/* Swipe / scroll between the two pages.
   index.html (home): <script src="nav-swipe.js" data-down="work.html"></script>
   work.html: <script src="nav-swipe.js" data-up="index.html"></script> */
(function(){
 var me=document.currentScript,NEXT=me&&me.getAttribute('data-down'),PREV=me&&me.getAttribute('data-up'),busy=false,acc=0,accT=0,ty=null;
 function introRunning(){var b=document.getElementById('blue');return !!b&&b.style.display!=='none'}
 function scrollableUp(el){for(;el&&el!==document.body&&el!==document.documentElement;el=el.parentElement){var cs=getComputedStyle(el);if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollTop>0)return true}return false}
 function atBottom(){return innerHeight+scrollY>=document.documentElement.scrollHeight-160}
 var VT=('onpagereveal' in window);
 function go(url,dir){if(busy)return;busy=true;try{sessionStorage.setItem('swipe',dir+'|'+Date.now())}catch(e){}
  if(VT){location.href=url;return}
  var a=document.documentElement.animate([{transform:'none',opacity:1},{transform:'translateY('+(dir==='down'?-70:70)+'px)',opacity:0}],{duration:240,easing:'ease-in',fill:'forwards'});
  a.onfinish=function(){location.href=url}}
 function down(){if(NEXT&&!introRunning()&&atBottom())go(NEXT,'down')}
 function up(t){if(PREV&&scrollY<=0&&!scrollableUp(t))go(PREV,'up')}
 addEventListener('wheel',function(e){var n=performance.now();if(n-accT>260)acc=0;accT=n;acc+=e.deltaY;
  if(acc>140){acc=0;down()}else if(acc<-140){acc=0;up(e.target)}},{passive:true});
 addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
 addEventListener('touchend',function(e){if(ty===null)return;var dy=e.changedTouches[0].clientY-ty;ty=null;if(dy<-80)down();else if(dy>80)up(e.target)},{passive:true});
 addEventListener('keydown',function(e){if(/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||'')))return;
  if(e.key==='ArrowDown'||e.key==='PageDown')down();else if(e.key==='ArrowUp'||e.key==='PageUp')up(e.target)});
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;var u=a.getAttribute('href');if(NEXT&&u===NEXT){try{sessionStorage.setItem('swipe','down|'+Date.now())}catch(x){}}});
 /* arrival: cross-document view transition when supported (smooth slide, no white flash), simple fade-in otherwise */
 var f=null;try{history.scrollRestoration='manual';var _s=(sessionStorage.getItem('swipe')||'').split('|');if(_s[1]&&Date.now()-(+_s[1])<4000)f=_s[0];sessionStorage.removeItem('swipe')}catch(e){}
 addEventListener('pagereveal',function(e){if(!e.viewTransition)return;if(!f){try{e.viewTransition.skipTransition()}catch(x){}return}document.documentElement.classList.add(f==='up'?'vt-up':'vt-down');e.viewTransition.finished.then(function(){document.documentElement.classList.remove('vt-up','vt-down')})});
 if(f){
  if(!VT)document.documentElement.animate([{transform:'translateY('+(f==='down'?70:-70)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'ease-out'})}
})();
