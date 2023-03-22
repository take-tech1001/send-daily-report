# send-daily-report
日報を簡単に投稿するためのChrome拡張機能

## インストール
https://chrome.google.com/webstore/detail/send-daily-report/kfoabkfnfecocaahfpieedpmkmiekicm?hl=ja&authuser=0

## 拡張機能の設定
1. OAuthトークンを取得する  
Slackアプリからメッセージを投稿する上で必要なトークンを取得します。  
[こちら](https://slack.com/oauth/v2/authorize?user_scope=chat:write,files:write,users.profile:write&client_id=2659222021.3289496275169&redirect_uri=https://asia-northeast1-send-daily-report-e1ce9.cloudfunctions.net/api)にアクセスすると「Send Daily Report が Slack ワークスペースにアクセスする権限をリクエストしています」という画面が表示されます。  
「許可する」を押すと画面が遷移した後、`xoxp-`で始まるトークンが表示されるのでこちらを保管しておいてください。  
※ワークスペースにサインインしている状態で実行する必要があります。上手くいかなかった方は[こちら](https://slack.com/intl/ja-jp/workspace-signin)にアクセスしてサインインしているかどうか確認してみてください。

2. オプションの登録  
インストールした拡張機能の詳細ページ（chrome://extensions/?id=kfoabkfnfecocaahfpieedpmkmiekicm）から「拡張機能のオプション」をクリックし、各項目を埋めて保存します。

| Item | Description |
| --- | --- |
| SlackのToken  | `xoxp-`で始まるSlackアプリのOAuthトークン  |
| 日報を投稿するチャンネルのチャンネルID  | 英数字11桁のチャンネルID<br/>チャンネルIDの[確認方法](https://zenn.dev/dashi296/articles/4324507780a3cf)  |
| timesを投稿するチャンネルのチャンネルID（任意）  | `times`のチャンネルID  |
| 名前  | 日報で使用している自分の名前  |
| Time DesignerのAPIトークン（任意）  | Time Designerと連携する際に使用するトークン<br/>トークンの[確認方法](https://developer.timedesigner.com/#1bff7d7a22)  |

## 使い方

- 項目を増やす
  - 書きたい項目が複数ある時は一つのテキストエリア内で改行するのではなく、＋ボタンで新しい項目を増やせるようになっています。
  - 削除する時は−ボタンを押します。

- 値を保存する
  - 「保存する」を押すと書いた内容を保存しておくことができます。保存しておくことで次の日以降も同じ値を使い回すことができます。
  - 「クリア」を押すと保存している内容を削除できます。
  - 保存されていない項目は日報に含まれないので注意してください。

- 日報を送信する
  - 「送信する」を押すと登録したチャンネルIDと紐づくチャンネルへ日報を送信します。

- Time Designerで記録したスケジュールを追加する
  - 「1日のスケジュールを追加する」にチェックを入れ送信することでTime Designerに記録した1日のスケジュールを日報に追加することができます（Time Designerの画面上だとどのタスクをどの程度作業したのかが分かりづらかったので追加しました）。
  - この機能を利用するにはTime DesignerのAPIトークンを登録する必要があります。
