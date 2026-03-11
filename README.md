# Symbol Highlighter

競技プログラミングのコード・問題文中の記号文字をハイライトして視認性を向上させるTampermonkeyユーザースクリプト。

## 対象サイト

- [AtCoder](https://atcoder.jp/)
- [Codeforces](https://codeforces.com/)

## ハイライト対象

| カテゴリ | 半角記号 | 全角記号 | 色 |
|---------|---------|---------|-----|
| 括弧 | `()` `{}` `[]` `<>` | `（）` `｛｝` `［］` `＜＞` `「」` `『』` `【】` | 赤系 |
| 演算子 | `+` `-` `*` `/` `%` `=` `!` `&` `\|` `^` `~` | `＋` `－` `＊` `／` `％` `＝` `！` `＆` `｜` `＾` `～` | 青系 |
| 区切り | `;` `:` `,` `.` | `；` `：` `，` `．` | 緑系 |

KaTeX/MathJax で描画された数式内の記号にも対応しています。

## インストール

1. ブラウザに [Tampermonkey](https://www.tampermonkey.net/) をインストール
2. Tampermonkeyのダッシュボードを開き、新規スクリプトを作成
3. `symbol-highlighter.user.js` の内容を貼り付けて保存

## カスタマイズ

スクリプト冒頭の `STYLE` 定数で各カテゴリの色を変更できます。

```js
const STYLE = {
  bracket: 'color:#e06c75 !important;font-weight:bold', // 括弧
  operator: 'color:#61afef !important;font-weight:bold', // 演算子
  delimiter: 'color:#98c379 !important;font-weight:bold', // 区切り
};
```

KaTeX内の記号の色は `injectKatexStyles()` 関数内のCSSルールで変更できます。
