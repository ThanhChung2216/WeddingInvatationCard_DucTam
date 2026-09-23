const $ = (id) => document.getElementById(id);

const safeText = (id, value) => {
  const el = $(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
};

let currentSide = 'groom';
let countdownInterval = null;

// Biến quản lý tính năng Tự động lướt (Auto Scroll)
let isAutoScrolling = false;
let autoScrollRafId = null;
let autoScrollSpeed = 0.85; // Tốc độ lướt êm ái (~50px/giây), vừa đủ để đọc từng câu chữ
let userInteractedTimeout = null;

function detectSideFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const sideParam = params.get('side') || params.get('nha');
  if (sideParam === 'bride' || sideParam === 'gai' || sideParam === 'nhagai') {
    return 'bride';
  }
  return 'groom';
}

function updateSideContent(sideKey) {
  currentSide = sideKey;
  const isGroom = sideKey === 'groom';
  const data = isGroom ? WEDDING.groomSide : WEDDING.brideSide;

  if (!data) return;

  // Cập nhật class trên body để điều chỉnh theme màu
  document.body.classList.remove('theme-groom', 'theme-bride');
  document.body.classList.add(data.themeClass);

  // Cập nhật trạng thái nút chuyển đổi
  if ($('switchGroomBtn') && $('switchBrideBtn')) {
    $('switchGroomBtn').classList.toggle('active', isGroom);
    $('switchBrideBtn').classList.toggle('active', !isGroom);
  }

  // Hero Section
  const hero = $('heroSection');
  if (hero) {
    if (isGroom) {
      hero.style.backgroundImage = `linear-gradient(rgba(28,38,48,.35), rgba(28,38,48,.55)), url("${data.heroImage}")`;
    } else {
      hero.style.backgroundImage = `linear-gradient(rgba(45,28,32,.35), rgba(45,28,32,.55)), url("${data.heroImage}")`;
    }
  }

  safeText('heroSideBadge', `THIỆP MỜI ${data.name.toUpperCase()}`);
  safeText('heroDate', data.heroDateText);

  // Thông tin phụ mẫu / gia đình
  safeText('introLabel', `LỜI NGỎ TỪ ${data.name.toUpperCase()}`);
  safeText('familyHeading', isGroom ? 'HÔN LỄ CON TRAI CHÚNG TÔI' : 'HÔN LỄ CON / CHÁU GÁI CHÚNG TÔI');
  safeText('familyCoupleHighlight', isGroom ? `Chú rể: ${data.groomName}` : `Cô dâu: ${data.brideName}`);
  if (data.parents) {
    safeText('familyParentsText', data.parents.label);
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

  // Nổi bật thẻ quà tặng tương ứng
  const groomCard = $('groomGiftCard');
  const brideCard = $('brideGiftCard');
  if (groomCard && brideCard) {
    groomCard.classList.toggle('active-gift', isGroom);
    brideCard.classList.toggle('active-gift', !isGroom);
  }

  // Cập nhật URL tham số để chia sẻ link
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

  if (WEDDING.gift) {
    if (WEDDING.gift.bride) {
      safeText('brideGiftName', WEDDING.gift.bride.name);
      safeText('brideBank', WEDDING.gift.bride.bank);
      safeText('brideAccount', WEDDING.gift.bride.account);
      if ($('brideQr')) $('brideQr').src = WEDDING.gift.bride.qr;
    }
    if (WEDDING.gift.groom) {
      safeText('groomGiftName', WEDDING.gift.groom.name);
      safeText('groomBank', WEDDING.gift.groom.bank);
      safeText('groomAccount', WEDDING.gift.groom.account);
      if ($('groomQr')) $('groomQr').src = WEDDING.gift.groom.qr;
    }
  }

  if ($('weddingMusic') && WEDDING.music) {
    $('weddingMusic').src = WEDDING.music.url;
  }

  if ($('gallery') && WEDDING.gallery) {
    $('gallery').innerHTML = WEDDING.gallery.map((src, i) => `
      <figure class="gallery-item"><img src="${src}" loading="lazy" alt="Khoảnh khắc ${i + 1}"></figure>
    `).join('');
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

  // Phát nhạc tự động khi người dùng bấm mở thiệp
  const audio = $('weddingMusic');
  if (audio) {
    audio.play().then(() => {
      if ($('soundButton')) $('soundButton').textContent = '❚❚';
    }).catch(() => {});
  }

  // Sau khi mở thiệp 2 giây, tự động bật tính năng tự động lướt để khách ngắm và đọc
  setTimeout(() => {
    startAutoScroll();
  }, 2200);
}

/* =========================================================
   TÍNH NĂNG TỰ ĐỘNG LƯỚT (AUTO-SCROLL) ÊM ÁI
   ========================================================= */
function startAutoScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;
  updateAutoScrollButtonUI(true);

  let lastTimestamp = performance.now();

  function scrollStep(currentTimestamp) {
    if (!isAutoScrolling) return;

    const elapsed = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;

    // Tính bước cuộn theo thời gian thực tế
    const delta = (autoScrollSpeed * elapsed) / 16.67;
    window.scrollBy(0, delta);

    // Kiểm tra đã cuộn đến đáy trang chưa
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 10);
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
      e.stopPropagation();
      toggleAutoScroll();
    });
  }

  // Nếu người dùng tự cuộn tay hoặc chạm màn hình, tạm dừng tự động lướt
  const pauseOnUserInteraction = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  };

  window.addEventListener('wheel', pauseOnUserInteraction, { passive: true });
  window.addEventListener('touchmove', pauseOnUserInteraction, { passive: true });
}

function setupSideSelection() {
  // Lựa chọn ở màn hình bìa
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

  // Nút chuyển đổi nổi trong trang
  if ($('switchGroomBtn')) {
    $('switchGroomBtn').addEventListener('click', () => {
      updateSideContent('groom');
      showToast('Đã chuyển sang thông tin Nhà Trai 🤵');
    });
  }

  if ($('switchBrideBtn')) {
    $('switchBrideBtn').addEventListener('click', () => {
      updateSideContent('bride');
      showToast('Đã chuyển sang thông tin Nhà Gái 👰');
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

// Khởi chạy ứng dụng
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
    // Đảm bảo loading screen biến mất
    const ls = $('loadingScreen');
    if (ls) {
      ls.classList.add('hide');
      setTimeout(() => { ls.style.display = 'none'; }, 300);
    }
  }
});
