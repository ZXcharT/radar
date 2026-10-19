/* Local share prototype: current rendered state only; no provider, upload or recomputation. */
'use strict';
(() => {
  const $ = id => document.getElementById(id), text = id => $(id)?.textContent.trim() || '';
  const camera = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8.25 6.5 1.5-2.25h4.5l1.5 2.25H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2Z"/><circle cx="12" cy="12.75" r="3.25"/></svg>';
  const dialog = document.createElement('dialog');
  dialog.id = 'snapshot-dialog'; dialog.setAttribute('aria-labelledby', 'snapshot-title');
  dialog.innerHTML = `<header class="snapshot-heading"><div><h2 id="snapshot-title">截图分享</h2><p>当前视图的本地快照，不上传图片。</p></div><button type="button" class="snapshot-close" aria-label="关闭截图预览"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="snapshot-options"><div class="snapshot-scopes" role="group" aria-label="截图内容"><button type="button" data-snapshot-scope="main">行业离散指数</button><button type="button" data-snapshot-scope="contribution">离散度贡献</button></div><label><input id="snapshot-details" type="checkbox" checked><span id="snapshot-option-label">包含排名（正负两端＋选中／锁定）</span></label><span id="snapshot-dimensions"></span></div><div class="snapshot-image-wrap"><img id="snapshot-image" alt="带OneChart品牌的当前图表分享快照" hidden><p id="snapshot-progress" role="status" aria-live="polite">正在生成截图…</p></div><footer class="snapshot-actions"><p id="snapshot-feedback" role="status" aria-live="polite"></p><div><button id="snapshot-copy" type="button" disabled>复制图片</button><button id="snapshot-share" type="button" disabled hidden>系统分享</button><button id="snapshot-save" type="button" disabled>保存 PNG</button></div></footer>`;
  document.body.append(dialog);
  const include = $('snapshot-details'), image = $('snapshot-image'), progress = $('snapshot-progress'), feedback = $('snapshot-feedback');
  let frozen = null, blob = null, objectURL = '', epoch = 0, opener = null;
  const actions = ['snapshot-copy', 'snapshot-share', 'snapshot-save'].map($);
  const loadImage = source => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('图片素材加载失败')); img.src = source; });
  const toBlob = canvas => new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('图片编码失败')), 'image/png'));
  function palette() {
    const css = getComputedStyle(document.documentElement);
    return Object.fromEntries(['bg', 'text', 'muted', 'line', 'up', 'down', 'oc-crowding'].map(key => [key, css.getPropertyValue('--' + key).trim()]));
  }
  // Lay out existing rendered coordinates on a fixed export plot. Never resize the live chart.
  function vectorSnapshot(svg, rows, p) {
    const surface = svg.querySelector('#contribution-surface'), left = +surface.getAttribute('x'), sourceTop = +surface.getAttribute('y'), sourceWidth = +surface.getAttribute('width');
    const width = 1200, height = 730, L = 76, R = 36, T = 32, H = 460, inner = width - L - R;
    const x = value => L + (value - left) / sourceWidth * inner, y = value => T + (value - sourceTop) / 450 * H;
    const ns = 'http://www.w3.org/2000/svg', out = document.createElementNS(ns, 'svg');
    out.setAttribute('xmlns', ns); out.setAttribute('width', width); out.setAttribute('height', height); out.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const add = (tag, attributes, label) => { const node = document.createElementNS(ns, tag); Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value))); if (label !== undefined) node.textContent = label; out.append(node); return node; };
    const label = (value, xx, yy, color = p.muted, size = 16, anchor = 'start') => add('text', { x: xx, y: yy, fill: color, 'font-size': size, 'font-family': '-apple-system, PingFang SC, sans-serif', 'text-anchor': anchor }, value);
    const css = getComputedStyle(surface), zero = y(+svg.querySelector('#contribution-zero-line').getAttribute('y1'));
    add('rect', { x: L, y: T, width: inner, height: 690, fill: css.fill });
    add('line', { x1: L, x2: width - R, y1: zero, y2: zero, stroke: p.muted, 'stroke-opacity': .6 });
    label('阶段强弱分界线', width - R - 8, zero - 10, p.muted, 15, 'end');
    const mandatory = new Set(rows.filter(row => row.selected || row.locked).map(row => row.code));
    const paths = [...svg.querySelectorAll('path')].filter(node => node.dataset.code || node.id === 'hql-curve25' || (!node.closest('#zero-flow-guide') && node.getAttribute('stroke') === '#8797a7'));
    paths.forEach(node => {
      const style = getComputedStyle(node), points = [...(node.getAttribute('d') || '').matchAll(/([ML])\s*(-?[\d.e+]+)\s+(-?[\d.e+]+)/gi)];
      if (!points.length || points.some(point => !Number.isFinite(+point[2]) || !Number.isFinite(+point[3]))) return;
      const d = points.map(point => `${point[1]} ${x(+point[2])} ${y(+point[3])}`).join(' '), emphasized = mandatory.has(node.dataset.code);
      add('path', { d, fill: 'none', stroke: style.stroke, 'stroke-width': emphasized ? Math.max(2.6, parseFloat(style.strokeWidth)) : style.strokeWidth, opacity: emphasized ? 1 : style.opacity, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': style.strokeDasharray });
      if (emphasized) {
        const row = rows.find(item => item.code === node.dataset.code), last = points.at(-1);
        label(row.name + (row.locked ? ' · 锁定' : ' · 选中'), width - R - 8, Math.max(T + 22, Math.min(T + H - 8, y(+last[3]) - 10)), style.stroke, 18, 'end');
      }
    });
    const brush = svg.querySelector('#brush-active18>rect');
    if (brush) add('rect', { x: x(+brush.getAttribute('x')), y: T, width: +brush.getAttribute('width') / sourceWidth * inner, height: H, fill: '#557da8', opacity: .1, stroke: '#557da8' });
    const bars = [...svg.querySelectorAll('.daily-bar23')], base = 665;
    add('line', { x1: L, x2: width - R, y1: base, y2: base, stroke: p.muted, 'stroke-opacity': .5 });
    bars.forEach(node => {
      const xx = x(+node.getAttribute('x')), hh = +node.getAttribute('height'), yy = +node.getAttribute('y') < 625 ? base - hh : base, style = getComputedStyle(node);
      add('rect', { x: xx, y: yy, width: +node.getAttribute('width') / sourceWidth * inner, height: hh, fill: style.fill, opacity: style.opacity });
    });
    const dates = [...svg.querySelectorAll(':scope>text')].map(node => node.textContent).filter(value => /^\d{2}-\d{2}-\d{2}$/.test(value));
    label(dates[0] || '', L, 535); label(dates.at(-1) || '', width - R, 535, p.muted, 16, 'end');
    label('90日累计贡献 · MA5点线', (L + width - R) / 2, 560, p.muted, 16, 'middle');
    const divider = svg.querySelector('#contribution-panel-divider');
    add('line', { x1: L, x2: width - R, y1: 578, y2: 578, stroke: divider ? getComputedStyle(divider).stroke : p.line, 'stroke-width': 1 });
    const daily = [...svg.querySelectorAll(':scope>text')].find(node => node.textContent.startsWith('当日'));
    label(daily?.textContent || '当日贡献 · 橙色扩大分化 / 蓝色缩小分化', L, 600, p.muted, 16);
    const guideX = 28;
    for (const [a, b] of [[T + 30, zero - 25], [zero + 25, T + H - 20]]) {
      add('line', { x1: guideX, x2: guideX, y1: a, y2: b, stroke: p.muted });
      add('path', { d: `M ${guideX - 4} ${a + 7} L ${guideX} ${a} L ${guideX + 4} ${a + 7} M ${guideX - 4} ${b - 7} L ${guideX} ${b} L ${guideX + 4} ${b - 7}`, fill: 'none', stroke: p.muted });
    }
    label('分化', guideX, T + 10, p.muted, 15, 'middle'); label('回归', guideX, zero + 5, p.text, 15, 'middle'); label('分化', guideX, T + H + 20, p.muted, 15, 'middle');
    [['进攻', 13, T + H / 4], ['回落', 43, T + H / 4], ['修复', 13, T + H * .75], ['走弱', 43, T + H * .75]].forEach(([word, xx, yy]) => { label(word[0], xx, yy - 12, p.text, 15, 'middle'); label(word[1], xx, yy + 12, p.text, 15, 'middle'); });
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(out)], { type: 'image/svg+xml;charset=utf-8' }));
    return loadImage(url).finally(() => URL.revokeObjectURL(url));
  }
  function compactRows(rows) {
    const positive = rows.filter(row => parseFloat(row.contribution) > 0).slice(0, 3);
    const negative = rows.filter(row => parseFloat(row.contribution) < 0).slice(-3);
    const codes = new Set([...positive, ...negative, ...rows.filter(row => row.selected || row.locked)].map(row => row.code));
    return rows.filter(row => codes.has(row.code));
  }
  function mainSnapshot(instance, p) {
    const option = instance.getOption(), target = document.createElement('div');
    const chart = window.echarts.init(target, null, { width: 1200, height: 680, devicePixelRatio: 2 });
    try { chart.setOption({ ...option, yAxis: option.yAxis.map(axis => ({ ...axis, name: '' })), animation: false, backgroundColor: p.bg }, { silent: true }); chart.getZr().flush(); return loadImage(chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: p.bg })); }
    finally { chart.dispose(); }
  }
  function capture(kind) {
    const contribution = kind === 'contribution', light = document.documentElement.dataset.theme === 'light';
    if (document.body.dataset.macroUiReady !== 'true') throw new Error('请等待图表加载完成再截图。');
    const p = palette(), rows = [...document.querySelectorAll('#rank-list .rank-row')].map(row => ({
      code: row.dataset.code, selected: row.classList.contains('selected'), locked: row.classList.contains('locked'),
      name: row.querySelector('.stock-detail-link-label,.name')?.textContent.trim() || '',
      state: row.querySelector('.state')?.textContent.trim() || '',
      contribution: row.querySelector('.direction-value')?.textContent.trim() || '—',
      change: row.querySelector('.return-value')?.textContent.trim() || '—'
    }));
    let chart, caption, legend = [], details, date;
    if (contribution) {
      if (!['current', 'stale-last-good'].includes($('dispersion-module').dataset.state)) throw new Error('请等待贡献数据加载完成再截图。');
      chart = vectorSnapshot($('plot'), rows, p); caption = document.querySelector('.contribution-range-label')?.textContent.trim() || '';
      date = text('date-display20');
      details = { title: text('scope-name'), note: text('scope-note'), rows: compactRows(rows), total: rows.length };
    } else {
      const instance = window.echarts.getInstanceByDom($('chart')), option = instance.getOption(), axis = option.xAxis[0].data;
      const zoom = option.dataZoom[0] || {}, position = (value, fraction) => typeof value === 'string' && axis.includes(value) ? axis.indexOf(value) : Math.round(value ?? (axis.length - 1) * fraction / 100);
      const start = position(zoom.startValue, zoom.start || 0), end = position(zoom.endValue, zoom.end ?? 100);
      const day = value => String(value).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
      caption = `观察区间 ${day(axis[start])} — ${day(axis[end])}`; date = text('sdr-readout-date');
      chart = mainSnapshot(instance, p);
      legend = [...document.querySelectorAll('#series-tags .series-chip.active')].map(node => ({ label: node.textContent.trim(), color: getComputedStyle(node).getPropertyValue('--series-color').trim() || p.text }));
      details = { rows: [['当前离散度', text('value')], ['当日变化', text('d1')], ['5日变化', text('d5')], ['20日变化', text('d20')], ['十年历史分位', text('percentile')]],
        rangeHint: text('range-hint'), meaning: document.querySelector('.sdr-explanation p').textContent.trim(),
        bands: [...document.querySelectorAll('.sdr-range-lines>span')].map(node => { const label = node.querySelector('b').textContent; return [label, node.textContent.replace(label, '').trim()]; }) };
    }
    return { kind, contribution, p, date, caption, legend, details, chart, dataAsOf: text('as-of'), portrait: innerWidth < 800,
      dataStatus: text('dispersion-state'),
      logo: loadImage(`/macro/assets/onechart-lockup-horizontal-${light ? 'black' : 'white'}.svg`),
      note: contribution ? '排名区间沿用当前页面；曲线展示90日窗口，二者分别标注。' : '指数为区间归一化表现；红利低波计入分红再投，其余指数为价格口径。' };
  }
  function drawText(ctx, value, x, y, size, color, maxWidth, align = 'left', weight = 400) {
    ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`; ctx.fillStyle = color; ctx.textAlign = align;
    let result = String(value);
    if (maxWidth) while (result.length > 1 && ctx.measureText(result).width > maxWidth) result = result.slice(0, -2) + '…';
    ctx.fillText(result, x, y);
    return result;
  }
  async function render(snapshot, withDetails) {
    const [chart, logo] = await Promise.all([snapshot.chart, snapshot.logo]);
    const { p, portrait, contribution, details } = snapshot, width = portrait ? 900 : 1600, margin = portrait ? 32 : 44, gap = 40;
    const side = withDetails && !portrait, panelWidth = 440, chartWidth = width - margin * 2 - (side ? panelWidth + gap : 0);
    const chartHeight = Math.round(chartWidth * chart.height / chart.width), top = 100;
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = '18px "PingFang SC",sans-serif';
    let legendRows = 0, legendWidth = 0;
    snapshot.legend.forEach(item => {
      const itemWidth = measure.measureText(item.label).width + 36;
      if (!legendRows || legendWidth + itemWidth > width - margin * 2) { legendRows++; legendWidth = 0; }
      legendWidth += itemWidth;
    });
    const legendHeight = legendRows * 28;
    const rowsHeight = contribution ? 126 + Math.max(0, details.rows.length - 1) * 47 : 520;
    const detailHeight = withDetails && portrait ? rowsHeight + 36 : 0;
    const contentHeight = Math.max(chartHeight + legendHeight, side ? rowsHeight : 0), height = top + contentHeight + detailHeight + 70;
    const canvas = document.createElement('canvas'); canvas.width = width * 2; canvas.height = height * 2;
    const ctx = canvas.getContext('2d'); ctx.scale(2, 2); ctx.fillStyle = p.bg; ctx.fillRect(0, 0, width, height);
    ctx.drawImage(logo, width - margin - 160, 18, 160, 50);
    drawText(ctx, contribution ? '离散度贡献 · 行业研究快照' : 'One-SDR · 行业离散指数', margin, 58, 30, p.text, width - margin * 2 - 200, 'left', 500);
    const period = contribution ? snapshot.caption.replace('固定90日窗口', '90日窗口').replace(/\s*｜\s*按\s*\d+\s*日贡献排序/, '') : snapshot.caption;
    const metadata = `观察日 ${snapshot.date} · ${period}` + (contribution && snapshot.dataStatus ? ' · 数据非最新' : '');
    drawText(ctx, metadata, margin, 94, 18, p.muted, width - margin * 2);
    ctx.drawImage(chart, margin, top, chartWidth, chartHeight);
    if (!contribution) {
      const vertical = (word, x) => [...word].forEach((character, i) => drawText(ctx, character, x, top + chartHeight / 2 - (word.length - 1) * 9 + i * 18, 14, p.muted, null, 'center'));
      vertical('离散度', margin + 9); vertical('涨跌幅%', margin + chartWidth - 5);
    }
    let legendY = top + chartHeight + 26, legendX = margin;
    snapshot.legend.forEach(item => {
      ctx.font = '18px "PingFang SC",sans-serif'; const itemWidth = ctx.measureText(item.label).width + 36;
      if (legendX + itemWidth > width - margin) { legendX = margin; legendY += 28; }
      ctx.fillStyle = item.color; ctx.fillRect(legendX, legendY - 7, 14, 3); drawText(ctx, item.label, legendX + 22, legendY, 18, p.muted); legendX += itemWidth;
    });
    if (withDetails) {
      const x = side ? margin + chartWidth + gap : margin;
      const y = side ? top + (contentHeight - rowsHeight) / 2 + 24 : top + chartHeight + legendHeight + 40;
      const w = side ? panelWidth : width - margin * 2;
      const financial = value => Number.parseFloat(value) > 0 ? p.up : Number.parseFloat(value) < 0 ? p.down : p.muted;
      if (contribution) {
        drawText(ctx, details.title, x, y, 24, p.text, w, 'left', 500);
        const columns = [x, x + w * .52, x + w * .77, x + w];
        ['行业', '状态', '贡献', '涨跌幅'].forEach((label, i) => drawText(ctx, label, columns[i], y + 50, 17, p.muted, null, i ? 'right' : 'left'));
        details.rows.forEach((row, i) => {
          const yy = y + 94 + i * 47;
          const name = drawText(ctx, row.name, x, yy, 20, p.text, w * .31);
          if (row.selected || row.locked) {
            const labelX = x + ctx.measureText(name).width + 8;
            drawText(ctx, row.locked ? '锁定' : '选中', labelX, yy, 14, p.muted);
          }
          drawText(ctx, row.state, columns[1], yy, 17, p.muted, w * .2, 'right');
          drawText(ctx, row.contribution, columns[2], yy, 20, financial(row.contribution), null, 'right');
          drawText(ctx, row.change, columns[3], yy, 20, financial(row.change), null, 'right');
        });
        if (!details.rows.length) drawText(ctx, '当前没有匹配行业', x, y + 130, 20, p.muted);
      } else {
        // Keep the existing page's reading hierarchy, meter and interpretation.
        drawText(ctx, '当前离散度', x, y, 18, p.muted);
        const value = drawText(ctx, details.rows[0][1], x, y + 53, 44, p['oc-crowding'], null, 'left', 500);
        const valueWidth = ctx.measureText(value).width;
        drawText(ctx, details.rangeHint, x + valueWidth + 14, y + 51, 17, p.muted, w - valueWidth - 14);
        details.rows.slice(1, 4).forEach(([label, number], i) => {
          const column = x + w * i / 3;
          drawText(ctx, label, column, y + 104, 17, p.muted);
          drawText(ctx, number, column, y + 138, 25, financial(number));
        });
        drawText(ctx, '十年历史分位', x, y + 194, 18, p.muted);
        drawText(ctx, details.rows[4][1], x + w, y + 194, 24, p.text, null, 'right');
        const railY = y + 222, percentile = parseFloat(details.rows[4][1]);
        ctx.strokeStyle = p.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 5, railY); ctx.lineTo(x + w - 5, railY); ctx.stroke();
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const tickX = x + 5 + (w - 10) * i / 4; ctx.beginPath(); ctx.moveTo(tickX, railY - 5); ctx.lineTo(tickX, railY + 5); ctx.stroke(); }
        if (Number.isFinite(percentile)) { ctx.fillStyle = p.text; ctx.beginPath(); ctx.arc(x + 5 + (w - 10) * Math.max(0, Math.min(100, percentile)) / 100, railY, 5, 0, Math.PI * 2); ctx.fill(); }
        ['0%', '50%', '100%'].forEach((label, i) => drawText(ctx, label, x + w * i / 2, y + 249, 15, p.muted, null, i === 0 ? 'left' : i === 2 ? 'right' : 'center'));
        drawText(ctx, '指标内涵', x, y + 300, 20, p.text);
        ctx.font = '18px "PingFang SC",sans-serif';
        let meaningLine = '', meaningY = y + 331;
        const clauses = details.meaning.match(/[^，。；]+[，。；]?/g) || [details.meaning];
        for (const clause of clauses) {
          if (meaningLine && ctx.measureText(meaningLine + clause).width > w) { drawText(ctx, meaningLine, x, meaningY, 18, p.muted); meaningY += 28; meaningLine = ''; }
          for (const character of clause) {
            if (meaningLine && ctx.measureText(meaningLine + character).width > w) { drawText(ctx, meaningLine, x, meaningY, 18, p.muted); meaningY += 28; meaningLine = ''; }
            meaningLine += character;
          }
        }
        drawText(ctx, meaningLine, x, meaningY, 18, p.muted);
        const bandsY = Math.max(y + 397, meaningY + 40);
        drawText(ctx, '数值区间', x, bandsY, 20, p.text);
        details.bands.forEach(([label, description], i) => { drawText(ctx, label, x, bandsY + 34 + i * 30, 18, p.text); drawText(ctx, description, x + 118, bandsY + 34 + i * 30, 18, p.muted); });
      }
    }
    const footerY = height - 55;
    ctx.strokeStyle = p.line; ctx.beginPath(); ctx.moveTo(margin, footerY); ctx.lineTo(width - margin, footerY); ctx.stroke();
    drawText(ctx, '仅供学习研究，不构成投资建议', margin, height - 28, 17, p.muted);
    drawText(ctx, 'onechartlab.com', width - margin, height - 28, 17, p.muted, null, 'right');
    return canvas;
  }
  async function update() {
    const token = ++epoch; blob = null; actions.forEach(button => button.disabled = true); image.hidden = true; progress.hidden = false; progress.textContent = '正在生成截图…'; feedback.textContent = '';
    try {
      const canvas = await render(frozen, include.checked), next = await toBlob(canvas);
      if (token !== epoch || !dialog.open) return;
      if (objectURL) URL.revokeObjectURL(objectURL);
      blob = next; objectURL = URL.createObjectURL(blob); image.src = objectURL;
      image.alt = frozen.contribution ? `OneChart · ${frozen.details.title} · ${include.checked ? frozen.details.rows.map(row => row.name).join('、') : '仅图表'}` : `OneChart · 行业离散指数 · ${include.checked ? '指标读数、历史分位刻度、指标内涵与数值区间' : '仅图表'}`;
      image.hidden = false; progress.hidden = true;
      $('snapshot-dimensions').textContent = `${canvas.width} × ${canvas.height} PNG`;
      actions.forEach(button => button.disabled = false);
      $('snapshot-copy').hidden = !navigator.clipboard?.write || !window.ClipboardItem;
      $('snapshot-share').hidden = !navigator.canShare?.({ files: [new File([blob], 'onechart.png', { type: 'image/png' })] });
    } catch (error) { if (token === epoch) progress.textContent = error.message || '生成失败，请关闭预览后重试。'; }
  }
  function open(kind, button) {
    opener = button; include.checked = true; $('snapshot-option-label').textContent = kind === 'contribution' ? '包含排名' : '包含指标解读';
    dialog.querySelectorAll('[data-snapshot-scope]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.snapshotScope === kind)));
    try { frozen = capture(kind); if (!dialog.open) dialog.showModal(); update(); }
    catch (error) { feedback.textContent = error.message; if (!dialog.open) dialog.showModal(); progress.hidden = false; progress.textContent = error.message; image.hidden = true; actions.forEach(action => action.disabled = true); }
  }
  dialog.querySelector('.snapshot-close').onclick = () => dialog.close();
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { ++epoch; blob = null; frozen = null; if (objectURL) URL.revokeObjectURL(objectURL); objectURL = ''; image.removeAttribute('src'); opener?.focus({ preventScroll: true }); });
  include.onchange = () => { if (frozen) update(); };
  const file = () => new File([blob], `OneChart-${frozen.kind}-${frozen.date.replace(/[^0-9]/g, '')}.png`, { type: 'image/png' });
  $('snapshot-save').onclick = () => { if (!blob) return; const link = document.createElement('a'); link.href = objectURL; link.download = file().name; link.click(); feedback.textContent = '已交给浏览器保存。'; };
  $('snapshot-copy').onclick = async () => { if (!blob) return; try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); feedback.textContent = '图片已复制。'; } catch { feedback.textContent = '浏览器未允许复制，请使用“保存 PNG”。'; } };
  $('snapshot-share').onclick = async () => { if (!blob) return; try { await navigator.share({ files: [file()] }); feedback.textContent = '已交给系统分享。'; } catch (error) { feedback.textContent = error.name === 'AbortError' ? '已取消分享。' : '暂不能系统分享，请保存图片。'; } };
  const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'snapshot-trigger'; trigger.dataset.snapshotGlobal = ''; trigger.setAttribute('aria-label', '截图分享'); trigger.title = '截图分享'; trigger.innerHTML = camera;
  trigger.onclick = () => open('main', trigger);
  document.querySelector('.site-global-tools').prepend(trigger);
  dialog.querySelectorAll('[data-snapshot-scope]').forEach(button => { button.onclick = () => open(button.dataset.snapshotScope, trigger); });
})();
