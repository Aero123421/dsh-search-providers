# API仕様と対応範囲

確認日：2026-10-11。通常検索は順位付きの出典を取得し、外部サービスで回答文を生成するAPIは使いません。検索結果の質や新しさは各社で異なります。

| 提供元 | 通常検索 | 追加機能の指定 | APIキーの環境変数 |
| --- | --- | --- | --- |
| Keenable | `/v1/search`。キーなしは明示的に `/public` | 本文取得は `/v1/fetch`、`live=true` | `KEENABLE_API_KEY` |
| Nimble | `/v2/search`、`search_depth=lite` | `focus=news/academic/coding`。本文は `/v2/extract`、ページ一覧は `/v2/map` | `NIMBLE_API_KEY` |
| TinyFish | Search API、`domain_type=web` | `news/research_paper`。本文はFetch API | `TINYFISH_API_KEY` |
| Parallel | `/v1/search`、`mode=fast` | 本文は `/v1/extract` | `PARALLEL_API_KEY` |
| Exa | `/search`、`type=auto`、highlights | `category=news/publication/people/company`。本文は `/contents` | `EXA_API_KEY` |
| Brave | `/res/v1/web/search` | `/news/search`、`/images/search`、`/videos/search` | `BRAVE_API_KEY` |
| Perplexity | `/search`、`search_type=web` | 人物は `search_type=people` | `PERPLEXITY_API_KEY` |
| FxTwitter | 通常検索には使わない | `/2/search`。投稿URLは `/2/status/{id}` | 不要 |

公式仕様：[Keenable](https://docs.keenable.ai/api-reference/search)、[Nimble](https://docs.nimbleway.com/nimble-sdk/web-tools/search)、[TinyFish](https://docs.tinyfish.ai/search-api/reference)、[Parallel](https://docs.parallel.ai/api-reference/search/search)、[Exa](https://exa.ai/docs/reference/search)、[Brave](https://api-dashboard.search.brave.com/documentation/services/web)、[Perplexity](https://docs.perplexity.ai/api-reference/search-post)。

Nimbleのコード検索は公開Webのコード例や文書を探す機能です。リポジトリ内の構造的なコード検索とは異なります。論文の著者・掲載先などはAPIが返した情報だけを使い、検索日時を公開日に変換しません。

ページ本文取得は、各社のAPIを使ってテキストを取り出します。API自身のHTTP 200を対象ページのHTTP 200として扱いません。Nimbleは対象statusを確認し、他社は本文の取得成否を応答内容から判定します。[Nimble Extract](https://docs.nimbleway.com/api-reference/extract/extract)、[TinyFish Fetch](https://docs.tinyfish.ai/fetch-api/reference)、[Parallel Extract](https://docs.parallel.ai/api-reference/extract/extract)、[Exa Contents](https://exa.ai/docs/reference/get-contents)、[Keenable Fetch](https://docs.keenable.ai/api-reference/fetch)。

料金は画面に金額の表としては固定しません。各社の料金は変わるため、契約前に公式ページを確認してください。確認日は 2026-10-15 です。

Brave Search API の公式 FAQ は、単独の無料プランはないと説明しています。各プランに毎月 $5 のクレジットがあり、Search では約 1,000 クエリです。プランの加入にはカードが必要です。既存の後払いプランは、請求と利用が変わらないと案内されています。プリペイド残高が $0 になるとサービスが止まり、追加のリクエストは拒否されます。拒否時の HTTP ステータスは、Web 検索リファレンス（200、404、422、429）には書かれていません。レート制限の説明では、秒あたりの上限と月間クォータの超過は HTTP 429 です。[プランの説明](https://api-dashboard.search.brave.com/documentation/resources/help-feedback) · [2026-02-12 の料金改定](https://brave.com/blog/most-powerful-search-api-for-ai/) · [レート制限](https://api-dashboard.search.brave.com/documentation/guides/rate-limiting)

このプラグインが他社へ切り替えるのは HTTP 429 だけです。残高 $0 の拒否が 429 以外で返った場合は切り替えません。

Braveで永続的な会話履歴に検索結果を保存する場合は、保存権を付与する契約か確認してください。[Braveの保存権の説明](https://brave.com/search/api/#faq)。

## FxTwitter

`x_search` は公開APIをキーなしで呼び出します。キーワード検索は `q`・`feed=latest/top`・`count` を使い、投稿URLの場合はIDを取り出して投稿取得APIを呼びます。任意の入力URLを直接fetchしません。[検索](https://docs.fxembed.com/api/twitter/operations/2search/) · [投稿取得](https://docs.fxembed.com/api/twitter/operations/2statusid/)

HTTPステータスとJSONの `code` を確認します。検索の404は該当なしと取得不能を区別できないため、空の成功結果には変換しません。HTTP 200・`code=200` の空配列だけを正常な空結果として扱います。HTTP 200でも `code=404` ならエラーです。

投稿本文と日時、取得できた投稿者・反応数を返します。本文は6,000文字までで、長い場合は `truncated=true` です。APIが次ページのcursorを返した場合も `truncated=true` とし、自動で次ページを取得しません。欠けた反応数は省略します。
