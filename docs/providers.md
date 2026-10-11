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

公式仕様：[Keenable](https://docs.keenable.ai/api-reference/search)、[Nimble](https://docs.nimbleway.com/nimble-sdk/web-tools/search)、[TinyFish](https://docs.tinyfish.ai/search-api/reference)、[Parallel](https://docs.parallel.ai/api-reference/search/search)、[Exa](https://exa.ai/docs/reference/search)、[Brave](https://api-dashboard.search.brave.com/documentation/services/web)、[Perplexity](https://docs.perplexity.ai/api-reference/search-post)。

Nimbleのコード検索は公開Webのコード例や文書を探す機能です。リポジトリ内の構造的なコード検索とは異なります。論文の著者・掲載先などはAPIが返した情報だけを使い、検索日時を公開日に変換しません。

ページ本文取得は、各社のAPIを使ってテキストを取り出します。API自身のHTTP 200を対象ページのHTTP 200として扱いません。Nimbleは対象statusを確認し、他社は本文の取得成否を応答内容から判定します。[Nimble Extract](https://docs.nimbleway.com/api-reference/extract/extract)、[TinyFish Fetch](https://docs.tinyfish.ai/fetch-api/reference)、[Parallel Extract](https://docs.parallel.ai/api-reference/extract/extract)、[Exa Contents](https://exa.ai/docs/reference/get-contents)、[Keenable Fetch](https://docs.keenable.ai/api-reference/fetch)。

無料枠や料金は画面に固定表示しません。Braveで永続的な会話履歴に検索結果を保存する場合は、保存権を付与する契約か確認してください。[Braveの保存権の説明](https://brave.com/search/api/#faq)。
