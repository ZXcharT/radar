(()=>{
const DATA_START="20021112";
const THEME_KEY="onechart-theme";
// Index identity colors are a visual candidate; kg has confirmed the neutral light UI, not these series values yet.
const CHART_THEMES={
  light:{
    crowding:"#d64b45",series:{"000001.SH":"#0168a5","000300.SH":"#2f3742","000016.SH":"#8e5403","399006.SZ":"#027743","000688.SH":"#6451ac","000852.SH":"#686801","932000.CSI":"#a32146"},
    muted:"#5b5b5b",axis:"#5b5b5b",axisLine:"#858585",splitLine:"#d6d6d6",tooltipBg:"#f7f7f7",tooltipBorder:"#c7c7c7",tooltipText:"#363636",tooltipShadow:"0 6px 18px rgba(0,0,0,.10)",
    sliderBorder:"#c7c7c7",sliderBg:"#ececec",sliderFill:"#e4e4e4",sliderHandle:"#5b5b5b",sliderHandleBorder:"#f7f7f7",sliderMove:"rgba(0,0,0,.03)",zoneGreen:"#5f8b84",zoneGold:"#9b7545"
  },
  dark:{
    crowding:"#e06a64",series:{"000001.SH":"#62ace8","000300.SH":"#b8c2d1","000016.SH":"#d69551","399006.SZ":"#64ba85","000688.SH":"#a498e8","000852.SH":"#a9ab4f","932000.CSI":"#e589a5"},
    muted:"#8f99a5",axis:"#8f99a5",axisLine:"#39424d",splitLine:"#252d36",tooltipBg:"rgba(24,29,35,.96)",tooltipBorder:"#39424d",tooltipText:"#c9d0d8",tooltipShadow:"0 6px 18px rgba(0,0,0,.40)",
    sliderBorder:"#39424d",sliderBg:"rgba(40,47,56,.78)",sliderFill:"rgba(142,172,210,.20)",sliderHandle:"#8eacd2",sliderHandleBorder:"#15191e",sliderMove:"rgba(142,172,210,.08)",zoneGreen:"#72a69d",zoneGold:"#c2a06b"
  }
};
const currentTheme=()=>document.documentElement.dataset.theme==="dark"?"dark":"light";
const chartTheme=()=>CHART_THEMES[currentTheme()];
const seriesColor=code=>chartTheme().series[code]||chartTheme().muted;
const LABELS={"000001.SH":"上证","399006.SZ":"创业","000688.SH":"科创","000016.SH":"50","000300.SH":"300","000852.SH":"1000","932000.CSI":"2000"};
const TAG_ORDER=["000001.SH","399006.SZ","000688.SH","000016.SH","000300.SH","000852.SH","932000.CSI"];
const mode="precise"; // kg confirmed: show the original series, not the display smoothing.
let data,chart,showCrowding=true,chosen=["000001.SH"],zoom={start:0,end:100},defaultZoom={start:0,end:100};
let rangePreset='year',activeStudy=null,lastReadoutIndex=-1;
let baseAnchorIndex=0,rightAxisRange={min:-10,max:10},scaleMode="common";
let selectedScaleSeries=null,manualScales={},verticalDrag=null,scaleFrame=null;
const $=id=>document.getElementById(id);
function syncThemeButton(){
  const button=$("theme-toggle");if(!button)return;
  const dark=currentTheme()==="dark",target=dark?"浅色":"深色",label=dark?"切换到浅色模式":"切换到深色模式";
  button.setAttribute("aria-pressed",String(dark));button.setAttribute("aria-label",label);button.title=label;
  const text=button.querySelector(".theme-label");if(text)text.textContent=target;
}
function applyTheme(theme,{persist=true,emit=true}={}){
  const next=theme==="dark"?"dark":"light";
  document.documentElement.dataset.theme=next;document.documentElement.style.colorScheme=next;
  if(persist)try{localStorage.setItem(THEME_KEY,next)}catch(error){}
  syncThemeButton();
  if(emit)dispatchEvent(new CustomEvent("onechart-theme-change",{detail:{theme:next}}));
}
function setupTheme(){
  // Isolated preview: the approved family controller alone owns theme changes.
  syncThemeButton();
}
const finite=value=>typeof value==="number"&&Number.isFinite(value);
const signed=value=>(value>=0?"+":"")+Number(value).toFixed(2);
const formatDate=value=>String(value||"").replace(/^20(\d{2})(\d{2})(\d{2})$/,"$1-$2-$3");
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

function trimToPublicStart(){
  const first=data.dates.findIndex(date=>date>=DATA_START);
  if(first<=0)return;
  data.dates=data.dates.slice(first);
  data.precise=data.precise.slice(first);
  data.smooth=data.smooth.slice(first);
  data.indices.forEach(index=>{index.close=index.close.slice(first)});
}

function shiftYears(dateString,years){
  const year=Number(dateString.slice(0,4)),month=Number(dateString.slice(4,6))-1,day=Number(dateString.slice(6,8));
  const date=new Date(Date.UTC(year,month,day));
  date.setUTCFullYear(date.getUTCFullYear()+years);
  return `${date.getUTCFullYear()}${String(date.getUTCMonth()+1).padStart(2,"0")}${String(date.getUTCDate()).padStart(2,"0")}`;
}

function computeDefaultZoom(){
  const n=data.dates.length;
  if(n<2)return{start:0,end:100};
  const target=shiftYears(data.dates[n-1],-1);
  let first=data.dates.findIndex(date=>date>=target);
  if(first<0)first=0;
  return{start:100*first/(n-1),end:100};
}

function visibleEndIndex(){return clamp(Math.round(zoom.end/100*(data.dates.length-1)),0,data.dates.length-1);}
function isoDate(day){return `${day.slice(0,4)}-${day.slice(4,6)}-${day.slice(6,8)}`;}
function syncRangeUI(){
  if(!data)return;
  const day=data.dates[visibleEndIndex()],button=$('sdr-date-toggle');
  button.textContent=isoDate(day);button.setAttribute('aria-label','选择主图观察日 '+isoDate(day));
  const exact=Math.abs(zoom.start-defaultZoom.start)<.00001&&Math.abs(zoom.end-defaultZoom.end)<.00001;
  document.querySelectorAll('[data-range]').forEach(node=>{const active=exact&&!activeStudy&&node.dataset.range===rangePreset;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll('[data-study-year]').forEach(node=>{const active=exact&&node.dataset.studyYear===activeStudy;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));});
}
function applyRange(preset,day=data.dates[visibleEndIndex()]){
  const end=data.dates.indexOf(day);if(end<0)return;
  let start;
  if(preset==='year'){const target=shiftYears(day,-1);start=data.dates.findIndex(date=>date>=target);if(start<0||start>end)start=end;}
  else start=Math.max(0,end-Number(preset)+1);
  activeStudy=null;rangePreset=preset;defaultZoom={start:start/(data.dates.length-1)*100,end:end/(data.dates.length-1)*100};zoom={...defaultZoom};setStableBaseFromZoom();computeCommonAxisRange();draw();
}
function applyStudy(year){
  const start=data.dates.findIndex(day=>day>=year+'0101'),end=data.dates.findLastIndex(day=>day<=year+'1231');if(start<0||end<start)return;
  activeStudy=year;defaultZoom={start:start/(data.dates.length-1)*100,end:end/(data.dates.length-1)*100};zoom={...defaultZoom};setStableBaseFromZoom();computeCommonAxisRange();draw();
}
function setupRangeControls(){
  const panel=$('sdr-date-panel'),toggle=$('sdr-date-toggle'),days=$('sdr-calendar-days'),years=$('sdr-calendar-year'),months=$('sdr-calendar-month'),valid=new Set(data.dates);
  let year=0,month=0,open=false;
  const first=Number(data.dates[0].slice(0,4))*12+Number(data.dates[0].slice(4,6))-1,last=Number(data.dates.at(-1).slice(0,4))*12+Number(data.dates.at(-1).slice(4,6))-1;
  years.min=data.dates[0].slice(0,4);years.max=data.dates.at(-1).slice(0,4);
  function render(){
    const selected=data.dates[visibleEndIndex()];$('sdr-calendar-heading').textContent=`${year}年${month+1}月`;years.value=year;months.value=month+1;
    panel.querySelectorAll('[data-calendar-month]').forEach(b=>b.disabled=year*12+month+Number(b.dataset.calendarMonth)<first||year*12+month+Number(b.dataset.calendarMonth)>last);
    const offset=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7,count=new Date(Date.UTC(year,month+1,0)).getUTCDate();days.replaceChildren();
    for(let i=0;i<offset;i++){const empty=document.createElement('span');empty.setAttribute('aria-hidden','true');days.append(empty);}
    for(let day=1;day<=count;day++){const key=`${year}${String(month+1).padStart(2,'0')}${String(day).padStart(2,'0')}`,button=document.createElement('button');button.type='button';button.textContent=day;button.disabled=!valid.has(key);button.dataset.date=key;button.setAttribute('aria-label','选择 '+isoDate(key));button.setAttribute('aria-pressed',String(key===selected));days.append(button);}
  }
  function place(){if(!open)return;const r=toggle.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;panel.style.left=Math.max(10,Math.min(innerWidth-w-10,r.right-w))+'px';panel.style.top=Math.max(10,r.bottom+h+8<=innerHeight-10?r.bottom+8:r.top-h-8)+'px';}
  function close(){if(panel.hidePopover&&panel.matches(':popover-open'))panel.hidePopover();panel.hidden=true;open=false;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',event=>{event.preventDefault();if(open){close();return;}const date=data.dates[visibleEndIndex()];year=Number(date.slice(0,4));month=Number(date.slice(4,6))-1;render();panel.hidden=false;if(panel.showPopover)panel.showPopover();open=true;toggle.setAttribute('aria-expanded','true');place();});
  panel.addEventListener('toggle',event=>{open=event.newState==='open';toggle.setAttribute('aria-expanded',String(open));if(!open)panel.hidden=true;});
  panel.addEventListener('click',event=>{const move=event.target.closest('[data-calendar-month]'),day=event.target.closest('[data-date]');if(move){const value=clamp(year*12+month+Number(move.dataset.calendarMonth),first,last);year=Math.floor(value/12);month=value%12;render();}else if(day&&!day.disabled){applyRange(rangePreset,day.dataset.date);close();toggle.focus({preventScroll:true});}});
  function locate(){const y=Number(years.value),m=Number(months.value);if(!Number.isInteger(y)||!Number.isInteger(m)||m<1||m>12)return;const value=clamp(y*12+m-1,first,last);year=Math.floor(value/12);month=value%12;render();}
  $('sdr-calendar-locate').addEventListener('click',locate);panel.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.tagName==='INPUT'){event.preventDefault();event.stopPropagation();locate();}});
  document.addEventListener('keydown',event=>{if(open&&event.key==='Escape'){event.preventDefault();event.stopPropagation();close();toggle.focus({preventScroll:true});}},true);
  document.addEventListener('pointerdown',event=>{if(open&&!panel.showPopover&&!panel.contains(event.target)&&!toggle.contains(event.target))close();});
  document.querySelectorAll('[data-range]').forEach(button=>button.addEventListener('click',()=>applyRange(button.dataset.range)));
  document.querySelectorAll('[data-study-year]').forEach(button=>{button.disabled=!data.dates.some(day=>day.startsWith(button.dataset.studyYear));button.addEventListener('click',()=>applyStudy(button.dataset.studyYear));});
  addEventListener('resize',place);addEventListener('scroll',event=>{if(open&&!(event.target instanceof Node&&panel.contains(event.target)))close()},true);
}

function bounds(targetZoom=zoom){
  const n=data.dates.length;
  let start=Math.max(0,Math.floor((targetZoom.start/100)*(n-1)+1e-7));
  let end=Math.min(n-1,Math.ceil((targetZoom.end/100)*(n-1)-1e-7));
  if(end<start)end=start;
  return{start,end};
}

function setStableBaseFromZoom(){baseAnchorIndex=bounds().start}

function normalized(index){
  let anchor=clamp(baseAnchorIndex,0,index.close.length-1);
  while(anchor<index.close.length&&!(index.close[anchor]>0))anchor++;
  const base=anchor<index.close.length?index.close[anchor]:null;
  return{
    base,
    baseDate:base?data.dates[anchor]:null,
    values:index.close.map(price=>!(price>0)||!base?null:100*Math.log(price/base))
  };
}

function fitVisible(values){
  const visibleBounds=bounds(),visible=values.slice(visibleBounds.start,visibleBounds.end+1).filter(finite);
  if(!visible.length)return values;
  const low=Math.min(...visible),high=Math.max(...visible),span=high-low;
  if(span<1e-9)return values.map(value=>finite(value)?0:null);
  return values.map(value=>finite(value)?100*((value-low)/span-.5):null);
}

function baseVisualValues(index){
  const values=normalized(index).values;
  return scaleMode==="fill"?fitVisible(values):values;
}

function scaleFactor(name){return manualScales[name]||1}
function isScaleModified(){return Object.values(manualScales).some(value=>Math.abs(value-1)>.002)}
function visualValues(index){
  const factor=scaleFactor(index.name);
  return baseVisualValues(index).map(value=>finite(value)?value*factor:null);
}

function computeCommonAxisRange(){
  const values=[],visible=bounds();
  chosen.forEach(code=>{
    const index=data.indices.find(item=>item.code===code);
    if(index)normalized(index).values.slice(visible.start,visible.end+1).forEach(value=>{if(finite(value))values.push(value)});
  });
  if(!values.length){rightAxisRange={min:-10,max:10};return}
  let low=Math.min(0,...values),high=Math.max(0,...values),span=high-low;
  const pad=Math.max(2,span*.08);
  low=5*Math.floor((low-pad)/5);high=5*Math.ceil((high+pad)/5);
  if(high<=low)high=low+10;
  rightAxisRange={min:low,max:high};
}

function crowdingAxisBounds(){
  const visible=bounds();
  const values=data[mode].slice(visible.start,visible.end+1).filter(finite);
  if(!values.length)return{min:15,max:200};
  const high=Math.max(...values);
  return{min:15,max:Math.max(200,Math.ceil((high+4)/10)*10)};
}

function buildSeries(axis){
  const theme=chartTheme(),crowdingColor=theme.crowding;
  const crowding={
    name:"行情离散度",type:"line",yAxisIndex:0,data:showCrowding?data[mode]:data[mode].map(()=>null),showSymbol:false,connectNulls:false,z:5,
    lineStyle:{color:crowdingColor,width:3,opacity:1},itemStyle:{color:crowdingColor},emphasis:{disabled:true},blur:{lineStyle:{opacity:1}},
    markLine:{
      silent:true,symbol:"none",label:{formatter:"{b}",position:"start",distance:8,align:"right",verticalAlign:"middle",fontSize:11,fontWeight:800},
      data:[
        {name:"30",yAxis:30,lineStyle:{color:theme.zoneGreen,width:1.4,type:[0,5],cap:"round",opacity:.78},label:{color:theme.zoneGreen}},
        {name:"70",yAxis:70,lineStyle:{color:theme.zoneGold,width:1.5,type:[0,5],cap:"round",opacity:.82},label:{color:theme.zoneGold}},
        {name:"120",yAxis:120,lineStyle:{color:crowdingColor,width:1.6,type:[0,5],cap:"round",opacity:.88},label:{color:crowdingColor}}
      ]
    },
    markArea:{silent:true,label:{show:false},data:[
      [{yAxis:70,itemStyle:{color:"rgba(190,145,75,.075)"}},{yAxis:120}],
      [{yAxis:120,itemStyle:{color:"rgba(214,75,69,.11)"}},{yAxis:axis.max}]
    ]}
  };
  const indices=chosen.map(code=>{
    const index=data.indices.find(item=>item.code===code),selected=index.name===selectedScaleSeries;
    return{
      name:index.name,type:"line",yAxisIndex:1,showSymbol:false,connectNulls:false,triggerLineEvent:true,z:selected?4:2,
      data:visualValues(index),
      lineStyle:{color:seriesColor(code),width:selected?2.15:1.55,opacity:selected?1:.9},
      itemStyle:{color:seriesColor(code),opacity:selected?1:.9},
      emphasis:{disabled:true},blur:{lineStyle:{opacity:selected?1:.9}}
    };
  });
  return[crowding,...indices];
}

function tooltip(items){
  const date=String(items[0]?.axisValue||''),theme=chartTheme();if(!date)return '';
  const rows=[];
  for(const item of items){
    const index=data.indices.find(candidate=>candidate.name===item.seriesName);if(!index||!chosen.includes(index.code))continue;
    const norm=normalized(index),pos=data.dates.indexOf(date),price=index.close[pos],growth=price>0&&norm.base?100*(price/norm.base-1):null;
    const color=growth>0?'var(--up)':growth<0?'var(--down)':'var(--muted)';
    rows.push(`<span style="color:${seriesColor(index.code)}">●</span> ${item.seriesName}：区间涨跌幅 <span style="color:${color}">${growth===null?'--':signed(growth)+'%'}</span>`);
  }
  return rows.length?[`<div style="margin-bottom:5px;color:${theme.muted}">${isoDate(date)}</div>`,...rows].join('<br/>'):'';
}

function rightAxisConfig(){
  const hidden=scaleMode==="fill"||isScaleModified(),theme=chartTheme();
  const range=scaleMode==="fill"?{min:-55,max:55}:rightAxisRange;
  return{
    type:"value",min:range.min,max:range.max,name:"",
    axisLabel:{show:!hidden,color:theme.axis,fontSize:11,formatter:value=>String(Math.round(100*(Math.exp(value/100)-1)))},
    axisTick:{show:false},axisLine:{show:false},splitLine:{show:false}
  };
}

function shortName(name){
  const index=data.indices.find(item=>item.name===name);return index?LABELS[index.code]:name;
}

function updateScaleUI(){
  const modified=isScaleModified(),status=$("scale-status"),canvas=$("chart"),scaleToggle=$("scale-toggle"),restore=$("restore-scale");
  scaleToggle.setAttribute("aria-checked",String(scaleMode==="fill"));
  document.querySelectorAll('[data-switch="scale"] .switch-side').forEach(item=>item.classList.toggle("active",item.dataset.side===scaleMode));
  restore.hidden=!modified;
  canvas.classList.toggle("scale-mode",Boolean(selectedScaleSeries));
  status.hidden=!selectedScaleSeries;
  status.textContent=selectedScaleSeries?`${shortName(selectedScaleSeries)}${modified?` ${scaleFactor(selectedScaleSeries).toFixed(2)}×`:""}`:"";
}

function draw(){
  const axis=crowdingAxisBounds(),theme=chartTheme(),style=getComputedStyle($('chart'));
  chart.setOption({
    animation:false,backgroundColor:"transparent",color:[theme.crowding,...chosen.map(seriesColor)],legend:{show:false},
    grid:{show:true,backgroundColor:style.getPropertyValue('--plot-surface').trim(),borderWidth:0,left:parseFloat(style.getPropertyValue('--sdr-plot-left'))||44,right:parseFloat(style.getPropertyValue('--sdr-plot-right'))||40,top:12,bottom:34,containLabel:false},tooltip:{show:chosen.length>0,trigger:"axis",axisPointer:{lineStyle:{type:[0,5],cap:'round'}},confine:true,formatter:tooltip,backgroundColor:theme.tooltipBg,borderColor:theme.tooltipBorder,borderWidth:1,padding:[8,10],textStyle:{color:theme.tooltipText,fontSize:12,fontWeight:400},extraCssText:`border-radius:10px;box-shadow:${theme.tooltipShadow};`},
    xAxis:{type:"category",data:data.dates,boundaryGap:false,axisLabel:{color:theme.axis,fontSize:11,formatter:value=>formatDate(value)},axisTick:{show:false},axisLine:{show:false}},
    yAxis:[
      {type:"value",name:"",min:15,max:axis.max,axisLabel:{color:theme.axis,fontSize:11,formatter:value=>Math.round(value)===200?"200":""},axisTick:{show:false},axisLine:{lineStyle:{color:theme.axisLine}},splitLine:{show:false}},
      rightAxisConfig()
    ],
    dataZoom:[
      {type:"inside",filterMode:"none",start:zoom.start,end:zoom.end,zoomOnMouseWheel:false,moveOnMouseMove:false,moveOnMouseWheel:false,preventDefaultMouseMove:false,throttle:0}
    ],
    series:buildSeries(axis)
  },{notMerge:true,lazyUpdate:true});
  updateScaleUI();syncRangeUI();updateStats();
}

function dispersionZone(value){
  if(value<30)return{key:"low",text:"低位趋同"};
  if(value<70)return{key:"normal",text:"正常区间范围内"};
  if(value<120)return{key:"elevated",text:"中高位 · 潜在高切低动力"};
  return{key:"extreme",text:"极致化抱团 · 谨慎"};
}

function tenYearPercentile(values,last){
  const startDate=shiftYears(data.dates[last],-10),sample=[];let first=-1;
  for(let index=0;index<=last;index++)if(data.dates[index]>=startDate&&finite(values[index])){if(first<0)first=index;sample.push(values[index]);}
  if(!sample.length||!finite(values[last]))return null;
  return{value:100*sample.filter(value=>value<=values[last]).length/sample.length,first,count:sample.length};
}

function updateStats(index=visibleEndIndex()){
  const last=clamp(index,0,data.dates.length-1);if(last===lastReadoutIndex)return;lastReadoutIndex=last;
  const values=data[mode],current=values[last],valid=finite(current),zone=valid?dispersionZone(current):{key:'unknown',text:'暂无有效值'},sample=tenYearPercentile(values,last),percentile=sample?.value;
  $('sdr-readout-date').textContent=isoDate(data.dates[last]);$('sdr-readout-date').dateTime=isoDate(data.dates[last]);
  $('value').textContent=valid?current.toFixed(2):'--';
  const hint=$('range-hint');hint.textContent=zone.text;hint.className=`range-hint ${zone.key}`;
  for(const lag of [1,5,20]){const node=$('d'+lag),delta=valid&&last>=lag&&finite(values[last-lag])?current-values[last-lag]:null;node.textContent=finite(delta)?signed(delta):'--';node.dataset.direction=delta>0?'up':delta<0?'down':'neutral';}
  const text=finite(percentile)?percentile.toFixed(1)+'%':'--';$('percentile').textContent=text;
  const description=sample?`截至${isoDate(data.dates[last])}，近十年可用样本为${isoDate(data.dates[sample.first])}至${isoDate(data.dates[last])}的${sample.count}个交易日，当前值高于或等于其中${text}的样本。`:'该日期暂无有效分位样本。';
  $('percentile-hint').textContent=description;
  const meter=$('sdr-percentile-meter'),cursor=$('sdr-percentile-cursor');meter.title=description;meter.setAttribute('aria-valuetext',text);
  if(finite(percentile)){meter.setAttribute('aria-valuenow',String(percentile));cursor.hidden=false;cursor.style.transform=`translateX(${percentile}%)`;}
  else{meter.removeAttribute('aria-valuenow');cursor.hidden=true;}
}

function renderSeriesTags(){
  const dispersion=`<button class="series-chip crowding${showCrowding?" active":""}" style="--series-color:${chartTheme().crowding}" type="button" data-role="dispersion" aria-pressed="${showCrowding}">离散指数</button>`;
  const indices=TAG_ORDER.map(code=>{
    const index=data.indices.find(item=>item.code===code),active=chosen.includes(code),scaleSelected=index.name===selectedScaleSeries;
    return `<button class="series-chip${active?" active":""}${scaleSelected?" scale-selected":""}" style="--series-color:${seriesColor(code)}" type="button" data-code="${code}" aria-pressed="${active}">${LABELS[code]}</button>`;
  }).join("");
  $("series-tags").innerHTML=`<div class="sdr-legend-main">${dispersion}</div><div class="sdr-legend-indices">${indices}</div>`;
}

function setupSeriesTags(){
  const host=$("series-tags");renderSeriesTags();
  host.addEventListener("click",event=>{
    const button=event.target.closest("button");if(!button)return;
    if(button.dataset.role==="dispersion"){showCrowding=!showCrowding;renderSeriesTags();draw();return}
    const code=button.dataset.code;if(!code)return;
    const index=data.indices.find(item=>item.code===code),active=chosen.includes(code);
    if(active){
      chosen=chosen.filter(item=>item!==code);
      if(index.name===selectedScaleSeries){selectedScaleSeries=null;delete manualScales[index.name]}
    }else chosen=[...chosen,code];
    computeCommonAxisRange();renderSeriesTags();draw();
  });
}

function resetTimeRange(){
  zoom={...defaultZoom};setStableBaseFromZoom();computeCommonAxisRange();draw();
}

function restoreManualScale(){manualScales={};selectedScaleSeries=null;renderSeriesTags();draw()}

function toggleScale(){
  manualScales={};selectedScaleSeries=null;scaleMode=scaleMode==="common"?"fill":"common";
  if(scaleMode==="common")computeCommonAxisRange();
  renderSeriesTags();draw();
}

function nearestIndexAt(offsetX,offsetY){
  if(!chosen.length)return;
  const grid=chart.getModel().getComponent("grid")?.coordinateSystem?.getRect();
  if(!grid||offsetX<grid.x||offsetX>grid.x+grid.width||offsetY<grid.y||offsetY>grid.y+grid.height)return;
  const indexAt=clamp(Math.round(chart.convertFromPixel({xAxisIndex:0},offsetX)),0,data.dates.length-1);
  let nearest=null,distance=Infinity;
  chosen.forEach(code=>{
    const index=data.indices.find(item=>item.code===code),value=visualValues(index)[indexAt];
    if(!finite(value))return;
    const y=chart.convertToPixel({yAxisIndex:1},value),delta=Math.abs(y-offsetY);
    if(delta<distance){distance=delta;nearest=index.name}
  });
  return nearest&&distance<=14?nearest:null;
}

function setupChartInteraction(){
  const host=$("chart"),selection=document.createElement('div');
  selection.className='chart-range-selection';selection.hidden=true;selection.setAttribute('aria-hidden','true');host.append(selection);
  host.tabIndex=0;host.setAttribute('aria-label','One-SDR走势图：左右拖动横移，选择指数后上下拖动调比例，右键框选，滚轮缩放');
  let gesture=null,panFrame=0,contextUntil=0;
  const limit=()=>data.dates.length-1;
  const range=()=>{const extent=chart.getModel().getComponent('xAxis')?.axis?.scale.getExtent();return extent?.every(finite)?{start:extent[0],end:extent[1]}:{start:zoom.start*limit()/100,end:zoom.end*limit()/100};};
  const grid=()=>chart.getModel().getComponent('grid')?.coordinateSystem?.getRect();
  function point(event){const r=host.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};}
  function inside(p,g){return g&&p.x>=g.x&&p.x<=g.x+g.width&&p.y>=g.y&&p.y<=g.y+g.height;}
  function commit(start,end){
    const total=limit();if(total<1)return;
    const span=clamp(end-start,Math.min(2,total),total);start=clamp(start,0,total-span);end=start+span;
    chart.dispatchAction({type:'hideTip'});
    chart.dispatchAction({type:'dataZoom',dataZoomIndex:0,start:start/total*100,end:end/total*100});
  }
  function latestVisible(r){
    const indices=data.indices.filter(index=>chosen.includes(index.code));
    for(let i=Math.min(limit(),Math.floor(r.end+1e-8));i>=Math.ceil(r.start-1e-8);i--){
      if(showCrowding&&finite(data[mode][i])||indices.some(index=>finite(index.close[i])&&index.close[i]>0))return i;
    }
    return r.end;
  }
  function zoomBy(factor){const r=range(),span=r.end-r.start;if(span<=0)return;const anchor=latestVisible(r),fraction=(anchor-r.start)/span,next=clamp(span*factor,Math.min(2,limit()),limit());commit(anchor-fraction*next,anchor+(1-fraction)*next);}
  function applyMotion(){
    panFrame=0;if(!gesture||gesture.button!==0||gesture.kind==='pending')return;
    if(gesture.kind==='scale'){manualScales[gesture.series]=clamp(gesture.factor*Math.exp((gesture.originY-gesture.y)/180),.3,3.5);draw();return;}
    const dx=gesture.x-gesture.origin,shift=-dx/gesture.grid.width*(gesture.range.end-gesture.range.start);commit(gesture.range.start+shift,gesture.range.end+shift);
  }
  function clear(){const previous=gesture;gesture=null;if(panFrame)cancelAnimationFrame(panFrame);panFrame=0;selection.hidden=true;host.classList.remove('is-panning','is-selecting','is-scaling');if(previous&&host.hasPointerCapture(previous.id))host.releasePointerCapture(previous.id);}
  host.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'||![0,2].includes(event.button)||gesture)return;
    const p=point(event),g=grid();if(!inside(p,g))return;
    event.preventDefault();chart.dispatchAction({type:'hideTip'});
    const initialRange=range(),hit=event.button===0?nearestIndexAt(p.x,p.y):null;
    if(hit){selectedScaleSeries=hit;renderSeriesTags();draw();}
    gesture={id:event.pointerId,button:event.button,origin:p.x,originY:event.clientY,x:p.x,y:event.clientY,kind:event.button===0?'pending':'brush',series:selectedScaleSeries,factor:scaleFactor(selectedScaleSeries),grid:{x:g.x,y:g.y,width:g.width,height:g.height},range:initialRange};
    host.setPointerCapture(event.pointerId);if(event.button===2)host.classList.add('is-selecting');
    if(event.button===2){contextUntil=performance.now()+500;selection.hidden=false;selection.style.left=p.x+'px';selection.style.top=g.y+'px';selection.style.width='0px';selection.style.height=g.height+'px';}
  },true);
  host.addEventListener('pointermove',event=>{
    if(!gesture){const p=point(event),g=grid();if(inside(p,g)){const index=chart.convertFromPixel({xAxisIndex:0},p.x);if(finite(index))updateStats(clamp(Math.round(index),0,limit()));}else updateStats();return;}
    if(event.pointerId!==gesture.id)return;event.preventDefault();
    const p=point(event);gesture.x=clamp(p.x,gesture.grid.x,gesture.grid.x+gesture.grid.width);gesture.y=event.clientY;
    if(gesture.button===0){
      const dx=gesture.x-gesture.origin,dy=gesture.y-gesture.originY;
      if(gesture.kind==='pending'&&Math.hypot(dx,dy)>=4){gesture.kind=gesture.series&&Math.abs(dy)>Math.abs(dx)?'scale':'pan';host.classList.add(gesture.kind==='scale'?'is-scaling':'is-panning');}
      if(gesture.kind!=='pending'&&!panFrame)panFrame=requestAnimationFrame(applyMotion);
    }
    else{selection.style.left=Math.min(gesture.origin,gesture.x)+'px';selection.style.width=Math.abs(gesture.x-gesture.origin)+'px';}
  });
  host.addEventListener('pointerup',event=>{
    if(!gesture||event.pointerId!==gesture.id)return;event.preventDefault();
    const current=gesture,p=point(event);current.x=clamp(p.x,current.grid.x,current.grid.x+current.grid.width);current.y=event.clientY;
    if(current.button===0){if(panFrame)cancelAnimationFrame(panFrame);applyMotion();}
    else{contextUntil=performance.now()+500;if(Math.abs(current.x-current.origin)>=5){const a=(Math.min(current.x,current.origin)-current.grid.x)/current.grid.width,b=(Math.max(current.x,current.origin)-current.grid.x)/current.grid.width,span=current.range.end-current.range.start;commit(current.range.start+a*span,current.range.start+b*span);}}
    clear();
  });
  host.addEventListener('pointerleave',()=>{if(!gesture)updateStats()});
  host.addEventListener('pointercancel',clear);host.addEventListener('lostpointercapture',()=>{if(gesture)clear()});
  addEventListener('keydown',event=>{if(gesture&&event.key==='Escape'){event.preventDefault();event.stopPropagation();clear();}},true);
  host.addEventListener('contextmenu',event=>{if(gesture||performance.now()<contextUntil||inside(point(event),grid()))event.preventDefault();});
  host.addEventListener('wheel',event=>{if(gesture||!event.deltaY||!inside(point(event),grid()))return;event.preventDefault();event.stopPropagation();const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?host.clientHeight:1);zoomBy(Math.exp(clamp(pixels,-240,240)*.002));},{passive:false,capture:true});
  host.addEventListener('dblclick',event=>{if(!inside(point(event),grid()))return;event.preventDefault();clear();resetTimeRange();});
  host.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','+','=','-','_','Home','Escape'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();
    if(event.key==='Escape'){clear();return;}if(event.key==='Home'){clear();resetTimeRange();return;}
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){const r=range(),step=(r.end-r.start)*.1*(event.key==='ArrowLeft'?-1:1);commit(r.start+step,r.end+step);return;}
    zoomBy(event.key==='-'||event.key==='_'?1.25:.8);
  });
  $("scale-toggle").addEventListener("click",toggleScale);
  $("restore-scale").addEventListener("click",restoreManualScale);
}

async function init(){
  const state=await fetch("state.json").then(response=>response.json());
  const manifest=state.current.manifest;
  data=await fetch(manifest.series_path).then(response=>response.json());
  trimToPublicStart();defaultZoom=computeDefaultZoom();zoom={...defaultZoom};setStableBaseFromZoom();computeCommonAxisRange();
  $('as-of').textContent=formatDate(data.dates.at(-1));
  chart=echarts.init($("chart"));setupSeriesTags();setupRangeControls();updateStats();draw();setupChartInteraction();
  chart.on("dataZoom",event=>{
    const dz=event.batch?.[0]||event,next={start:Number(dz.start??zoom.start),end:Number(dz.end??zoom.end)};
    if(Math.abs(next.start-zoom.start)<.001&&Math.abs(next.end-zoom.end)<.001)return;
    const oldSpan=zoom.end-zoom.start,newSpan=next.end-next.start,spanChanged=Math.abs(newSpan-oldSpan)>.03;
    zoom=next;syncRangeUI();updateStats();
    if(spanChanged){setStableBaseFromZoom();computeCommonAxisRange();draw();return}
    if(scaleMode==="fill")draw();
  });
  addEventListener("resize",()=>chart.resize());
}

setupTheme();
addEventListener("onechart-theme-change",()=>{
  if(!chart||!data)return;
  renderSeriesTags();draw();chart.resize();
});
init().catch(error=>{console.error(error);$("chart").innerHTML='<div class="chart-unavailable">数据暂不可用</div>'});
})();
