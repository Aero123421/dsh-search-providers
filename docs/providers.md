# API仕様と対応範囲

`0.4.0` の実装と、2026-10-18に確認した公式仕様に基づきます。通常検索は順位付きの出典を取得し、外部サービスに回答文を生成させるAPIは使いません。検索品質・網羅性・期間条件の実効性を比較した結果ではありません。実API通信とモック確認の範囲は[更新内容](release-0.4.0.md)を参照してください。

## 利用するAPI

| 提供元 | 検索と未設定時のモード | 追加機能 | APIキーの環境変数 |
| --- | --- | --- | --- |
| Keenable | `/v1/search`。`mode` は省略し、組織／APIの既定を維持 | `/v1/fetch`、`live=true`。キーなしは検索・本文とも明示的に `/public` | `KEENABLE_API_KEY` |
| Nimble | `/v2/search`、`search_depth=lite`、`full_content=false` | `focus=news/academic/coding`、本文 `/v2/extract`、一覧 `/v2/map` | `NIMBLE_API_KEY` |
| TinyFish | Search API、`domain_type=web` | `news/research_paper`、Fetch APIで単一／バッチ本文 | `TINYFISH_API_KEY` |
| Parallel | `/v1/search`、`mode=fast` | `/v1/extract` で単一／バッチ本文 | `PARALLEL_API_KEY` |
| Exa | `/search`、`type=auto`、highlights | `category=news/publication/people/company`、`/contents` で単一／バッチ本文 | `EXA_API_KEY` |
| Brave | `/res/v1/web/search` | `/news/search`、`/images/search`、`/videos/search` | `BRAVE_API_KEY` |
| Perplexity | Search API `/search`、`search_type=web` | 人物は `search_type=people`。Agent APIではない | `PERPLEXITY_API_KEY` |
| FxTwitter | 通常検索には使わない | `/2/search`、投稿URLは `/2/status/{id}` | 不要 |

通常検索に対応する7社では、任意の追加機能 `web`（ツール名 `search_web`）も選べます。標準 `web_search` の置き換えではなく、呼出しごとの条件や続き取得のための別ツールです。追加機能は初期状態ではすべて無効で、同じ機能の提供元は1社です。

モードはKeenable `pro/realtime`、Nimble `lite/standard`、Parallel `turbo/fast/basic/advanced`、Exa `auto/instant/fast`、Perplexity `web/fast` を明示選択できます。従来の既定を維持し、自動で高額モードへ変えません。Exaのdeep系は未対応です。地域・言語・フィルター・組合せ制限・料金資料は[検索設定](search-options.md)を参照してください。

公式検索仕様：[Keenable](https://docs.keenable.ai/api-reference/search.md) · [Nimble](https://docs.nimbleway.com/api-reference/search/search.md) · [TinyFish](https://docs.tinyfish.ai/search-api/reference.md) · [Parallel](https://docs.parallel.ai/api-reference/search/search.md) · [Exa](https://exa.ai/docs/reference/search.md) · [Brave Web](https://api-dashboard.search.brave.com/api-reference/web/search/get)／[ニュース](https://api-dashboard.search.brave.com/api-reference/news/news_search/get)／[画像](https://api-dashboard.search.brave.com/api-reference/images/image_search)／[動画](https://api-dashboard.search.brave.com/api-reference/videos/video_search/get) · [Perplexity](https://docs.perplexity.ai/api-reference/search-post.md)

Nimbleのコード検索は、公開Webのコード例や文書を探す機能です。リポジトリ内の構造的なコード検索ではありません。`standard` で専門focusを使おうとした場合は拒否し、一般検索へ読み替えません。

## 日付・論文・メディア情報

APIが返した項目だけを型付きの任意フィールドに正規化します。欠けている日付・著者・年・反応数等を推測したり、0を補ったりしません。明示的に返った0／falseは保持します。

| 提供元の項目 | 正規化と意味 |
| --- | --- |
| Exa `publishedDate`、`author` | `publishedAt`、`author`。日付はHTMLから推定した作成日と公式に説明されており、検証済み公開日とは呼ばない |
| Exa `entities[].type=publication` の `properties` | `authors[].name/id` → `authors` と `authorDetails`、`year`、`date` → 公開日候補、`doi`、`citationCount`、`referenceCount`。人物・企業の累積被引用数を論文へ流用しない |
| 論文結果の著者・掲載先 | 文字列の著者配列、名前付き著者オブジェクト、`year`、`venue`、`doi` を検証。DOI URLは識別子へ正規化 |
| TinyFish Search `cited_by_count`、`pdf_url`、`publisher`、`date` | `citationCount`、`pdfUrl`、`publisher`、`publishedAt` |
| TinyFish Fetch `author`／`published_date` | `author`／`publishedAt`。欠落やnullは省略し、推測しない |
| Perplexity `date`／`last_updated` | `publishedAt`／`updatedAt`。更新日だけの場合に公開日を作らない |
| Keenable Search `published_at`／`acquired_at` | ISO文字列を `publishedAt`／`acquiredAt` へ。取得・インデックス化と公開を区別 |
| Keenable Fetch `author`／`published_at` | 著者、整数のUnix秒をISOの `publishedAt` へ。Searchとは日付の入力型が異なる |
| Brave `page_age`／`page_fetched`／`age` | 公開または変更を示す `pageDate`／ページ取得の `fetchedAt`／相対表示の `age`。`pageDate` を公開日・更新日と断定しない |
| Brave `fetched_content_timestamp` | `fetchedContentTimestamp`。公式資料が単位を明記しないため、整数をそのまま保持し、日時へ変換しない |
| Brave画像 `properties.url/width/height` | `mediaUrl`、`width`、`height`。出典ページの `url` と画像URLを分ける |
| Brave `thumbnail.src/original/width/height` | `thumbnailUrl`、`thumbnailOriginalUrl`、`thumbnailWidth`、`thumbnailHeight`。提供された項目だけ |
| Brave `video` | `duration` は提供元の時間文字列のまま。`creator`、`publisher`、`views`、`requiresSubscription`、`tags` も任意で保持 |

Nimbleの検索日時を公開日に変換しません。公開・更新・取得・インデックス化・相対的なページ年齢は区別します。認識できない日付を現在時刻へ補いません。Exaは最大8個のentityを調べ、最初の有効なpublicationだけを採用します。結果直下に公開日があればそれを優先し、entityの日付で上書きしません。

追加検索は、正規化したフィールドをoutput schemaとモデル向けのメタデータJSONで返します。標準DSHの `web_search` が出典を `url/title/snippet/publishedAt` の4項目へ投影するため、このプラグインは追加情報の一部を `Source metadata (external data)` とラベル付きで `snippet` にも載せます。追加検索の `presentationMeta` にも同じ注記を使います。これにより既存の標準整形・出典カード・履歴用JSONで扱う文字列に含めますが、新しい専用カードや画像ビューアを実装したわけではありません。

保存・表示する情報には次の上限があります。

- 1出典の追加メタデータJSONは16,384文字まで。標準経路の注記内JSONは2,000文字、ラベルを含む `snippet` 全体は6,000文字までです。注記のために抜粋を短くする場合もあります。すべての追加フィールドがカード／履歴へ届く保証はなく、省略すると `truncated=true` です。
- 著者20人、名前200文字、ID256文字、タグ10個・各100文字。その他の通常テキスト1,000文字、age／duration100文字。URLは2,048文字以下の資格情報なしHTTP(S)で、無効・長大なURLを途中で切ってリンクにはしません。
- 寸法は1〜100,000の整数、カウントは非負の安全な整数、年は0〜9999。日付は実在する日付だけ、またはタイムゾーン付きISO日時を検証し、日付だけの精度や提供元のoffsetを保持します。
- 認識した項目が不正・過大な場合は省略／制限し、`truncated=true` にします。raw応答、再帰したquote、subpages、全文、abstract、人物略歴を無制限に転送しません。外部由来の文字列は指示として信頼しません。

Keenable本文の仕様：[Fetch](https://docs.keenable.ai/api-reference/fetch.md)。保存・再利用・画像の表示やダウンロードには、提供元の契約と第三者の権利が別途適用されます。メタデータの取得成功やURLの検証は、利用許諾を取得したことを意味しません。

## 本文の単一取得とバッチ取得

単一URLの `extract_web_page` と標準 `web_fetch` は維持します。外部APIのHTTP 200を対象ページのHTTP 200と見なしません。Nimbleは対象statusを確認し、他社は本文の取得成否を応答内容から判定します。単一取得の結果は従来のURL・本文・title・truncatedに、取得できた任意メタデータが加わります。

複数URLは「使う機能を選ぶ → 複数ページ本文取得」で有効にした `extract_web_pages` を使います。対応はTinyFish／Parallel／Exaだけです。非対応社への個別並列リクエストで補いません。

```js
extract_web_pages({ urls: ["https://example.com/guide", "https://example.org/article"] })
```

| 制限 | このプラグインの値 |
| --- | --- |
| 入力数 | 1〜10 URL。重複も入力数に含む |
| URL | 各2,048文字まで。公開HTTP(S)、資格情報なし、既存のローカル向けURL拒否規則を適用 |
| 本文 | 1ページ100,000文字、出力本文の合計200,000文字。重複展開した本文も合計に数える |
| HTTP応答 | 1回2MiBまで。本文を切る前にこの上限を超えると呼出し全体をエラーにする |
| 通信 | 各社で共有する最大4並行の枠、HTTP期限45秒、追加ツール期限60秒。呼出し取消と解除を通信／待機へ伝える |

公式APIの入力上限はTinyFish10／Parallel20／Exa100ですが、このツールは出力量・費用を抑えるため全社10です。URLをすべて検証してから、正規化した重複を除き、1回の提供元バッチ要求を送ります。同じ入力を複数回書いた場合は要求へ1度だけ送り、出力では入力順・入力数を維持します。応答順が違ってもURLで対応付け、対応を証明できない・欠けた・重複した応答は成功に見せません。

Exaの `statuses` は省略または空配列でも、一意なURL対応と空でない本文を確認できれば成功にできます。明示されたエラーや矛盾するstatusは成功本文より優先し、`statuses: null` のような不正な構造は拒否します。

各 `results[]` は `inputUrl` と `ok` を持ちます。成功は `url`（提供元が返した最終URL）・`content`・`truncated`、任意の `title`。失敗は検証した `error.code/message` と、返っていれば `providerCode/status` です。不明な対象HTTPステータスは作らず、上流の未加工エラーメッセージも流しません。本文の切詰めはURL単位とバッチ全体の `truncated` に反映します。

本文上限を使い切ると、後続の成功URLも空の省略本文・`truncated=true` になる場合があります。HTTP／JSON全体の失敗、取消、過大応答はURL別の成功結果を捏造せず、呼出し全体のエラーにします。自動再送・他社への切り替え・無制限fan-outはしません。

料金は「ツール1呼出し分」とは限りません。対象URL数やcontent typeで増えます。重複除去は提供元の課金免除を保証するものではなく、取消後の返金も保証しません。TinyFishの無料枠・超過条件について、無料で無制限のバッチと説明しません。[TinyFish Fetch](https://docs.tinyfish.ai/fetch-api/reference.md) · [Parallel Extract](https://docs.parallel.ai/api-reference/extract/extract.md)／[料金](https://docs.parallel.ai/getting-started/pricing.md) · [Exa Contents](https://exa.ai/docs/reference/get-contents.md)／[料金](https://exa.ai/docs/admin/pricing.md) · [Nimble Extract](https://docs.nimbleway.com/api-reference/extract/extract)

## ページ送りと429

続き取得は追加検索の `next_page` で明示要求した場合だけです。TinyFishは0〜10、Brave Web／ニュース／動画は0〜9、FxTwitterは最大10ページです。Brave画像や他社には次ページを作りません。ハンドルは提供元・query・カテゴリ・条件を固定し、15分・提供元ごと100件の一時保存です。重複URLは省きますが、順位・網羅性・次ページの非空は保証しません。[引数・失効・課金の詳細](search-options.md#件数と明示的な続き取得)

他社への切り替えは、条件のない初回検索のHTTP 429だけです。保存済み／呼出しの条件が1項目でもあれば切り替えず、保存条件がある候補も飛ばします。続き取得・抽出・一覧・Xは切り替えません。[詳細](search-options.md#http-429と他社への切り替え)

検索結果の出典URLと、本文取得が返す最終URLは、抽出入力と同じ公開URL条件です。ループバック、`169.254.0.0/16`、名前に埋めたプライベートアドレス、`localtest.me` や `lvh.me` などの出典は結果から除き、検索結果は切り詰めます。最終URLが公開URLでない本文取得は失敗します。HTTPの45秒期限を超えた要求は `timeout` です。呼出し側が取り消した場合は、この期限切れにしません。

## FxTwitter

`x_search` は公開APIをキーなしで呼び出します。キーワード検索は `q`・`feed=latest/top`・`count` を使い、投稿URLの場合はIDを取り出して投稿APIを呼びます。任意の入力URLを直接fetchしません。[検索](https://docs.fxembed.com/api/twitter/operations/2search/) · [投稿取得](https://docs.fxembed.com/api/twitter/operations/2statusid/)

HTTPステータスとJSONの `code` を確認します。検索の404は該当なしと取得不能を区別できないため、空の成功やページ末尾には変換しません。HTTP 200・`code=200` の空配列だけを正常な空結果として扱います。投稿本文は6,000文字までで、取得できた投稿者・日時・反応数だけを返します。再帰した引用投稿やメディアの拡張表示は含めません。

## 契約・料金・保存権

各社の料金と契約を利用前に確認してください。モード・件数・追加ページ・バッチURLによる料金差があります。取消でサービス側の処理や料金も取り消されるとは限りません。

2026-10-18に確認したBrave公式FAQは、単独の無料プランはなく、各プランに毎月$5のクレジット（Searchで約1,000クエリ）があり、加入にカードが必要と説明しています。既存の後払いプランは継続できます。プリペイド残高$0では停止しますが、その拒否が429とは限りません。429以外ではこのプラグインは他社へ切り替えません。[Brave FAQ](https://api-dashboard.search.brave.com/documentation/resources/help-feedback) · [レート制限](https://api-dashboard.search.brave.com/documentation/guides/rate-limiting)

同FAQはAPIデータの保存を禁止し、保存や学習が必要な場合はBraveへの相談を求めています。DSHはツール結果を会話履歴に保存するため、Braveを含む提供元を使う前に、履歴・保持期間・再利用に適用される保存許諾を確認してください。このプラグインは保存禁止を自動で解除／回避せず、第三者の本文・画像・動画への権利も付与しません。
