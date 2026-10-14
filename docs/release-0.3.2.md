# 0.3.2 更新内容

DSH `0.2.1-alpha.3` は、プラグインの `@deepseek-ai/dsh` と `@deepseek-ai/dsh-*` の peerDependencies が実行中の版を満たさないと、起動時にそのプラグインを読み飛ばします。`0.3.1` はこれらの peer を `0.2.1-alpha.2` に固定しているため、`0.2.1-alpha.3` では読み込まれません。設定画面の更新も動きません。

`0.3.2` の該当 peer は `>=0.2.1-alpha.2 <0.3.0-0` です。`0.2.1-alpha.2`、`0.2.1-alpha.3`、それ以降の `0.2.x`（prerelease を含む）を満たします。`0.3.0` とその prerelease は含みません。`0.2.0-rc.2` は、このプラグインが使っている API より前のため含めません。`@deepseek-ai/cordis` と `@deepseek-ai/schemastery` は、この起動時判定の対象外なので版を固定したままです。

`0.3.1` を入れたまま DSH を `0.2.1-alpha.3` に上げた場合は、`v0.3.2` を GitHub のタグか Release の tarball から導入し直してください。

HMR が有効な DSH は、導入済みパッケージを指す `installBundle` を `already-installed` で拒否します。profile は変更されません。更新処理はその結果のときだけ `removeBundle` のあと `installBundle` を呼び、以前の有効状態を渡します。取り外しが `stop-profile` のときはパッケージが残るので導入を続けます。それ以外の取り外し失敗では導入しません。HMR がない DSH `0.2.1-alpha.2` では、`installBundle` だけで上書きします。
