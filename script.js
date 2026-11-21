document.addEventListener('DOMContentLoaded', function () {
  // 1. VISITOR COUNTER (LocalStorage)
  const visitorEl = document.getElementById('visitor-count');
  if (visitorEl) {
    let count = parseInt(localStorage.getItem('alpine_visitor_count'), 10);
    count = isNaN(count) ? 1240 : count + 1;
    localStorage.setItem('alpine_visitor_count', count);
    visitorEl.textContent = count.toLocaleString();
  }

  // 2. NAVBAR SCROLL EFFECT, CLICK HIGHLIGHT & SCROLL-SPY DESTINATION TRACKING
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.navbar-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');
  let isClickScrolling = false;
  let scrollTimeout;

  function setActiveNavById(id) {
    if (!id) return;
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isMatch);
    });
  }

  function updateNavbarOnScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Toggle frosted navbar background
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    // Skip scroll-spy briefly while smooth-scrolling from a direct click
    if (isClickScrolling) return;

    // Detect which section is currently in view
    const navOffset = (navbar ? navbar.offsetHeight : 80) + 60;
    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navOffset;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSectionId = section.getAttribute('id');
      }
    });
  
   function initSeeMoreGallery() {
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const extraCards = document.querySelectorAll('.extra-card');

    if (!seeMoreBtn || extraCards.length === 0) return;

    // Prevent attaching duplicate listeners if script runs twice
    if (seeMoreBtn.dataset.listenerAttached === 'true') return;
    seeMoreBtn.dataset.listenerAttached = 'true';

    seeMoreBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Check current visibility of the first hidden card
        const isHidden = extraCards[0].classList.contains('d-none');

        extraCards.forEach(function (card) {
            if (isHidden) {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        });

        // Update button text
        seeMoreBtn.textContent = isHidden ? 'See Less' : 'See More';
    });
}

// Run immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeeMoreGallery);
} else {
    initSeeMoreGallery();
}

    // Ensure the last section highlights when scrolled to the very bottom
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 20 && sections.length) {
      currentSectionId = sections[sections.length - 1].getAttribute('id');
    }

    setActiveNavById(currentSectionId);
  }

  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
  updateNavbarOnScroll(); // Highlight the active destination on initial page load

  // Immediate orange highlight on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navLinks.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');

      // Pause scroll-spy briefly so smooth scrolling doesn't flicker middle tabs
      isClickScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  // 3. UNIFIED LIVE DATE & TIME TICKER (Supports both #aa-tk-* and #ticker-* IDs)
  function refreshAlpineTicker() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString();

    const aaDate = document.getElementById('aa-tk-date');
    const aaTime = document.getElementById('aa-tk-time');
    const oldDate = document.getElementById('ticker-date');
    const oldTime = document.getElementById('ticker-time');

    if (aaDate) aaDate.textContent = dateStr;
    if (aaTime) aaTime.textContent = timeStr;
    if (oldDate) oldDate.textContent = `Date: ${dateStr}`;
    if (oldTime) oldTime.textContent = `Time: ${timeStr}`;
  }

  refreshAlpineTicker();
  setInterval(refreshAlpineTicker, 1000);

  // 4. UNIFIED GEOLOCATION FOR TICKER
  const aaLoc = document.getElementById('aa-tk-location');
  const oldLoc = document.getElementById('ticker-location');

  if ((aaLoc || oldLoc) && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(2);
        const lon = pos.coords.longitude.toFixed(2);
        if (aaLoc) aaLoc.textContent = `Base Coordinates: ${lat}° N, ${lon}° E`;
        if (oldLoc) oldLoc.textContent = `Geo Position: Lat ${lat}°, Lon ${lon}°`;
      },
      () => {
        if (aaLoc) aaLoc.textContent = 'Karachi & Karakoram Base Camp';
        if (oldLoc) oldLoc.textContent = 'Location: Standard Region Detected';
      }
    );
  }

  // 5. LOGIN & REGISTER USING SESSION STORAGE
  const showLoginBtn = document.getElementById('showLoginBtn');
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginBox = document.getElementById('loginBox');
  const registerBox = document.getElementById('registerBox');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const navbarAccountLink = document.getElementById('navbarAccountLink');
  const navbarUserArea = document.getElementById('navbarUserArea');
  const navbarUserName = document.getElementById('navbarUserName');
  const logoutBtn = document.getElementById('logoutBtn');

  function openLoginForm() {
    if (!loginBox || !registerBox) return;
    loginBox.classList.remove('d-none');
    registerBox.classList.add('d-none');
    if (showLoginBtn) showLoginBtn.classList.add('active');
    if (showRegisterBtn) showRegisterBtn.classList.remove('active');
  }

  function openRegisterForm() {
    if (!loginBox || !registerBox) return;
    registerBox.classList.remove('d-none');
    loginBox.classList.add('d-none');
    if (showRegisterBtn) showRegisterBtn.classList.add('active');
    if (showLoginBtn) showLoginBtn.classList.remove('active');
  }

  if (showLoginBtn) showLoginBtn.addEventListener('click', openLoginForm);
  if (switchToLogin) switchToLogin.addEventListener('click', openLoginForm);
  if (showRegisterBtn) showRegisterBtn.addEventListener('click', openRegisterForm);
  if (switchToRegister) switchToRegister.addEventListener('click', openRegisterForm);

  function updateNavbarUser() {
    const activeUser = sessionStorage.getItem('alpine_logged_in_user');
    if (activeUser) {
      if (navbarAccountLink) navbarAccountLink.classList.add('d-none');
      if (navbarUserArea) navbarUserArea.classList.remove('d-none');
      if (navbarUserArea) navbarUserArea.classList.add('d-flex');
      if (navbarUserName) navbarUserName.textContent = `Welcome, ${activeUser}`;
    } else {
      if (navbarAccountLink) navbarAccountLink.classList.remove('d-none');
      if (navbarUserArea) {
        navbarUserArea.classList.add('d-none');
        navbarUserArea.classList.remove('d-flex');
      }
      if (navbarUserName) navbarUserName.textContent = '';
    }
  }

  // Restore the logged-in name after refresh while this browser tab session exists.
  updateNavbarUser();

  if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      // Demo-only account storage. Session Storage is cleared when the tab session ends.
      const accounts = JSON.parse(sessionStorage.getItem('alpine_accounts') || '[]');
      if (accounts.some(account => account.email === email)) {
        alert('This email is already registered in this browser session. Please sign in.');
        openLoginForm();
        document.getElementById('loginEmail').value = email;
        return;
      }

      accounts.push({ name, email, password });
      sessionStorage.setItem('alpine_accounts', JSON.stringify(accounts));
      sessionStorage.setItem('alpine_logged_in_user', name);
      updateNavbarUser();
      alert(`Registration successful! Welcome to Alpine Ascents, ${name}.`);
      this.reset();
      document.getElementById('account').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const accounts = JSON.parse(sessionStorage.getItem('alpine_accounts') || '[]');
      const account = accounts.find(item => item.email === email && item.password === password);

      if (!account) {
        alert('Invalid email or password. Please register first or check your details.');
        return;
      }

      sessionStorage.setItem('alpine_logged_in_user', account.name);
      updateNavbarUser();
      alert(`Welcome back, ${account.name}!`);
      this.reset();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('alpine_logged_in_user');
      updateNavbarUser();
      alert('You have been logged out successfully.');
    });
  }

  // 6. CONTACT FORM ONLY
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      alert('Thank you! Your message has been submitted.');
      this.reset();
    });
  }

  // 7. COMMENT FORM FUNCTIONALITY
  const commentForm = document.getElementById('commentForm');
  const commentList = document.getElementById('commentList');

  if (commentForm && commentList) {
    commentForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = document.getElementById('commentName').value;
      const message = document.getElementById('commentMessage').value;

      const commentBox = document.createElement('div');
      commentBox.classList.add('comment-box');

      const commentName = document.createElement('h5');
      commentName.textContent = name;

      const commentText = document.createElement('p');
      commentText.textContent = message;

      commentBox.append(commentName, commentText);
      commentList.appendChild(commentBox);

      this.reset();
    });
  }
});

// 8. INTERACTIVE MAP SWITCHER FUNCTION
function loadMap(type, name, location) {
  const iframe = document.getElementById('map-iframe');
  const mapTitle = document.getElementById('map-title');
  const mapLoc = document.getElementById('map-location');

  if (mapTitle) {
    mapTitle.innerHTML = `<i class="fa-solid fa-map-location-dot text-warning me-2"></i> ${name}`;
  }
  if (mapLoc) {
    mapLoc.textContent = location;
  }

  const buttons = document.querySelectorAll('#club-list .list-group-item');
  buttons.forEach((btn) => btn.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  if (iframe) {
    const query = encodeURIComponent(location);
    iframe.src = `https://maps.google.com/maps?q=${query}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  }
}
