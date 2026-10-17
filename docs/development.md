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

`test:native` はPATH上の `dsh` と `pnpm` を使います。`DSH_HOME`を一時ディレクトリに設定し、実際のWebプロファイルにプラグインを追加します。通常のDSH設定には書き込みません。テスト用APIキーは架空の値で、外部APIへ送信しません。設定画面は、DSH `0.2.1-alpha.2` のサイドバー「Settings」と、`0.2.1-alpha.3` の未ログイン時の「More」（accessible name は Account menu）内の Settings の両方から開きます。

既存のChromiumを使う場合は `PLAYWRIGHT_CHROMIUM_EXECUTABLE` で実行ファイルを指定できます。

### 旧版からの更新を確認する

[test:upgradeの実装](../scripts/upgrade-check.mjs)は、実DSHの隔離した一時 `DSH_HOME` に公式 `0.3.2` を導入し、旧設定を保存した後、DSHのplugin manager CLIによるremove／addで新しいパッケージへ切り替えます。PATH上の `dsh`・`pnpm`・`tar` とPlaywright Chromiumが必要です。提供元・モデルAPIは呼ばず、保存するキーは架空の値です。

公式Releaseの `0.3.2` tarballを取得し、同じReleaseの `SHA256SUMS` と照合してから、`OLD_RELEASE_TGZ` にそのローカルパスを設定してください。`NEW_PACKAGE_TGZ` は検証する新しいtarballのローカルパスです。以下はリポジトリのルートで実行します。

```sh
# ソースディレクトリを更新先として検証
npm run test:upgrade -- "$OLD_RELEASE_TGZ" .
# 実際の配布tarballを更新先として検証
npm run test:upgrade -- "$OLD_RELEASE_TGZ" "$NEW_PACKAGE_TGZ"
```

第1引数は旧tarballが必須、第2引数は新しいpackage specで、省略すると実行時のカレントディレクトリです。スクリプト自身は旧tarballのpackage名・版を検査しますが、checksumの取得・照合は呼出し前の責任です。

通常検索先と元の検索先、保存キーの有無（値は非開示）、提供元のON/OFF、既存の論文／本文／X機能選択が残り、新しいWeb／バッチ機能は未選択・検索条件は空であることを確認します。さらに新条件の保存・リセットと複数回のHost再起動後の保持を調べます。通常の利用者profileは変更しません。これは更新と設定保持の確認で、旧版へのダウングレードや実APIの検索品質の試験ではありません。

CIはDSH `0.2.1-alpha.2`／`0.2.1-rc.2` のmatrixで、checksumを照合した旧Releaseから新しくpackしたtarballへの更新を実行する構成です。各実行の結果は[GitHub Actions](https://github.com/Aero123421/dsh-search-providers/actions)を参照してください。

## 設定とツール

`providers` と `tools` はDSH Settingsのvolatileフィールドです。提供元ごとの検索条件は `providers.<id>.search` に任意で保存し、未指定なら従来の既定を維持します。`search-options` RPCはrevisionを確認し、`settings.mutate` の `set` でこの部分木を置換します。`{}` でのリセットは古いフィルターを残しません。追加ツールの `options` は保存値とフィールド単位でマージしてから検証します。[対応値と組合せ](search-options.md)

通常検索の選択は既存WebサービスのConfigをConfigEditorで保存し、Loaderに再構成を任せます。`fetchProvider`やエージェントのpresetは変更しません。

通常検索のツールは `dsh-tool-web` のままです。追加機能の提供元は機能ごとに1社です。Hostのグローバルツールとして登録し、各presetとその制限に従います。OFFにすると登録を解除し、選択は保存します。

| 機能 | ツール名 |
| --- | --- |
| 条件付きWeb検索 | `search_web` |
| ニュース | `search_news` |
| 論文 | `search_papers` |
| コード | `search_code` |
| 人物 | `search_people` |
| 企業 | `search_companies` |
| 画像 | `search_images` |
| 動画 | `search_videos` |
| 本文 | `extract_web_page` |
| 複数URLの本文 | `extract_web_pages` |
| ページ一覧 | `map_website` |
| Xの投稿検索・URL取得 | `x_search` |

FxTwitterは追加ツール専用で、Webサービスの検索プロバイダーには登録しません。資格情報ストアも使用しません。旧版で保存した7社のキーと機能選択はそのまま使います。

入力とAPI応答を検証し、HTTP以外の出典URL、資格情報を含むURL、ローカル向けの抽出URLを拒否します。API応答は2MiB、抜粋は1件6,000文字、本文は1ページ100,000文字です。バッチは最大10 URL・出力本文合計200,000文字で、重複を要求時に除き、出力を入力順に戻します。各社へのリクエストは最大4件並行、HTTP期限45秒、追加ツール期限60秒です。

HTTP 429の他社切り替えは、通常検索と追加検索の条件なし初回要求だけです。選択元に保存条件があるか、呼出しの `options` にフィールドがあれば切り替えません。候補も保存条件のない有効な対応社に限り、一覧順に1回ずつ試します。同じ社への自動再送、認証失敗・未対応指定・429以外での切り替えはしません。本文・バッチ・一覧・X・続き取得も切り替えません。

ページ送りはTinyFish・Braveの対応検索・FxTwitterだけに、query／カテゴリ／条件を固定した一時ハンドルを返します。自動で取得せず、15分・提供元ごと100件、解除で破棄します。メタデータは型付きの任意フィールドとして検証し、標準DSHが保持しない追加情報は上限付きsnippet注記にも載せます。標準ツールのschemaを拡張したり、専用の出典カードを作ったりはしません。[詳細と制約](providers.md)

`tools.web`／`tools.batchExtract` を保存したprofileは、そのままでは旧版が読めません。OFFでも項目は残るため、ダウングレード前に[バックアップと設定整理](release-0.4.0.md#更新と旧版への復帰)が必要です。

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
