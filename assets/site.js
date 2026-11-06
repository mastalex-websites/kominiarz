(()=>{'use strict';
const pin=document.querySelector('.lh-pin'),hint=document.querySelector('.hint');
const stops=pin.dataset.stops.split(',').map(Number);
const span=()=>pin.offsetHeight-document.querySelector('.lh').offsetHeight;
const on=document.documentElement.classList.contains('lh-on');
if(on){
  const brush=document.getElementById('brush'),climber=document.getElementById('climber');
  const clamp=x=>Math.min(1,Math.max(0,x));
  pin.addEventListener('lh:frame',e=>{const E=e.detail;
    if(hint)hint.style.opacity=1-clamp(E/.015);
    const c=clamp((E-stops[1])/(stops[2]-stops[1])/.8),b=clamp((E-stops[3]-(stops[4]-stops[3])*.24)/((stops[4]-stops[3])*.66));
    climber.setAttribute('transform',`translate(1745 ${(840-c*640).toFixed(1)})`);
    brush.setAttribute('transform',`translate(4650 ${(150+b*570).toFixed(1)})`);
  });
  document.querySelectorAll('[data-stage]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const i=+a.dataset.stage,t=stops[i]+(stops[i+1]-stops[i])*.6;scrollTo({top:pin.offsetTop+t*span(),behavior:'smooth'})}));
}
document.querySelectorAll('form[data-mail]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const t=[...f.elements].filter(x=>x.name&&x.value).map(x=>x.name+': '+x.value).join('\n');location.href='mailto:kominiarz1981@interia.pl?subject='+encodeURIComponent(f.elements['Tytuł'].value)+'&body='+encodeURIComponent(t)}));
})();
