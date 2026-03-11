# 記号ハイライト ユーザースクリプト

## プロジェクト概要

競技プログラミングのコード・問題文中の記号文字を色付けして視認性を向上させるTampermonkeyユーザースクリプト。
詳細は `docs/symbol-highlighter-design.md` を参照。

## 言語

日本語で応答すること。コード内のコメントも日本語。

## 技術スタック

- Tampermonkey ユーザースクリプト（JSファイル1つで完結）
- 純粋なDOM操作のみ（Tampermonkey固有APIは使わない）

## ファイル構成

```text
symbol-highlighter.user.js   メインスクリプト
docs/                         設計ドキュメント
```

## 実装方針

- 対象サイト: AtCoder, Codeforces
- 通常テキスト: `#task-statement` `.problem-statement` `pre` `code` 内のテキストノードをTreeWalkerで走査し、記号を `<span>` で囲む
- KaTeX数式内: CSSルール（`.katex .mopen`, `.mord.mathnormal` 等）で色を当てる（DOM構造を壊さないため）
- TreeWalkerフィルタでKaTeX/MathJax/script/style/math要素内のテキストノードをスキップ
- MutationObserver（disconnect/observe方式）で動的コンテンツにも対応
- 半角・全角記号、矢印、集合・論理記号にも対応
- 配色はOne Lightテーマベース（白背景最適化）
