/**
 * S&K VENTURE SIGNS - MASTER LOGIC
 * Replaces all inline scripts from HTML. Automatically handles all pages based on the body class.
 */

// =========================================================
// 1. CROSS-TAB AWARENESS & SMART CLICKS
// =========================================================
function safeSetStorage(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
function safeGetStorage(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function safeRemoveStorage(key) { try { localStorage.removeItem(key); } catch (e) {} }

window.smartTabClick = function(event, element, targetName, url) {
    if(event) event.preventDefault();
    safeSetStorage(targetName, 'true');
    if(element && element.classList) element.classList.add('already-open');
    let tabWindow = window.open(url, targetName);
    if (tabWindow) { tabWindow.focus(); } else { window.location.href = url; }
};

// =========================================================
// 2. THEME & GLOBAL UI CONTROLS
// =========================================================
function setTheme(mode) {
    const body = document.body;
    let targetMode = mode;

    if (mode === 'auto') {
        const hour = new Date().getHours();
        const isNightTime = (hour < 6 || hour >= 19);
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        targetMode = (isNightTime || isSystemDark) ? 'dark' : 'light';
    }
    
    if (targetMode === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    
    const header = document.getElementById('main-header');
    const logo = document.getElementById('header-logo');
    if (header && logo && header.classList.contains('header-scrolled')) {
        logo.src = (targetMode === 'dark') 
            ? "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-White.png" 
            : "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-Black.png";
    }

    document.cookie = `theme=${mode};max-age=31536000;path=/`;
}

function updateOutlineColor(color) {
    document.documentElement.style.setProperty('--outline-color', color);
    document.cookie = `outline-color=${color};max-age=31536000;path=/`;
}

function toggleSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    if(panel) panel.classList.toggle('hidden-settings');
}

function closeModals() { 
    document.querySelectorAll('.sk-modal-overlay').forEach(m => m.style.display = 'none'); 
}

function openPhoneSmartActions(num) {
    const clean = num.replace(/\D/g, '');
    const container = document.getElementById('phone-options-container');
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    let html = isMac 
        ? `<a href="tel:${clean}" target="_blank" class="smart-option"><i data-lucide="monitor"></i> FaceTime / iPhone</a>`
        : `<a href="tel:${clean}" target="_blank" class="smart-option"><i data-lucide="phone"></i> Direct Call</a>`;
    
    if (num.includes('618')) html += `<a href="https://wa.me/1${clean}" target="_blank" class="smart-option"><i data-lucide="message-circle"></i> WhatsApp Specialist</a>`;

    if(container) container.innerHTML = html;
    document.getElementById('phone-modal').style.display = 'flex';
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function openEmailSmartActions(email, subject = "General Inquiry") {
    const encodedSubject = encodeURIComponent(subject);
    const container = document.getElementById('email-options-container');
    container.innerHTML = `
        <a href="mailto:${email}?subject=${encodedSubject}" target="_blank" class="smart-option"><i data-lucide="mail"></i> Default Client</a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}" target="_blank" class="smart-option"><i data-lucide="send"></i> Gmail Web</a>
        <div onclick="navigator.clipboard.writeText('${email}'); alert('Email Copied');" class="smart-option"><i data-lucide="copy"></i> Copy Address</div>
    `;
    document.getElementById('email-modal').style.display = 'flex';
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function openMapSmartActions() {
    const addrStr = `${SK_DATA.global.addressStreet} ${SK_DATA.global.addressCity}`;
    const addr = encodeURIComponent(addrStr);
    document.getElementById('link-gmaps').href = `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
    document.getElementById('link-amaps').href = `http://maps.apple.com/?daddr=${addr}`;
    document.getElementById('link-waze').href = `https://waze.com/ul?q=${addr}&navigate=yes`;
    document.getElementById('map-modal').style.display = 'flex';
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function downloadSKContact() {
    const PHOTO_URL = "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-Black.png";
    const vcard = "BEGIN:VCARD\nVERSION:3.0\nFN:Scott Robinson\nORG:S&K Venture Signs\nTEL;TYPE=WORK,VOICE:" + (SK_DATA.global.phones[1] || "844-907-4450") + "\nTEL;TYPE=CELL,VOICE:" + (SK_DATA.global.phones[0] || "618-708-4450") + "\nEMAIL;TYPE=PREF,INTERNET:" + SK_DATA.global.email + "\nADR;TYPE=WORK:;;" + SK_DATA.global.addressStreet + ";" + SK_DATA.global.addressCity.split(' ')[0] + ";IL;" + SK_DATA.global.addressCity.split(' ').pop() + ";USA\nURL:https://skventuresigns.com/\nPHOTO;VALUE=URI:" + PHOTO_URL + "\nEND:VCARD";
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Scott_Robinson_SKVenture.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =========================================================
// 3. RENDER FRAMEWORK (Nav & Footer from Data File)
// =========================================================
function renderFramework() {
    const dNav = document.getElementById('desktop-nav-root');
    const mNav = document.getElementById('mobile-menu');
    const fPhone = document.getElementById('footer-phone-list');
    const fEmail = document.getElementById('footer-email-list');
    const fAddr = document.getElementById('footer-address-container');

    if (dNav && mNav) {
        SK_DATA.global.navigation.forEach(n => {
            // Determine active page by checking body class
            const bodyClass = document.body.className;
            const isActive = bodyClass.includes(`page-${n.label.toLowerCase()}`);
            const uniqueTarget = `tab_sk_${n.label}`;

            if (isActive) {
                window.name = uniqueTarget;
                safeSetStorage(uniqueTarget, 'true');
                window.addEventListener('beforeunload', () => safeRemoveStorage(uniqueTarget));
            }

            const isOpen = safeGetStorage(uniqueTarget) === 'true';
            const openClass = isOpen && !isActive ? 'already-open' : '';
            const desktopActive = isActive ? 'active' : '';
            
            dNav.innerHTML += `<li><a href="${n.url}" target="${uniqueTarget}" class="nav-link ${desktopActive} ${openClass}" onclick="smartTabClick(event, this, '${uniqueTarget}', '${n.url}')">${n.label}</a></li>`;
            
            const mobileClass = isActive ? `text-2xl font-bold border-b border-black/10 pb-3 text-[var(--sk-gold)]` : `text-2xl font-bold border-b border-black/10 pb-3`;
            mNav.innerHTML += `<a href="${n.url}" target="${uniqueTarget}" class="${mobileClass} ${openClass}" onclick="smartTabClick(event, this, '${uniqueTarget}', '${n.url}')">${n.label}</a>`;
        });
    }

    if (fPhone && fEmail && fAddr) {
        let phoneHTML = `<span class="footer-value !mb-0" onclick="openPhoneSmartActions('${SK_DATA.global.phones[0]}')">${SK_DATA.global.phones[0]}</span>`;
        if (SK_DATA.global.phones[1]) phoneHTML += `<span class="text-white opacity-70 text-sm font-bold uppercase">or</span><span class="footer-value !mb-0" onclick="openPhoneSmartActions('${SK_DATA.global.phones[1]}')">${SK_DATA.global.phones[1]}</span>`;
        fPhone.innerHTML = phoneHTML;
        fEmail.innerHTML = `<span class="footer-value" onclick="openEmailSmartActions('${SK_DATA.global.email}')">${SK_DATA.global.email}</span>`;
        fAddr.innerHTML = `<span class="footer-value" onclick="openMapSmartActions()">${SK_DATA.global.addressStreet}, ${SK_DATA.global.addressCity}</span>`;
    }
}

// =========================================================
// 4. PAGE SPECIFIC ROUTERS
// =========================================================

// CLIENTS PAGE LOGIC
let lightboxGallery = [];
function renderClients() {
    const grid = document.getElementById('customer-grid');
    const loading = document.getElementById('loading');
    if (!grid) return;
    
    loading.style.display = 'none';
    grid.innerHTML = '';
    lightboxGallery = [];

    SK_DATA.clients.forEach((client, index) => {
        lightboxGallery.push(client.image);
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const linkAttributes = (client.url !== '#' && client.url !== '') ? `href="${client.url}" target="_blank"` : '';
        item.innerHTML = `
            <img src="${client.image}" alt="${client.name}" onclick="openLightbox(${index})" onerror="this.src='https://via.placeholder.com/400x320?text=Logo+Coming+Soon'">
            <h3><a ${linkAttributes} class="client-link">${client.name}</a></h3>
        `;
        grid.appendChild(item);
    });
}

function openLightbox(index) {
    const img = document.getElementById('lightbox-image');
    const overlay = document.getElementById('lightbox-overlay');
    if(img && overlay) {
        img.src = lightboxGallery[index];
        overlay.style.display = 'flex';
    }
}
function closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    if(overlay) overlay.style.display = 'none';
}

// INITIALIZE EVERYTHING ON LOAD
window.onload = () => {
    // 1. Read Cookies for theme/outline
    const cookies = document.cookie.split('; ').reduce((acc, curr) => {
        const [k, v] = curr.split('='); acc[k] = v; return acc;
    }, {});
    if (cookies['outline-color']) updateOutlineColor(cookies['outline-color']);
    setTheme(cookies['theme'] || 'auto');

    // 2. Render Global Framework
    renderFramework();

    // 3. Render Page Specific Data
    if(document.body.classList.contains('page-clients')) renderClients();
    
    // Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

// Scroll listener for header
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    const logo = document.getElementById('header-logo');
    const isDark = document.body.classList.contains('dark-mode');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
        logo.src = isDark ? "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-White.png" : "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-Black.png";
    } else {
        header.classList.remove('header-scrolled');
        logo.src = "https://skventuresigns.com/wp-content/uploads/2025/03/SK-Sign-White.png";
    }
});

// Menu Toggle
document.getElementById('menu-toggle')?.addEventListener('click', () => {
    const m = document.getElementById('mobile-menu');
    m.classList.toggle('hidden'); m.classList.toggle('flex');
});
