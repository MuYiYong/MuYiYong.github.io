const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(document.querySelectorAll('main section[id]'));

// Active Nav state sync
const syncActiveNav = () => {
  const scrollPosition = window.scrollY + 100; // offset

  let currentSectionId = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
};

document.addEventListener('scroll', syncActiveNav, { passive: true });
syncActiveNav();

// Language Toggle and Detection Logic
const initLanguage = async () => {
  const toggleBtn = document.getElementById('lang-toggle');
  
  // Apply language
  const setLang = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('preferredLang', lang);
    if (toggleBtn) {
      toggleBtn.textContent = lang === 'en' ? '中' : 'EN';
    }
    document.title = lang === 'en' ? 'Fang Yang | Graph Database Product & Architecture' : '方扬 | 图数据库产品与架构实践';
  };

  // Toggle button event
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
      setLang(currentLang === 'zh-CN' ? 'en' : 'zh-CN');
    });
  }

  // Check saved language
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang) {
    setLang(savedLang);
    return;
  }

  // Auto-detect based on IP
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const zhCountries = ['CN', 'TW', 'HK', 'MO'];
    if (zhCountries.includes(data.country_code)) {
      setLang('zh-CN');
    } else {
      setLang('en');
    }
  } catch (err) {
    console.error('IP detection failed, falling back to browser language:', err);
    // Fallback to browser lang
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.toLowerCase().includes('zh')) {
      setLang('zh-CN');
    } else {
      setLang('en');
    }
  }
};

document.addEventListener('DOMContentLoaded', initLanguage);

// Simple smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});