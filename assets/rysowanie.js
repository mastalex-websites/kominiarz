(()=>{
'use strict';
const pin=document.querySelector('.lh-pin');
if(!pin||!document.documentElement.classList.contains('lh-on'))return;
const hero=pin.querySelector('.lh'),svg=pin.querySelector('.lh-art'),text=pin.querySelector('.lh-text'),shade=pin.querySelector('.lh-shade'),bar=pin.querySelector('.lh-bar');
const steps=[...pin.querySelectorAll('.lh-step')];
const nums=s=>(s||'').split(',').filter(Boolean).map(Number);
const T=nums(pin.dataset.stops),CX=nums(pin.dataset.cx);
const textEnd=+pin.dataset.textEnd||.05,fade=+pin.dataset.fade||.014,shadeOff=nums(pin.dataset.shadeOff).length?nums(pin.dataset.shadeOff):[.9,.94];
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=t=>t*t*(3-2*t);
const span=(a,b,x)=>ease(clamp((x-a)/(b-a)));
const base=svg.getAttribute('viewBox').split(' ').map(Number);
const groups=[...svg.querySelectorAll('g[data-s]')].map(g=>{
  const els=[...g.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon')],n=els.length,dur=Math.min(1,Math.max(.22,4/n));
  els.forEach(e=>{e.setAttribute('pathLength','1');e.style.strokeDasharray='1 1';e.style.strokeDashoffset='1';e.style.visibility='hidden'});
  return{els,s:+g.dataset.s,e:+g.dataset.e,dur,last:-1};
});
const fades=[...svg.querySelectorAll('[data-f]')].map(g=>{const r=g.dataset.f.split(' ');return{el:g,s:+r[0],e:+r[1]}});
let vw=base[2],vh=base[3],vy=base[1],focus=.675;
function view(){
  if(!CX.length){const a=hero.offsetWidth/hero.offsetHeight,tall=a<1.2;svg.setAttribute('preserveAspectRatio',tall||a>1.85?'xMidYMax meet':'xMidYMax slice');return}
  const a=hero.offsetWidth/hero.offsetHeight,tall=a<1.45,H=base[3];
  vw=tall?Math.max(H,H*1.35*a):a*H;vh=vw/a;vy=base[1]+H-vh;focus=tall?.5:.675;
}
function camera(E){
  let i=0;while(i<CX.length-1&&i<T.length-2&&E>=T[i+1])i++;
  const q=ease(clamp((E-T[i])/(T[i+1]-T[i])/.34));
  return i?CX[i-1]+(CX[i]-CX[i-1])*q:CX[0];
}
function paint(E){
  for(const g of groups){
    const p=clamp((E-g.s)/(g.e-g.s));
    if(p===g.last)continue;g.last=p;
    const n=g.els.length;
    for(let i=0;i<n;i++){
      const st=n>1?i/(n-1)*(1-g.dur):0,t=clamp((p-st)/g.dur),e=g.els[i];
      e.style.strokeDashoffset=(1-t).toFixed(4);e.style.visibility=t>0?'visible':'hidden';
    }
  }
  for(const f of fades)f.el.style.opacity=clamp((E-f.s)/(f.e-f.s)).toFixed(3);
  if(CX.length)svg.setAttribute('viewBox',`${(camera(E)-vw*focus).toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
  for(const s of steps){
    const a=+s.dataset.s,b=+s.dataset.e,o=Math.min(clamp((E-a)/fade),clamp((b-E)/fade));
    s.style.opacity=o.toFixed(3);s.style.visibility=o>0?'visible':'hidden';s.style.transform=`translate3d(0,${((1-o)*14).toFixed(1)}px,0)`;
  }
  if(text){const a=1-span(0,textEnd,E);text.style.opacity=a.toFixed(3);text.style.visibility=a>0?'visible':'hidden';text.style.transform=`translate3d(0,${((a-1)*40).toFixed(1)}px,0)`}
  if(shade)shade.style.opacity=(span(textEnd*.4,textEnd,E)*(1-span(shadeOff[0],shadeOff[1],E))).toFixed(3);
  if(bar)bar.style.transform=`scaleX(${E.toFixed(4)})`;
  pin.dispatchEvent(new CustomEvent('lh:frame',{detail:E}));
}
let cur=-1,goal=0,raf=0;
function read(){const r=pin.getBoundingClientRect();goal=clamp(-r.top/Math.max(1,pin.offsetHeight-hero.offsetHeight))}
function tick(){raf=0;if(cur<0)cur=goal;cur+=(goal-cur)*.16;if(Math.abs(goal-cur)<.0004)cur=goal;else raf=requestAnimationFrame(tick);paint(cur)}
function kick(){read();if(!raf)raf=requestAnimationFrame(tick)}
addEventListener('scroll',kick,{passive:true});
addEventListener('resize',()=>{view();cur=-1;kick()},{passive:true});
view();read();cur=goal;paint(cur);
})();
