(()=>{
const DATA_START="20021112";
const CROWDING_COLOR="#d64b45";
const COLORS={
  "000001.SH":"#557da8",
  "000300.SH":"#7d6f8f",
  "000016.SH":"#ad8959",
  "399006.SZ":"#5f8b84",
  "000688.SH":"#a56f89",
  "000852.SH":"#788d63",
  "932000.CSI":"#7a8492"
};
const LABELS={"000001.SH":"上证","399006.SZ":"创业","000688.SH":"科创","000016.SH":"50","000300.SH":"300","000852.SH":"1000","932000.CSI":"2000"};
const TAG_ORDER=["000001.SH","399006.SZ","000688.SH","000016.SH","000300.SH","000852.SH","932000.CSI"];
let data,chart,mode="smooth",showCrowding=true,chosen=["000001.SH"],zoom={start:0,end:100},defaultZoom={start:0,end:100};
let baseAnchorIndex=0,rightAxisRange={min:-10,max:10},scaleMode="common";
let selectedScaleSeries=null,manualScales={},verticalDrag=null,scaleFrame=null;
const $=id=>document.getElementById(id);
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
  const target=shiftYears(data.dates[n-1],-7);
  let first=data.dates.findIndex(date=>date>=target);
  if(first<0)first=0;
  return{start:100*first/(n-1),end:100};
}

function bounds(targetZoom=zoom){
  const n=data.dates.length;
  let start=Math.max(0,Math.floor((targetZoom.start/100)*(n-1)));
  let end=Math.min(n-1,Math.ceil((targetZoom.end/100)*(n-1)));
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
  const crowding={
    name:"行情离散度",type:"line",yAxisIndex:0,data:showCrowding?data[mode]:data[mode].map(()=>null),showSymbol:false,connectNulls:false,z:5,
    lineStyle:{color:CROWDING_COLOR,width:3,opacity:1},itemStyle:{color:CROWDING_COLOR},emphasis:{disabled:true},blur:{lineStyle:{opacity:1}},
    markLine:{
      silent:true,symbol:"none",label:{formatter:"{b}",position:"start",distance:8,align:"right",verticalAlign:"middle",fontSize:11,fontWeight:800},
      data:[
        {name:"30",yAxis:30,lineStyle:{color:"rgba(93,139,132,.78)",width:1.4,type:"dashed"},label:{color:"#5f8b84"}},
        {name:"70",yAxis:70,lineStyle:{color:"rgba(173,137,89,.82)",width:1.5,type:"dashed"},label:{color:"#9b7545"}},
        {name:"120",yAxis:120,lineStyle:{color:"rgba(214,75,69,.88)",width:1.6,type:"dashed"},label:{color:CROWDING_COLOR}}
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
      lineStyle:{color:COLORS[code],width:selected?2.15:1.55,opacity:selected?.9:.58},
      itemStyle:{color:COLORS[code],opacity:selected?.9:.72},
      emphasis:{disabled:true},blur:{lineStyle:{opacity:selected?.9:.58}}
    };
  });
  return[crowding,...indices];
}

function tooltip(items){
  const date=items[0]?.axisValue;
  if(!date)return"";
  const output=[`<div style="margin-bottom:5px;color:#64748b;font-weight:700">${formatDate(date)}</div>`];
  for(const item of items){
    if(item.seriesName==="行情离散度"){
      output.push(`<span style="color:${CROWDING_COLOR}">●</span> 行情离散度：${finite(item.data)?Number(item.data).toFixed(2):"--"}`);
      continue;
    }
    const index=data.indices.find(candidate=>candidate.name===item.seriesName),norm=normalized(index),pos=data.dates.indexOf(date),price=index?.close[pos];
    const growth=price>0&&norm.base?100*(price/norm.base-1):null;
    output.push(`<span style="color:${COLORS[index.code]}">●</span> ${item.seriesName}：区间涨跌幅 ${growth===null?"--":signed(growth)+"%"}`);
  }
  return output.join("<br/>");
}

function rightAxisConfig(){
  const hidden=scaleMode==="fill"||isScaleModified();
  const range=scaleMode==="fill"?{min:-55,max:55}:rightAxisRange;
  return{
    type:"value",min:range.min,max:range.max,name:"",
    axisLabel:{show:!hidden,color:"#7a8492",formatter:value=>String(Math.round(100*(Math.exp(value/100)-1)))},
    axisTick:{show:!hidden},axisLine:{show:!hidden},splitLine:{show:false}
  };
}

function shortName(name){
  const index=data.indices.find(item=>item.name===name);return index?LABELS[index.code]:name;
}

function updateScaleUI(){
  const modified=isScaleModified(),status=$("scale-status"),canvas=$("chart"),valueToggle=$("value-toggle"),scaleToggle=$("scale-toggle"),restore=$("restore-scale");
  valueToggle.setAttribute("aria-checked",String(mode==="precise"));
  scaleToggle.setAttribute("aria-checked",String(scaleMode==="fill"));
  document.querySelectorAll('[data-switch="value"] .switch-side').forEach(item=>item.classList.toggle("active",item.dataset.side===mode));
  document.querySelectorAll('[data-switch="scale"] .switch-side').forEach(item=>item.classList.toggle("active",item.dataset.side===scaleMode));
  restore.hidden=!modified;
  canvas.classList.toggle("scale-mode",Boolean(selectedScaleSeries));
  status.hidden=!selectedScaleSeries;
  status.textContent=selectedScaleSeries?`${shortName(selectedScaleSeries)}${modified?` ${scaleFactor(selectedScaleSeries).toFixed(2)}×`:""}`:"";
}

function draw(){
  const axis=crowdingAxisBounds();
  chart.setOption({
    animation:false,color:[CROWDING_COLOR,...chosen.map(code=>COLORS[code])],legend:{show:false},
    grid:{left:64,right:72,top:window.innerWidth<=420?56:48,bottom:86,containLabel:false},tooltip:{trigger:"axis",confine:true,formatter:tooltip,backgroundColor:"rgba(255,255,255,.60)",borderColor:"#d7e0ea",borderWidth:1,padding:[8,10],textStyle:{color:"#475569",fontSize:12,fontWeight:700},extraCssText:"border-radius:7px;box-shadow:0 4px 10px rgba(15,23,42,.10);backdrop-filter:blur(6px);"},
    xAxis:{type:"category",data:data.dates,boundaryGap:false,axisLabel:{color:"#697586",formatter:value=>formatDate(value)},axisLine:{lineStyle:{color:"#cfd7e2"}}},
    yAxis:[
      {type:"value",name:"",min:15,max:axis.max,axisLabel:{color:"#697586",formatter:value=>Math.round(value)===200?"200":""},axisTick:{show:false},splitLine:{lineStyle:{color:"#edf1f5"}}},
      rightAxisConfig()
    ],
    dataZoom:[
      {type:"inside",filterMode:"none",start:zoom.start,end:zoom.end,zoomOnMouseWheel:true,moveOnMouseMove:false,moveOnMouseWheel:false,preventDefaultMouseMove:false,throttle:45},
      {type:"slider",filterMode:"none",start:zoom.start,end:zoom.end,height:30,bottom:18,brushSelect:false,showDetail:false,showDataShadow:false,handleSize:"100%",moveHandleSize:"100%",borderColor:"#d8e0e9",backgroundColor:"rgba(226,232,240,.42)",fillerColor:"rgba(85,125,168,.14)",handleStyle:{color:"#728da8",borderColor:"#fff",borderWidth:1},moveHandleStyle:{color:"rgba(85,125,168,.035)",borderColor:"transparent"},selectedDataBackground:{lineStyle:{color:"transparent"},areaStyle:{color:"transparent"}}}
    ],
    series:buildSeries(axis)
  },{notMerge:true,lazyUpdate:true});
  updateScaleUI();
}

function dispersionZone(value){
  if(value<30)return{key:"low",text:"低位趋同"};
  if(value<70)return{key:"normal",text:"正常区间范围内"};
  if(value<120)return{key:"elevated",text:"中高位 · 潜在高切低动力"};
  return{key:"extreme",text:"极致化抱团 · 谨慎"};
}

function tenYearPercentile(values,last){
  const startDate=shiftYears(data.dates[last],-10),sample=[];
  for(let index=0;index<=last;index++)if(data.dates[index]>=startDate&&finite(values[index]))sample.push(values[index]);
  if(!sample.length)return null;
  const current=values[last],notAbove=sample.filter(value=>value<=current).length;
  return 100*notAbove/sample.length;
}

function updateStats(){
  const values=data[mode];let last=values.length-1;
  while(last>=0&&!finite(values[last]))last--;
  if(last<0)return;
  const current=Number(values[last]),zone=dispersionZone(current),percentile=tenYearPercentile(values,last);
  $("value").textContent=current.toFixed(2);
  const hint=$("range-hint");hint.textContent=zone.text;hint.className=`range-hint ${zone.key}`;
  const percentileText=finite(percentile)?`${percentile.toFixed(1)}%`:"--";
  $("percentile").textContent=percentileText;
  $("percentile-hint").textContent=finite(percentile)?`高于近十年${percentileText}的交易日`:"高于近十年--的交易日";
  $("d1").textContent=last>0&&finite(values[last-1])?signed(values[last]-values[last-1]):"--";
  const previous=Math.max(0,last-5);
  $("d5").textContent=finite(values[previous])?signed(values[last]-values[previous]):"--";
  $("as-of").textContent=formatDate(data.dates[last]);
}

function renderSeriesTags(){
  const dispersion=`<button class="series-chip crowding${showCrowding?" active":""}" style="--series-color:${CROWDING_COLOR}" type="button" data-role="dispersion" aria-pressed="${showCrowding}">离散度</button>`;
  const indices=TAG_ORDER.map(code=>{
    const index=data.indices.find(item=>item.code===code),active=chosen.includes(code),scaleSelected=index.name===selectedScaleSeries;
    return `<button class="series-chip${active?" active":""}${scaleSelected?" scale-selected":""}" style="--series-color:${COLORS[code]}" type="button" data-code="${code}" aria-pressed="${active}">${LABELS[code]}</button>`;
  }).join("");
  $("series-tags").innerHTML=dispersion+indices;
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

function toggleValueMode(){mode=mode==="smooth"?"precise":"smooth";updateStats();draw()}

function selectNearestIndex(offsetX,offsetY){
  if(!chosen.length)return;
  const grid=chart.getModel().getComponent("grid")?.coordinateSystem?.getRect();
  if(!grid||offsetX<grid.x||offsetX>grid.x+grid.width||offsetY<grid.y||offsetY>grid.y+grid.height)return;
  const visible=bounds(),ratio=clamp((offsetX-grid.x)/grid.width,0,1),indexAt=Math.round(visible.start+ratio*(visible.end-visible.start));
  let nearest=null,distance=Infinity;
  chosen.forEach(code=>{
    const index=data.indices.find(item=>item.code===code),value=visualValues(index)[indexAt];
    if(!finite(value))return;
    const y=chart.convertToPixel({yAxisIndex:1},value),delta=Math.abs(y-offsetY);
    if(delta<distance){distance=delta;nearest=index.name}
  });
  if(nearest&&distance<=14){selectedScaleSeries=nearest;renderSeriesTags();draw()}
}

function setupVerticalScaleInteraction(){
  const host=$("chart");
  chart.getZr().on("click",event=>selectNearestIndex(event.offsetX,event.offsetY));
  host.addEventListener("mousedown",event=>{
    if(!selectedScaleSeries||event.button!==0)return;
    verticalDrag={startY:event.clientY,startFactor:scaleFactor(selectedScaleSeries)};event.preventDefault();
  });
  addEventListener("mousemove",event=>{
    if(!verticalDrag||!selectedScaleSeries)return;
    const delta=verticalDrag.startY-event.clientY;if(Math.abs(delta)<2)return;
    manualScales[selectedScaleSeries]=clamp(verticalDrag.startFactor*Math.exp(delta/180),.3,3.5);
    if(scaleFrame===null)scaleFrame=requestAnimationFrame(()=>{scaleFrame=null;draw()});
    event.preventDefault();
  });
  addEventListener("mouseup",()=>{verticalDrag=null});
  host.addEventListener("dblclick",event=>{event.preventDefault();resetTimeRange()});
  $("value-toggle").addEventListener("click",toggleValueMode);
  $("scale-toggle").addEventListener("click",toggleScale);
  $("restore-scale").addEventListener("click",restoreManualScale);
}

async function init(){
  const state=await fetch("state.json").then(response=>response.json());
  const manifest=state.current.manifest;
  data=await fetch(manifest.series_path).then(response=>response.json());
  trimToPublicStart();defaultZoom=computeDefaultZoom();zoom={...defaultZoom};setStableBaseFromZoom();computeCommonAxisRange();
  chart=echarts.init($("chart"));setupSeriesTags();updateStats();draw();setupVerticalScaleInteraction();
  chart.on("dataZoom",event=>{
    const dz=event.batch?.[0]||event,next={start:Number(dz.start??zoom.start),end:Number(dz.end??zoom.end)};
    if(Math.abs(next.start-zoom.start)<.001&&Math.abs(next.end-zoom.end)<.001)return;
    const oldSpan=zoom.end-zoom.start,newSpan=next.end-next.start,spanChanged=Math.abs(newSpan-oldSpan)>.03;
    zoom=next;
    if(spanChanged){setStableBaseFromZoom();computeCommonAxisRange();draw();return}
    if(scaleMode==="fill")draw();
  });
  addEventListener("resize",()=>chart.resize());
}

init().catch(error=>{console.error(error);$("chart").innerHTML='<div style="padding:80px 20px;text-align:center;color:#94a3b8">数据暂不可用</div>'});
})();
