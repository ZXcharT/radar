'use strict';
// Presentation only; leave the original chart/selection/store contracts in control.
(() => {
  const help=document.getElementById('chart-help'),panel=document.getElementById('chart-help-panel');
  let helpOpen=false,pinned=false,helpTimer=0;
  function placeHelp(){
    if(!helpOpen)return;const r=help.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight){closeHelp();return;}
    const w=panel.offsetWidth,h=panel.offsetHeight;panel.style.left=Math.max(10,Math.min(innerWidth-w-10,r.right-w))+'px';panel.style.top=Math.max(10,r.bottom+8+h<=innerHeight-10?r.bottom+8:r.top-h-8)+'px';
  }
  function openHelp(pin=false){clearTimeout(helpTimer);pinned=pinned||pin;if(!helpOpen){panel.hidden=false;if(panel.showPopover)panel.showPopover();helpOpen=true;}help.setAttribute('aria-expanded','true');placeHelp();}
  function closeHelp(){clearTimeout(helpTimer);pinned=false;if(panel.hidePopover&&panel.matches(':popover-open'))panel.hidePopover();panel.hidden=true;helpOpen=false;help.setAttribute('aria-expanded','false');}
  function leaveHelp(){if(!pinned)helpTimer=setTimeout(closeHelp,140);}
  help.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')openHelp()});help.addEventListener('pointerleave',leaveHelp);
  panel.addEventListener('pointerenter',()=>clearTimeout(helpTimer));panel.addEventListener('pointerleave',leaveHelp);
  help.addEventListener('click',event=>{event.preventDefault();if(pinned)closeHelp();else openHelp(true)});
  panel.addEventListener('toggle',event=>{helpOpen=event.newState==='open';help.setAttribute('aria-expanded',String(helpOpen));if(!helpOpen){pinned=false;panel.hidden=true;}});
  document.addEventListener('keydown',event=>{if(helpOpen&&event.key==='Escape'){event.preventDefault();event.stopPropagation();closeHelp();}},true);
  document.addEventListener('pointerdown',event=>{if(helpOpen&&!panel.showPopover&&!panel.contains(event.target)&&!help.contains(event.target))closeHelp();});
  addEventListener('resize',placeHelp);addEventListener('scroll',placeHelp,true);
  const note=document.querySelector('.algorithm-note'),module=document.getElementById('dispersion-module');
  if(note&&module){const details=document.createElement('details'),summary=document.createElement('summary');details.className='method-details';summary.textContent='指标说明与使用限制';details.append(summary,note);module.after(details);}
  const svg=document.getElementById('plot'),pane=svg.closest('.chart-pane'),host=document.getElementById('dispersion-module');
  // Relocate existing nodes, preserving native handlers, selection and lazy-data guards.
  const contributionTools=document.createElement('div'),contributionSort=document.createElement('div'),contributionCaption=document.createElement('span'),overlayControl=document.createElement('button');
  contributionTools.className='contribution-topbar';contributionSort.className='contribution-sort-controls';contributionCaption.className='contribution-range-label';overlayControl.classList.add('series-chip','contribution-overlay-control');overlayControl.type='button';overlayControl.textContent='离散指数';overlayControl.disabled=true;overlayControl.setAttribute('aria-label','显示或隐藏贡献图中的离散指数');overlayControl.setAttribute('aria-pressed','false');overlayControl.style.setProperty('--series-color','#d64b45');overlayControl.onclick=()=>window.toggleHQL25();contributionSort.append(contributionCaption);contributionTools.append(overlayControl,contributionSort);
  function arrangeContribution(){
    const timeline=pane.querySelector('.timeline'),header=host.querySelector('.prototype-header'),search=host.querySelector('#industry-search18');
    if(timeline&&pane.lastElementChild!==timeline)pane.append(timeline);
    if(contributionTools.parentElement!==pane)pane.insertBefore(contributionTools,svg);
    const periods=host.querySelector('.period-tabs');if(periods&&periods.parentElement!==contributionSort)contributionSort.append(periods);
    if(header&&search&&search.parentElement!==header)header.append(search);
  }
  new MutationObserver(arrangeContribution).observe(host,{childList:true,subtree:true});arrangeContribution();
  // Match the actual period-button center, including wrapped toolbar layouts.
  let lastPeriodCenter=-1;
  new ResizeObserver(()=>{const periods=contributionTools.querySelector('.period-tabs');if(!periods)return;const r=periods.getBoundingClientRect(),t=contributionTools.getBoundingClientRect(),center=r.top+r.height/2-t.top;if(Math.abs(center-lastPeriodCenter)>.1){lastPeriodCenter=center;host.style.setProperty('--contribution-period-center',center+'px');}}).observe(contributionTools);
  // One shared spine, split at the actual zero axis; based on kg's sketch.
  function zeroFlowGuide(){
    if(svg.querySelector('#zero-flow-guide'))return;
    const axis=svg.querySelector('#contribution-zero-line'),surface=svg.querySelector('#contribution-surface');
    if(!axis||!surface)return;
    const L=Number(axis.getAttribute('x1')),x=L/2-6,z=Number(axis.getAttribute('y1')),T=Number(surface.getAttribute('y')),B=2*z-T;
    const segments=[[T+18,z-24],[z+24,B-18]],g=document.createElementNS('http://www.w3.org/2000/svg','g');
    function phase(key,cx,cy,word){return `<text data-flow-phase="${key}" x="${cx}" y="${cy-20}"><tspan x="${cx}">${word[0]}</tspan><tspan x="${cx}" dy="44">${word[1]}</tspan></text>`;}
    g.id='zero-flow-guide';g.setAttribute('role','img');g.setAttribute('aria-labelledby','zero-flow-description');g.setAttribute('pointer-events','none');
    g.innerHTML=`<title id="zero-flow-description">零轴运动示意：零轴下向上为修复，上穿后向上为进攻；零轴上向下为回落，下穿后向下为走弱。靠近零轴回归、缩小分化，远离零轴扩大分化。</title>
      <line id="flow-zero-line" x1="${x+14}" x2="${L}" y1="${z}" y2="${z}" stroke="${axis.getAttribute('stroke')}" stroke-width="1.3"/>
      <g class="axis-arrows" fill="var(--muted)" stroke="var(--muted)">
        ${segments.map(([a,b])=>`<g class="axis-arrow"><path d="M${x} ${a+1} V${b-1}" fill="none" stroke-width="1.2" stroke-linecap="round"/><path d="M${x} ${a} L${x-4.5} ${a+8} L${x} ${a+5.5} Z M${x} ${b} L${x+4.5} ${b-8} L${x} ${b-5.5} Z" stroke="none"/></g>`).join('')}
      </g>
      <g class="flow-phases" fill="var(--text)" font-size="12" text-anchor="middle">${phase('attack',x-10,(segments[0][0]+segments[0][1])/2,'进攻')}${phase('pullback',x+10,(segments[0][0]+segments[0][1])/2,'回落')}${phase('repair',x-10,(segments[1][0]+segments[1][1])/2,'修复')}${phase('weaken',x+10,(segments[1][0]+segments[1][1])/2,'走弱')}</g>
      <g class="axis-poles" fill="var(--muted)" font-size="12" text-anchor="middle"><text x="${x}" y="${T+12}">分化</text><text x="${x}" y="${B-4}">分化</text></g>
      <rect x="${x-14}" y="${z-10}" width="28" height="20" fill="var(--observation-surface)"/><text class="axis-return" x="${x}" y="${z+4}" fill="var(--text)" font-size="12" text-anchor="middle">回归</text>`;
    svg.append(g);
  }
  // Keep native SVG controls/handlers in the plot; adapt only their layout/skin.
  function svgPresentation(){
    const narrow=svg.clientWidth<=600,right=parseFloat(getComputedStyle(svg).getPropertyValue('--sdr-plot-right'))||40;svg.style.marginTop='-32px';
    const plotSurface=svg.querySelector('#contribution-surface');
    if(plotSurface&&!svg.querySelector('#contribution-panel-divider')){
      const divider=document.createElementNS('http://www.w3.org/2000/svg','line'),left=Number(plotSurface.getAttribute('x')),y=narrow?550:538;
      for(const [key,value] of Object.entries({id:'contribution-panel-divider',x1:left,x2:left+Number(plotSurface.getAttribute('width')),y1:y,y2:y,stroke:'var(--line)','stroke-width':1,'pointer-events':'none'}))divider.setAttribute(key,String(value));
      svg.append(divider);
    }
    const caption=[...svg.querySelectorAll(':scope>text')].find(node=>node.textContent.startsWith('固定90日窗口'));
    if(caption){if(contributionCaption.textContent!==caption.textContent)contributionCaption.textContent=caption.textContent;caption.remove();}
    for(const node of svg.querySelectorAll('[stroke-dasharray]')){node.setAttribute('stroke-dasharray','0 5');node.setAttribute('stroke-linecap','round');}
    for(const node of svg.querySelectorAll('text')){node.style.fontWeight=node.getAttribute('font-size')==='15'?'500':'400';if(node.textContent.includes('虚线为MA5'))node.textContent=node.textContent.replace('虚线为MA5','点线为MA5');}
    if(narrow){
      // Use separate date, caption, controls and bar rows; preserve units and font sizes.
      svg.setAttribute('viewBox',`0 0 ${Math.round(svg.clientWidth)} 744`);
      const surface=svg.querySelector('#contribution-surface');if(surface)surface.setAttribute('height','682');
      for(const node of svg.querySelectorAll(':scope>text')){
        if(/^\d{2}-\d{2}-\d{2}$/.test(node.textContent)&&node.getAttribute('y')==='530')node.setAttribute('y','516');
        if(node.textContent.startsWith('90日窗口累计离散贡献')){node.textContent='累计贡献 · MA5点线';node.setAttribute('y','538');}
        if(node.textContent.startsWith('当日离散度贡献：')){const value=node.textContent.split('：')[1].split('｜')[0];node.textContent=`当日贡献 ${value} · 橙扩 / 蓝缩`;node.setAttribute('y','570');}
      }
      svg.querySelectorAll('.daily-bar23,line[y1="625"]').forEach(node=>node.setAttribute('transform','translate(0 44)'));
      const probe=svg.querySelector('#date-probe23');if(probe)probe.setAttribute('y2','726');
    }
    const toggle=svg.querySelector('#hql-toggle25');
    if(toggle){
      const visible=Number(toggle.querySelector('circle').getAttribute('cx'))>17;
      overlayControl.disabled=false;overlayControl.classList.toggle('active',visible);overlayControl.setAttribute('aria-pressed',String(visible));
      const curve=svg.querySelector('#hql-curve25');if(curve)overlayControl.style.setProperty('--series-color',getComputedStyle(curve).stroke);
      toggle.remove();
    }
    const scale=svg.querySelector('#bar-scale23');
    if(scale){
      const faces=scale.querySelectorAll(':scope>rect'),adaptive=Number(faces[1]?.getAttribute('x'))<10;
      if(faces[0])faces[0].style.fill='var(--plot-control)';if(faces[1])faces[1].style.fill='var(--plot-selected)';
      scale.querySelectorAll('[data-bar-scale23]').forEach(group=>{group.removeAttribute('onclick');group.onclick=e=>{e.stopPropagation();window.setBarScale23(group.dataset.barScale23)};group.querySelector('text').style.fill=(group.dataset.barScale23==='adaptive')===adaptive?'var(--text)':'var(--muted)';group.querySelector('text').style.fontWeight='400'});
      scale.setAttribute('transform',`translate(${Math.max(0,svg.clientWidth-right-144)},${narrow?586:540})`);
    }
    zeroFlowGuide();
    if(!narrow)return;
    const context=document.createElement('canvas').getContext('2d');
    for(const node of svg.querySelectorAll('text')){
      if(node.dataset.wrapped||!/^固定90日窗口|^当日离散度贡献/.test(node.textContent))continue;
      const original=node.textContent,x=Number(node.getAttribute('x'))||0,available=Math.max(80,svg.clientWidth-x-right);
      context.font=getComputedStyle(node).font;
      if(context.measureText(original).width<=available)continue;
      const lines=[];let line='';for(const char of original){if(line&&context.measureText(line+char).width>available){lines.push(line);line=''}line+=char}if(line)lines.push(line);
      node.dataset.wrapped='true';node.setAttribute('y',String(Number(node.getAttribute('y'))-(lines.length-1)*14));node.textContent='';
      lines.forEach((text,i)=>{const span=document.createElementNS('http://www.w3.org/2000/svg','tspan');span.setAttribute('x',String(x));span.setAttribute('dy',i?'14':'0');span.textContent=text;node.append(span)});
    }
  }
  new MutationObserver(svgPresentation).observe(svg,{childList:true});
  let frame=0,lastWidth=0;
  function width(){frame=0;const next=Math.round(pane.clientWidth);if(next<100||Math.abs(next-lastWidth)<1)return;lastWidth=next;svg.setAttribute('viewBox',`0 0 ${next} 700`);if(host.dataset.state==='current'||host.dataset.state==='stale-last-good')dispatchEvent(new CustomEvent('onechart-theme-change',{detail:{mode:OneChartTheme.mode,reason:'layout'}}));}
  function schedule(){if(!frame)frame=requestAnimationFrame(width)}
  new ResizeObserver(schedule).observe(pane);schedule();
  function ready(){if(document.getElementById('value').textContent!=='--'&&['current','stale-last-good'].includes(host.dataset.state)){document.body.dataset.macroUiReady='true';schedule();}}
  new MutationObserver(ready).observe(host,{attributes:true,attributeFilter:['data-state']});
  new MutationObserver(ready).observe(document.getElementById('value'),{childList:true});ready();
  function tintDrawer(drawer){const update=()=>drawer.querySelectorAll('.stock-detail-value').forEach(node=>{node.style.color=Number.parseFloat(node.textContent)<0?'var(--down)':Number.parseFloat(node.textContent)>0?'var(--up)':'var(--muted)'});new MutationObserver(update).observe(drawer,{childList:true,subtree:true});update();}
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1&&node.classList.contains('stock-detail-drawer'))tintDrawer(node)}))).observe(document.body,{childList:true});
})();
