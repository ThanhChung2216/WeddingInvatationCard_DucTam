const $ = (id) => document.getElementById(id);

const safeText = (id, value) => { const el = $(id); if (el) el.textContent = value; };

function formatDateForCover(dateText) {
  const d = new Date(WEDDING.event.dateTime);
  if (Number.isNaN(d.getTime())) return dateText;
  return `${String(d.getDate()).padStart(2, '0')} · ${String(d.getMonth()+1).padStart(2,'0')} · ${d.getFullYear()}`;
}

function populateContent() {
  document.title = `${WEDDING.couple.short} — Wedding Invitation`;
  safeText('coverNames', WEDDING.couple.short);
  safeText('coverDate', formatDateForCover(WEDDING.event.dateText));
  safeText('groomName', WEDDING.couple.groom);
  safeText('brideName', WEDDING.couple.bride);
  safeText('tagline', WEDDING.couple.tagline);
  safeText('heroDate', WEDDING.event.dateText);
  safeText('storyTitle', WEDDING.story.title);

  // Cử hành lễ thành hôn
  const c = WEDDING.ceremony || {};
  safeText('ceremonyTag', c.tag || 'CỬ HÀNH HÔN LỄ');
  safeText('ceremonyTimeBadge', c.time || (WEDDING.event && WEDDING.event.timeText) || '16:00');
  safeText('ceremonyTitle', c.title || 'Lễ Thành Hôn');
  safeText('ceremonyVenue', c.venue || (WEDDING.venue && WEDDING.venue.ceremony) || 'Tư gia nhà trai');
  safeText('ceremonyAddress', c.address || (WEDDING.venue && WEDDING.venue.address) || '');
  if ($('ceremonyMapBtn')) {
    $('ceremonyMapBtn').href = c.mapsUrl || (WEDDING.venue && WEDDING.venue.mapsUrl) || '#';
  }

  // Tiệc rượu / Tiệc cưới
  const r = WEDDING.reception || {};
  safeText('receptionTag', r.tag || 'TIỆC RƯỢU CHUNG VUI');
  safeText('receptionTimeBadge', r.time || (WEDDING.event && WEDDING.event.receptionText) || '17:30');
  safeText('receptionTitle', r.title || 'Tiệc Cưới');
  safeText('receptionVenue', r.venue || (WEDDING.venue && WEDDING.venue.reception) || 'Nhà thờ giáo xứ Dũng Vy');
  safeText('receptionAddress', r.address || (WEDDING.venue && WEDDING.venue.address) || '');
  if ($('receptionMapBtn')) {
    $('receptionMapBtn').href = r.mapsUrl || (WEDDING.venue && WEDDING.venue.mapsUrl) || '#';
  }

  safeText('closingNames', WEDDING.couple.short);
  safeText('footerNames', WEDDING.couple.short);

  $('storyCopy').innerHTML = WEDDING.story.paragraphs.map(p => `<p>${p}</p>`).join('');
  if ($('mapsButton')) $('mapsButton').href = (WEDDING.venue && WEDDING.venue.mapsUrl) || '#';
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

function setupCountdown() {
  const target = new Date(WEDDING.event.dateTime).getTime();
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
  setInterval(tick, 1000);
}

function setupCover() {
  const cover = $('inviteCover');
  $('openInvitation').addEventListener('click', async () => {
    cover.classList.add('opened');
    $('siteShell').setAttribute('aria-hidden', 'false');
    $('loadingScreen').classList.add('hide');
    try {
      await $('weddingMusic').play();
      $('soundButton').textContent = '❚❚';
    } catch (_) {
      // Browser may block audio; user can press the sound button.
    }
  });
}

function setupMusic() {
  const audio = $('weddingMusic');
  $('soundButton').addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); $('soundButton').textContent = '❚❚'; }
      catch (_) { showToast('Hãy chạm lại để bật nhạc.'); }
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
    const start = new Date(WEDDING.event.dateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${WEDDING.couple.short} — Wedding`,
      `LOCATION:${WEDDING.venue.address}`,
      'DESCRIPTION:Thiệp cưới online',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

function setupShare() {
  $('shareButton').addEventListener('click', async () => {
    const shareData = { title: document.title, text: `Mời bạn đến chung vui cùng ${WEDDING.couple.short}`, url: location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('Đã sao chép đường link thiệp.');
    } catch (_) {
      showToast('Hãy sao chép đường link trên thanh địa chỉ.');
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

window.addEventListener('DOMContentLoaded', () => {
  populateContent();
  setupCountdown();
  setupCover();
  setupMusic();
  setupCopyButtons();
  setupCalendar();
  setupShare();
  setupReveal();
  setTimeout(() => $('loadingScreen').classList.add('hide'), 450);
});
