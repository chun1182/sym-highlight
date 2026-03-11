// ==UserScript==
// @name         Symbol Highlighter
// @namespace    https://github.com/sym-highlight
// @version      1.7.0
// @description  競技プログラミングのコード中の記号文字をハイライトして視認性を向上させる
// @match        https://atcoder.jp/*
// @match        https://codeforces.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // === 色設定（カテゴリごと） ===
  const STYLE = {
    bracket: 'color:#e45649 !important;font-weight:bold', // 括弧: 赤
    operator: 'color:#4078f2 !important;font-weight:bold', // 演算子: 青
    delimiter: 'color:#50a14f !important;font-weight:bold', // 区切り: 緑
  };

  // 正規表現（半角＋全角＋記号文字をリテラルで直接定義）
  const RE = /[(){}[\]<>+\-*/%=!&|^~;:,.（）｛｝［］＜＞＋－＊／％＝！＆｜＾～；：，．「」『』【】。、・→←↑↓↔⇒⇔×÷≤≥≠≦≧∞∈∉⊂⊃∪∩∧∨¬#@_？?＃＠＿]/g;

  // 文字→カテゴリ名のマップ
  const CAT = {};
  for (const ch of '(){}[]<>（）｛｝［］＜＞「」『』【】') CAT[ch] = 'bracket';
  for (const ch of '+-*/%=!&|^~＋－＊／％＝！＆｜＾～×÷≤≥≠≦≧∈∉⊂⊃∪∩∧∨¬') CAT[ch] = 'operator';
  for (const ch of ';:,.；：，．。、・') CAT[ch] = 'delimiter';
  for (const ch of '→←↑↓↔⇒⇔∞#@_？?＃＠＿') CAT[ch] = 'operator';

  // === KaTeX内の記号にCSSで色を当てる ===
  function injectKatexStyles() {
    const style = document.createElement('style');
    style.textContent = [
      // 括弧: mopen, mclose
      `.katex .mopen { color: #e45649 !important; font-weight: bold; }`,
      `.katex .mclose { color: #e45649 !important; font-weight: bold; }`,
      // 演算子: mrel (=, <, > 等), mbin (+, -, * 等)
      `.katex .mrel { color: #4078f2 !important; font-weight: bold; }`,
      `.katex .mbin { color: #4078f2 !important; font-weight: bold; }`,
      // 区切り: mpunct (, ; 等)
      `.katex .mpunct { color: #50a14f !important; font-weight: bold; }`,
      // 変数: mathnormal (m, k, A, w 等のイタリック変数)
      `.katex .mord.mathnormal { color: #c18401 !important; font-weight: bold; }`,
    ].join('\n');
    document.head.appendChild(style);
  }

  // === 対象コンテナのセレクタ ===
  const TARGET_SELECTOR = '#task-statement, .problem-statement, pre, code';

  // === TreeWalkerフィルタ（KaTeX/MathJax/script等をスキップ） ===
  function createFilteredWalker(root) {
    return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        let p = node.parentNode;
        while (p && p !== root) {
          const tag = p.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MATH' || tag === 'SVG') {
            return NodeFilter.FILTER_REJECT;
          }
          if (p.hasAttribute && p.hasAttribute('data-sh')) {
            return NodeFilter.FILTER_REJECT;
          }
          const cls = p.className;
          if (cls && typeof cls === 'string' && (cls.includes('katex') || cls.includes('MathJax'))) {
            return NodeFilter.FILTER_REJECT;
          }
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
  }

  // === テキストノードを置換 ===
  function processTextNode(textNode) {
    const text = textNode.nodeValue;
    RE.lastIndex = 0;
    if (!RE.test(text)) return;
    RE.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = RE.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const span = document.createElement('span');
      span.setAttribute('style', STYLE[CAT[match[0]]]);
      span.setAttribute('data-sh', '1');
      span.textContent = match[0];
      frag.appendChild(span);

      lastIndex = RE.lastIndex;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  // === メイン処理 ===
  function highlightSymbols(root) {
    const containers = root.querySelectorAll
      ? root.querySelectorAll(TARGET_SELECTOR)
      : [];
    const targets =
      root.matches && root.matches(TARGET_SELECTOR)
        ? [root, ...containers]
        : [...containers];

    for (const container of targets) {
      const walker = createFilteredWalker(container);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      for (const textNode of textNodes) {
        processTextNode(textNode);
      }
    }
  }

  // === MutationObserver（disconnect/observe方式） ===
  let observer;

  function startObserving() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function setupObserver() {
    observer = new MutationObserver((mutations) => {
      observer.disconnect();

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              highlightSymbols(addedNode);
            }
          }
        } else if (mutation.type === 'characterData') {
          if (mutation.target.nodeType === Node.TEXT_NODE) {
            processTextNode(mutation.target);
          }
        }
      }

      startObserving();
    });

    startObserving();
  }

  // === エントリポイント ===
  injectKatexStyles();
  highlightSymbols(document);
  setupObserver();
})();
