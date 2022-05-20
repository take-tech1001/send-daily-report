# send-daily-report
日報を簡単に投稿するためのChrome拡張機能

## インストール
https://chrome.google.com/webstore/detail/send-daily-report/kfoabkfnfecocaahfpieedpmkmiekicm?hl=ja&authuser=0

## 使い方
- 読み込んだ拡張機能の詳細ページから「拡張機能のオプション」をクリック
- 各項目を埋めて保存する

| Item | Description |
| --- | --- |
| SlackのToken  | `xoxp-`で始まるSlackアプリのOAuthトークン  |
| 日報を投稿するチャンネルのチャンネルID  | `frontend_dev_group_dayrepo`のチャンネルID<br/>チャンネルIDの[確認方法](https://zenn.dev/dashi296/articles/4324507780a3cf)  |
| timesを投稿するチャンネルのチャンネルID  | `times`のチャンネルID  |
| 名前  | 日報で使用している自分の名前  |
| togglのAPIトークン（任意）  | togglと連携する際に使用するトークン<br/>トークンの[確認方法](https://support.toggl.com/en/articles/3116844-where-is-my-api-key-located)  |

- 拡張機能を開いて日報を記載し送信するボタンを押すと投稿される<br/>＊timeの出勤時間と退勤時間は任意
