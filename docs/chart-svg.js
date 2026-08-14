/**
 * chart-svg.js — 外部ライブラリを使わないインラインSVGのグラフ描画
 *
 * 設計宣言: 紙色の地に墨色の罫線、データ線はカテゴリ色1色。
 *           数値を叫ばず、形で変化を見せる。装飾は足さない。
 *
 * 使い方: 描画したい場所に <div data-chart="ノートのid"></div> を置く。
 *         データは notes-diet.js の各ノートの chart フィールドから読む
 *         （仕様書10章: 差し替え対象のデータは1つの配列にまとめる）。
 *
 * 【最重要の制約】体重グラフは実数値を出さない。
 *   基準線（長期平均）を 0 とした差分だけを描き、縦軸に数値目盛りを出さない。
 *   基準値そのものはこのファイルにもデータにも書かない（仕様書7章）。
 *
 * chart フィールドの形式:
 *   type        : "line" | "bar"
 *   ariaLabel   : スクリーンリーダー向けの日本語要約（必須）
 *   desc        : 補足説明（任意）
 *   points      : [{ x:"2026-03", y:5, gapBefore:true, note:"開始" }, ...]
 *                 gapBefore を付けた点は直前の点と線をつながない（記録が無い期間）
 *                 x が "YYYY-MM" / "M/D" 形式なら、横位置は日付の間隔に比例させる
 *   showYValues : true のときだけY軸に数値を出す（体重グラフは false）
 *   baselineLabel / caption / valueSuffix : 任意
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var seq = 0;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function shortMonth(key) {
    var m = String(key).match(/^(\d{4})-(\d{1,2})$/);
    return m ? m[1].slice(2) + '/' + Number(m[2]) : String(key);
  }

  // 横位置に使う数値。日付として読めれば日付の間隔を反映する（読めなければ等間隔）
  function timeValue(x) {
    var s = String(x);
    var m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) return Number(m[1]) * 12 + Number(m[2]);          // 月単位
    var d = s.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (d) return (Number(d[1]) * 31 + Number(d[2])) / 31;   // 同一年内の日付
    return null;
  }

  // 目盛りの値を、重複しない見出しに整える（qa指摘: 5.87〜8.28で「6,6,7,8,9」になっていた）
  function tickLabels(min, max, count) {
    var raw = [], i;
    for (i = 0; i <= count; i++) raw.push(min + ((max - min) * i) / count);
    var digits = 0;
    while (digits < 2) {
      var seen = {}, dup = false;
      for (i = 0; i < raw.length; i++) {
        var t = raw[i].toFixed(digits);
        if (seen[t]) { dup = true; break; }
        seen[t] = 1;
      }
      if (!dup) break;
      digits++;
    }
    return raw.map(function (v) { return { value: v, label: v.toFixed(digits) }; });
  }

  function emptyState(container, message) {
    var p = document.createElement('p');
    p.className = 'empty-msg';
    p.textContent = message || 'グラフの元になる記録がまだありません。';
    container.appendChild(p);
  }

  function render(container, data) {
    if (!data || !Array.isArray(data.points)) { emptyState(container); return; }

    // 有効な点だけを残す（null・NaN・Infinity・数値でないものを落とす）
    var pts = [];
    data.points.forEach(function (p) {
      if (!p || typeof p !== 'object') return;
      var y = typeof p.y === 'number' ? p.y : Number(p.y);
      if (!isFinite(y)) return;
      pts.push({ x: p.x, y: y, gapBefore: !!p.gapBefore, note: p.note, label: p.label });
    });
    if (pts.length === 0) { emptyState(container); return; }

    if (!data.ariaLabel && window.console && console.warn) {
      console.warn('[chart-svg] ariaLabel が未設定です。読み上げのために必ず指定してください。');
    }

    var isBar = data.type === 'bar';
    var W = 720, H = 300;
    var padL = data.showYValues ? 40 : 18;
    var padR = 18, padT = 30, padB = 44;
    var innerW = W - padL - padR;
    var innerH = H - padT - padB;

    // 縦の範囲
    var ys = pts.map(function (p) { return p.y; });
    var lo = Math.min.apply(null, ys);
    var hi = Math.max.apply(null, ys);
    var wantBaseline = isBar || data.baselineLabel || (lo < 0 && hi > 0);
    if (wantBaseline) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    var span = (hi - lo) || 1;
    if (isBar) {
      // 棒グラフは下端を厳密に0に固定する（Codex指摘1: 負の距離目盛りが出ていた）
      if (lo >= 0) { lo = 0; hi = hi + span * 0.16; }
      else { lo = lo - span * 0.08; hi = hi + span * 0.16; }
    } else {
      lo -= span * 0.14;
      hi += span * 0.14;
    }

    // 横の範囲（日付が読めれば間隔を反映する。Codex指摘2）
    var tvals = pts.map(function (p) { return timeValue(p.x); });
    var useTime = tvals.every(function (v) { return v !== null; }) && !isBar;
    var tMin = 0, tMax = 1;
    if (useTime) {
      tMin = Math.min.apply(null, tvals);
      tMax = Math.max.apply(null, tvals);
      if (tMax === tMin) useTime = false;
    }
    function xAt(i) {
      if (pts.length === 1) return padL + innerW / 2;
      if (useTime) return padL + (innerW * (tvals[i] - tMin)) / (tMax - tMin);
      return padL + (innerW * i) / (pts.length - 1);
    }
    function yAt(v) { return padT + innerH - ((v - lo) / (hi - lo)) * innerH; }

    var id = 'chart' + (++seq);
    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      role: 'img',
      // aria-label と aria-labelledby の両方を持たせる。
      // labelledby が効く環境では title を、効かない環境では label を読む
      'aria-label': data.ariaLabel || 'グラフ',
      'aria-labelledby': id + '-t',
      'aria-describedby': data.desc ? id + '-d' : null,
      class: 'chart-svg',
      preserveAspectRatio: 'xMidYMid meet'
    });
    if (!data.desc) svg.removeAttribute('aria-describedby');
    var tEl = el('title', { id: id + '-t' });
    tEl.textContent = data.ariaLabel || 'グラフ';
    svg.appendChild(tEl);
    if (data.desc) {
      var dEl = el('desc', { id: id + '-d' });
      dEl.textContent = data.desc;
      svg.appendChild(dEl);
    }

    // 目盛り線
    var ticks = tickLabels(lo, hi, 4);
    ticks.forEach(function (tk) {
      var y = yAt(tk.value);
      svg.appendChild(el('line', { x1: padL, x2: W - padR, y1: y, y2: y, class: 'chart-grid' }));
      if (data.showYValues) {
        var lab = el('text', { x: padL - 8, y: y + 5, class: 'chart-ytick', 'text-anchor': 'end' });
        lab.textContent = tk.label;
        svg.appendChild(lab);
      }
    });

    // 基準線（0）
    if (wantBaseline && lo <= 0 && hi >= 0) {
      var y0 = yAt(0);
      svg.appendChild(el('line', { x1: padL, x2: W - padR, y1: y0, y2: y0, class: 'chart-baseline' }));
      if (data.baselineLabel) {
        var bl = el('text', { x: W - padR, y: y0 - 9, class: 'chart-baseline-label', 'text-anchor': 'end' });
        bl.textContent = data.baselineLabel;
        svg.appendChild(bl);
      }
    }

    if (isBar) {
      var slot = innerW / pts.length;
      var bw = Math.min(52, slot * 0.58);
      var base = yAt(Math.max(lo, 0));
      pts.forEach(function (p, i) {
        var y = yAt(p.y);
        var h = Math.abs(base - y);
        if (h > 0.5) {
          svg.appendChild(el('rect', {
            x: xAt(i) - bw / 2, y: Math.min(y, base),
            width: bw, height: h, rx: 4, class: 'chart-bar'
          }));
        }
        var lab = el('text', { x: xAt(i), y: y - 10, class: 'chart-point-label', 'text-anchor': 'middle' });
        lab.textContent = p.y + (data.valueSuffix || '');
        svg.appendChild(lab);
        if (p.note) {
          var n = el('text', { x: xAt(i), y: y - 26, class: 'chart-note', 'text-anchor': 'middle' });
          n.textContent = p.note;
          svg.appendChild(n);
        }
      });
    } else {
      var d = '', started = false;
      pts.forEach(function (p, i) {
        var cmd = (!started || p.gapBefore) ? 'M' : 'L';
        d += cmd + xAt(i).toFixed(1) + ',' + yAt(p.y).toFixed(1) + ' ';
        started = true;
      });
      svg.appendChild(el('path', { d: d.trim(), class: 'chart-line', fill: 'none' }));
      pts.forEach(function (p, i) {
        svg.appendChild(el('circle', {
          cx: xAt(i), cy: yAt(p.y), r: p.note ? 5.5 : 3.5,
          class: p.note ? 'chart-dot is-key' : 'chart-dot'
        }));
        if (p.note) {
          var n2 = el('text', { x: xAt(i), y: yAt(p.y) - 15, class: 'chart-note', 'text-anchor': 'middle' });
          n2.textContent = p.note;
          svg.appendChild(n2);
        }
      });
    }

    // X軸ラベル（重ならないように間引く）
    // 点の横位置は日付に応じて決まるため間隔が一定でない。「何個おき」で間引くと
    // 記録が混んでいる時期で文字が重なるので、実際の距離を見て間引く。
    // またSVGはviewBoxで縮尺されるので、画面上の距離をviewBoxの単位に換算して判定する
    var shownW = (container.getBoundingClientRect && container.getBoundingClientRect().width) || W;
    var minGap = 70 * (W / (shownW || W));
    var lastIdx = pts.length - 1;
    var idxs = [];
    var prevX = -Infinity;
    pts.forEach(function (p, i) {
      if (i === lastIdx) return;
      if (xAt(i) - prevX >= minGap) { idxs.push(i); prevX = xAt(i); }
    });
    // 最後のラベルは必ず描く。近すぎる手前のラベルは落とす（先頭は残す）
    while (idxs.length > 1 && xAt(lastIdx) - xAt(idxs[idxs.length - 1]) < minGap) idxs.pop();
    idxs.push(lastIdx);
    idxs.forEach(function (i) {
      // 両端は中央寄せだと文字の半分がSVGの外へ出て切れるため、内側へ寄せる
      var anchor = i === 0 ? 'start' : (i === lastIdx ? 'end' : 'middle');
      var t2 = el('text', { x: xAt(i), y: H - padB + 24, class: 'chart-xtick', 'text-anchor': anchor });
      t2.textContent = pts[i].label || shortMonth(pts[i].x);
      svg.appendChild(t2);
    });

    container.appendChild(svg);

    if (data.caption) {
      var cap = document.createElement('figcaption');
      cap.className = 'chart-caption';
      cap.textContent = data.caption;
      container.appendChild(cap);
    }
  }

  function findChart(noteId) {
    // notes-diet.js は const 宣言なので window のプロパティにならない。
    // 既存ページ（diet.html）と同じく typeof で参照する
    var list = (typeof NOTES_DIET !== 'undefined') ? NOTES_DIET
             : (window.NOTES_DIET || null);
    if (!Array.isArray(list)) return null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === noteId) return list[i].chart || null;
    }
    return null;
  }

  function init() {
    document.querySelectorAll('[data-chart]').forEach(function (node) {
      render(node, findChart(node.getAttribute('data-chart')));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
