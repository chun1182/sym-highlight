# Symbol Highlighter

競技プログラミングのコード・問題文中の記号文字をハイライトして視認性を向上させるTampermonkeyユーザースクリプト。

## 対象サイト

- [AtCoder](https://atcoder.jp/)
- [Codeforces](https://codeforces.com/)

## ハイライト対象

### 通常テキスト（TreeWalkerによるspan置換）

| カテゴリ | 半角記号 | 全角・特殊記号 | 色 |
| --------- | --------- | --------------- | ----- |
| 括弧 | `()` `{}` `[]` `<>` | `（）` `｛｝` `［］` `＜＞` `「」` `『』` `【】` | 赤 `#e45649` |
| 演算子 | `+` `-` `*` `/` `%` `=` `!` `&` `\|` `^` `~` | `＋－＊／％＝！＆｜＾～` `×÷≤≥≠≦≧` `∈∉⊂⊃∪∩∧∨¬` `→←↑↓↔⇒⇔∞` `#@_？?＃＠＿` | 青 `#4078f2` |
| 区切り | `;` `:` `,` `.` | `；：，．。、・` | 緑 `#50a14f` |

### KaTeX数式内（CSS経由）

| KaTeXクラス | 対応する記号 | 色 |
| ------------- | ------------- | ----- |
| `.mopen` `.mclose` | 括弧 | 赤 `#e45649` |
| `.mrel` `.mbin` | 演算子 (`=`, `+`, `-` 等) | 青 `#4078f2` |
| `.mpunct` | 区切り (`,`, `;` 等) | 緑 `#50a14f` |
| `.mord.mathnormal` | 変数 (`m`, `k`, `A` 等) | ゴールド `#c18401` |

配色は One Light テーマベースで、白背景に最適化されています。

## インストール

1. ブラウザに [Tampermonkey](https://www.tampermonkey.net/) をインストール
2. Tampermonkeyのダッシュボードを開き、新規スクリプトを作成
3. `symbol-highlighter.user.js` の内容を貼り付けて保存

## カスタマイズ

スクリプト冒頭の `STYLE` 定数で各カテゴリの色を変更できます。

```js
const STYLE = {
  bracket: 'color:#e45649 !important;font-weight:bold', // 括弧
  operator: 'color:#4078f2 !important;font-weight:bold', // 演算子
  delimiter: 'color:#50a14f !important;font-weight:bold', // 区切り
};
```

KaTeX内の記号・変数の色は `injectKatexStyles()` 関数内のCSSルールで変更できます。
