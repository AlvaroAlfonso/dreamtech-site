// Counter animation
let statsTriggered = false;
function animateCounter(el, target, suffix, duration=1800){
  let start=0, step=target/(duration/16);
  const t=setInterval(()=>{start+=step;if(start>=target){start=target;clearInterval(t);}el.textContent=Math.floor(start)+suffix;},16);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting&&!statsTriggered){statsTriggered=true;
    document.querySelectorAll('.stat-n[data-target]').forEach(el=>{
      animateCounter(el,parseInt(el.dataset.target),el.dataset.suffix||'');
    });
  }});
},{threshold:0.5});
const statsEl=document.getElementById('stats');
if(statsEl)statsObs.observe(statsEl);

// Reveal on scroll
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

// FAQ
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen)item.classList.add('open');
  });
});

// Nav scroll
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>60);
});

// Smooth anchor
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1);
    const el=document.getElementById(id);
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});