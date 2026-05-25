
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.06});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

// Badge active on scroll
const sections=['web','marketplace','gmb','whatsapp','ia','mobile'];
const sectionLinks=document.querySelectorAll('.hero-badges .badge');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.getBoundingClientRect().top<200)current=id;
  });
  sectionLinks.forEach(l=>{
    l.classList.toggle('active',l.getAttribute('href')==='#'+current);
  });
});
