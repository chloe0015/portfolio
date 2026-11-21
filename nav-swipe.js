/* Swipe / scroll between the two pages.
   home.html : <script src="nav-swipe.js" data-down="index.html"></script>
   index.html: <script src="nav-swipe.js" data-up="home.html"></script> */
(function(){
 var me=document.currentScript,NEXT=me&&me.getAttribute('data-down'),PREV=me&&me.getAttribute('data-up'),busy=false,acc=0,accT=0,ty=null;
 function introRunning(){var b=document.getElementById('blue');return !!b&&b.style.display!=='none'}
 function scrollableUp(el){for(;el&&el!==document.body&&el!==document.documentElement;el=el.parentElement){var cs=getComputedStyle(el);if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollTop>0)return true}return false}
 function atBottom(){return innerHeight+scrollY>=document.documentElement.scrollHeight-160}
 var VT=('onpagereveal' in window);
 function go(url,dir){if(busy)return;busy=true;try{sessionStorage.setItem('swipe',dir)}catch(e){}
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
 /* arrival: cross-document view transition when supported (smooth slide, no white flash), simple fade-in otherwise */
 var f=null;try{f=sessionStorage.getItem('swipe')}catch(e){}
 addEventListener('pagereveal',function(e){if(!e.viewTransition)return;document.documentElement.classList.add(f==='up'?'vt-up':'vt-down');e.viewTransition.finished.then(function(){document.documentElement.classList.remove('vt-up','vt-down')})});
 if(f){setTimeout(function(){try{sessionStorage.removeItem('swipe')}catch(e){}},1500);
  if(!VT)document.documentElement.animate([{transform:'translateY('+(f==='down'?70:-70)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'ease-out'})}
})();
