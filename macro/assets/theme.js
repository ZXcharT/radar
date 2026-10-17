'use strict';
// Visual preference only. Never reads or writes financial/application data.
(() => {
  const storageKey = 'onechart-theme';
  let mode = 'dark';
  try { const saved = localStorage.getItem(storageKey); if (saved === 'dark' || saved === 'light') mode = saved; } catch {}
  document.documentElement.dataset.theme = mode;
  const dayInk = {
    '#f27980':'#b53643', '#66c3a3':'#167454',
    '#f0bf73':'#926115', '#d4b477':'#926115',
    '#ffffff':'#3d4955', '#96a3b0':'#7a8591', '#a1afbe':'#5e6a77',
    '#222d37':'#e5e9ed', '#536273':'#a2adb8', '#617080':'#929fab',
    '#475564':'#d1d8df', '#718296':'#abb6c1', '#91a5b7':'#778798',
    '#9dc3f0':'#4778aa',
    '#a7a0f1':'#7460b3', '#6ec7d4':'#237887', '#dc98c6':'#aa4d82',
    '#a3bc81':'#597b32', '#dbab78':'#936a35', '#90aed8':'#4a70a3',
    '#d1c66e':'#84711c', '#72b79a':'#257b60', '#bb9b85':'#8b654b',
    '#7ba8bc':'#366d87', '#c193a7':'#9c5270', '#a4b3cf':'#607295',
    '#b8b37d':'#777433', '#a18fbe':'#775c97', '#d4a58b':'#9b6347', '#88c0be':'#317979',
    '#bc94e8':'#8559b0', '#61c8c0':'#177e78', '#e387ac':'#ad4e78',
    '#74a8ed':'#386fae', '#a6ce72':'#587c29', '#e88174':'#b55346'
  };
  function ink(value) {
    if (mode !== 'light' || typeof value !== 'string') return value;
    let key = value.toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(key)) key = '#' + [...key.slice(1)].map(c => c + c).join('');
    const base = key.slice(0,7), mapped = dayInk[base];
    return mapped ? mapped + key.slice(7) : value;
  }
  function svg(markup) {
    return mode === 'light' ? markup.replace(/\b(fill|stroke)="(#[0-9a-f]{3,8})"/gi, (_,attribute,color) => `${attribute}="${ink(color)}"`) : markup;
  }
  function syncControl(displayMode = mode) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const target = displayMode === 'light' ? '夜间' : '日间';
    button.title = `切换至${target}模式`;
    button.setAttribute('aria-label', button.title);
  }
  function set(next, persist = true) {
    if (next !== 'light' && next !== 'dark') return;
    const changed = mode !== next;
    mode = next;
    document.documentElement.dataset.theme = mode;
    if (persist) { try { localStorage.setItem(storageKey, mode); } catch {} }
    syncControl();
    if (changed) dispatchEvent(new CustomEvent('onechart-theme-change', {detail:{mode}}));
  }
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition = null;
  function saveDesired(next) { try { localStorage.setItem(storageKey, next); } catch {} }
  function directSwitch(next) {
    root.setAttribute('data-theme-switching', '');
    set(next);
    // Commit all target colors together; do not leave old highlight transitions running.
    void root.offsetWidth;
    requestAnimationFrame(() => { if (!transition) root.removeAttribute('data-theme-switching'); });
  }
  function alignDirection(record) {
    const animation = record.animation;
    if (!animation) return;
    const forward = record.wanted === record.to;
    // updatePlaybackRate preserves the current frame and replaces any pending rate.
    animation.updatePlaybackRate(forward ? 1 : -1);
    if (animation.playState === 'paused' || animation.playState === 'finished') animation.play();
  }
  function switchTheme() {
    const next = (transition?.wanted || mode) === 'light' ? 'dark' : 'light';
    saveDesired(next);
    if (transition) {
      transition.wanted = next;
      syncControl(next);
      alignDirection(transition);
      return;
    }
    if (reducedMotion.matches || document.hidden || !document.startViewTransition) {
      directSwitch(next);
      return;
    }
    // Finish only local finite effects, then capture one coherent old/new scene.
    for (const animation of document.getAnimations()) {
      if (animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity) animation.finish();
    }
    root.setAttribute('data-theme-switching', '');
    const record = {to:next, wanted:next, animation:null, view:null};
    transition = record;
    record.view = document.startViewTransition(() => set(record.to, false));
    record.view.ready.then(() => {
      if (transition !== record) return;
      record.animation = document.getAnimations().find(animation => animation.animationName === 'onechart-theme-blend');
      if (!record.animation) { record.view.skipTransition(); return; }
      // The new view is live. Keep its palette fixed while reversing the visual blend;
      // apply the final requested mode at the endpoint before the snapshots disappear.
      record.animation.finished.then(() => {
        if (transition === record) set(record.wanted, false);
      }, () => {});
      syncControl(record.wanted);
      alignDirection(record);
    }).catch(() => { if (transition === record) set(record.wanted, false); });
    const cleanUp = () => {
      if (transition !== record) return;
      set(record.wanted, false);
      transition = null;
      root.removeAttribute('data-theme-switching');
    };
    record.view.finished.then(cleanUp, cleanUp);
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && transition) transition.view.skipTransition();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && transition) transition.view.skipTransition();
  });
  window.OneChartTheme = { get mode() { return mode; }, ink, svg, set };
  addEventListener('DOMContentLoaded', () => {
    syncControl();
    document.getElementById('theme-toggle').addEventListener('click', switchTheme);
  }, {once:true});
})();
function themeInk(value) { return window.OneChartTheme.ink(value); }
