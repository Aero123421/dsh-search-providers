# 開発と検証

Node.js 22.19以降を使います。HostとClientは別々にビルドし、HostのDSHパッケージとClientのReactは実行環境から解決します。UI部品は `upstream.json` に固定した公式ソースからビルドに含めます。

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:compat
npm run test:peers
npx playwright install chromium
npm run test:browser
npm run test:native
```

`test:peers` は、インストール済みの `@deepseek-ai/dsh-app-boot` にある起動時の peer 判定で、この package の `@deepseek-ai/dsh*` peer を確認します。あわせて npm の `@deepseek-ai/dsh` を読み、`alpha` dist-tag と公開版の最大が peer 範囲の外なら失敗します。`latest` dist-tag は `0.2.0-rc.2` のままなので、対象には使いません。

`test:native` はPATH上の `dsh` と `pnpm` を使います。`DSH_HOME`を一時ディレクトリに設定し、実際のWebプロファイルにプラグインを追加します。通常のDSH設定には書き込みません。テスト用APIキーは架空の値で、外部APIへ送信しません。

既存のChromiumを使う場合は `PLAYWRIGHT_CHROMIUM_EXECUTABLE` で実行ファイルを指定できます。

## 設定とツール

`providers` と `tools` はDSH Settingsのvolatileフィールドです。通常検索の選択は既存Webサービスの普通のConfigなので、ConfigEditorを通して保存し、Loaderに再構成を任せます。`fetchProvider`やエージェントのpresetは変更しません。

通常検索のツールは `dsh-tool-web` のままです。追加機能の提供元は機能ごとに1社です。Hostのグローバルツールとして登録し、各presetとその制限に従います。OFFにすると登録を解除し、選択は保存します。

| 機能 | ツール名 |
| --- | --- |
| ニュース | `search_news` |
| 論文 | `search_papers` |
| コード | `search_code` |
| 人物 | `search_people` |
| 企業 | `search_companies` |
| 画像 | `search_images` |
| 動画 | `search_videos` |
| 本文 | `extract_web_page` |
| ページ一覧 | `map_website` |
| Xの投稿検索・URL取得 | `x_search` |

FxTwitterは追加ツール専用で、Webサービスの検索プロバイダーには登録しません。資格情報ストアも使用しません。旧版で保存した7社のキーと機能選択はそのまま使います。

入力とAPI応答を検証し、HTTP以外の出典URL、資格情報を含むURL、ローカル向けの抽出URLを拒否します。API応答は2MiB、抜粋は1件6,000文字、本文は100,000文字で制限します。各社へのリクエストは最大4件並行です。429はエラーとして返し、他社へ切り替えたり自動で再送したりしません。

キャンセルはHTTP通信と待機中のリクエストへ伝えます。プラグインの解除でも通信を中断します。サービス側の処理や料金が取り消される保証は各社のAPI契約に従います。

## 配布

```sh
npm pack
```

`dist` はGit管理します。利用者のインストール時にビルドは走りません。GitHubからインストールできます。

```sh
dsh plugin --profile web add -w github:Aero123421/dsh-search-providers
```

UI部品を更新するときは `upstream.json` のcommitとversionを更新し、ビルド・互換・ブラウザ検証を行います。API更新は各社の公式仕様と `docs/providers.md` を確認します。
