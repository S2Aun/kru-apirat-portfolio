/**
 * วPA ครูคอมพิวเตอร์: นายอภิรัตน์ เสาวภาคย์รัตนชาติ
 * Interactive Logic & Dynamic Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initWorkloadTabs();
  initDimensionTabs();
  initScrollSpyAndBackToTop();
  loadCertificates();
  initGearParallax();
  initEditorialEffects();
  initSpotlightAndTilt();
  initGlidingTabs();
  initReadingProgressBar();
  initScrollReveal();
  initNumberTicker();
  initFloatingDock();
});

/* =========================================================
   Theme Toggle (Dark / Light Mode)
   ========================================================= */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
  const urlParams = new URLSearchParams(searchStr);
  const themeParam = urlParams.get('theme');

  // ล้างค่าเก่าที่อาจค้างใน localStorage เพื่อให้เปิดเว็บเป็นธีมกลางคืนก่อนเสมอ
  try {
    if (localStorage.getItem('pa-theme') === 'light') {
      localStorage.removeItem('pa-theme');
    }
  } catch (e) {}

  // กำหนดธีมเริ่มต้น: เป็นธีมกลางคืน (dark) ก่อนเสมอ
  // หากผู้ใช้กดสลับธีมในแท็บนี้ จะจำใน sessionStorage ชั่วคราว
  let currentTheme = 'dark';
  try {
    currentTheme = themeParam || sessionStorage.getItem('pa-theme') || 'dark';
  } catch (e) {
    currentTheme = themeParam || 'dark';
  }

  document.body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    try {
      sessionStorage.setItem('pa-theme', newTheme);
    } catch (e) {}
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
    icon.style.color = '#f59e0b';
  } else {
    icon.className = 'fa-solid fa-moon';
    icon.style.color = '';
  }
}

/* =========================================================
   Mobile Navigation
   ========================================================= */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Dropdown toggle on click (desktop click & mobile tap)
  const dropdownItems = navMenu.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('open');
        dropdownItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
        e.preventDefault();
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) {
      dropdownItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Close menu and dropdowns when clicking on any terminal link
  navMenu.querySelectorAll('.nav-link:not(.nav-dropdown-trigger), .dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      dropdownItems.forEach(item => item.classList.remove('open'));
    });
  });
}

/* =========================================================
   Workload Tabs
   ========================================================= */
function initWorkloadTabs() {
  const tabBtns = document.querySelectorAll('#workloadTabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.card-workload .tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* =========================================================
   Indicator Dimension Tabs
   ========================================================= */
function initDimensionTabs() {
  const dimBtns = document.querySelectorAll('.indicator-dimension-tabs .dim-btn');
  dimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dimBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.dim-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-dim');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        // Ensure at least the first indicator item is opened for immediate visual feedback
        const hasOpen = targetPane.querySelector('.indicator-item.open');
        if (!hasOpen) {
          const firstItem = targetPane.querySelector('.indicator-item');
          if (firstItem) firstItem.classList.add('open');
        }
      }
    });
  });
}

/* =========================================================
   Accordion Toggle
   ========================================================= */
function toggleAccordion(header) {
  const item = header.closest('.indicator-item');
  if (!item) return;
  item.classList.toggle('open');
}

/* =========================================================
   ScrollSpy & Back to Top
   ========================================================= */
function initScrollSpyAndBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    }

    // Active nav link spy & Dropdown parent highlight mapping
    const dropdownMap = {
      'challenge': 'navDropdownChallenge',
      'achievements': 'navDropdownChallenge',
      'videos': 'navDropdownChallenge',
      'indicators': 'navDropdownIndicators',
      'school-duty': 'navDropdownIndicators'
    };

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Also highlight parent dropdown if current section belongs to a dropdown group
        if (dropdownMap[sectionId]) {
          const parentDropdown = document.getElementById(dropdownMap[sectionId]);
          if (parentDropdown) {
            parentDropdown.classList.add('active');
          }
        }
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* =========================================================
   Load & Filter Certificates Showcase (126 Items)
   ========================================================= */
let allCertificates = [];

async function loadCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;

  try {
    const res = await fetch('assets/certificates.json');
    allCertificates = await res.json();
    // Always ensure sorted by newest date first
    allCertificates.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    renderCertificates(allCertificates);
    initCertFilters();
  } catch (err) {
    console.error('Failed to load certificates.json:', err);
    grid.innerHTML = `
      <div class="empty-certs" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <p><i class="fa-solid fa-triangle-exclamation color-amber"></i> ไม่สามารถโหลดข้อมูลเกียรติบัตรอัตโนมัติได้ สามารถเปิดดูผ่าน Google Drive โดยตรง</p>
      </div>
    `;
  }
}

function renderCertificates(certs) {
  const grid = document.getElementById('certGrid');
  if (!grid) return;

  const counterBadge = document.getElementById('certCounterBadge');
  if (counterBadge) {
    const isFiltered = certs.length !== allCertificates.length;
    counterBadge.innerHTML = `
      <i class="fa-solid fa-certificate text-amber"></i> 
      แสดง <strong>${certs.length}</strong> รายการ ${isFiltered ? `<span style="opacity: 0.8; font-weight: normal;">(จากทั้งหมด ${allCertificates.length} รายการ)</span>` : ''}
    `;
  }

  if (certs.length === 0) {
    grid.innerHTML = `
      <div class="empty-certs" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-subtle);">
        <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 0.5rem; display: block;"></i>
        <p>ไม่พบรายการเกียรติบัตรที่ค้นหา</p>
      </div>
    `;
    return;
  }

  const html = certs.map((c) => {
    const isPdf = c.type === 'PDF';
    const iconClass = isPdf ? 'fa-file-pdf color-red' : 'fa-file-image color-cyan';
    const fileUrl = encodeURI(c.path);

    const thumbSrc = encodeURI(c.thumb || c.path);
    const thumbHtml = `
      <div class="cert-card-preview-thumb">
        <img src="${thumbSrc}" alt="${c.title}" class="cert-card-thumb-img" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'cert-card-thumb-pdf\\'><i class=\\'fa-solid ${iconClass}\\'></i><span>${c.type || 'DOC'}</span></div>'">
      </div>
    `;

    return `
      <div class="cert-card" data-category="${c.category}" onclick="openCertModal('${encodeURIComponent(JSON.stringify(c))}')" title="คลิกเพื่อเปิดดูเอกสารตัวจริง">
        <div class="cert-card-glare" aria-hidden="true"></div>
        ${thumbHtml}
        <div class="cert-top">
          <span class="badge ${c.badgeClass}">${c.category}</span>
          <span class="cert-type-pill"><i class="fa-solid ${iconClass}"></i> ${c.type || 'DOC'}</span>
        </div>
        <div class="cert-date-row">
          <span class="cert-date-badge"><i class="fa-regular fa-calendar-check"></i> ${c.dateThai || ''}</span>
        </div>
        <h4 class="cert-title" title="${c.title}">${c.title}</h4>
        <button class="cert-btn" type="button">
          <i class="fa-regular fa-eye"></i> ดูเอกสารเกียรติบัตร
        </button>
      </div>
    `;
  }).join('');

  grid.innerHTML = html;
  if (typeof attachSpotlightToCards === 'function') {
    attachSpotlightToCards(grid.querySelectorAll('.cert-card'));
  }
}

function initCertFilters() {
  const filterBtns = document.querySelectorAll('#certFilterBtns .filter-btn');
  const searchInput = document.getElementById('certSearchInput');

  function applyFilterAndSearch() {
    const activeBtn = document.querySelector('#certFilterBtns .filter-btn.active');
    const selectedCat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = allCertificates.filter(c => {
      const matchCat = (selectedCat === 'all') || (c.category === selectedCat);
      const matchQuery = !query || c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    renderCertificates(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilterAndSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSearch);
  }
}

/* =========================================================
   Modal Dialogs & Google Drive Openers
   ========================================================= */
const DRIVE_BASE_URL = 'https://drive.google.com/drive/folders/13OMmFMrFZZ9Al9NEbEbSGt9JUeeLEJ4G?usp=sharing';

function openDriveFolder(subfolderPath) {
  const modal = document.getElementById('modalViewer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) {
    window.open(DRIVE_BASE_URL, '_blank');
    return;
  }

  title.innerHTML = `<i class="fa-solid fa-folder-open color-amber"></i> โฟลเดอร์สำหรับใส่รูปภาพ`;
  body.innerHTML = `
    <div style="text-align: left; line-height: 1.7;">
      <div style="background: var(--bg-card-alt); padding: 1rem; border-radius: 8px; margin-bottom: 1.2rem;">
        <p style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">
          <i class="fa-solid fa-folder"></i> ตำแหน่งโฟลเดอร์:
        </p>
        <code style="font-family: monospace; font-size: 0.9rem; word-break: break-all;">G:\\ไดรฟ์ของฉัน\\วิทยฐานะ อั้น\\Pic\${subfolderPath}</code>
      </div>

      <h5 style="font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.5rem;">
        <i class="fa-solid fa-circle-info color-blue"></i> วิธีการนำรูปภาพมาใส่:
      </h5>
      <ol style="padding-left: 1.3rem; margin-bottom: 1.5rem; font-size: 0.95rem; color: var(--text-muted);">
        <li>เปิด File Explorer ในเครื่องคอมพิวเตอร์ของคุณ</li>
        <li>ไปที่ <strong>G:\\ไดรฟ์ของฉัน\\วิทยฐานะ อั้น\\Pic\${subfolderPath}</strong></li>
        <li>คัดลอกไฟล์รูปภาพผลงานของคุณครูมาวางในโฟลเดอร์นี้</li>
        <li>ระบบจะซิงค์รูปภาพขึ้นสู่ Google Drive ออนไลน์ให้โดยอัตโนมัติ</li>
      </ol>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="closeModal()">ปิดหน้าต่าง</button>
        <a href="${DRIVE_BASE_URL}" target="_blank" class="btn btn-primary">
          <i class="fa-brands fa-google-drive"></i> เปิดโฟลเดอร์ใน Google Drive
        </a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function openCertModal(encodedData) {
  const data = JSON.parse(decodeURIComponent(encodedData));
  const modal = document.getElementById('modalViewer');
  const box = modal ? modal.querySelector('.modal-box') : null;
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  if (box) box.classList.add('modal-box-cert');

  const fileUrl = encodeURI(data.path);
  const isPdf = data.type === 'PDF';
  const iconClass = isPdf ? 'fa-file-pdf color-red' : 'fa-file-image color-cyan';

  title.innerHTML = `
    <div class="modal-cert-header-content">
      <span class="cert-modal-type-badge"><i class="fa-solid ${iconClass}"></i> ${data.type || 'DOCUMENT'}</span>
      <span class="modal-cert-title-text" title="${data.title}">${data.title}</span>
    </div>
  `;

  let previewHtml = '';
  if (isPdf) {
    previewHtml = `
      <div class="cert-preview-frame-wrap">
        <iframe src="${fileUrl}#view=FitH" class="cert-preview-iframe" title="${data.title}"></iframe>
        <div class="cert-preview-fallback">
          <span><i class="fa-solid fa-circle-info"></i> หากเอกสารไม่แสดงอัตโนมัติ สามารถกดปุ่มเปิดดูหรือดาวน์โหลดได้</span>
          <a href="${fileUrl}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> เปิดดูไฟล์ PDF เต็มจอ</a>
        </div>
      </div>
    `;
  } else {
    previewHtml = `
      <div class="cert-preview-img-wrap">
        <a href="${fileUrl}" target="_blank" title="คลิกเพื่อดูรูปภาพขนาดเต็มในหน้าต่างใหม่">
          <img src="${fileUrl}" alt="${data.title}" class="cert-preview-img">
        </a>
        <div class="cert-preview-tip"><i class="fa-solid fa-magnifying-glass-plus"></i> คลิกที่รูปภาพเพื่อเปิดดูขนาดใหญ่เต็มจอ</div>
      </div>
    `;
  }

  body.innerHTML = `
    <div class="cert-modal-content">
      <div class="cert-modal-meta">
        <span class="badge ${data.badgeClass}">${data.category}</span>
        <span class="cert-modal-date"><i class="fa-regular fa-calendar-check color-cyan"></i> วันที่เอกสาร: <strong>${data.dateThai || '-'}</strong></span>
        <span class="cert-file-name" title="${data.filename}"><i class="fa-regular fa-file"></i> ${data.filename}</span>
      </div>

      ${previewHtml}

      <div class="cert-modal-actions">
        <a href="${fileUrl}" target="_blank" class="btn btn-primary">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> เปิดดูเต็มจอ
        </a>
        <a href="${fileUrl}" download="${data.filename}" class="btn btn-secondary">
          <i class="fa-solid fa-download"></i> ดาวน์โหลด
        </a>
        <button class="btn btn-outline" onclick="closeModal()">
          <i class="fa-solid fa-xmark"></i> ปิด
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/* =========================================================
   Avatar Photo Switcher
   ========================================================= */
function switchAvatar(type) {
  const avatarImg = document.getElementById('mainAvatarImg');
  const btnOfficial = document.getElementById('btnAvatarOfficial');
  const btnSuit = document.getElementById('btnAvatarSuit');

  if (!avatarImg) return;

  if (type === 'suit') {
    avatarImg.src = 'assets/teacher_suit.png';
    if (btnSuit) btnSuit.classList.add('active');
    if (btnOfficial) btnOfficial.classList.remove('active');
  } else {
    avatarImg.src = 'assets/teacher_official.png';
    if (btnOfficial) btnOfficial.classList.add('active');
    if (btnSuit) btnSuit.classList.remove('active');
  }
}

/* =========================================================
   Image Modal Lightbox
   ========================================================= */
function openImageModal(imgSrc, titleText, descText) {
  const modal = document.getElementById('modalViewer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  title.innerHTML = `<i class="fa-solid fa-image color-cyan"></i> ${titleText || 'ดูรูปภาพสื่อการเรียนรู้'}`;
  body.innerHTML = `
    <div style="text-align: center;">
      <div style="max-height: 65vh; overflow-y: auto; margin-bottom: 1rem; border-radius: 8px; background: #000; display: flex; align-items: center; justify-content: center; padding: 0.5rem;">
        <img src="${imgSrc}" alt="${titleText}" style="max-width: 100%; max-height: 62vh; object-fit: contain; border-radius: 4px;">
      </div>
      ${descText ? `<p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.2rem; text-align: left; background: var(--bg-card-alt); padding: 0.8rem 1rem; border-radius: 6px;">${descText}</p>` : ''}
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="closeModal()">ปิดหน้าต่าง</button>
        <a href="${imgSrc}" download class="btn btn-primary"><i class="fa-solid fa-download"></i> ดาวน์โหลดรูปภาพ</a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/* =========================================================
   Video Modal Viewer (ว9)
   ========================================================= */
function openVideoModal(videoTitle, durationText, folderPath, youtubeId = '') {
  const modal = document.getElementById('modalViewer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  title.innerHTML = `<i class="fa-solid fa-circle-play color-red"></i> ${videoTitle}`;

  if (!youtubeId) {
    body.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1.5rem; line-height: 1.7;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); border: 1.5px dashed rgba(245, 158, 11, 0.5); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: #fbbf24; font-size: 1.8rem;">
          <i class="fa-solid fa-hourglass-start"></i>
        </div>
        <span class="badge badge-warning" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-clock-rotate-left"></i> อยู่ระหว่างบันทึกเทปการสอนจริง</span>
        <h3 style="color: var(--text-color); margin-bottom: 0.5rem; font-size: 1.25rem;">${videoTitle}</h3>
        <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 480px; margin: 0 auto 1.5rem;">
          วิดีโอนี้อยู่ระหว่างดำเนินการบันทึกเทปการจัดการเรียนรู้จริงในชั้นเรียนตามเกณฑ์ ก.ค.ศ. ว9/2564 เมื่อดำเนินการเสร็จสิ้นจะเผยแพร่และนำเข้าสู่ระบบ DPA ต่อไป
        </p>
        <div style="background: var(--bg-card-alt); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; font-size: 0.88rem; border: 1px solid var(--border-color); text-align: left;">
          <p style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">
            <i class="fa-solid fa-folder"></i> ตำแหน่งโฟลเดอร์ Google Drive ของสถานศึกษา:
          </p>
          <code style="font-family: monospace; font-size: 0.82rem; word-break: break-all; color: var(--text-muted);">G:\\ไดร์ฟของฉัน\\วิทยฐานะ ครู\\Pic\\${folderPath}</code>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="closeModal()">ปิดหน้าต่าง</button>
          <a href="${DRIVE_BASE_URL}" target="_blank" class="btn btn-primary">
            <i class="fa-brands fa-google-drive"></i> เปิดใน Google Drive
          </a>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    return;
  }

  body.innerHTML = `
    <div style="text-align: left; line-height: 1.7;">
      <!-- Embedded Responsive YouTube Player -->
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 1.25rem; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <iframe 
          src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
          title="${videoTitle}"
          style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border: 0;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>

      <div style="background: var(--bg-card-alt); padding: 1.1rem; border-radius: 10px; margin-bottom: 1.2rem; font-size: 0.9rem; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <h4 style="color: var(--text-color); font-size: 1.05rem; margin: 0;">${videoTitle}</h4>
          <span class="badge badge-primary"><i class="fa-solid fa-video"></i> ${durationText.includes("ว9") ? durationText : durationText + " • ว9/2564"}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.86rem; margin-bottom: 0.5rem;">
          <i class="fa-solid fa-link color-cyan"></i> ลิงก์เผยแพร่ทางการ: <a href="https://www.youtube.com/watch?v=${youtubeId}" target="_blank" style="color: var(--color-primary); word-break: break-all;">https://www.youtube.com/watch?v=${youtubeId}</a>
        </p>
        <p style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px; font-size: 0.85rem;">
          <i class="fa-solid fa-folder"></i> ตำแหน่งโฟลเดอร์ Google Drive ของสถานศึกษา:
        </p>
        <code style="font-family: monospace; font-size: 0.82rem; word-break: break-all; color: var(--text-muted);">G:\\ไดร์ฟของฉัน\\วิทยฐานะ ครู\\Pic\\${folderPath}</code>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="closeModal()">ปิด</button>
        <a href="https://www.youtube.com/watch?v=${youtubeId}" target="_blank" class="btn btn-danger" style="background: #dc2626; color: #fff;">
          <i class="fa-brands fa-youtube"></i> ชมบน YouTube
        </a>
        <a href="${DRIVE_BASE_URL}" target="_blank" class="btn btn-primary">
          <i class="fa-brands fa-google-drive"></i> เปิดใน Google Drive
        </a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/* =========================================================
   PDF Modal Viewer (แผนการจัดการเรียนรู้ / ผลลัพธ์การเรียนรู้ / เอกสารทางการ)
   ========================================================= */
function openPdfModal(pdfUrl, titleText, descText, badgeText, pageCountText, fileName) {
  const modal = document.getElementById('modalViewer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  const box = modal.querySelector('.modal-box');
  if (box) box.classList.add('modal-box-cert');

  const actualFileName = fileName || (pdfUrl ? pdfUrl.split('/').pop() : 'document.pdf');
  const actualBadge = badgeText || '<i class="fa-solid fa-graduation-cap"></i> แผนการจัดการเรียนรู้ Active Learning 5E';
  const actualPageCount = pageCountText || '<i class="fa-solid fa-file-lines color-cyan"></i> เอกสารทางการ: <strong>ฉบับสมบูรณ์</strong>';

  title.innerHTML = `<i class="fa-solid fa-file-pdf color-red"></i> ${titleText || 'เอกสารทางการ'}`;
  body.innerHTML = `
    <div class="cert-modal-content">
      <div class="cert-modal-meta">
        <span class="badge badge-primary">${actualBadge}</span>
        <span class="cert-modal-date">${actualPageCount}</span>
        <span class="cert-file-name" title="${titleText || actualFileName}"><i class="fa-regular fa-file-pdf text-red"></i> ${actualFileName}</span>
      </div>

      <div class="cert-preview-area" style="height: 66vh; border-radius: 8px; overflow: hidden; background: #0f172a; border: 1px solid var(--border-color); box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);">
        <iframe src="${pdfUrl}#toolbar=1&navpanes=1" width="100%" height="100%" style="border: none; border-radius: 8px; background: #fff;" title="${titleText}">
          <p style="padding: 2rem; text-align: center; color: #fff;">เบราว์เซอร์ไม่รองรับการแสดงตัวอย่าง PDF ในหน้าต่างนี้ <a href="${pdfUrl}" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;"><i class="fa-solid fa-arrow-up-right-from-square"></i> คลิกเปิดดูไฟล์ PDF โดยตรง</a></p>
        </iframe>
      </div>

      ${descText ? `<p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-top: 0.75rem; text-align: left; background: var(--bg-card-alt); padding: 0.6rem 0.9rem; border-radius: 6px; border: 1px solid var(--border-color);"><i class="fa-solid fa-circle-info color-cyan"></i> ${descText}</p>` : ''}

      <div class="cert-modal-actions" style="margin-top: 0.85rem;">
        <a href="${pdfUrl}" target="_blank" class="btn btn-primary">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> เปิดดูเต็มจอ (แท็บใหม่)
        </a>
        <a href="${pdfUrl}" download="${actualFileName}" class="btn btn-secondary">
          <i class="fa-solid fa-download"></i> ดาวน์โหลดไฟล์ PDF
        </a>
        <button class="btn btn-outline" onclick="closeModal()">
          <i class="fa-solid fa-xmark"></i> ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/* =========================================================
   Student Work Modal Viewer (ผลงานนักเรียนจริง)
   ========================================================= */
function openStudentWorkModal(imgUrl, studentName, studentNo, score, levelBadge, notes) {
  const modal = document.getElementById('modalViewer');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  const box = modal.querySelector('.modal-box');
  if (box) box.classList.add('modal-box-cert');

  title.innerHTML = `<i class="fa-solid fa-palette color-amber"></i> ผลงานนักเรียน: ${studentName}`;
  body.innerHTML = `
    <div class="cert-modal-content">
      <div class="cert-modal-meta">
        <span class="badge badge-primary"><i class="fa-solid fa-user-graduate"></i> ชั้นประถมศึกษาปีที่ 3/2</span>
        <span class="cert-modal-date"><i class="fa-solid fa-hashtag color-cyan"></i> เลขที่ <strong>${studentNo}</strong></span>
        <span class="cert-date-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700;">
          <i class="fa-solid fa-star"></i> คะแนน ${score}/9 (${levelBadge})
        </span>
      </div>

      <div class="cert-preview-area" style="max-height: 65vh; overflow-y: auto; border-radius: 8px; background: #0f172a; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; padding: 0.75rem;">
        <img src="${imgUrl}" alt="${studentName}" style="max-width: 100%; max-height: 60vh; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);" loading="lazy">
      </div>

      <div style="background: var(--bg-card-alt); padding: 0.85rem 1rem; border-radius: 8px; margin-top: 0.8rem; border: 1px solid var(--border-color); font-size: 0.9rem; line-height: 1.6; text-align: left;">
        <div style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">
          <i class="fa-solid fa-clipboard-check"></i> ข้อมูลการประเมินตามเกณฑ์ Rubric Score (เต็ม 9 คะแนน):
        </div>
        <p style="color: var(--text-color); margin: 0;">${notes || 'ผลงานการออกแบบลวดลายเครื่องปั้นดินเผาด่านเกวียน ผ่านเกณฑ์การประเมินด้านความคิดสร้างสรรค์ ความสวยงามประณีต และความสมบูรณ์ของชิ้นงาน'}</p>
      </div>

      <div class="cert-modal-actions" style="margin-top: 0.85rem;">
        <a href="${imgUrl}" target="_blank" class="btn btn-primary">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> เปิดดูรูปภาพต้นฉบับ
        </a>
        <a href="${imgUrl}" download="ผลงานนักเรียน_${studentName}_เลขที่${studentNo}.jpg" class="btn btn-secondary">
          <i class="fa-solid fa-download"></i> ดาวน์โหลดรูปผลงาน
        </a>
        <button class="btn btn-outline" onclick="closeModal()">
          <i class="fa-solid fa-xmark"></i> ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/* =========================================================
   Student Works Filter & Tab Switcher
   ========================================================= */
function filterStudentWorks(level) {
  const cards = document.querySelectorAll('.student-work-card');
  const btns = document.querySelectorAll('.work-filter-btn');

  btns.forEach(b => {
    if (b.getAttribute('data-filter') === level) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  cards.forEach(card => {
    const cardLevel = card.getAttribute('data-level');
    if (level === 'all' || cardLevel === level) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function switchOutcomeTab(tabId) {
  const tabs = document.querySelectorAll('.lo-tab-btn');
  const panes = document.querySelectorAll('.lo-tab-pane');

  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === tabId) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  panes.forEach(p => {
    if (p.id === 'pane-' + tabId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

function closeModal() {
  const modal = document.getElementById('modalViewer');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active', 'open');
    const box = modal.querySelector('.modal-box');
    if (box) box.classList.remove('modal-box-cert');
    const body = document.getElementById('modalBody');
    if (body) body.innerHTML = '';
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('modalViewer');
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal when pressing Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

/* =========================================================
   Grand Hero Persona Switcher (Official Uniform vs Tech Suit)
   ========================================================= */
function switchGrandAvatar(mode) {
  const avatar = document.getElementById('grandHeroAvatar');
  const btnOfficial = document.getElementById('btnPersonaOfficial');
  const btnSuit = document.getElementById('btnPersonaSuit');
  if (!avatar) return;

  // Smooth cross-fade transition
  avatar.style.opacity = '0';
  avatar.style.transform = 'scale(0.96)';

  setTimeout(() => {
    if (mode === 'suit') {
      avatar.src = 'assets/teacher_suit.png';
      avatar.alt = 'นายอภิรัตน์ เสาวภาคย์รัตนชาติ (ชุดสูทครูคอมพิวเตอร์ & ICT)';
      if (btnOfficial) btnOfficial.classList.remove('active');
      if (btnSuit) btnSuit.classList.add('active');
    } else {
      avatar.src = 'assets/teacher_official.png';
      avatar.alt = 'นายอภิรัตน์ เสาวภาคย์รัตนชาติ (ชุดปกติขาว/กากี ข้าราชการครู)';
      if (btnOfficial) btnOfficial.classList.add('active');
      if (btnSuit) btnSuit.classList.remove('active');
    }
    avatar.style.opacity = '1';
    avatar.style.transform = 'scale(1)';
  }, 180);
}

/* =========================================================
   Interactive Mouse Parallax for Floating Tech Gear
   ========================================================= */
function initGearParallax() {
  const layer = document.getElementById('heroGearLayer');
  if (!layer) return;

  const items = layer.querySelectorAll('.floating-gear-item');
  if (!items.length) return;

  const heroSection = document.getElementById('hero') || document.querySelector('.hero-section');
  if (!heroSection) return;

  let targetNormX = 0;
  let targetNormY = 0;
  let currentNormX = 0;
  let currentNormY = 0;
  let isMouseOver = false;
  let rafId = null;

  // Track mouse coordinates over hero section
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized from -1 to +1 relative to hero center
    targetNormX = (e.clientX - centerX) / (rect.width / 2);
    targetNormY = (e.clientY - centerY) / (rect.height / 2);

    // Clamp between -1.5 and 1.5
    targetNormX = Math.max(-1.5, Math.min(1.5, targetNormX));
    targetNormY = Math.max(-1.5, Math.min(1.5, targetNormY));
    isMouseOver = true;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallaxLoop);
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    isMouseOver = false;
    targetNormX = 0;
    targetNormY = 0;
  });

  function updateParallaxLoop() {
    // Smooth lerp damping (0.08 gives a fluid floaty inertia)
    currentNormX += (targetNormX - currentNormX) * 0.08;
    currentNormY += (targetNormY - currentNormY) * 0.08;

    items.forEach((item) => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 0.05;
      const baseRot = parseFloat(item.getAttribute('data-rot')) || 0;

      // Displacement in pixels with directional depth
      const moveX = currentNormX * speed * 380;
      const moveY = currentNormY * speed * 300;
      const rot = baseRot + (currentNormX * speed * 45);

      item.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    });

    // Continue loop if active or still smoothly interpolating back to rest
    const delta = Math.abs(targetNormX - currentNormX) + Math.abs(targetNormY - currentNormY);
    if (isMouseOver || delta > 0.002) {
      rafId = requestAnimationFrame(updateParallaxLoop);
    } else {
      rafId = null;
    }
  }
}

/* =========================================================
   Scroll to PLC Duty Card with Spotlight Pulse
   ========================================================= */
function scrollToPlc(e) {
  if (e) e.preventDefault();
  const el = document.getElementById('duty-plc');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('highlight-pulse');
    setTimeout(() => {
      el.classList.remove('highlight-pulse');
    }, 2500);
  } else {
    window.location.hash = '#school-duty';
  }
}

/* =========================================================
   Scroll to Workload Calculation Ledger with Spotlight Pulse
   ========================================================= */
function scrollToLedger(e) {
  if (e) e.preventDefault();
  const el = document.getElementById('workload-calc-ledger');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('highlight-pulse-amber');
    setTimeout(() => {
      el.classList.remove('highlight-pulse-amber');
    }, 2500);
  } else {
    window.location.hash = '#school-duty';
  }
}


/* =========================================================
   DARK LUXURY EDITORIAL INTERACTIONS & FX
   ========================================================= */

function initEditorialEffects() {
  initEditorialParallax();
  initEditorialCounters();
  initHeroMeshCanvas();
}

// 3D Parallax on Mouse Move (Depth Layering FX)
function initEditorialParallax() {
  const hero = document.getElementById('hero');
  const wordmark = document.getElementById('heroWordmark');
  const cutout = document.getElementById('heroCutoutFrame');

  if (!hero || !wordmark || !cutout) return;

  // Only run on desktop/devices with hover
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width) - 0.5; // -0.5 to 0.5
      const yPercent = (y / rect.height) - 0.5;

      // Wordmark moves slightly opposite for background depth (relative to 0)
      const wordmarkX = xPercent * -22;
      const wordmarkY = yPercent * -14;
      wordmark.style.transform = `translate(${wordmarkX}px, ${wordmarkY}px)`;

      // Cutout moves with mouse for foreground depth
      const cutoutX = xPercent * 14;
      const cutoutY = yPercent * 8;
      cutout.style.transform = `translate(${cutoutX}px, ${cutoutY}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      wordmark.style.transform = 'translate(0, 0)';
      cutout.style.transform = 'translate(0, 0)';
    });
  }
}

// Smooth Number Count-Up Animation
function initEditorialCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

// Persona Switcher for Editorial Hero (Suit / Official Uniform)
function switchEditorialPersona(type) {
  const avatar = document.getElementById('editorialHeroAvatar');
  const video = document.getElementById('editorialHeroVideo');
  const btnSuit = document.getElementById('btnEditorialSuit');
  const btnOfficial = document.getElementById('btnEditorialOfficial');

  if (type === 'official') {
    if (video) {
      video.style.opacity = '0';
      setTimeout(() => {
        video.style.display = 'none';
        video.pause();
      }, 150);
    }
    if (avatar) {
      avatar.style.opacity = '0';
      avatar.style.display = 'block';
      avatar.src = 'assets/teacher_official.png';
      avatar.alt = 'นายอภิรัตน์ เสาวภาคย์รัตนชาติ (ชุดข้าราชการ)';
      setTimeout(() => {
        avatar.style.opacity = '1';
      }, 160);
    }
    if (btnOfficial) btnOfficial.classList.add('active');
    if (btnSuit) btnSuit.classList.remove('active');
  } else {
    if (avatar) {
      avatar.style.opacity = '0';
      setTimeout(() => {
        avatar.style.display = 'none';
      }, 150);
    }
    if (video) {
      video.style.display = 'block';
      video.currentTime = 0;
      video.play().catch(() => {});
      setTimeout(() => {
        video.style.opacity = '1';
      }, 160);
    }
    if (btnSuit) btnSuit.classList.add('active');
    if (btnOfficial) btnOfficial.classList.remove('active');
  }
}

/* =========================================================
   INTERACTIVE CYBER NEURAL MESH CANVAS (getlayers.ai Inspired)
   ========================================================= */
function initHeroMeshCanvas() {
  const canvas = document.getElementById('heroMeshCanvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let animId = null;
  let isRunning = false;

  const mouse = {
    x: -9999,
    y: -9999,
    active: false,
    radius: 160 // Interactive radius around mouse
  };

  // Color palettes for themes
  const colorPalettes = {
    dark: {
      nodes: ['#38bdf8', '#60a5fa', '#22d3ee', '#93c5fd', '#818cf8'],
      lines: 'rgba(56, 189, 248, ',
      cursorLine: 'rgba(96, 165, 250, ',
      glow: 'rgba(56, 189, 248, 0.7)'
    },
    light: {
      nodes: ['#0284c7', '#2563eb', '#0ea5e9', '#1d4ed8', '#3b82f6'],
      lines: 'rgba(37, 99, 235, ',
      cursorLine: 'rgba(2, 132, 199, ',
      glow: 'rgba(37, 99, 235, 0.35)'
    }
  };

  function getTheme() {
    return document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = width > 1200 ? 58 : width > 768 ? 38 : 22;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        baseRadius: Math.random() * 1.5 + 1.3,
        colorIndex: Math.floor(Math.random() * 5),
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.024,
        maxOpacity: 0.45 + Math.random() * 0.45
      });
    }
  }

  function updateAndDraw() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    const theme = getTheme();
    const palette = colorPalettes[theme];
    const isDark = theme === 'dark';
    const maxLinkDist = width > 768 ? 120 : 90;

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxLinkDist) {
          const alpha = (1 - dist / maxLinkDist) * (isDark ? 0.32 : 0.2);
          ctx.beginPath();
          ctx.strokeStyle = palette.lines + alpha + ')';
          ctx.lineWidth = isDark ? 0.85 : 0.75;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Connect to mouse cursor when active
      if (mouse.active) {
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);

        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.55 : 0.38);
          ctx.beginPath();
          ctx.strokeStyle = palette.cursorLine + mAlpha + ')';
          ctx.lineWidth = isDark ? 1.15 : 0.9;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          // Subtle repulsion physics
          const repelForce = (1 - mdist / mouse.radius) * 1.6;
          p1.x += (mdx / (mdist || 1)) * repelForce;
          p1.y += (mdy / (mdist || 1)) * repelForce;
        }
      }

      // Update particle position & pulse
      p1.x += p1.vx;
      p1.y += p1.vy;
      p1.pulseAngle += p1.pulseSpeed;

      // Bounce on edges smoothly
      if (p1.x < 0) { p1.x = 0; p1.vx *= -1; }
      else if (p1.x > width) { p1.x = width; p1.vx *= -1; }
      if (p1.y < 0) { p1.y = 0; p1.vy *= -1; }
      else if (p1.y > height) { p1.y = height; p1.vy *= -1; }

      // Draw particle node
      const currentOpacity = (Math.sin(p1.pulseAngle) * 0.25 + 0.75) * p1.maxOpacity;
      const currentRadius = p1.baseRadius + Math.sin(p1.pulseAngle) * 0.35;
      const nodeColor = palette.nodes[p1.colorIndex];

      ctx.save();
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = currentOpacity;
      if (isDark) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = palette.glow;
      }
      ctx.fill();
      ctx.restore();
    }

    // Dynamic pulse point at cursor position
    if (mouse.active) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.globalAlpha = 0.65;
      if (isDark) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
      }
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(updateAndDraw);
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      animId = requestAnimationFrame(updateAndDraw);
    }
  }

  function stop() {
    if (isRunning) {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }
  }

  // Mouse / Pointer Event Listeners
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch Support for Mobile / Tablets
  hero.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    }
  }, { passive: true });

  hero.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Resize Listener with debounce
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Battery / CPU Saver: Intersection Observer (runs only when Hero is visible)
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
  }, { threshold: 0.05 });

  heroObserver.observe(hero);

  // Initial setup
  resize();
}

/* =========================================================
   21ST.DEV & GETLAYERS SUITE: DYNAMIC SPOTLIGHT (FLAT / NO 3D TILT)
   ========================================================= */

/* =========================================================
   21ST.DEV SUITE: READING SCROLL PROGRESS BAR
   ========================================================= */
function initReadingProgressBar() {
  const bar = document.getElementById('readingProgressBar') || document.querySelector('.reading-progress-bar');
  if (!bar) return;

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const pct = (window.scrollY / totalHeight) * 100;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* =========================================================
   21ST.DEV SUITE: INTELLIGENT SCROLL-TRIGGERED REVEAL ENGINE
   (Once-Trigger, Typography Blur-Up, Staggered Card Wave)
   ========================================================= */
function initScrollReveal() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Gather all Section Title Wraps and Header Blocks
  const headerWraps = document.querySelectorAll('.section-title-wrap, .lo-header-wrap, .pottery-marquee-header, .editorial-highlights-section .eh-header');

  // 2. Gather key Content Card groups for staggered upward glide
  const cardSelectors = [
    '.card-personal-info',
    '.card-workload',
    '.workload-calc-banner',
    '.wcb-col',
    '.indicator-item',
    '.duty-card',
    '.challenge-banner-card',
    '.video-showcase-card',
    '.lesson-plan-showcase-card',
    '.lo-kpi-card',
    '.student-work-card',
    '.achievement-card',
    '.ach-card-highlight',
    '.video-card',
    '.download-card',
    '.eb-card',
    '.eh-card'
  ];

  const allCards = document.querySelectorAll(cardSelectors.join(', '));
  allCards.forEach(card => {
    if (!card.classList.contains('reveal-card') && !card.classList.contains('scroll-reveal')) {
      card.classList.add('reveal-card');
    }
  });

  if (isReducedMotion) {
    headerWraps.forEach(el => el.classList.add('is-revealed'));
    allCards.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // 3. Setup Stagger timing for grid children
  const gridContainers = document.querySelectorAll('.school-duties-grid, .workload-cols, .dimension-cards-grid, .lo-kpi-grid, .student-gallery-grid, .editorial-bento-grid, .download-grid, .video-cards-grid, .certs-grid');
  gridContainers.forEach(grid => {
    const items = grid.querySelectorAll('.reveal-card, .duty-card, .wcb-col, .indicator-item, .lo-kpi-card, .student-work-card, .eb-card, .download-card, .video-card, .achievement-card');
    items.forEach((item, idx) => {
      // Calculate smooth stagger: 0.05s up to max 0.40s
      const delay = Math.min(0.40, (idx % 4) * 0.08);
      item.style.transitionDelay = `${delay.toFixed(2)}s`;
    });
  });

  // 4. Create Unified IntersectionObserver (Once-Trigger)
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed', 'revealed', 'active');
        // Unobserve to guarantee the animation only plays ONCE and stays stable
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  // Observe all headers & cards
  headerWraps.forEach(el => revealObserver.observe(el));
  allCards.forEach(el => revealObserver.observe(el));

  // If items are already in viewport at load (e.g. top of page), reveal immediately
  const winHeight = window.innerHeight;
  [...headerWraps, ...allCards].forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < winHeight * 0.92) {
      el.classList.add('is-revealed', 'revealed', 'active');
      revealObserver.unobserve(el);
    }
  });
}

function initSpotlightAndTilt() {
  const cards = document.querySelectorAll('.eh-card, .eb-card, .editorial-stat-block, .quote-card-inner, .indicator-card, .download-card, .wcb-col, .duty-card, .challenge-card, .video-showcase-card, .pottery-card, .learning-outcomes-card, .lesson-plan-showcase-card, .spotlight-card, .student-work-card');
  attachSpotlightToCards(cards);
}

function attachSpotlightToCards(elements) {
  if (!elements || !elements.length) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  elements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-9999px');
      card.style.setProperty('--mouse-y', '-9999px');
    });
  });
}

function initGlidingTabs() {
  // Clean up any stray glider inside workloadTabs if previously created
  const strayGlider = document.querySelector('#workloadTabs .magnetic-glider');
  if (strayGlider) strayGlider.remove();

  const tabContainers = document.querySelectorAll('.eps-btn-group');

  tabContainers.forEach(container => {
    const activeBtn = container.querySelector('.active') || container.querySelector('button, .tab-btn, .dim-btn');
    if (activeBtn) {
      setTimeout(() => updateGlider(container, activeBtn), 60);
    }

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .tab-btn, .dim-btn');
      if (btn && container.contains(btn)) {
        updateGlider(container, btn);
      }
    });
  });

  window.addEventListener('resize', () => {
    tabContainers.forEach(container => {
      const activeBtn = container.querySelector('.active');
      if (activeBtn) updateGlider(container, activeBtn);
    });
  }, { passive: true });
}

function updateGlider(container, targetBtn) {
  let glider = container.querySelector('.magnetic-glider');
  if (!glider) {
    glider = document.createElement('div');
    glider.className = 'magnetic-glider';
    glider.style.position = 'absolute';
    glider.style.top = '0';
    glider.style.left = '0';
    glider.style.pointerEvents = 'none';
    container.style.position = 'relative';
    container.insertBefore(glider, container.firstChild);
  }

  const cRect = container.getBoundingClientRect();
  const bRect = targetBtn.getBoundingClientRect();

  const left = bRect.left - cRect.left + container.scrollLeft;
  const top = bRect.top - cRect.top + container.scrollTop;

  glider.style.width = `${bRect.width}px`;
  glider.style.height = `${bRect.height}px`;
  glider.style.transform = `translate(${left}px, ${top}px)`;
  glider.style.opacity = '1';
}

function openClassroomVideoModal(src, title) {
  const modal = document.getElementById('classroomVideoModal');
  const player = document.getElementById('cvmPlayer');
  const titleEl = document.getElementById('cvmTitle');

  if (!modal || !player) return;

  if (title && titleEl) titleEl.textContent = title;
  player.src = src;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  player.play().catch(() => {});
}

function closeClassroomVideoModal() {
  const modal = document.getElementById('classroomVideoModal');
  const player = document.getElementById('cvmPlayer');

  if (!modal || !player) return;

  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handleVideoModalBackdrop(event) {
  if (event.target && event.target.id === 'classroomVideoModal') {
    closeClassroomVideoModal();
  }
}

/* =========================================================
   21ST.DEV GOD-TIER POTTERY GALLERY LIGHTBOX & FULLSCREEN
   (Authentic Titles, 100% Full-View Uncropped, Carousel Nav)
   ========================================================= */

const POTTERY_GALLERY_DATA = [
  {
    id: 1,
    numStr: 'ชิ้นที่ 1',
    file: 'assets/pottery/pottery_01.jpg',
    title: 'ผลส้มแฟนซีประดับใบไม้ (ส้ม)',
    category: 'ผลงานปั้นรูปทรงผลไม้',
    score: '10/10 ดีเยี่ยม',
    desc: 'ผลงานปั้นรูปทรงผลส้มกลมแป้นติดขั้วก้านและใบไม้สีเขียว ถอดแบบจากภาพร่างในสมุดกิจกรรมสู่การขึ้นรูปทรง 3 มิติอย่างสวยงาม'
  },
  {
    id: 2,
    numStr: 'ชิ้นที่ 2',
    file: 'assets/pottery/pottery_02.jpg',
    title: 'ผลส้มดินปั้นไล่เฉดสี (ส้ม)',
    category: 'ผลงานปั้นรูปทรงผลไม้',
    score: '10/10 ดีเยี่ยม',
    desc: 'เทคนิคการผสมสีดินน้ำมันไล่ระดับเฉดสีเหลือง-ส้ม-แดงเสมือนเปลือกผลส้มธรรมชาติ พร้อมลวดลายกิ่งก้านและใบไม้สมบูรณ์แบบ'
  },
  {
    id: 3,
    numStr: 'ชิ้นที่ 3',
    file: 'assets/pottery/pottery_03.jpg',
    title: 'ตุ๊กตาหมีน้อยตั้งโต๊ะ (หมี)',
    category: 'ผลงานปั้นสัตว์และตุ๊กตา',
    score: '9.5/10 ดีมาก',
    desc: 'งานปั้นตุ๊กตาหมีสีน้ำตาลทรงกลมน่ารัก พร้อมส่วนประกอบหู จมูก ตา และแขนขาที่ยึดติดแน่นหนาตามกระบวนการขึ้นรูปทรงอิสระ'
  },
  {
    id: 4,
    numStr: 'ชิ้นที่ 4',
    file: 'assets/pottery/pottery_04.jpg',
    title: 'แจกันปากผายกลีบหยัก (แจกัน)',
    category: 'เครื่องปั้นดินเผาประยุกต์',
    score: '10/10 ดีเยี่ยม',
    desc: 'การขึ้นรูปทรงแจกันดินเผาปากหยักโค้งมนเลียนแบบกลีบดอกไม้ สะท้อนการประยุกต์ลวดลายธรรมชาติเข้ากับเครื่องใช้ในครัวเรือน'
  },
  {
    id: 5,
    numStr: 'ชิ้นที่ 5',
    file: 'assets/pottery/pottery_05.jpg',
    title: 'ผลแอปเปิ้ลแดงสดใส (แอปเปิ้ล)',
    category: 'ผลงานปั้นรูปทรงผลไม้',
    score: '9.5/10 ดีมาก',
    desc: 'การปั้นผลแอปเปิ้ลสีแดงสดรูปทรงกลมมนพร้อมขั้วก้านสีน้ำตาลและใบไม้สีเขียว แสดงทักษะการเก็บรายละเอียดผิวสัมผัสอย่างประณีต'
  },
  {
    id: 6,
    numStr: 'ชิ้นที่ 6',
    file: 'assets/pottery/pottery_06.jpg',
    title: 'แจกันดินเหนียวด่านเกวียนดั้งเดิม (แจกัน)',
    category: 'เครื่องปั้นดินเผาดั้งเดิม',
    score: '10/10 ดีเยี่ยม',
    desc: 'จำลองรูปทรงแจกันดินเผาด่านเกวียนโบราณ ขึ้นรูปทรงกระบอกฐานกว้างและบีบปากคอดตามเอกลักษณ์ภูมิปัญญาท้องถิ่น'
  },
  {
    id: 7,
    numStr: 'ชิ้นที่ 7',
    file: 'assets/pottery/pottery_07.jpg',
    title: 'แจกันทรงสูงปากบานลายริ้ว (แจกัน)',
    category: 'เครื่องปั้นดินเผาประยุกต์',
    score: '10/10 ดีเยี่ยม',
    desc: 'งานปั้นแจกันทรงสูงขัดผิวเรียบเนียน พร้อมเซาะร่องลวดลายริ้วรอบลำตัวแจกัน แสดงทักษะการใช้เครื่องมือปั้นได้อย่างชำนาญ'
  },
  {
    id: 8,
    numStr: 'ชิ้นที่ 8',
    file: 'assets/pottery/pottery_08.jpg',
    title: 'ตุ๊กตาการ์ตูนบนใบบัว (ตุ๊กตา)',
    category: 'ผลงานปั้นสร้างสรรค์แฟนซี',
    score: '10/10 ดีเยี่ยม',
    desc: 'งานปั้นตัวการ์ตูนน่ารักสีม่วงนอนเล่นบนฐานใบบัวสีเขียวขอบยกสูง สื่อถึงจินตนาการสร้างสรรค์อันไร้ขีดจำกัดในการเรียนรู้ Active Learning'
  },
  {
    id: 9,
    numStr: 'ชิ้นที่ 9',
    file: 'assets/pottery/pottery_09.jpg',
    title: 'ผลไม้แฟนซีสีชมพูพาสเทล (ผลไม้)',
    category: 'ผลงานปั้นรูปทรงผลไม้',
    score: '9.5/10 ดีมาก',
    desc: 'การผสมเฉดสีพาสเทลสดใสขึ้นรูปทรงผลไม้แฟนซี พร้อมตกแต่งใบไม้ประดับด้านบนอย่างลงตัว'
  },
  {
    id: 10,
    numStr: 'ชิ้นที่ 10',
    file: 'assets/pottery/pottery_10.jpg',
    title: 'รูปปั้นกระทิงโทนสีแฟนซี (กระทิง)',
    category: 'ประติมากรรมสัตว์ท้องถิ่น',
    score: 'ระดับ A (ดีเยี่ยม)',
    desc: 'การถ่ายทอดเอกลักษณ์สัตว์พื้นถิ่นโคราช ขึ้นรูปทรงเขากระทิงโค้งมนและสัดส่วนลำตัวได้อย่างสมดุล'
  },
  {
    id: 11,
    numStr: 'ชิ้นที่ 11',
    file: 'assets/pottery/pottery_11.jpg',
    title: 'รูปปั้นกระทิงป่าดินด่านเกวียน (กระทิง)',
    category: 'ประติมากรรมสัตว์ท้องถิ่น',
    score: 'ระดับ A (ดีเยี่ยม)',
    desc: 'การขึ้นรูปทรงกระทิงสัตว์ป่า สะท้อนความแข็งแกร่งด้วยสัดส่วนลำตัว เขา และขาครบถ้วนตามแบบร่างภาพวาดในสมุดเรียน'
  },
  {
    id: 12,
    numStr: 'ชิ้นที่ 12',
    file: 'assets/pottery/pottery_12.jpg',
    title: 'แจกันทรงสูงพันเกลียวลายประยุกต์',
    category: 'เครื่องปั้นดินเผาประยุกต์',
    score: '8/10 ดีมาก',
    desc: 'งานปั้นแจกันทรงสูงผสมผสานเทคนิคการขดเส้นดิน (Coiling Technique) พันรอบคอขวด พร้อมตกแต่งตัวการ์ตูนจิ๋วเกาะด้านข้างอย่างสร้างสรรค์'
  }
];

let currentPotteryIdx = 0;

function openPotteryModal(imgSrc, title, category, score, desc) {
  let foundIdx = -1;
  if (imgSrc) {
    foundIdx = POTTERY_GALLERY_DATA.findIndex(item => item.file === imgSrc || imgSrc.includes(item.file));
  }
  if (foundIdx === -1 && title) {
    foundIdx = POTTERY_GALLERY_DATA.findIndex(item => item.title === title || title.includes(item.title));
  }
  if (foundIdx === -1) foundIdx = 0;

  openPotteryModalByIndex(foundIdx);
}

function openPotteryModalByIndex(idx) {
  if (idx < 0) idx = POTTERY_GALLERY_DATA.length - 1;
  if (idx >= POTTERY_GALLERY_DATA.length) idx = 0;
  currentPotteryIdx = idx;

  const item = POTTERY_GALLERY_DATA[idx];
  const modal = document.getElementById('modalViewer');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !modalBody) return;

  const box = modal.querySelector('.modal-box');
  if (box) {
    box.classList.add('modal-box-cert');
    box.style.maxWidth = '1120px';
    box.style.width = '96vw';
  }

  modalTitle.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
      <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; font-size: 0.8rem;">
        <i class="fa-solid fa-shapes"></i> ชิ้นที่ ${item.id} / ${POTTERY_GALLERY_DATA.length}
      </span>
      <span style="font-weight: 800; color: var(--text-color); font-size: 1.05rem;">
        ${item.title}
      </span>
    </div>
  `;

  modalBody.innerHTML = `
    <div class="pottery-modal-stage" style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
      
      <!-- TOP: Ultra-Clear Full Image Stage (Uncropped & Theater Framed) -->
      <div class="pottery-full-view-theater" style="position: relative; background: #070b14; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.12); padding: 0.85rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 2px 20px rgba(0,0,0,0.8), 0 16px 40px rgba(0,0,0,0.6); overflow: hidden;">
        
        <!-- Quick Nav Prev / Next Overlays -->
        <button type="button" class="pottery-nav-arrow arrow-prev" onclick="navPottery(-1); event.stopPropagation();" title="ผลงานก่อนหน้า (ลูกศรซ้าย)" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; cursor: pointer; z-index: 10; transition: all 0.2s ease;">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <button type="button" class="pottery-nav-arrow arrow-next" onclick="navPottery(1); event.stopPropagation();" title="ผลงานถัดไป (ลูกศรขวา)" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; cursor: pointer; z-index: 10; transition: all 0.2s ease;">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <!-- The Hero Image (100% Uncropped & Responsive) -->
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; min-height: 380px; max-height: 68vh; overflow: hidden; cursor: zoom-in;" onclick="openPotteryFullscreen('${item.file}', '${item.title}')" title="คลิกรูปภาพเพื่อดูแบบเต็มจอ 100% (Fullscreen Zoom)">
          <img id="potteryStageImg" src="${item.file}" alt="${item.title}" style="max-width: 100%; max-height: 66vh; width: auto; height: auto; object-fit: contain; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); transition: transform 0.3s ease;">
        </div>

        <!-- Image Toolbar & Full View Hint -->
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 0.65rem; padding: 0.25rem 0.5rem; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.08);">
          <div style="font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-magnifying-glass-plus text-amber"></i> ภาพถ่ายผลงานจริงความละเอียดสูง (ปั้นจริง ณ ร.ร.วันอาสาพัฒนา 2520) • <em>คลิกที่ภาพเพื่อขยายเต็มจอ</em>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-outline btn-sm" onclick="openPotteryFullscreen('${item.file}', '${item.title}')" style="background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">
              <i class="fa-solid fa-expand"></i> ดูรูปเต็มจอ (Full Size)
            </button>
            <a href="${item.file}" download="${item.title}.jpg" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-download"></i> ดาวน์โหลดรูป
            </a>
          </div>
        </div>
      </div>

      <!-- BOTTOM: Metadata, Rubric Score & Pedagogy Description -->
      <div style="background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); padding: 1.15rem 1.35rem; display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
              <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700;">
                <i class="fa-solid fa-shapes"></i> ${item.category}
              </span>
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); font-weight: 700;">
                <i class="fa-solid fa-award"></i> คะแนนประเมิน: ${item.score}
              </span>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-color); margin: 0;">
              ${item.title}
            </h3>
            <div style="color: var(--text-muted); font-size: 0.84rem; margin-top: 0.25rem;">
              <i class="fa-solid fa-school text-cyan"></i> นักเรียนชั้นประถมศึกษาปีที่ 3/2 • หน่วยการเรียนรู้ "ด๊ะดาดของดี...ดินด่านเกวียน"
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="btn btn-outline btn-sm" onclick="navPottery(-1)">
              <i class="fa-solid fa-arrow-left"></i> ชิ้นก่อนหน้า
            </button>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); min-width: 55px; text-align: center;">
              ${item.id} / ${POTTERY_GALLERY_DATA.length}
            </span>
            <button class="btn btn-outline btn-sm" onclick="navPottery(1)">
              ชิ้นถัดไป <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="closeModal()">
              <i class="fa-solid fa-xmark"></i> ปิด
            </button>
          </div>
        </div>

        <div style="background: var(--bg-card-alt); padding: 0.85rem 1.1rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.88rem; line-height: 1.65;">
          <div style="font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem;">
            <i class="fa-solid fa-clipboard-check"></i> คำอธิบายคุณค่าและความประณีตของชิ้นงาน:
          </div>
          <p style="color: var(--text-color); margin: 0;">
            ${item.desc}
          </p>
        </div>

        <!-- Thumbnail Navigation Bar -->
        <div style="margin-top: 0.25rem;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
            <i class="fa-solid fa-grip"></i> เลือกดูชิ้นงานทั้ง 12 ชิ้น (คลิกเพื่อสลับภาพทันที):
          </div>
          <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.4rem; scrollbar-width: thin;">
            ${POTTERY_GALLERY_DATA.map((p, i) => `
              <button type="button" onclick="openPotteryModalByIndex(${i})" style="flex-shrink: 0; width: 56px; height: 56px; border-radius: 6px; overflow: hidden; border: 2px solid ${i === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}; background: #000; padding: 0; cursor: pointer; transition: all 0.2s ease;" title="${p.numStr}: ${p.title}">
                <img src="${p.file}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.classList.add('active', 'open');
  document.body.style.overflow = 'hidden';
}

function navPottery(direction) {
  openPotteryModalByIndex(currentPotteryIdx + direction);
}

/* =========================================================
   100% IMMERSIVE FULLSCREEN LIGHTBOX OVERLAY
   ========================================================= */
function openPotteryFullscreen(imgSrc, title) {
  let fsOverlay = document.getElementById('potteryFullscreenOverlay');
  if (!fsOverlay) {
    fsOverlay = document.createElement('div');
    fsOverlay.id = 'potteryFullscreenOverlay';
    fsOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(3, 7, 18, 0.96);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    `;
    document.body.appendChild(fsOverlay);
  }

  fsOverlay.innerHTML = `
    <div style="position: absolute; top: 1.25rem; left: 1.5rem; right: 1.5rem; display: flex; justify-content: space-between; align-items: center; z-index: 100000; color: #fff;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="badge" style="background: rgba(245, 158, 11, 0.3); color: #f59e0b; border: 1px solid #f59e0b; font-weight: 700;">
          <i class="fa-solid fa-shapes"></i> ภาพผลงานเต็มจอ 100%
        </span>
        <span style="font-weight: 700; font-size: 1.1rem; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
          ${title || ''}
        </span>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <a href="${imgSrc}" target="_blank" class="btn btn-outline btn-sm" style="color: #fff; border-color: rgba(255,255,255,0.4);" title="เปิดในแท็บใหม่">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> แท็บใหม่
        </a>
        <button type="button" class="btn btn-secondary btn-sm" onclick="closePotteryFullscreen()" style="background: rgba(255,255,255,0.2); color: #fff; border: none; font-size: 1rem; padding: 0.4rem 0.85rem; border-radius: 8px;">
          <i class="fa-solid fa-xmark"></i> ปิดรูปเต็มจอ (ESC)
        </button>
      </div>
    </div>

    <!-- Arrow Controls -->
    <button type="button" onclick="navPotteryFullscreen(-1); event.stopPropagation();" title="ก่อนหน้า" style="position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; cursor: pointer; z-index: 100000; transition: all 0.2s;">
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <button type="button" onclick="navPotteryFullscreen(1); event.stopPropagation();" title="ถัดไป" style="position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; cursor: pointer; z-index: 100000; transition: all 0.2s;">
      <i class="fa-solid fa-chevron-right"></i>
    </button>

    <!-- Full Image Container -->
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 4.5rem 1rem 1.5rem;" onclick="closePotteryFullscreen()">
      <img id="potteryFullscreenImg" src="${imgSrc}" alt="${title}" style="max-width: 95vw; max-height: 88vh; width: auto; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.9); cursor: zoom-out;" onclick="event.stopPropagation()">
    </div>
  `;

  fsOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePotteryFullscreen() {
  const fsOverlay = document.getElementById('potteryFullscreenOverlay');
  if (fsOverlay) {
    fsOverlay.style.display = 'none';
  }
}

function navPotteryFullscreen(dir) {
  let nextIdx = currentPotteryIdx + dir;
  if (nextIdx < 0) nextIdx = POTTERY_GALLERY_DATA.length - 1;
  if (nextIdx >= POTTERY_GALLERY_DATA.length) nextIdx = 0;
  currentPotteryIdx = nextIdx;
  const nextItem = POTTERY_GALLERY_DATA[nextIdx];
  openPotteryFullscreen(nextItem.file, nextItem.title);
  const modal = document.getElementById('modalViewer');
  if (modal && modal.style.display === 'flex') {
    openPotteryModalByIndex(nextIdx);
  }
}

// Global window exposure to guarantee zero undefined reference errors
window.openPotteryModal = openPotteryModal;
window.openPotteryModalByIndex = openPotteryModalByIndex;
window.navPottery = navPottery;
window.openPotteryFullscreen = openPotteryFullscreen;
window.closePotteryFullscreen = closePotteryFullscreen;
window.closeModal = closeModal;

// Keyboard listeners for Pottery Lightbox (ESC, Left, Right)
window.addEventListener('keydown', (e) => {
  const fsOverlay = document.getElementById('potteryFullscreenOverlay');
  const isFsOpen = fsOverlay && fsOverlay.style.display === 'flex';
  const modal = document.getElementById('modalViewer');
  const isModalOpen = modal && (modal.style.display === 'flex' || modal.classList.contains('active'));

  if (e.key === 'Escape') {
    if (isFsOpen) {
      closePotteryFullscreen();
      e.stopPropagation();
    } else if (isModalOpen) {
      closeModal();
    }
  } else if (e.key === 'ArrowLeft') {
    if (isFsOpen) navPotteryFullscreen(-1);
    else if (isModalOpen) navPottery(-1);
  } else if (e.key === 'ArrowRight') {
    if (isFsOpen) navPotteryFullscreen(1);
    else if (isModalOpen) navPottery(1);
  }
});

function closeModal() {
  const modal = document.getElementById('modalViewer');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active', 'open');
    const box = modal.querySelector('.modal-box');
    if (box) {
      box.classList.remove('modal-box-cert');
      box.style.maxWidth = '';
      box.style.width = '';
    }
    const body = document.getElementById('modalBody');
    if (body) body.innerHTML = '';
    document.body.style.overflow = '';
  }
  closePotteryFullscreen();
}
