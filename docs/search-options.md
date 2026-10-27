# 検索条件・モード・続き取得

`0.4.0` では「設定 → 検索プロバイダー → 各社の検索設定」で地域・言語・モード・フィルターを保存できます。標準 `web_search` はその保存値を使います。標準ツールの引数・システムプロンプト・presetは変更しません。

呼出しごとに条件を変える場合は「使う機能を選ぶ → Web検索」を有効にし、追加の `search_web` を使います。ニュース等の追加検索にも `options` があります。以下の例は、各ツールで対応する提供元を選び、有効にした場合の呼出し例です。API実行結果の例ではありません。

## 保存値と呼出しの優先順位

1. 保存していないフィールドは、従来のプラグイン既定値または各社のAPI既定値を使います。空欄を日本／日本語に自動変更しません。
2. 追加検索の `options` はフィールド単位で保存値を上書きします。配列は置き換えで、連結しません。指定しないフィールドは保存値を引き継ぎます。
3. マージ後の組合せを検証します。未知・未対応の条件や組合せは、送信前にエラーにします。黙って無条件検索や別カテゴリへ変換しません。

```js
// 例：提供元をBraveに設定したsearch_web。
// 保存済みcountryは引き継ぎ、結果言語と表示言語だけを上書きする。
search_web({
  query: "日本の再生可能エネルギー政策",
  options: { language: "jp", uiLanguage: "ja-JP" },
  max_results: 8
})
```

`options: {}` では保存値を消せません。`null`、空文字列、空配列による削除も受け付けません。保存した条件を外すには、設定画面で該当欄を空にして保存するか、「検索設定をリセット」を使います。保存操作は、その提供元の `search` オブジェクト全体を置き換えます。

RPCを使う実装では、`dsh-search-providers/list` で読んだ最新の `revision` を添えて、`dsh-search-providers/search-options` に `{ provider, options: {}, revision }` を送ると全条件を解除できます。Hostは `settings.mutate` の `set` で `providers/<provider>/search` を `{}` に置換します。部分更新ではないため、削除したフィルターが残りません。競合時は更新を拒否し、画面は入力を残して最新revisionを読み直します。再読込に失敗した場合は、読込みをやり直すまで保存できません。

検索設定は同じ提供元の標準検索・追加検索で共有します。例えば、TinyFishの論文向け年指定を保存したままWeb検索を使うと、未対応の組合せとして失敗します。用途が異なる場合は保存値を解除し、対応する追加ツールで指定してください。キー・ON/OFF・通常検索先・機能選択は、検索設定の保存やリセットで変更しません。

## 地域・言語

| 提供元 | プラグインの指定 → API | 注意 |
| --- | --- | --- |
| Nimble | `country` → `country`、`language` → `locale` | 未指定ならAPIの既定はUS／en |
| TinyFish | `country` → `location`、`language` → `language` | 一方だけの場合の補完はAPI側の規則。両方未指定の公式既定はUS／en |
| Brave | `country` → `country`、`language` → `search_lang`、`uiLanguage` → `ui_lang` | 日本語の結果言語は `jp`、表示言語は `ja-JP`。画像は `uiLanguage` 非対応 |
| Perplexity | `country` → `country`、`language` → `search_language_filter: [値]` | このプラグインは1言語だけ指定。複数言語の上限を共通化しない |
| Exa | `country` → `userLocation` | 国のヒントで、結果言語フィルターではない。`language` 非対応 |
| Parallel | `country` → `advanced_settings.location`（小文字） | 対応国だけ受理。`language` 非対応 |
| Keenable／FxTwitter | 明示的な地域・言語設定なし | 自動判定を明示指定と同一視しない。FxTwitterの翻訳用 `lang` は公開しない |

国コードは大文字へ正規化します。Brave／Parallelは実装に列挙した対応国の集合、他社はISOの2文字国コードを検証します。Braveの `ALL` はこの入口では受け付けません。言語は通常、小文字のISO 639-1（例 `ja`、`en`、`zh`）で、Braveは独自の対応値（例 `jp`、`zh-hans`、`zh-hant`）です。`uiLanguage` はBraveの対応localeを厳密に検証します。

地域のヒント、検索結果の言語条件、応答の表示言語は異なる指定です。日本語のqueryだけで国・言語のパラメーターを送ったことにはなりません。条件の送信は検索品質や全件の言語一致を、このプラグインが保証するものではありません。[Nimble](https://docs.nimbleway.com/api-reference/search/search.md) · [TinyFish](https://docs.tinyfish.ai/search-api/reference.md) · [Brave](https://api-dashboard.search.brave.com/api-reference/web/search/get) · [Perplexity言語ガイド](https://docs.perplexity.ai/docs/search/filters/language-filter.md) · [Parallel](https://docs.parallel.ai/search/advanced-search-settings.md)

## モードと既定値

| 提供元 | 選べる `mode` | 保存／呼出しとも未指定の場合 |
| --- | --- | --- |
| Keenable | `pro`、`realtime` | `mode` を送らない。APIの通常 `pro` または組織の既定を維持 |
| Nimble | `lite`、`standard` | `search_depth=lite`、`full_content=false` |
| Parallel | `turbo`、`fast`、`basic`、`advanced` | `mode=fast`。API自体の省略時既定 `advanced` とは異なる |
| Exa | `auto`、`instant`、`fast` | `type=auto`、highlightsを要求 |
| Perplexity | `web`、`fast` | Web検索は `search_type=web`。人物検索は `people` |
| TinyFish／Brave／FxTwitter | 選択なし | 提供元の対応検索APIを使用 |

- Nimbleの `standard` は一般検索だけです。`focus` を送らず、`search_news`／`search_papers`／`search_code` では送信前に拒否します。`lite` の専門検索は `news`／`academic`／`coding` を使います。
- Perplexityの人物検索では、保存済みの `web`／`fast` は明示的な例外として適用せず、常に `search_type=people` を使います。ただし人物検索の呼出しで `options.mode` を指定するとエラーです。他の未対応条件を黙って削除する規則ではありません。
- Exaの `deep-lite`／`deep`／`deep-reasoning` は未対応です。長時間処理・費用・取消・応答形式の扱いを別途確認するまで延期しています。独立した調査エージェントやDeepResearch機能も追加しません。
- 検索結果を増やしたり429になったりしても、高額／長時間モードへ自動変更しません。

2026-10-18に読んだ公式料金資料では、Perplexityは `fast` $1／1,000要求、`web` $5／1,000要求。Exaは10結果まで `instant` $4、`fast`／`auto` $7／1,000要求で、10件超の結果には追加料金があります。Parallelも `turbo`／`fast` と `basic`／`advanced` で料金が異なり、10件超は追加料金の対象です。Nimbleは `lite` $1.10、`standard` $5／1,000 inputsと説明しています。Keenableは組織別のSKU価格で、`realtime` が安いとは断定しません。これらは料金資料の比較で、同等の検索品質や実請求額を測定した結果ではありません。

契約・無料枠・価格は変わります。課金単位、追加結果、抽出URL数と利用上限を契約前に確認してください。Parallelの `turbo` は公式資料上、英語・日本語queryが対象です。[Perplexity](https://docs.perplexity.ai/docs/search/fast-search.md) · [Exa](https://exa.ai/docs/admin/pricing.md) · [Parallel料金](https://docs.parallel.ai/getting-started/pricing.md)／[モード](https://docs.parallel.ai/search/modes.md) · [Nimble](https://docs.nimbleway.com/nimble-sdk/admin/pricing.md) · [Keenable](https://docs.keenable.ai/credits.md)

## フィルターの対応とマッピング

下表にないフィールドは、その提供元では使えません。`options` はAPIの任意JSONを通す入口ではありません。

| 提供元 | 指定 → API |
| --- | --- |
| Keenable | `includeDomains` の1件 → `site`、`publishedAfter/Before` → `published_after/before`、`acquiredAfter/Before` → `acquired_after/before`、`queryTime` → `query_time` |
| Nimble | `includeDomains/excludeDomains` → `include_domains/exclude_domains`、`publishedAfter/Before` → `start_date/end_date`、`recency` → `time_range` |
| TinyFish | `includeDomains/excludeDomains` → カンマ区切りの `include_domains/exclude_domains`、`publishedAfter/Before` → `after_date/before_date`、`recencyMinutes` → `recency_minutes`、`yearMin/Max` → `pub_year_min/max`、`purpose` → `purpose` |
| Parallel | `includeDomains/excludeDomains` → `advanced_settings.source_policy.include_domains/exclude_domains`、`publishedAfter` → 同 `after_date` |
| Exa | `includeDomains/excludeDomains` → 同名フィールド、`publishedAfter/Before` → `startPublishedDate/endPublishedDate` |
| Perplexity | `includeDomains` または `excludeDomains` → `search_domain_filter`（除外は各値に `-`）、`publishedAfter/Before` → `search_after/before_date_filter`、`updatedAfter/Before` → `last_updated_after/before_filter`、`recency` → `search_recency_filter` |
| Brave | `safeSearch` → `safesearch`、`freshness` → `freshness`、`goggles` → 繰り返しの `goggles` パラメーター |

### 値と組合せ

- ドメインは1〜20件、各253文字までの通常のドメイン名だけです。スキーム、path、wildcardは不可。小文字へ正規化します。Keenableは1件だけ、Parallel／Perplexityはincludeとexcludeの併用不可です。Braveはこの構造化ドメイン指定に非対応です。
- 日付入力は実在する `YYYY-MM-DD` のみです。時刻付きISO、年だけ、`7d` 等の相対文字列は、提供元APIが受理していてもこの入口では拒否します。下限は上限以下にします。
- Exaは下限をUTC `00:00:00.000Z`、上限をUTC `23:59:59.999Z` に変換します。Keenableへは日付のまま送り、公式仕様では公開／取得日の両端をそのUTC日全体として含めます。`queryTime` だけはUTC午前0時で、その日の終端ではありません。
- Nimble／TinyFish／Parallelは対応する日付文字列を送り、Perplexityは `MM/DD/YYYY` に変換します。包括・排他的な境界、インデックス時刻、実効的な鮮度は提供元の規則です。全社共通の厳密な期間保証にはしません。
- `recency` は `hour/day/week/month/year`、`recencyMinutes` は1〜5,256,000の整数です。公開日の絶対指定とは併用不可。公開日と更新日・取得日を置き換えません。
- TinyFish論文は日付・相対鮮度ではなく `yearMin/yearMax` を使います。0〜9999の整数、両端を含みます。Web／ニュースでの年指定はエラーです。`purpose` は2,000文字までです。
- Exaの人物／企業検索は公開日の指定不可。人物検索は `excludeDomains` も不可です。
- Braveの `safeSearch` は `off/moderate/strict`。画像は `off/strict` だけで、`uiLanguage`／`freshness`／`goggles` も拒否します。GogglesはWeb／ニュースだけです。1〜3件、各2,000文字までの公開HTTPS URLだけを受け、正規化したURLを保存してBraveへ送ります。このプラグイン自身では取得しません。
- Braveの `freshness` は `pd/pw/pm/py` または `YYYY-MM-DDtoYYYY-MM-DD`。ページの公開日または変更日に基づくため、公開日だけの厳密なフィルターとは呼びません。

```js
// 例：TinyFishを選んだ論文検索。年月日ではなく出版年を指定する。
search_papers({
  query: "retrieval augmented generation",
  options: { yearMin: 2024, yearMax: 2026, includeDomains: ["arxiv.org"] }
})
```

## HTTP 429と他社への切り替え

初回検索で、選択元に保存済みの検索条件がなく、呼出しの `options` にもフィールドがない場合だけ、HTTP 429で別の有効な対応提供元を一覧順に1回ずつ試します。候補に保存済み検索条件がある場合は、その候補を飛ばします。

**どれか1つでも条件があると、国だけ・モードだけでも他社へ切り替えません。** 条件を黙って落としたり、異なる意味のモードへ読み替えたりすることを避けるためです。空の `{}` 自体は新しい条件になりませんが、既存の保存値は残ります。

同じ提供元への自動再送、高額モードへの自動切り替え、無効な提供元の有効化はしません。認証失敗・無効・未対応指定・429以外の失敗は切り替えません。本文取得、バッチ本文取得、サイト一覧、X検索、続き取得も切り替えません。別社へ切り替えた要求にも、その社の利用枠・料金がかかります。

## 件数と明示的な続き取得

追加検索の `max_results` は1〜100、省略時8です。APIへ送る上限はKeenable50、Parallel20、Brave Web20／他の対応検索50、Perplexity Web／Fast20・人物50です。Exa／Nimbleは要求件数を送ります。TinyFishは件数を送らず、提供元が返した1ページをローカルで切ります。少ない件数指定が少ない課金や全件の受信を意味するとは限りません。

`nextPage` が返った場合だけ、同じ追加検索ツールに同じ `query` と `next_page` を渡すと次ページを要求できます。`options`、`max_results`、Xの `sort` は併記できません。保存設定を変更しても、続きはハンドルに固定した提供元・カテゴリ・有効条件・件数・並び順を使います。

```js
// 例：TinyFishを選んだニュース検索。
const first = search_news({ query: "日本の電力政策", max_results: 8 })
// 続きを取得すると判断した場合だけ。nextPageがない場合は呼ばない。
search_news({ query: "日本の電力政策", next_page: first.nextPage })
```

| 対象 | 範囲 |
| --- | --- |
| TinyFish Search（Web／ニュース／論文） | `page=0..10`、最大11ページ |
| Brave Web／ニュース／動画 | `offset=0..9`、最大10ページ。画像は非対応 |
| FxTwitterキーワード検索 | 検証した `cursor.bottom` で最大10ページ。投稿URLの取得は1件のみ |
| その他の検索 | 続き取得なし。件数を増やしてもページ送りにはならない |

ハンドルは `provider:UUID` の不透明な文字列です。query・APIキー・外部URL・生cursorを埋め込みません。Hostの提供元ごとの一時メモリに最大100件保持し、発行から15分、プラグイン解除／再起動、古いハンドルの追い出しで失効します。不正・期限切れ・別query／別カテゴリ・別提供元のものはエラーです。履歴にハンドルが残っていても、再開後に使えるとは限りません。

自動ページ送り・続きの他社切り替え・全件取得はしません。各ページでAPI呼出し・利用枠・料金が増えます。同じハンドルの再送でも通信が再度発生し得ます。前ページまでに返したURLの重複は省き、`duplicatesRemoved` に数を返しますが、順位の不変性や網羅性は保証しません。ローカルの件数制限で省いた結果を、次ページで回収できる保証もありません。

`page` は0始まり、`pagination` は `end`／`page-limit`／`repeated-cursor`／`more-results-not-guaranteed` 等の状態です。`nextPage` は残件の存在証明ではなく、空の次ページになることもあります。FxTwitterの404は終端や「該当なし」の成功には変換しません。標準 `web_search` に続き用の引数は追加しません。

## 旧版へ戻す場合

`0.3.2` は新しい保存項目 `tools.web`／`tools.batchExtract` を、OFFでも未知の機能として拒否します。profile設定のバックアップを先に取り、各社の検索設定をリセットしたうえで、DSH標準のprofile設定編集またはバックアップ済み設定の手動編集から、この2つの機能エントリーだけを除く必要があります。提供元設定全体やAPIキーは削除しません。[更新と復帰の条件](release-0.4.0.md#更新と旧版への復帰)を読んでから旧版を導入してください。

[対応APIとメタデータ](providers.md) · [0.4.0更新内容](release-0.4.0.md)
