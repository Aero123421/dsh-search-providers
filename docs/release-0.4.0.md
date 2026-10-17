# 0.4.0 更新内容

検索条件を明示して使うための更新です。既存のキー・ON/OFF・通常検索先・追加機能の選択を維持し、未設定の条件を勝手に追加しません。新しい追加機能は自動で有効になりません。標準 `web_search`／`web_fetch` の引数、システムプロンプト、presetは変更しません。

## 追加した機能

| Issue | 対応 |
| --- | --- |
| [#10 地域・言語](https://github.com/Aero123421/dsh-search-providers/issues/10) | 各社の検索設定を保存・再読込し、対応する国／結果言語／表示localeへ変換。未指定と明示指定を区別 |
| [#11 モード](https://github.com/Aero123421/dsh-search-providers/issues/11) | Keenable pro/realtime、Nimble lite/standard、Parallel turbo/fast/basic/advanced、Exa auto/instant/fast、Perplexity web/fastを選択 |
| [#12 詳細フィルター](https://github.com/Aero123421/dsh-search-providers/issues/12) | 対応するドメイン・公開日・更新日・取得日・時点・相対鮮度・論文年・Brave SafeSearch／Goggles等を検証して送信 |
| [#13 メタデータ](https://github.com/Aero123421/dsh-search-providers/issues/13) | Exa publication entityの著者・年・DOI・被引用数、TinyFish PDF／publisher、Brave画像・動画、Perplexity更新日、Keenable公開／取得日時等を任意フィールドへ正規化 |
| [#14 バッチ本文](https://github.com/Aero123421/dsh-search-providers/issues/14) | TinyFish／Parallel／Exaの1〜10 URLを1バッチで取得し、入力順のURL別成功／エラーを返す |
| [#15 続き取得](https://github.com/Aero123421/dsh-search-providers/issues/15) | TinyFish、Brave Web／ニュース／動画、FxTwitterのキーワード検索で次ページを明示要求 |

使い方とマッピングは[検索設定](search-options.md)、返す情報・安全境界・契約条件は[対応API](providers.md)を参照してください。

## 標準検索と追加検索

通常検索の7社で、追加機能 `web`／ツール `search_web` を選べます。保存条件は標準検索と同じ提供元の専門検索にも適用します。追加検索の `options` はフィールド単位で保存値を上書きし、省略したフィールドは引き継ぎます。空の呼出し `options: {}` では保存値は消えません。

設定画面の空欄で該当条件を外し、リセットでは保存 `search` を `{}` に置換します。RPC `dsh-search-providers/search-options` は最新revisionを検査し、`settings.mutate` の `set` で部分木を置換するため、取り除いた条件を残しません。競合は拒否し、再読込後の再確認を求めます。

条件が保存／呼出しのどちらかに1つでもあると、429で他社へ切り替えません。条件なしの初回検索だけ、条件を保存していない有効な対応候補へ1回ずつ切り替えます。続き取得・X・本文・バッチ・サイト一覧は切り替えません。高額モードへの自動変更もしません。

未対応の指定は送信前に拒否します。Nimble `standard` の専門focus、Exa人物／企業の公開日、Exa人物の除外ドメイン、TinyFish論文の年月日／相対鮮度、Brave画像の `uiLanguage`／`freshness`／Goggles／moderate等を黙って落としません。BraveのニュースにはGogglesを使えます。Perplexity人物検索は保存したweb/fastだけを適用しない明示的な例外で、呼出しでのmode指定は拒否します。

日付入力は実在する `YYYY-MM-DD` だけです。ExaはUTCの日の始端／終端へ変換し、Keenableの公開・取得日の範囲は公式仕様のUTC日全体、`queryTime` はUTC午前0時を使います。他社を含む全条件の包含境界や鮮度・網羅性を共通保証しません。

## 出典・本文・続きの上限

- メタデータは出典ごとに最大16,384文字のJSON、著者20人等の個別上限を持ちます。不明な値を推測・0補完せず、raw応答や再帰した引用投稿は転送しません。公開／更新／取得／インデックス化を区別します。
- 追加検索は型付きフィールドとモデル向けJSONを返します。標準DSHが4項目へ出典を投影するため、追加情報の一部をラベル付きsnippet注記にも載せます。注記内JSONは2,000文字、snippet全体は6,000文字までです。既存の出典カード・presentationMeta・履歴用JSONが扱う文字列への注記で、専用カードの追加ではありません。注記も省略され得ます。
- 新しい `batchExtract`／`extract_web_pages` は1〜10 URL、本文100,000文字／ページ、出力本文合計200,000文字、HTTP応答2MiBです。重複は要求時に除き、結果では入力順に展開します。全体の通信失敗や過大JSONを全成功に変換しません。既存 `extract_web_page` は維持し、取得できたメタデータを任意で加えます。
- 追加検索の `next_page` は、同じquery・同じ検索ツールでだけ使います。options／件数／sortの併記は不可。提供元・カテゴリ・条件・件数を固定した `provider:UUID` で、15分・提供元ごと100件の一時メモリ保存です。解除／再起動でも失効します。
- TinyFishは0〜10、Brave Web／ニュース／動画は0〜9、FxTwitterは最大10ページ。画像等の非対応検索に次ページは作りません。自動ページ送りもありません。重複URLを省きますが、順位・網羅性・次ページの存在は保証しません。FxTwitterの404は「末尾」や「該当なし」の成功にはしません。

## 費用・契約・未対応

各社のモード、追加結果、次ページ、バッチURL数で費用・利用枠が増えます。低価格モードが同等品質とは保証せず、Keenable realtimeの価格がproより低いとも断定しません。バッチを1要求へまとめても、1URL分の料金になるとは限りません。取消・解除で処理や課金の取消／返金は保証しません。[料金資料](search-options.md#モードと既定値)

検索結果・第三者の画像や本文の保存／再利用の権利は付与しません。特にBrave公式FAQはAPIデータの保存を禁止し、必要な場合の相談を求めています。DSHの会話履歴への保存にも適用する契約を確認してください。[Brave FAQ](https://api-dashboard.search.brave.com/documentation/resources/help-feedback)

Exaのdeep系は、長時間処理・取消・料金・応答形式の確認を別段階へ延期しています。DeepResearch、外部調査エージェント、ブラウザ操作、クロール、定期監視、FxTwitterの再帰的な引用／メディア表示は追加しません。

## 更新と旧版への復帰

`0.3.2` 以前からの更新では、新しい検索設定は未指定のまま、キー・ON/OFF・選択を維持します。導入後は必要に応じてHostのDSHを再起動し、設定画面の実行版を確認してください。導入済みの版と実行中の版の表示は別です。新しい検索設定と追加機能は利用者が選ぶまで有効にしません。

**新機能を設定した後の `0.3.2` へのダウングレードは、そのままでは互換ではありません。** 旧版は保存された `tools.web`／`tools.batchExtract` を未知の機能として拒否します。機能をOFFにしただけでも設定エントリーは残ります。

旧版へ戻す必要がある場合は、先にDSHの対象profile設定をバックアップしてください。まだ `0.4.0` が動く間に、各社の「検索設定をリセット」で検索条件を `{}` に戻すことも推奨します。新しい `providers.<id>.search` は旧版で保持・解釈される保証がありません。その後、DSH標準のprofile設定編集、またはバックアップを確保した設定の手動編集で、このプラグインが所有する `tools.web` と `tools.batchExtract` の2エントリーだけを除いてから旧版を導入してください。具体的な設定ファイルの場所や編集手順は、使っているDSHの構成に従います。

`providers` 全体や他の機能選択、資格情報ストアを削除する必要はありません。APIキーを削除して復旧しようとしないでください。Hostを再起動し、旧版の読込み・元の検索先・既存機能が使えることを確認します。旧版が読めなければ、バックアップと互換な版へ戻して確認してください。この手動ダウングレード手順全体の実機検証は、今回の確認には含めません。

## 検証

以下はローカルで実行した結果です。ソースの確認、配布ファイルの内容、実DSHでの更新を区別して記録します。

| 確認 | 状態 |
| --- | --- |
| `npm run typecheck` | 成功 |
| `npm test` | 217／217成功、失敗・取消・skipなし |
| `npm run build` | 最新のメタデータ・Exa応答処理の修正を含め成功 |
| `npm run test:compat` | 成功 |
| `npm run test:peers` | 公開版 `0.2.1-alpha.5` までを確認して成功 |
| `npm run test:browser` | 成功 |
| `npm run test:native` | ソース／配布tgzの両方を実DSH `0.2.1-rc.2` へ導入して成功。検索条件の保存・置換・リセット・競合拒否・実Host再起動後の保持とUIを確認 |
| `git diff --check` | 成功 |
| 配布ファイルの確認 | pack dry-run・manifest・実tgzのmanager導入を確認。16ファイルにHost／Client・patch・icon・ライセンス・docsを含み、artifacts／node_modules／.agentsは含まない |
| ビルドの再現性 | 再ビルド後のhash一致を確認 |
| `npm run test:upgrade -- <旧tgz> <新package>` | 実DSH `0.2.1-rc.2` の隔離profileで、公式 `0.3.2` からソース／配布tgzの両方への更新に成功 |

更新確認では、通常検索先・元の検索先、保存キーの有無、提供元のON/OFF、既存の論文／本文／X機能選択を保持し、新機能が自動選択されないことを確認しました。新しい検索条件の保存・リセットもHost再起動後に確認しています。具体的な旧tarballのchecksum照合と引数は[更新テストの手順](development.md#旧版からの更新を確認する)を参照してください。

CIはDSH `0.2.1-alpha.2`／`0.2.1-rc.2` のmatrixで、公式旧tarballのchecksumを照合し、新しい配布tgzへの更新も実行する構成です。各実行の結果は[GitHub Actions](https://github.com/Aero123421/dsh-search-providers/actions)を参照してください。

インストール済みDSH `0.2.1-rc.2` の実装呼出しにfixtureを渡し、Webサービスは任意フィールドを保持する一方、標準検索ツールの実行・presentationMetaが `url/title/snippet/publishedAt` だけを投影することを確認しています。これは実装／fixtureの確認であり、実GUIの会話を保存して再起動・再表示する全経路の実証とは区別します。

Keenableでは今回、キーなしの `/v1/search/public` に `mode=realtime`、`includeDomains: ["typescriptlang.org"]`、query `TypeScript official documentation`、要求3件を送る実通信を確認しました。`https://typescriptlang.org/docs...` のURLを3件返し、`truncated=false` でした。これはこのモード・サイト条件の取得成功で、網羅性や検索品質の比較、実請求の検証ではありません。

その他の提供元の新条件・モード・バッチ・ページ送りについて、実APIキーを使った確認や実請求は未検証です。公式schemaの照合とモック応答を、実APIの成功と同一視しません。FxTwitterのキーワード検索成功も未確認です。
