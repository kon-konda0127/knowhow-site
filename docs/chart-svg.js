/**
 * chart-svg.js — 外部ライブラリを使わないインラインSVGのグラフ描画
 *
 * 設計宣言: 紙色の地に墨色の罫線、データの線はカテゴリ色1色。
 *           数値を叫ばず、形で変化を見せる。装飾は足さない。
 *
 * 使い方: 描画先の要素に data-chart="キー名" を付け、CHART_DATA にデータを置く。
 *         DOMContentLoaded 後に自動で描画される。
 *
 * 【重要な制約】体重グラフは実数値を出さない。
 *   基準線（平均）を 0 とした差分だけを描き、縦軸に数値目盛りを出さない。
 *   基準値そのものはこのファイルにもデータにも書かない（仕様書7章）。
 *
 * データ形式:
 *   {
 *     type: "line" | "bar",
 *     ariaLabel: "スクリーンリーダー向けの日本語要約（必須）",
 *     desc: "補足説明",
 *     points: [{ x: "2026-03", y: 5, gapBefore: true, note: "開始" }, ...]
 *     // gapBefore: true を付けた点は、直前の点と線をつながない（記録が無い期間）
 *     yLabel / xLabel: 軸の説明（任意）
 *     showYValues: true のときだけ Y軸に数値を出す（体重グラフでは false）
 *     valueSuffix: 直接ラベルに付ける単位
 *   }
 */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs) => {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  // 月キー "2026-03" → "26/3" の短縮表記（軸ラベル用）
  const shortMonth = (key) => {
    const m = String(key).match(/^(\d{4})-(\d{1,2})$/);
    return m ? `${m[1].slice(2)}/${Number(m[2])}` : String(key);
  };

  function render(container, data) {
    if (!data || !Array.isArray(data.points) || data.points.length === 0) {
      const p = document.createElement('p');
      p.className = 'empty-msg';
      p.textContent = 'グラフの元になる記録がまだありません。';
      container.appendChild(p);
      return;
    }

    // 座標系（viewBox基準。CSSで幅100%に伸縮する）
    const W = 720, H = 300;
    const padL = 18, padR = 18, padT = 26, padB = 40;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const ys = data.points.map(p => p.y).filter(v => typeof v === 'number');
    let min = Math.min(...ys), max = Math.max(...ys);
    if (data.type === 'bar') min = Math.min(0, min);
    // 上下に余白を1割ずつ
    const span = (max - min) || 1;
    min -= span * 0.12;
    max += span * 0.12;

    const xAt = (i) => padL + (data.points.length === 1 ? innerW / 2 : (innerW * i) / (data.points.length - 1));
    const yAt = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;

    const svg = el('svg', {
      viewBox: `0 0 ${W} ${H}`,
      role: 'img',
      'aria-label': data.ariaLabel || 'グラフ',
      class: 'chart-svg',
      preserveAspectRatio: 'xMidYMid meet'
    });
    const titleEl = el('title', {});
    titleEl.textContent = data.ariaLabel || 'グラフ';
    svg.appendChild(titleEl);
    if (data.desc) {
      const d = el('desc', {});
      d.textContent = data.desc;
      svg.appendChild(d);
    }

    // 目盛り線（控えめ）。体重グラフでは数値を出さない
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const v = min + ((max - min) * i) / gridCount;
      const y = yAt(v);
      svg.appendChild(el('line', {
        x1: padL, x2: W - padR, y1: y, y2: y,
        class: 'chart-grid'
      }));
      if (data.showYValues) {
        const t = el('text', { x: padL - 6, y: y + 4, class: 'chart-ytick', 'text-anchor': 'end' });
        t.textContent = Math.round(v);
        svg.appendChild(t);
      }
    }

    // 基準線（0）— 差分グラフの意味の中心なので強調する
    if (min < 0 && max > 0) {
      const y0 = yAt(0);
      svg.appendChild(el('line', {
        x1: padL, x2: W - padR, y1: y0, y2: y0, class: 'chart-baseline'
      }));
      if (data.baselineLabel) {
        const t = el('text', { x: W - padR, y: y0 - 7, class: 'chart-baseline-label', 'text-anchor': 'end' });
        t.textContent = data.baselineLabel;
        svg.appendChild(t);
      }
    }

    if (data.type === 'bar') {
      const bw = Math.min(46, (innerW / data.points.length) * 0.56);
      data.points.forEach((p, i) => {
        if (typeof p.y !== 'number') return;
        const y = yAt(p.y), y0 = yAt(Math.max(min, 0));
        svg.appendChild(el('rect', {
          x: xAt(i) - bw / 2, y: Math.min(y, y0),
          width: bw, height: Math.max(2, Math.abs(y0 - y)),
          rx: 4, class: 'chart-bar'
        }));
        const lab = el('text', { x: xAt(i), y: y - 8, class: 'chart-point-label', 'text-anchor': 'middle' });
        lab.textContent = `${p.y}${data.valueSuffix || ''}`;
        svg.appendChild(lab);
        if (p.note) {
          const n = el('text', { x: xAt(i), y: y - 22, class: 'chart-note', 'text-anchor': 'middle' });
          n.textContent = p.note;
          svg.appendChild(n);
        }
      });
    } else {
      // 折れ線: 記録が無い区間（gapBefore）は線をつながない
      let d = '', started = false;
      data.points.forEach((p, i) => {
        if (typeof p.y !== 'number') { started = false; return; }
        const cmd = (!started || p.gapBefore) ? 'M' : 'L';
        d += `${cmd}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)} `;
        started = true;
      });
      svg.appendChild(el('path', { d: d.trim(), class: 'chart-line', fill: 'none' }));

      data.points.forEach((p, i) => {
        if (typeof p.y !== 'number') return;
        svg.appendChild(el('circle', {
          cx: xAt(i), cy: yAt(p.y), r: p.note ? 5 : 3.2, class: p.note ? 'chart-dot is-key' : 'chart-dot'
        }));
        if (p.note) {
          const n = el('text', { x: xAt(i), y: yAt(p.y) - 13, class: 'chart-note', 'text-anchor': 'middle' });
          n.textContent = p.note;
          svg.appendChild(n);
        }
      });
    }

    // X軸ラベル（狭い画面では間引く）
    const step = data.points.length > 12 ? Math.ceil(data.points.length / 6) : 1;
    data.points.forEach((p, i) => {
      if (i % step !== 0 && i !== data.points.length - 1) return;
      const t = el('text', { x: xAt(i), y: H - padB + 20, class: 'chart-xtick', 'text-anchor': 'middle' });
      t.textContent = p.label || shortMonth(p.x);
      svg.appendChild(t);
    });

    container.appendChild(svg);

    if (data.caption) {
      const cap = document.createElement('p');
      cap.className = 'chart-caption';
      cap.textContent = data.caption;
      container.appendChild(cap);
    }
  }

  function init() {
    const data = window.CHART_DATA || {};
    document.querySelectorAll('[data-chart]').forEach(node => {
      const key = node.getAttribute('data-chart');
      render(node, data[key]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
