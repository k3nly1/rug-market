const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

if(burger && mobileNav) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    if(!expanded) {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      const firstLink = mobileNav.querySelector('a');
      if(firstLink) firstLink.focus();
    } else {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if(!mobileNav.classList.contains('open')) return;
    if(burger.contains(e.target)) return;
    if(e.target.closest('.mobile-nav .nav-list, .mobile-nav .btn, .mobile-nav a')) return;
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    mobileNav.setAttribute('aria-hidden','true');
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && mobileNav.classList.contains('open')){
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      mobileNav.setAttribute('aria-hidden','true');
      burger.focus();
    }
  });
}

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function adaptCards(){
  const cols = getComputedStyle(document.documentElement).fontSize;
}
window.addEventListener('resize', adaptCards);
adaptCards();
