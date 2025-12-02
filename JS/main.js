// ===== Бургер-меню: керування мобільною навігацією =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if(burger && mobileNav){
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      // focus first link for accessibility
      const firstLink = mobileNav.querySelector('a'); if(firstLink) firstLink.focus();
    } else {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  // Закрити мобільне меню при натисканні поза ним або на overlay
  document.addEventListener('click', (e) => {
    if(!mobileNav.classList.contains('open')) return;

    // Якщо клік по самому бургеру — ігноруємо (бургер обробляє toggle)
    if(burger.contains(e.target)) return;

    // Якщо клік всередині навігаційного списку або по кнопкам у мобільному меню — ігноруємо
    if(e.target.closest('.mobile-nav .nav-list, .mobile-nav .btn, .mobile-nav a')) return;

    // Якщо клік по overlay (тобто сам mobileNav) або будь-де поза контентом меню — закриваємо
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    mobileNav.setAttribute('aria-hidden','true');
  });

  // Закриття клавішею Escape для доступності
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && mobileNav.classList.contains('open')){
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      mobileNav.setAttribute('aria-hidden','true');
      burger.focus();
    }
  });
}

// ===== Плавне з'явлення контенту при скролі (reveal) =====
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ===== Простий приклад адаптивної перебудови сітки на JS (необов'язково) =====
function adaptCards(){
  const cols = getComputedStyle(document.documentElement).fontSize; // placeholder для демонстрації
  // тут можна додавати логіку для підвантаження зображень іншого розміру
}
window.addEventListener('resize', adaptCards);
adaptCards();
