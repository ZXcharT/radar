'use strict';
// Presentation and input semantics only. Native date/data/export owners remain.
(() => {
 let returnFocus=null,closeCalendar=()=>{};
 const editing=target=>target instanceof Element&&(target.isContentEditable||!!target.closest('textarea,select,[role="textbox"],input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="range"])'));
 function installSearch(app){
  const field=document.querySelector('.oc-search'),wrap=field.closest('.oc-search-wrap');
  let active=-1,composing=false,scheduled=false;
  const popup=()=>wrap.querySelector('.oc-search-results,.oc-search-empty');
  const options=()=>[...wrap.querySelectorAll('.oc-search-result')];
  Object.entries({role:'combobox','aria-label':'搜索名称、代码或首字母','aria-autocomplete':'list','aria-haspopup':'listbox','aria-controls':'cashflow-search-results','aria-expanded':'false'}).forEach(([key,value])=>field.setAttribute(key,value));
  function choose(index,reveal=false){
   const rows=options();active=rows.length?(index+rows.length)%rows.length:-1;
   rows.forEach((button,i)=>{button.classList.toggle('search-active',i===active);button.setAttribute('aria-selected',String(i===active));});
   if(active<0){field.removeAttribute('aria-activedescendant');return;}
   const button=rows[active];field.setAttribute('aria-activedescendant',button.id);
   if(reveal){const p=popup(),a=button.getBoundingClientRect(),b=p.getBoundingClientRect();if(a.top<b.top)p.scrollTop-=b.top-a.top;else if(a.bottom>b.bottom)p.scrollTop+=a.bottom-b.bottom;}
  }
  function position(){
   const p=popup();if(!p)return;
   const r=field.getBoundingClientRect(),desired=Math.min(380,Math.max(72,options().length*40+12)),above=r.top-12,below=innerHeight-r.bottom-12,up=below<desired&&above>below;
   p.classList.toggle('opens-up',up);p.style.width=r.width+'px';p.style.left=Math.max(12,Math.min(r.left,innerWidth-r.width-12))+'px';p.style.maxHeight=Math.max(60,Math.min(380,innerHeight/2,up?above:below))+'px';
   p.style.top=(up?Math.max(12,r.top-p.getBoundingClientRect().height-6):r.bottom+6)+'px';
  }
  function sync(reset=false){const p=popup();field.setAttribute('aria-expanded',String(!!p));if(!p){field.removeAttribute('aria-activedescendant');active=-1;return;}position();choose(reset?0:active<0?0:active);}
  function queue(reset=true){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync(reset);});}
  function close(){app.showDropdown=false;field.setAttribute('aria-expanded','false');field.removeAttribute('aria-activedescendant');active=-1;}
  new MutationObserver(()=>queue()).observe(wrap,{childList:true,subtree:true});
  field.addEventListener('focus',()=>{closeCalendar();queue();});field.addEventListener('input',event=>{if(!composing&&!event.isComposing){app.showDropdown=Boolean(field.value.trim());queue();}});
  field.addEventListener('compositionstart',()=>{composing=true;});field.addEventListener('compositionend',()=>{composing=false;app.showDropdown=Boolean(field.value.trim());queue();});
  field.addEventListener('keydown',event=>{
   if(composing||event.isComposing||event.keyCode===229)return;
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    event.preventDefault();event.stopPropagation();if(!app.showDropdown&&field.value.trim()){app.showDropdown=true;queueMicrotask(()=>{sync();choose(event.key==='ArrowDown'?0:options().length-1,true);});return;}
    choose(active<0?(event.key==='ArrowDown'?0:options().length-1):active+(event.key==='ArrowDown'?1:-1),true);
   }else if(event.key==='Enter'){
    event.preventDefault();event.stopPropagation();const result=app.showDropdown?app.searchResults[active<0?0:active]:null;if(result){returnFocus=field;app.openModal(result,'top');}close();
   }else if(event.key==='Escape'||event.key==='Tab'){close();if(event.key==='Escape'){event.preventDefault();event.stopPropagation();}}
  });
  wrap.addEventListener('pointermove',event=>{const button=event.target.closest('.oc-search-result');if(button)choose(options().indexOf(button));});
  document.addEventListener('pointerdown',event=>{if(!wrap.contains(event.target))close();});
  function focus(){field.focus({preventScroll:true});field.setSelectionRange(0,field.value.length);const r=field.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)field.scrollIntoView({block:'nearest',behavior:'auto'});}
  document.addEventListener('keydown',event=>{
   if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||editing(event.target)||app.modalData||document.querySelector('dialog[open],[role="dialog"]:not([hidden])'))return;
   if(event.key==='Process'||event.keyCode===229){focus();return;}
   if(!event.isComposing&&/^[\p{L}\p{N}]$/u.test(event.key))focus();
  },true);
  document.addEventListener('compositionstart',event=>{if(!editing(event.target)&&!app.modalData&&!document.querySelector('[role="dialog"]:not([hidden])')){composing=true;focus();}},true);
  document.addEventListener('compositionend',()=>{composing=false;},true);
  addEventListener('resize',position);addEventListener('scroll',position,true);
 }
 function installCalendar(app){
  const trigger=document.getElementById('cashflow-date-trigger'),dates=new Set(app.availableDates),sorted=[...dates].sort(),min=sorted[0],max=sorted.at(-1);
  const popup=document.createElement('div');popup.id='cashflow-calendar';popup.hidden=true;popup.inert=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','选择数据日期');
  popup.innerHTML='<div class="cf-calendar-head"><button type="button" data-month="-1" aria-label="上个月"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m12 5-5 5 5 5"/></svg></button><label><span class="sr-only">年份</span><input aria-label="年份" inputmode="numeric" type="number"></label><label><span class="sr-only">月份</span><select aria-label="月份"></select></label><button type="button" data-month="1" aria-label="下个月"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m8 5 5 5-5 5"/></svg></button></div><div class="cf-calendar-week" aria-hidden="true">'+['一','二','三','四','五','六','日'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="cf-calendar-days" role="grid" aria-label="可用数据日期"></div><div class="cf-calendar-foot"><span>仅可选择已有数据日期</span><button type="button" data-latest>最新日期</button></div>';
  document.body.append(popup);const yearInput=popup.querySelector('input'),monthSelect=popup.querySelector('select'),grid=popup.querySelector('.cf-calendar-days');
  yearInput.min=min.slice(0,4);yearInput.max=max.slice(0,4);monthSelect.innerHTML=Array.from({length:12},(_,i)=>'<option value="'+i+'">'+(i+1)+'月</option>').join('');
  let year=0,month=0;
  function place(){if(popup.hidden)return;const r=trigger.getBoundingClientRect(),h=popup.getBoundingClientRect().height;popup.style.left=Math.max(12,Math.min(r.right-popup.offsetWidth,innerWidth-popup.offsetWidth-12))+'px';popup.style.top=Math.max(12,r.bottom+6+h<=innerHeight-12?r.bottom+6:r.top-h-6)+'px';}
  function draw(){
   yearInput.value=year;monthSelect.value=month;const first=(new Date(year,month,1).getDay()+6)%7,count=new Date(year,month+1,0).getDate();let html='<span aria-hidden="true"></span>'.repeat(first);
   for(let day=1;day<=count;day++){const iso=year+'-'+String(month+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');html+='<button type="button" role="gridcell" data-date="'+iso+'" aria-label="'+iso+'" aria-selected="'+(iso===app.selectedDate)+'" '+(dates.has(iso)?'':'disabled')+'>'+day+'</button>';}
   grid.innerHTML=html;const serial=year*12+month;popup.querySelector('[data-month="-1"]').disabled=serial<=Number(min.slice(0,4))*12+Number(min.slice(5,7))-1;popup.querySelector('[data-month="1"]').disabled=serial>=Number(max.slice(0,4))*12+Number(max.slice(5,7))-1;place();
  }
  function close(focus=false){popup.hidden=true;popup.inert=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus({preventScroll:true});}
  closeCalendar=close;
  function select(iso){app.closeAllCalendars();app.selectedDate=iso;close(true);}
  trigger.addEventListener('click',event=>{event.preventDefault();if(!popup.hidden){close();return;}app.showDropdown=false;[year,month]=app.selectedDate.split('-').slice(0,2).map(Number);month--;draw();popup.hidden=false;popup.inert=false;trigger.setAttribute('aria-expanded','true');place();popup.querySelector('[aria-selected="true"]')?.focus({preventScroll:true});});
  popup.addEventListener('click',event=>{
   const day=event.target.closest('[data-date]');if(day&&!day.disabled){select(day.dataset.date);return;}
   const next=event.target.closest('[data-month]');if(next&&!next.disabled){const d=new Date(year,month+Number(next.dataset.month),1);year=d.getFullYear();month=d.getMonth();draw();}
   if(event.target.closest('[data-latest]'))select(max);
  });
  function locate(){const candidate=Math.max(Number(yearInput.min),Math.min(Number(yearInput.max),Number(yearInput.value)));if(!Number.isFinite(candidate))return;year=candidate;month=Number(monthSelect.value);draw();}
  yearInput.addEventListener('change',locate);monthSelect.addEventListener('change',locate);
  popup.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);return;}
   const button=event.target.closest('[data-date]');if(!button)return;const shift={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(!shift)return;
   event.preventDefault();let iso;if(Math.abs(shift)===1){const at=sorted.indexOf(button.dataset.date);iso=sorted[Math.max(0,Math.min(sorted.length-1,at+shift))];}else{const d=new Date(button.dataset.date+'T12:00:00');d.setDate(d.getDate()+shift);iso=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}if(!dates.has(iso))return;[year,month]=iso.split('-').slice(0,2).map(Number);month--;draw();popup.querySelector('[data-date="'+iso+'"]')?.focus({preventScroll:true});
  });
  document.addEventListener('pointerdown',event=>{if(!popup.hidden&&!popup.contains(event.target)&&!trigger.contains(event.target))close();});
  addEventListener('resize',place);addEventListener('scroll',place,true);
 }
 function ready(){
  const app=window.CashflowApp;if(!app)return;app.theme=window.OneChartTheme.mode;document.documentElement.style.colorScheme=app.theme;
  installSearch(app);installCalendar(app);
  const dismissSelectionCalendars=current=>{if(current){closeCalendar();app.closeAllCalendars();}};
  app.$watch('exportMode',dismissSelectionCalendars);app.$watch('exportBusy',dismissSelectionCalendars);
  app.$watch('modalData',(current,prior)=>{
   if(current){closeCalendar();if(!prior&&!returnFocus)returnFocus=document.activeElement;document.body.style.overflow='hidden';requestAnimationFrame(()=>document.querySelector('.modal-overlay:not(.cf-detail-leave-active) .modal-close')?.focus({preventScroll:true}));}
  });
  addEventListener('cashflow-detail-closed',()=>{
   if(app.modalData)return; // A rapid reopen must not be unlocked by an older leave.
   document.body.style.overflow='';const target=returnFocus;returnFocus=null;
   queueMicrotask(()=>{if(!app.modalData&&target?.isConnected)target.focus({preventScroll:true});});
  });
  document.body.dataset.cashflowReady='true';
 }
 addEventListener('cashflow-ready',ready);
 addEventListener('onechart-theme-change',event=>{document.documentElement.style.colorScheme=event.detail.mode;if(window.CashflowApp)window.CashflowApp.theme=event.detail.mode;});
 document.addEventListener('pointerdown',event=>{if(event.target.closest('.mirror-name'))returnFocus=event.target.closest('button');if(event.target.closest('.oc-search-result'))returnFocus=document.querySelector('.oc-search');},true);
 document.addEventListener('keydown',event=>{
  const app=window.CashflowApp;if(!app||event.defaultPrevented||event.isComposing||event.keyCode===229)return;
  if(event.key==='Tab'&&app.modalData){const modal=document.querySelector('.modal-overlay:not(.cf-detail-leave-active) .detail-dialog');if(!modal)return;const list=[...modal.querySelectorAll('button,input,select,summary,a[href],[tabindex="0"]')].filter(e=>!e.disabled&&e.getClientRects().length);if(!list.length)return;const first=list[0],last=list.at(-1);if(event.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){event.preventDefault();first.focus();}}
  if(event.key!=='Escape')return;
  if(app.modalData){app.closeModal();event.preventDefault();}else if(app.expandedCal){app.closeAllCalendars();event.preventDefault();}else if(app.showDropdown){app.showDropdown=false;event.preventDefault();}else if(app.exportMode){app.exitExportSelection();event.preventDefault();}
 });
})();
