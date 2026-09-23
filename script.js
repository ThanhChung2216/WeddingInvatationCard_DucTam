const $ = (id) => document.getElementById(id);

const safeText = (id, value) => { const el = $(id); if (el) el.textContent = value; };

let currentSide = 'groom';
let countdownInterval = null;

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

  // Cập nhật class trên body để điều chỉnh theme màu nếu cần
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
  safeText('familyParentsText', data.parents.label);

  // Tiêu đề Countdown
  safeText('countdownTargetTitle', `Đếm ngược đến ${data.ceremony.title}`);
  setupCountdown(data.countdownDate);

  // Khu vực sự kiện & Địa điểm
  safeText('eventSectionTitle', `Chương trình & Địa điểm (${data.name})`);
  safeText('eventSectionDesc', `Trân trọng kính mời quý khách đến chung vui cùng gia đình ${data.name}`);

  // 1. Tiệc mời cơm
  safeText('banquetTag', data.banquet.tag);
  safeText('banquetTime', data.banquet.time);
  safeText('banquetLunar', data.banquet.lunarDate);
  safeText('banquetTitle', data.banquet.title);
  safeText('banquetVenue', data.banquet.venue);
  safeText('banquetAddress', data.banquet.address);
  if ($('banquetMapBtn')) $('banquetMapBtn').href = data.banquet.mapsUrl;

  // 2. Hôn lễ (Thành Hôn / Vu Quy)
  safeText('ceremonyTag', data.ceremony.tag);
  safeText('ceremonyTime', data.ceremony.time);
  safeText('ceremonyLunar', data.ceremony.lunarDate);
  safeText('ceremonyTitle', data.ceremony.title);
  safeText('ceremonyVenue', data.ceremony.venue);
  safeText('ceremonyAddress', data.ceremony.address);
  if ($('ceremonyMapBtn')) $('ceremonyMapBtn').href = data.ceremony.mapsUrl;

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

  $('storyCopy').innerHTML = WEDDING.story.paragraphs.map(p => `<p>${p}</p>`).join('');
  $('rsvpButton').href = WEDDING.contact.rsvpUrl;
  $('brideContact').href = `tel:${WEDDING.contact.bridePhone}`;
  $('groomContact').href = `tel:${WEDDING.contact.groomPhone}`;

  safeText('brideGiftName', WEDDING.gift.bride.name);
  safeText('brideBank', WEDDING.gift.bride.bank);
  safeText('brideAccount', WEDDING.gift.bride.account);
  $('brideQr').src = WEDDING.gift.bride.qr;

  safeText('groomGiftName', WEDDING.gift.groom.name);
  safeText('groomBank', WEDDING.gift.groom.bank);
  safeText('groomAccount', WEDDING.gift.groom.account);
  $('groomQr').src = WEDDING.gift.groom.qr;

  const audio = $('weddingMusic');
  audio.src = WEDDING.music.url;

  const gallery = $('gallery');
  gallery.innerHTML = WEDDING.gallery.map((src, i) => `
    <figure class="gallery-item"><img src="${src}" loading="lazy" alt="Khoảnh khắc ${i + 1}"></figure>
  `).join('');
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
    $('days').textContent = String(days).padStart(2,'0');
    $('hours').textContent = String(hours).padStart(2,'0');
    $('minutes').textContent = String(minutes).padStart(2,'0');
    $('seconds').textContent = String(seconds).padStart(2,'0');
  };
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function openInvitationCard() {
  const cover = $('inviteCover');
  cover.classList.add('opened');
  $('siteShell').setAttribute('aria-hidden', 'false');
  $('loadingScreen').classList.add('hide');

  const audio = $('weddingMusic');
  try {
    audio.play().then(() => {
      $('soundButton').textContent = '❚❚';
    }).catch(() => {
      // Audio autoplay policy
    });
  } catch (_) {}
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
  $('soundButton').addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        $('soundButton').textContent = '❚❚';
      } catch (_) {
        showToast('Hãy chạm lại để bật nhạc.');
      }
    } else {
      audio.pause();
      $('soundButton').textContent = '♫';
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
  $('calendarButton').addEventListener('click', () => {
    const data = currentSide === 'groom' ? WEDDING.groomSide : WEDDING.brideSide;
    const start = new Date(data.countdownDate);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
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
  $('shareButton').addEventListener('click', async () => {
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
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
}

let toastTimer;
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.addEventListener('DOMContentLoaded', () => {
  populateCommonContent();
  
  // Nhận diện bên từ URL (nếu có)
  const initialSide = detectSideFromUrl();
  updateSideContent(initialSide);

  setupSideSelection();
  setupMusic();
  setupCopyButtons();
  setupCalendar();
  setupShare();
  setupReveal();

  setTimeout(() => $('loadingScreen').classList.add('hide'), 300);
});
