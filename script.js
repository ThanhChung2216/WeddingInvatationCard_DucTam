const $ = (id) => document.getElementById(id);

const safeText = (id, value) => {
  const el = $(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
};

let currentSide = 'groom';
let countdownInterval = null;

// Quản lý Tự động lướt (Auto Scroll)
let isAutoScrolling = false;
let autoScrollRafId = null;
let autoScrollSpeed = 1.0; // Tốc độ chuẩn (~60px/s), rất êm ái để đọc trên cả mobile và desktop
let particleInterval = null;

function detectSideFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const sideParam = params.get('side') || params.get('nha');
  if (sideParam === 'bride' || sideParam === 'gai' || sideParam === 'nhagai') {
    return 'bride';
  }
  return 'groom';
}

/* =========================================================
   HIỆU ỨNG HẠT ĐỘNG (SPARKLES CHO NHÀ TRAI, CÁNH HOA CHO NHÀ GÁI)
   ========================================================= */
function spawnParticles(sideKey) {
  const container = $('particleContainer');
  if (!container) return;

  container.innerHTML = '';
  if (particleInterval) clearInterval(particleInterval);

  const isGroom = sideKey === 'groom';
  const particleClass = isGroom ? 'sparkle-particle' : 'petal-particle';

  // Khởi tạo các hạt
  for (let i = 0; i < 15; i++) {
    createParticle(container, particleClass, isGroom, true);
  }

  // Tạo liên tục các hạt mới
  particleInterval = setInterval(() => {
    if (container.children.length < 24) {
      createParticle(container, particleClass, isGroom, false);
    }
  }, 900);
}

function createParticle(container, className, isGroom, randomStart) {
  const p = document.createElement('div');
  p.className = className;
  p.style.left = `${Math.random() * 100}vw`;

  const duration = isGroom ? 5 + Math.random() * 4 : 7 + Math.random() * 5;
  p.style.animationDuration = `${duration}s`;

  if (randomStart) {
    p.style.animationDelay = `-${Math.random() * duration}s`;
  } else {
    p.style.animationDelay = '0s';
  }

  // Kích cỡ ngẫu nhiên nhẹ
  const scale = 0.7 + Math.random() * 0.6;
  p.style.transform = `scale(${scale})`;

  container.appendChild(p);

  setTimeout(() => {
    if (p.parentNode === container) {
      container.removeChild(p);
    }
  }, duration * 1000);
}

/* =========================================================
   CẬP NHẬT NỘI DUNG THEO BÊN (NHÀ TRAI / NHÀ GÁI)
   ========================================================= */
function updateSideContent(sideKey) {
  currentSide = sideKey;
  const isGroom = sideKey === 'groom';
  const data = isGroom ? WEDDING.groomSide : WEDDING.brideSide;

  if (!data) return;

  // Cập nhật Theme Class trên Body
  document.body.classList.remove('theme-groom', 'theme-bride');
  document.body.classList.add(data.themeClass);

  // Kích hoạt hiệu ứng nền động tương ứng
  spawnParticles(sideKey);

  // Cập nhật trạng thái nút chuyển đổi nổi
  if ($('switchGroomBtn') && $('switchBrideBtn')) {
    $('switchGroomBtn').classList.toggle('active', isGroom);
    $('switchBrideBtn').classList.toggle('active', !isGroom);
  }

  // Hero Section Background
  const hero = $('heroSection');
  if (hero) {
    hero.style.backgroundImage = `url("${data.heroImage}")`;
    hero.style.backgroundPosition = data.heroPosition || 'center top';
  }

  safeText('heroSideBadge', `THIỆP MỜI ${data.name.toUpperCase()}`);
  safeText('heroDate', data.heroDateText);

  // Thông tin phụ mẫu / gia đình
  safeText('introLabel', `LỜI NGỎ TỪ ${data.name.toUpperCase()}`);
  safeText('familyHeading', isGroom ? 'HÔN LỄ CON TRAI CHÚNG TÔI' : 'HÔN LỄ CON / CHÁU GÁI CHÚNG TÔI');
  safeText('familyCoupleHighlight', isGroom ? `Chú rể: ${data.groomName}` : `Cô dâu: ${data.brideName}`);
  if (data.parents) {
    const parentsContainer = $('familyParentsText');
    if (parentsContainer) {
      if (Array.isArray(data.parents.lines)) {
        parentsContainer.innerHTML = data.parents.lines
          .map(line => `<span class="parent-line">${line}</span>`)
          .join('');
      } else {
        safeText('familyParentsText', data.parents.label);
      }
    }
  }

  // Tiêu đề Countdown
  if (data.ceremony) {
    safeText('countdownTargetTitle', `Đếm ngược đến ${data.ceremony.title}`);
  }
  setupCountdown(data.countdownDate);

  // Khu vực sự kiện & Địa điểm
  safeText('eventSectionTitle', `Chương trình & Địa điểm (${data.name})`);
  safeText('eventSectionDesc', `Trân trọng kính mời quý khách đến chung vui cùng gia đình ${data.name}`);

  // 1. Tiệc mời cơm
  if (data.banquet) {
    safeText('banquetTag', data.banquet.tag);
    safeText('banquetTime', data.banquet.time);
    safeText('banquetLunar', data.banquet.lunarDate);
    safeText('banquetTitle', data.banquet.title);
    safeText('banquetVenue', data.banquet.venue);
    safeText('banquetAddress', data.banquet.address);
    if ($('banquetMapBtn')) $('banquetMapBtn').href = data.banquet.mapsUrl || '#';
  }

  // 2. Hôn lễ (Thành Hôn / Vu Quy)
  if (data.ceremony) {
    safeText('ceremonyTag', data.ceremony.tag);
    safeText('ceremonyTime', data.ceremony.time);
    safeText('ceremonyLunar', data.ceremony.lunarDate);
    safeText('ceremonyTitle', data.ceremony.title);
    safeText('ceremonyVenue', data.ceremony.venue);
    safeText('ceremonyAddress', data.ceremony.address);
    if ($('ceremonyMapBtn')) $('ceremonyMapBtn').href = data.ceremony.mapsUrl || '#';
  }

  // Hiển thị phần Hộp mừng cưới / QR chuyển khoản CHỈ TRÊN THIỆP NHÀ TRAI
  const giftSection = $('giftSection');
  if (giftSection) {
    giftSection.style.display = isGroom ? '' : 'none';
  }

  // Cập nhật URL tham số
  try {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('side', sideKey);
    window.history.replaceState({ side: sideKey }, '', newUrl.toString());
  } catch (_) {}
}

function populateCommonContent() {
  document.title = `${WEDDING.couple.short} — Wedding Invitation`;
  safeText('coverNames', WEDDING.couple.short);
  safeText('groomName', WEDDING.couple.groom);
  safeText('brideName', WEDDING.couple.bride);
  safeText('tagline', WEDDING.couple.tagline);
  safeText('storyTitle', WEDDING.story.title);
  safeText('closingNames', WEDDING.couple.short);
  safeText('footerNames', WEDDING.couple.short);

  if ($('storyCopy') && WEDDING.story && WEDDING.story.paragraphs) {
    $('storyCopy').innerHTML = WEDDING.story.paragraphs.map(p => `<p>${p}</p>`).join('');
  }
  if ($('rsvpButton')) $('rsvpButton').href = WEDDING.contact.rsvpUrl || '#';
  if ($('brideContact')) $('brideContact').href = `tel:${WEDDING.contact.bridePhone}`;
  if ($('groomContact')) $('groomContact').href = `tel:${WEDDING.contact.groomPhone}`;

  // Nạp thông tin mừng cưới & QR chuyển khoản Nhà Trai
  if (WEDDING.gift && WEDDING.gift.groom) {
    safeText('giftGroomName', WEDDING.gift.groom.name || WEDDING.groomSide?.groomName || WEDDING.couple.groom);
    safeText('giftGroomBank', WEDDING.gift.groom.bank || 'Ngân hàng');
    safeText('giftGroomAccount', WEDDING.gift.groom.account || '0000000000');
    safeText('giftGroomAccountName', WEDDING.gift.groom.accountName || WEDDING.gift.groom.name || WEDDING.groomSide?.groomName || WEDDING.couple.groom);
    if ($('giftGroomQr') && WEDDING.gift.groom.qr) {
      $('giftGroomQr').src = WEDDING.gift.groom.qr;
    }
  }

  if ($('weddingMusic') && WEDDING.music) {
    $('weddingMusic').src = WEDDING.music.url;
  }

  if ($('gallery') && WEDDING.gallery) {
    $('gallery').innerHTML = WEDDING.gallery.map((src, i) => `
      <figure class="gallery-item" data-src="${src}">
        <img src="${src}" loading="lazy" decoding="async" alt="Khoảnh khắc ${i + 1}">
      </figure>
    `).join('');
    setupLightbox();
  }
}

function setupCountdown(targetDateStr) {
  if (countdownInterval) clearInterval(countdownInterval);
  const target = new Date(targetDateStr).getTime();

  const tick = () => {
    const now = Date.now();
    let diff = target - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    diff %= 86400000;
    const hours = Math.floor(diff / 3600000);
    diff %= 3600000;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    safeText('days', String(days).padStart(2, '0'));
    safeText('hours', String(hours).padStart(2, '0'));
    safeText('minutes', String(minutes).padStart(2, '0'));
    safeText('seconds', String(seconds).padStart(2, '0'));
  };
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function openInvitationCard() {
  const cover = $('inviteCover');
  if (cover) cover.classList.add('opened');
  
  const siteShell = $('siteShell');
  if (siteShell) siteShell.setAttribute('aria-hidden', 'false');

  const loading = $('loadingScreen');
  if (loading) {
    loading.classList.add('hide');
    setTimeout(() => { loading.style.display = 'none'; }, 300);
  }

  // Tự động phát nhạc khi mở thiệp
  const audio = $('weddingMusic');
  const soundBtn = $('soundButton');
  if (audio) {
    audio.play().then(() => {
      if (soundBtn) {
        soundBtn.textContent = '❚❚';
        soundBtn.classList.add('playing');
      }
    }).catch(() => {});
  }

  // Tự động kích hoạt tính năng lướt êm ái sau 2.2 giây
  setTimeout(() => {
    startAutoScroll();
  }, 2200);
}

/* =========================================================
   TỰ ĐỘNG LƯỚT (AUTO-SCROLL)
   ========================================================= */
function startAutoScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;
  document.documentElement.classList.add('is-autoscrolling');
  document.body.classList.add('is-autoscrolling');
  updateAutoScrollButtonUI(true);

  let lastTimestamp = performance.now();

  function scrollStep(currentTimestamp) {
    if (!isAutoScrolling) return;

    const elapsed = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;

    const delta = (autoScrollSpeed * elapsed) / 16.67;
    window.scrollBy(0, delta);

    const isAtBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 15);
    if (isAtBottom) {
      stopAutoScroll();
      showToast('Đã xem hết thiệp cưới ✨');
      return;
    }

    autoScrollRafId = requestAnimationFrame(scrollStep);
  }

  autoScrollRafId = requestAnimationFrame(scrollStep);
}

function stopAutoScroll() {
  if (!isAutoScrolling) return;
  isAutoScrolling = false;
  document.documentElement.classList.remove('is-autoscrolling');
  document.body.classList.remove('is-autoscrolling');
  if (autoScrollRafId) {
    cancelAnimationFrame(autoScrollRafId);
    autoScrollRafId = null;
  }
  updateAutoScrollButtonUI(false);
}

function toggleAutoScroll() {
  if (isAutoScrolling) {
    stopAutoScroll();
    showToast('Đã tạm dừng tự động lướt');
  } else {
    startAutoScroll();
    showToast('Bắt đầu tự động lướt đọc thiệp ✨');
  }
}

function updateAutoScrollButtonUI(active) {
  const btn = $('autoScrollBtn');
  const icon = $('scrollIcon');
  const text = $('scrollText');
  if (!btn) return;

  if (active) {
    btn.classList.add('is-scrolling');
    if (icon) icon.textContent = '❚❚';
    if (text) text.textContent = 'Tạm dừng';
  } else {
    btn.classList.remove('is-scrolling');
    if (icon) icon.textContent = '▶';
    if (text) text.textContent = 'Tự động lướt';
  }
}

function setupAutoScroll() {
  const btn = $('autoScrollBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleAutoScroll();
    });
  }

  // Tạm dừng khi người dùng chủ động vuốt ngón tay để đọc
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isAutoScrolling && e.touches && e.touches.length > 0) {
      const touchCurrentY = e.touches[0].clientY;
      if (Math.abs(touchCurrentY - touchStartY) > 12) {
        stopAutoScroll();
      }
    }
  }, { passive: true });

  window.addEventListener('wheel', (e) => {
    if (isAutoScrolling && Math.abs(e.deltaY) > 2) {
      stopAutoScroll();
    }
  }, { passive: true });
}

function setupSideSelection() {
  if ($('chooseGroomSide')) {
    $('chooseGroomSide').addEventListener('click', () => {
      updateSideContent('groom');
      openInvitationCard();
    });
  }

  if ($('chooseBrideSide')) {
    $('chooseBrideSide').addEventListener('click', () => {
      updateSideContent('bride');
      openInvitationCard();
    });
  }

  if ($('switchGroomBtn')) {
    $('switchGroomBtn').addEventListener('click', () => {
      updateSideContent('groom');
      showToast('Đã chuyển sang phong cách Nhà Trai 🤵');
    });
  }

  if ($('switchBrideBtn')) {
    $('switchBrideBtn').addEventListener('click', () => {
      updateSideContent('bride');
      showToast('Đã chuyển sang phong cách Nhà Gái 👰');
    });
  }
}

function setupMusic() {
  const audio = $('weddingMusic');
  const soundBtn = $('soundButton');
  if (!audio || !soundBtn) return;

  soundBtn.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        soundBtn.textContent = '❚❚';
        soundBtn.classList.add('playing');
      } catch (_) {
        showToast('Hãy chạm lại để bật nhạc.');
      }
    } else {
      audio.pause();
      soundBtn.textContent = '♫';
      soundBtn.classList.remove('playing');
    }
  });
}

function setupLightbox() {
  const lightbox = $('galleryLightbox');
  const lightboxImg = $('lightboxImg');
  const closeBtn = $('lightboxClose');
  const overlay = $('lightboxOverlay');
  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img')?.src;
      if (src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = $(btn.dataset.copyTarget)?.textContent?.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        showToast('Đã sao chép số tài khoản.');
      } catch (_) {
        showToast(`Số tài khoản: ${value}`);
      }
    });
  });
}

function setupCalendar() {
  const btn = $('calendarButton');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const data = currentSide === 'groom' ? WEDDING.groomSide : WEDDING.brideSide;
    const start = new Date(data.countdownDate);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${WEDDING.couple.short} — ${data.ceremony.title} (${data.name})`,
      `LOCATION:${data.ceremony.venue}, ${data.ceremony.address}`,
      `DESCRIPTION:Thiệp cưới ${WEDDING.couple.short} (${data.name})`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-${currentSide}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

function setupShare() {
  const btn = $('shareButton');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const data = currentSide === 'groom' ? WEDDING.groomSide : WEDDING.brideSide;
    const shareUrl = `${window.location.origin}${window.location.pathname}?side=${currentSide}`;
    const shareData = {
      title: `${WEDDING.couple.short} — Thiệp cưới (${data.name})`,
      text: `Trân trọng kính mời bạn đến chung vui cùng gia đình chúng mình (${data.name}) 💍`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(`Đã sao chép link thiệp ${data.name}!`);
    } catch (_) {
      showToast(shareUrl);
    }
  });
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(item => observer.observe(item));
}

let toastTimer;
function showToast(message) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    populateCommonContent();
    const initialSide = detectSideFromUrl();
    updateSideContent(initialSide);

    setupSideSelection();
    setupAutoScroll();
    setupMusic();
    setupCopyButtons();
    setupCalendar();
    setupShare();
    setupReveal();
  } catch (err) {
    console.error("Init error:", err);
  } finally {
    const ls = $('loadingScreen');
    if (ls) {
      ls.classList.add('hide');
      setTimeout(() => { ls.style.display = 'none'; }, 300);
    }
  }
});
