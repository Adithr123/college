(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var $=function(s,r){return(r||document).querySelectorAll(s)};
// theme
var root=document.documentElement;
$('#theme')[0].onclick=function(){var dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;root.dataset.theme=dark?'light':'dark'};
// copy email
var toast=$('#toast')[0],tt;
$('[data-copy]').forEach(function(b){b.onclick=function(){
 var done=function(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2200)};
 try{navigator.clipboard.writeText('adith08@gmail.com').then(function(){done('✓ Email copied to clipboard')},function(){done('Email: adith08@gmail.com')})}catch(e){done('Email: adith08@gmail.com')}
}});
// filter
$('.tab').forEach(function(t){t.onclick=function(){
 $('.tab').forEach(function(x){x.setAttribute('aria-pressed',x===t)});
 var f=t.dataset.f;
 $('#experience .card').forEach(function(c){var show=f==='all'||c.dataset.c===f;c.classList.toggle('hide',!show);
  if(show&&window.gsap&&!reduce)gsap.fromTo(c,{opacity:0,y:20,scale:.96},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.6)'})})
}});
// typed roles
var roles=['pediatrician','chemist','tutor','lifeguard','community builder'],ri=0,ci=0,del=false,el=$('#typed')[0];
if(!reduce)(function tick(){var w=roles[ri];ci+=del?-1:1;el.textContent=w.slice(0,ci)||'\u00a0';
 var d=del?45:90;if(!del&&ci===w.length){del=true;d=1400}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=300}setTimeout(tick,d)})();
// scroll progress + active nav
var links=[].slice.call($('nav a.l'));
addEventListener('scroll',function(){
 var h=root.scrollHeight-innerHeight;$('#bar')[0].style.width=(scrollY/h*100)+'%';
 var cur='';$('section').forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});
 links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)})
},{passive:true});
// 3D tilt
if(!reduce&&matchMedia('(hover:hover)').matches)$('.tilt').forEach(function(c){
 c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.style.setProperty('--mx',(x+.5)*100+'%');c.style.setProperty('--my',(y+.5)*100+'%');c.style.transform='perspective(800px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg) translateY(-4px)'});
 c.addEventListener('mouseleave',function(){c.style.transform=''})});
// GSAP animations
function counters(){$('[data-n]').forEach(function(n){var end=+n.dataset.n,d=+(n.dataset.d||0),s=n.dataset.s||'';
 var o={v:0};
 var run=function(){gsap.to(o,{v:end,duration:1.6,ease:'power2.out',onUpdate:function(){n.textContent=o.v.toFixed(d)+s}})};
 reduce?n.textContent=end.toFixed(d)+s:ScrollTrigger.create({trigger:n,start:'top 90%',once:true,onEnter:run})})}
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 counters();
 if(!reduce){
  var nm=$('#name')[0];nm.innerHTML=nm.textContent.split('').map(function(c){return '<span>'+(c===' '?'&nbsp;':c)+'</span>'}).join('');
  gsap.from('#name span',{yPercent:110,opacity:0,rotate:6,stagger:.035,duration:.9,ease:'power4.out',delay:2});
  gsap.from('.role,.meta,.btns,.hint,.ph',{opacity:0,y:20,stagger:.15,delay:2.6,duration:.7});
  $('.card,.stat').forEach(function(c){gsap.from(c,{opacity:0,y:40,duration:.8,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 92%',once:true}})});
  gsap.to('#mol',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 }
}else{$('[data-n]').forEach(function(n){n.textContent=n.dataset.n+(n.dataset.s||'')})}

// preloader
var pre=$('#pre')[0],pn=$('#pn')[0];
if(reduce||!window.gsap){pre.remove()}else{var po={v:0};gsap.to(po,{v:100,duration:1.4,ease:'power2.inOut',onUpdate:function(){pn.textContent=Math.round(po.v)},onComplete:function(){gsap.to(pre,{yPercent:-100,duration:.9,ease:'power4.inOut',onComplete:function(){pre.remove()}})}})}
// marquee
var mt=$('.mt')[0];mt.innerHTML+=mt.innerHTML;
var fine=matchMedia('(pointer:fine)').matches;
// smooth scroll
if(window.Lenis&&window.gsap&&window.ScrollTrigger&&!reduce&&fine){var lenis=new Lenis();lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
 $('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-60})}})})}
// custom cursor + magnetic buttons
if(fine&&window.gsap&&!reduce){document.body.classList.add('fine');
 var dot=$('.cur')[0],ring=$('.ring')[0],dx=gsap.quickTo(dot,'x',{duration:.1}),dy=gsap.quickTo(dot,'y',{duration:.1}),rx=gsap.quickTo(ring,'x',{duration:.45,ease:'power3'}),ry=gsap.quickTo(ring,'y',{duration:.45,ease:'power3'});
 addEventListener('pointermove',function(e){dx(e.clientX);dy(e.clientY);rx(e.clientX);ry(e.clientY)});
 document.addEventListener('pointerover',function(e){ring.classList.toggle('big',!!e.target.closest('a,button,.tilt,.pt-t'))});
 $('.btn').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.3})});b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.8,ease:'elastic.out(1,.4)'})})})}
// scroll-scrubbed statement
var st=$('#stmt')[0];st.innerHTML=st.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
if(window.ScrollTrigger&&!reduce)gsap.fromTo('.w',{opacity:.15},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:st,start:'top 80%',end:'bottom 45%',scrub:true}});
// pinned horizontal achievements (desktop)
if(window.ScrollTrigger&&!reduce)ScrollTrigger.matchMedia({'(min-width: 900px)':function(){var sec=$('#achievements')[0],g=sec.querySelector('.grid');g.classList.add('hz');
 var dist=function(){return Math.max(0,g.scrollWidth-sec.clientWidth)};
 ScrollTrigger.create({trigger:sec,start:'top top+=60',end:function(){return '+='+dist()},pin:true,anticipatePin:1,invalidateOnRefresh:true});
 gsap.to(g,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:sec,start:'top 75%',end:function(){return '+='+(dist()+innerHeight*.75-60)},scrub:.6,invalidateOnRefresh:true}});
 return function(){g.classList.remove('hz')}}});
var pi=[].slice.call($('#ph img')),pc=0,bag=[],pt;
function pnext(){if(!bag.length){bag=pi.map(function(_,k){return k}).sort(function(){return Math.random()-.5});if(bag[0]===pc)bag.push(bag.shift())}return bag.shift()}
function pshow(i){var o=pi[pc],n=pi[i];o.classList.remove('on');o.classList.add('out');n.classList.remove('out');n.style.setProperty('--r',(Math.random()*8-4)+'deg');n.classList.add('on');pc=i}
function pstart(){clearInterval(pt);if(!reduce)pt=setInterval(function(){pshow(pnext())},3600)}
pi[0].classList.remove('on');pc=Math.floor(Math.random()*pi.length);bag=pi.map(function(_,k){return k}).filter(function(k){return k!==pc}).sort(function(){return Math.random()-.5});pi[pc].classList.add('on');
$('#ph')[0].onclick=function(){pshow(pnext());pstart()};pstart();
// molecule canvas: atoms bond near each other and react to the cursor
var cv=$('#mol')[0],cx=cv.getContext('2d'),W,H,atoms=[],mx=-999,my=-999,cols=['#0b8a86','#e8553f','#3a7bd5','#8a5cd6'];
function size(){var r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
function add(x,y){atoms.push({x:x,y:y,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:4+Math.random()*7,c:cols[atoms.length%4|0]});if(atoms.length>90)atoms.shift()}
function init(){size();atoms=[];var n=Math.min(60,Math.floor(W*H/17000));for(var i=0;i<n;i++)add(Math.random()*W,Math.random()*H)}
init();addEventListener('resize',init);
var hero=$('.hero')[0];
hero.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
hero.addEventListener('pointerleave',function(){mx=my=-999});
hero.addEventListener('pointerdown',function(e){if(e.target.closest('a,button'))return;var r=cv.getBoundingClientRect();for(var i=0;i<4;i++)add(e.clientX-r.left+(Math.random()-.5)*30,e.clientY-r.top+(Math.random()-.5)*30)});
var dark=function(){return root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches};
function frame(){
 cx.clearRect(0,0,W,H);var bond=dark()?'61,214,207':'11,138,134';
 atoms.forEach(function(a,i){
  var dx=a.x-mx,dy=a.y-my,d=Math.hypot(dx,dy);if(d<130){a.vx+=dx/d*.06;a.vy+=dy/d*.06}
  a.vx*=.99;a.vy*=.99;a.x+=a.vx;a.y+=a.vy;
  if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
  for(var j=i+1;j<atoms.length;j++){var b=atoms[j],l=Math.hypot(a.x-b.x,a.y-b.y);
   if(l<120){cx.strokeStyle='rgba('+bond+','+(1-l/120)*.55+')';cx.lineWidth=1+(1-l/120)*1.5;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 });
 atoms.forEach(function(a){cx.fillStyle=a.c;cx.globalAlpha=.85;cx.beginPath();cx.arc(a.x,a.y,a.r,0,7);cx.fill()});cx.globalAlpha=1;
 requestAnimationFrame(frame)}
if(reduce){atoms.forEach(function(a){a.vx=a.vy=0});frame=function(){}; }
requestAnimationFrame(function f(){frame();});
})();
