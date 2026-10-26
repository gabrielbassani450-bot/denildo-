/* ═══ Consentimento de cookies + Google Analytics ═══
   Tag G-5QQS0CVFVX. Nada do Google carrega antes do aceite (LGPD, guia de cookies da ANPD).
   Escolha guardada em localStorage (dnCk) por 12 meses; depois é apagada e o aviso volta.
   Uso: <script src="consent.js?v=1" defer></script> no <head> de cada página. */
(function(){
'use strict';
var GA_ID='G-5QQS0CVFVX',KEY='dnCk',MAX_AGE=365*864e5;
var win=window,doc=document,root=doc.documentElement,loaded=false,bar=null,current=null,ro=null;

function read(){
  try{
    var v=JSON.parse(win.localStorage.getItem(KEY)||'null');
    if(v&&(v.s==='granted'||v.s==='denied')){
      if(Date.now()-v.t<MAX_AGE)return v.s;
      win.localStorage.removeItem(KEY);
    }
  }catch(e){}
  return null;
}
function save(s){
  current=s;
  try{win.localStorage.setItem(KEY,JSON.stringify({s:s,t:Date.now(),v:1}))}catch(e){}
}

/* gtag padrão do Google; consentimento começa negado para tudo */
win.dataLayer=win.dataLayer||[];
function gtag(){win.dataLayer.push(arguments)}
if(typeof win.gtag!=='function')win.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});

function loadGA(){
  loaded=true;
  gtag('consent','update',{analytics_storage:'granted'});
  gtag('js',new Date());
  gtag('config',GA_ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
  var s=doc.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
  doc.head.appendChild(s);
}
function clearGACookies(){
  var parts=win.location.hostname.split('.'),domains=[''];
  for(var i=0;i<parts.length-1;i++)domains.push('; domain=.'+parts.slice(i).join('.'));
  doc.cookie.split(';').forEach(function(c){
    var n=c.split('=')[0].trim();
    if(n==='_ga'||n.indexOf('_ga_')===0||n==='_gid'||n.indexOf('_gat')===0){
      domains.forEach(function(d){doc.cookie=n+'=; Max-Age=0; path=/'+d});
    }
  });
}
/* applyX muda só o estado da página; grant/deny também gravam a escolha */
function applyGrant(){
  win['ga-disable-'+GA_ID]=false;
  if(loaded)gtag('consent','update',{analytics_storage:'granted'});
  else loadGA();
}
function applyDeny(){
  if(loaded)gtag('consent','update',{analytics_storage:'denied'});
  win['ga-disable-'+GA_ID]=true;
  clearGACookies();
}
function grant(){save('granted');applyGrant()}
function deny(){save('denied');applyDeny()}
function clearAll(){
  current=null;
  try{win.sessionStorage.clear();win.localStorage.clear()}catch(e){}
  applyDeny();
}

/* ── Aviso (primeiro nível): Recusar e Aceitar com o mesmo peso ── */
var CSS=''+
'.ck{position:fixed;z-index:1100;left:24px;bottom:24px;width:min(400px,calc(100vw - 48px));padding:20px 20px 18px;background:rgba(8,13,24,.96);border:1px solid rgba(192,169,106,.24);border-radius:14px;box-shadow:0 16px 44px rgba(0,0,0,.54);color:#C2D2E8;font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;opacity:1;transform:none;transition:opacity .28s cubic-bezier(.23,1,.32,1),transform .28s cubic-bezier(.23,1,.32,1)}'+
'@starting-style{.ck{opacity:0;transform:translateY(12px)}}'+
'.ck--out{opacity:0;transform:translateY(8px);transition-duration:.18s;pointer-events:none}'+
'.ck__t{margin:0;font-size:13.5px;line-height:1.6;font-weight:300;letter-spacing:0}'+
'.ck__t strong{color:#fff;font-weight:600}'+
'.ck__t a{color:#D4BF8A;text-decoration:underline;text-decoration-color:rgba(212,191,138,.45);text-underline-offset:3px;border:0}'+
'.ck__a{display:flex;gap:10px;margin-top:16px}'+
'.ck__b{flex:1;min-height:44px;padding:10px 16px;border-radius:9999px;border:1px solid rgba(192,169,106,.55);background:rgba(192,169,106,.08);color:#E8EDF5;font:600 14px/1 "DM Sans",system-ui,sans-serif;letter-spacing:.01em;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;transition:background-color .16s ease,border-color .16s ease,transform .12s cubic-bezier(.23,1,.32,1)}'+
'.ck__b:active{transform:scale(.97)}'+
'.ck__b:focus-visible,.ck__t a:focus-visible{outline:2px solid #D4BF8A;outline-offset:2px}'+
'@media(hover:hover) and (pointer:fine){.ck__b:hover{background:rgba(192,169,106,.18);border-color:#C0A96A}.ck__t a:hover{color:#fff}}'+
/* reserva o espaço do aviso: o fim da página e o foco do teclado nunca ficam por baixo dele */
'html.ck-open{scroll-padding-bottom:calc(var(--ckh,200px) + 36px)}'+
'body.ck-open{padding-bottom:calc(var(--ckh,200px) + 36px)}'+
'@media(max-width:960px){.ck{left:12px;right:12px;width:auto;bottom:calc(12px + env(safe-area-inset-bottom,0px));padding:16px 16px 14px}body.ck-open .waf,body.ck-open .sticky{visibility:hidden}}'+
'@media(prefers-reduced-motion:reduce){.ck{transition-property:opacity}}';

function measure(){if(bar)root.style.setProperty('--ckh',bar.offsetHeight+'px')}
/* foco do teclado por baixo do aviso: rola a página até o item aparecer (WCAG 2.4.11) */
function inFixed(el){
  for(;el&&el!==doc.body;el=el.parentElement){if(win.getComputedStyle(el).position==='fixed')return true}
  return false;
}
doc.addEventListener('focusin',function(e){
  if(!bar||bar.contains(e.target)||inFixed(e.target))return;
  var r=e.target.getBoundingClientRect(),top=bar.getBoundingClientRect().top;
  if(r.bottom>top-12)win.scrollBy({top:r.bottom-top+24,behavior:'instant'});
});
function showBar(){
  if(bar||doc.querySelector('[data-ck-panel]'))return;
  if(!doc.getElementById('ckcss')){
    var st=doc.createElement('style');
    st.id='ckcss';
    st.textContent=CSS;
    doc.head.appendChild(st);
  }
  bar=doc.createElement('div');
  bar.className='ck';
  bar.setAttribute('role','region');
  bar.setAttribute('aria-label','Aviso de cookies');
  bar.innerHTML='<p class="ck__t"><strong>Medição de visitas.</strong> Com a sua permissão, usamos cookies do Google Analytics para entender, de forma estatística, como o site é usado e avaliar a divulgação do consultório. Sem ela, nada é ativado. <a href="cookies.html">Política de Cookies</a></p>'+
    '<div class="ck__a"><button type="button" class="ck__b" data-ck="denied">Recusar</button><button type="button" class="ck__b" data-ck="granted">Aceitar</button></div>';
  bar.addEventListener('click',function(e){
    var b=e.target.closest('[data-ck]');
    if(!b)return;
    if(b.getAttribute('data-ck')==='granted')grant();else deny();
    hideBar();
  });
  /* no começo do body: primeiro na ordem de tabulação e de leitura */
  doc.body.insertBefore(bar,doc.body.firstChild);
  doc.body.classList.add('ck-open');
  root.classList.add('ck-open');
  measure();
  if(win.ResizeObserver){ro=new ResizeObserver(measure);ro.observe(bar)}
}
function hideBar(){
  if(!bar)return;
  var el=bar;
  bar=null;
  if(ro){ro.disconnect();ro=null}
  doc.body.classList.remove('ck-open');
  root.classList.remove('ck-open');
  root.style.removeProperty('--ckh');
  el.classList.add('ck--out');
  var gone=false;
  function rm(){if(gone)return;gone=true;if(el.parentNode)el.parentNode.removeChild(el)}
  el.addEventListener('transitionend',rm);
  setTimeout(rm,260);
}

/* ── Página de preferências: [data-ck-state], [data-ck-set], [data-ck-clear] ── */
var MSG={
  granted:'Medição ativada. Você aceitou os cookies do Google Analytics.',
  denied:'Medição desativada. Você recusou os cookies do Google Analytics.',
  none:'Você ainda não escolheu. A medição fica desativada até você aceitar.'
};
/* reescreve o texto com atraso curto para o leitor de tela anunciar mesmo sem mudança */
function announce(el,text){el.textContent='';setTimeout(function(){el.textContent=text},60)}
function paint(speak){
  var s=read()||current||'none';
  Array.prototype.forEach.call(doc.querySelectorAll('[data-ck-state]'),function(el){
    if(speak)announce(el,MSG[s]);else el.textContent=MSG[s];
  });
}
function bindPanel(){
  Array.prototype.forEach.call(doc.querySelectorAll('[data-ck-set]'),function(btn){
    btn.addEventListener('click',function(){
      if(btn.getAttribute('data-ck-set')==='granted')grant();else deny();
      hideBar();
      paint(true);
    });
  });
  Array.prototype.forEach.call(doc.querySelectorAll('[data-ck-clear]'),function(btn){
    btn.addEventListener('click',function(){
      clearAll();
      paint(true);
      var ok=doc.getElementById(btn.getAttribute('data-ck-clear'));
      if(!ok)return;
      var msg=ok.getAttribute('data-msg')||ok.textContent;
      ok.setAttribute('data-msg',msg);
      ok.classList.add('show');
      announce(ok,msg);
    });
  });
  paint(false);
}

/* outra aba ou página restaurada do cache de voltar: relê a escolha */
function sync(){
  var s=read();
  current=s;
  if(s==='granted'){applyGrant();hideBar()}
  else{
    if(loaded||win['ga-disable-'+GA_ID]===false)applyDeny();
    if(s==='denied')hideBar();else showBar();
  }
  paint(false);
}

var choice=read();
current=choice;
if(choice==='granted')loadGA();
else if(choice==='denied')win['ga-disable-'+GA_ID]=true;

function onReady(){
  bindPanel();
  if(!choice)showBar();
}
if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',onReady);else onReady();
win.addEventListener('pageshow',function(e){if(e.persisted)sync()});
win.addEventListener('storage',function(e){if(e.key===KEY||e.key===null)sync()});
})();
