/* Cashflow adapter: copy the already-rendered view model; never fetch or rerank for a screenshot. */
'use strict';
(() => {
  function capture() {
    const app = window.CashflowApp;
    if (!app || !app.recordsByDate[app.selectedDate]?.length) throw new Error('请等待当前日期榜单加载完成再截图。');
    const selected = new Set(app.selectedSectors), columns = app.mirrorAuxColumns.filter(column => column.key);
    const record = (row, side) => ({
      code: row.ts_code, name: app.cleanName(row.index_name), originalName: row.index_name,
      rank: String(app.mirrorRank(row)), metric: app.getMirrorMetric(row), primary: app.formatMirrorMetric(row),
      bar: parseFloat(app.mirrorBarStyle(row)['--mirror-width']) / 100,
      pct: app.formatPctChange(row.pct_change), pctRaw: row.pct_change,
      selected: selected.has(row.index_name),
      aux: columns.map(column => ({ label: column.kind === 'calendar' ? '30日在榜' : column.label,
        value: app.mirrorAuxValue(row, column, side) + (column.kind === 'calendar' ? '日' : ''),
        raw: app.mirrorAuxRaw(row, column, side), signed: !['score','calendar'].includes(column.kind) }))
    });
    const first = rows => rows.filter((row,index) => index < 8 || selected.has(row.index_name));
    const top = first(app.topList).map(row => record(row,'top')), bot = first(app.botList).map(row => record(row,'bot'));
    const included = new Set([...top,...bot].map(row => row.originalName));
    // Do not pretend a selected non-tail sector belongs to either top/bottom cohort.
    const extras = app.processedData.filter(row => selected.has(row.index_name) && !included.has(row.index_name)).map(row => record(row,'top'));
    const css = getComputedStyle(document.documentElement), color = key => css.getPropertyValue(key).trim();
    const p = { bg:color('--oc-ground'), panel:color('--oc-flow'), text:color('--oc-ink'), muted:color('--oc-muted'), line:color('--oc-line'), up:color('--oc-attack'), down:color('--oc-weak'), upFill:color('--oc-attack-fill'), downFill:color('--oc-weak-fill') };
    const light = document.documentElement.dataset.theme === 'light';
    const nativeRow = document.querySelector('.desktop-mirror .mirror-row'), nativeBar = document.querySelector('.desktop-mirror .mirror-bar');
    const nativeRowStyle = nativeRow && getComputedStyle(nativeRow);
    const rowFill = nativeBar ? parseFloat(getComputedStyle(nativeBar).height) / (parseFloat(nativeRowStyle.height) || parseFloat(nativeRowStyle.minHeight) || 56) : .76;
    const baseline = app.tabs.find(tab => tab.id === app.rankChangeMetric)?.name || '';
    return { date:app.selectedDate, type:app.activeType.replace('板块',''), metric:app.mirrorMetricLabel,
      period:app.activeTab === 'RankChange' ? `近${app.rankChangeDays}个交易日 · 基准${baseline}` : '',
      titles:app.activeTab === 'RankChange' ? ['排名上升榜','排名下降榜'] : ['资金进攻榜','资金撤离榜'],
      top, bot, extras, p, rowFill:Number.isFinite(rowFill) ? Math.min(.9,Math.max(.5,rowFill)) : .76, portrait:innerWidth < 800,
      logo:document.querySelector(light ? '.logo-day' : '.logo-night').src,
      columns:columns.map(column => column.kind === 'calendar' ? '30日在榜' : column.label) };
  }
  function signColor(value,p) { return Number.isFinite(value) && value > 0 ? p.up : Number.isFinite(value) && value < 0 ? p.down : p.muted; }
  async function render(s, helpers) {
    const {text,image} = helpers, {p} = s, logo = await image(s.logo);
    const width = s.portrait ? 900 : 1760, margin = s.portrait ? 32 : 44, inner = width-margin*2, top = 138, rowHeight = 56;
    const barThickness = Math.round(rowHeight*s.rowFill);
    const count = Math.max(s.top.length,s.bot.length), extrasHeight = s.extras.length ? 64+s.extras.length*rowHeight : 0;
    const bodyHeight = s.portrait ? 2*78+(s.top.length+s.bot.length)*94 : 92+Math.max(1,count)*rowHeight;
    const height = top+bodyHeight+extrasHeight+70;
    const canvas = document.createElement('canvas');canvas.width = width*2;canvas.height = height*2;
    const ctx = canvas.getContext('2d');ctx.scale(2,2);ctx.fillStyle=p.bg;ctx.fillRect(0,0,width,height);
    const line = (x1,y1,x2,y2,color=p.line) => { ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke(); };
    text(ctx,'板块资金雷达',margin,56,30,p.text,null,'left',500);
    ctx.drawImage(logo,width-margin-160,16,160,50);
    text(ctx,`${s.date} · ${s.type} · ${s.metric}${s.period?' · '+s.period:''}`,margin,94,19,p.muted,inner);
    const labelName = (row,x,y,w,align='left') => {
      text(ctx,row.rank,x,y,16,p.muted,null,align);
      const nameX = align==='left'?x+32:x-32;
      const name=text(ctx,row.name,nameX,y,20,p.text,w-116-(row.selected?36:0),align);
      const codeX=nameX+(align==='left'?1:-1)*(ctx.measureText(name).width+8);
      text(ctx,row.code,codeX,y,12,p.muted,null,align);
      if(row.selected)text(ctx,'已选',align==='left'?x+w-4:x-w+4,y,13,p.muted,null,align==='left'?'right':'left');
    };
    if (!s.portrait) {
      const center=width/2,barHalf=176,sideWidth=(inner-barHalf*2)/2,leftEnd=center-barHalf,rightStart=center+barHalf;
      ctx.fillStyle=p.panel;ctx.fillRect(center-barHalf,top+44,barHalf*2,bodyHeight-44);
      text(ctx,s.titles[0],margin,top+20,24,p.up,null,'left',500);
      text(ctx,s.titles[1],width-margin,top+20,24,p.down,null,'right',500);
      text(ctx,s.metric,center,top+20,19,p.muted,null,'center');
      line(margin,top+40,width-margin,top+40);line(center,top+40,center,top+bodyHeight);
      const nameWidth=sideWidth*.4,metricX=margin+sideWidth*.53,auxStart=margin+sideWidth*.66,auxStep=sideWidth*.32/Math.max(1,s.columns.length);
      text(ctx,'板块',margin+32,top+70,16,p.muted);
      text(ctx,'涨跌幅',metricX,top+70,16,p.muted,null,'right');
      s.columns.forEach((label,i)=>text(ctx,label,auxStart+i*auxStep+auxStep*.7,top+70,15,p.muted,null,'right'));
      text(ctx,'板块',width-margin-32,top+70,16,p.muted,null,'right');
      text(ctx,'涨跌幅',width-metricX,top+70,16,p.muted);
      s.columns.forEach((label,i)=>text(ctx,label,width-(auxStart+i*auxStep+auxStep*.7),top+70,15,p.muted));
      line(margin,top+90,width-margin,top+90);
      const draw = (row,index,left) => {
        if(!row)return;const yy=top+90+index*rowHeight+rowHeight/2,financial=signColor(row.metric,p);
        ctx.textBaseline='middle';
        labelName(row,left?margin+6:width-margin-6,yy,nameWidth,left?'left':'right');
        text(ctx,row.pct,left?metricX:width-metricX,yy,19,signColor(row.pctRaw,p),null,left?'right':'left');
        row.aux.forEach((item,i)=>text(ctx,item.value,left?auxStart+i*auxStep+auxStep*.7:width-(auxStart+i*auxStep+auxStep*.7),yy,17,item.signed?signColor(item.raw,p):p.muted,null,left?'right':'left'));
        const barWidth=Math.max(0,Math.min(1,row.bar))*(barHalf-12),barX=left?center-barWidth:center;
        ctx.fillStyle=row.metric<0?p.downFill:p.upFill;ctx.fillRect(barX,yy-barThickness/2,barWidth,barThickness);
        text(ctx,row.primary,left?center-9:center+9,yy,20,financial,null,left?'right':'left',500);
        ctx.textBaseline='alphabetic';
      };
      for(let i=0;i<count;i++) {draw(s.top[i],i,true);draw(s.bot[i],i,false);if(i<count-1)line(margin,top+90+(i+1)*rowHeight,width-margin,top+90+(i+1)*rowHeight);}
      if(!count)text(ctx,'当前条件下没有榜单数据',center,top+138,20,p.muted,null,'center');
    } else {
      let groupY=top;
      for(const [group,title] of [[s.top,s.titles[0]],[s.bot,s.titles[1]]]) {
        text(ctx,title,margin,groupY+20,24,title===s.titles[0]?p.up:p.down,null,'left',500);
        text(ctx,s.metric,width-margin,groupY+20,17,p.muted,null,'right');line(margin,groupY+40,width-margin,groupY+40);
        group.forEach((row,i)=>{
          const yy=groupY+78+i*94;
          ctx.textBaseline='middle';
          labelName(row,margin+4,yy,inner*.53);
          const bw=Math.min(1,Math.max(0,row.bar))*190;ctx.fillStyle=row.metric<0?p.downFill:p.upFill;ctx.fillRect(width-margin-bw,yy-barThickness/2,bw,barThickness);
          text(ctx,row.primary,width-margin-8,yy,24,signColor(row.metric,p),null,'right',500);
          ctx.textBaseline='alphabetic';
          const fields=[{label:'涨跌幅',value:row.pct,color:signColor(row.pctRaw,p)},...row.aux.map(item=>({...item,color:item.signed?signColor(item.raw,p):p.muted}))];
          fields.forEach((item,j)=>{const xx=margin+inner*j/fields.length;text(ctx,item.label,xx,yy+44,15,p.muted);text(ctx,item.value,xx+inner/fields.length-16,yy+44,18,item.color,null,'right');});
          if(i<group.length-1)line(margin,yy+62,width-margin,yy+62);
        });
        if(!group.length)text(ctx,'当前条件下没有榜单数据',margin,groupY+80,20,p.muted);
        groupY+=78+group.length*94+30;
      }
    }
    if(s.extras.length) {
      const y=top+bodyHeight+36;text(ctx,'已选板块',margin,y,22,p.text);
      s.extras.forEach((row,i)=>{const yy=y+40+i*rowHeight;labelName(row,margin,yy,inner*.5);text(ctx,row.pct,width-margin-200,yy,20,signColor(row.pctRaw,p),null,'right');text(ctx,row.primary,width-margin,yy,22,signColor(row.metric,p),null,'right');});
    }
    line(margin,height-55,width-margin,height-55);
    text(ctx,'仅供学习研究，不构成投资建议',margin,height-28,17,p.muted);
    text(ctx,'onechartlab.com',width-margin,height-28,17,p.muted,null,'right');
    return canvas;
  }
  function ready() { window.OneChartShare.mount({capture,render,filename:s=>`OneChart-cashflow-${s.date}.png`,describe:s=>`OneChart · ${s.date} ${s.type} ${s.metric} · ${[...s.top,...s.bot,...s.extras].map(row=>row.name).join('、')}`}); }
  if(window.CashflowApp)ready();else addEventListener('cashflow-ready',ready,{once:true});
})();
