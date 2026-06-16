/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE */
/* NYT Timestamp: 2026-06-16 04:34:25 */

(function() {
    const activeTown = document.body.getAttribute('data-town') || 'louisville';

    // Absolute GitHub URLs mapped directly to your Testpages repository to bypass CORS blocks
    const URLS = {
        config: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/config.json",
        assets: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/assets.json",
        menu: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/menu.json",
        partners: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/partners.json",
        maps: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/maps.json",
        history: `https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/${activeTown}.json`,
        images: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/louisville-images.json",
        footer: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/footer.json",
        news: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json",
        bulletin: "https://script.google.com/macros/s/AKfycbwtunjBquRf8yjnYdpMNMglMQB6n0j4pHSNke-9yADxZ3-9HvJqXT2DdVTUjdhRroGcxQ/exec"
    };

    let rssFeeds = [];

    // --- 1. GLOBAL ASSETS (Header & Footer) ---
    async function loadAssets() {
        try {
            const astRes = await fetch(URLS.assets);
            const astData = await astRes.json();
            const headerUrl = astData.global_header_image || astData[0]?.url;
            if(headerUrl) {
                document.getElementById('global-header-container').innerHTML = `
                    <a href="https://staging.supportmylocalcommunity.com/" target="main-content-window">
                        <img src="${headerUrl}" alt="Global Header">
                    </a>`;
            }

            const ftrRes = await fetch(URLS.footer);
            const ftrData = await ftrRes.json();
            document.getElementById('global-footer-container').innerHTML = `
                <div class="footer-inner-content">
                    <img src="${ftrData.footer_logo || ''}" alt="Logo">
                    <p style="color:#aaa; font-size:12px;">${ftrData.copyright_text || ''}</p>
                    <p style="color:#777; font-size:11px;">All Rights Reserved - <a href="${ftrData.firm_url || '#'}" style="color:var(--town-detail);">${ftrData.firm_name || ''}</a></p>
                </div>`;
        } catch(e) {
            console.error("Failed to load global assets", e);
        }
    }

    // --- 2. MENU ---
    async function loadMenu() {
        try {
            const res = await fetch(URLS.menu);
            const data = await res.json();
            const ul = document.getElementById('dynamic-menu-links');
            ul.innerHTML = '';
            data.forEach(link => {
                ul.innerHTML += `<li><a href="${link.url}" target="main-content-window" class="${window.location.href.includes(link.url) ? 'active' : ''}">${link.name}</a></li>`;
            });
        } catch(e) {
            console.error("Failed to load menu", e);
        }
    }

    // --- 3. CALENDAR (Strict 30-Day Chicago Time Rule) ---
    function getChicagoTime() {
        return new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}));
    }

    setInterval(() => {
        const cst = getChicagoTime();
        const clockEl = document.getElementById('chicago-clock');
        if (clockEl) {
            clockEl.innerText = cst.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"});
        }
    }, 1000);

    async function loadCalendar() {
        try {
            const res = await fetch(URLS.bulletin + "?feed=true");
            const events = await res.json();
            const list = document.getElementById('divi-event-list');
            list.innerHTML = '';

            const nowCST = getChicagoTime();
            const maxDateCST = new Date(nowCST.getTime() + (30 * 24 * 60 * 60 * 1000));

            const validEvents = events.filter(ev => {
                if(!ev.date) return false;
                const evDate = new Date(`${ev.date} ${ev.time || '12:00 AM'}`);
                if (isNaN(evDate)) return true; // Keep TBA
                return evDate >= nowCST && evDate <= maxDateCST;
            });

            if(validEvents.length > 0) {
                validEvents.slice(0,6).forEach(ev => {
                    list.innerHTML += `
                        <div class="divi-event-item">
                            <div class="divi-event-date">${ev.date || 'TBA'}</div>
                            <div class="divi-event-title">${ev.title || ev.name}</div>
                            <div class="event-info-text">
                                <strong>Where:</strong> ${ev.location || 'Clay County'}<br>
                                <strong>Time:</strong> ${ev.time || 'TBA'}
                            </div>
                        </div>`;
                });
            } else {
                list.innerHTML = `<p style="padding:15px; color:#222; font-style:italic;">No events matching current timeframe.</p>`;
            }
        } catch(e) { 
            const list = document.getElementById('divi-event-list');
            if (list) list.innerHTML = "Feed offline."; 
        }
    }

    // --- 4. CONFIG (RSS) & LOCAL NEWS (Center Column) ---
    async function loadCenterNews() {
        try {
            const confRes = await fetch(URLS.config);
            const conf = await confRes.json();
            rssFeeds = conf.multi_alerts_rss_cluster || [];
            const rssCont = document.getElementById('rss-feed-container');
            if (rssCont) {
                rssCont.innerHTML = `<p style="padding:15px; color:#ccc; font-style:italic; font-size:12px;">(RSS proxy active - feeds synced via alerts)</p>`;
            }

            const newsRes = await fetch(URLS.news);
            const newsData = await newsRes.json();
            const townNews = newsData.filter(n => (n.title+n.full_story).toLowerCase().includes(activeTown));
            const newsCont = document.getElementById('json-news-container');
            if (newsCont) {
                newsCont.innerHTML = '';
                townNews.slice(0,3).forEach(n => {
                    newsCont.innerHTML += `
                        <div class="newspaper-card">
                            <h3>${n.title}</h3>
                            <p style="font-size:14px; color:#333;">${(n.full_story || '').substring(0,120)}...</p>
                        </div>`;
                });
            }
        } catch(e) {
            console.error("Failed to load news", e);
        }
    }

    // --- 5. MAPS DIRECTORY (Right Column) ---
    async function loadMaps() {
        try {
            const res = await fetch(URLS.maps);
            const data = await res.json();
            const townData = data[activeTown];
            if(townData) {
                const addr = encodeURIComponent(townData.address);
                const mapCont = document.getElementById('dynamic-map-container');
                if (mapCont) {
                    mapCont.innerHTML = `
                        <a href="tel:${townData.phone.replace(/[^0-9]/g,'')}" class="directory-click-row" style="color:#fff; text-decoration:none;">📞 ${townData.phone}</a>
                        <a href="https://maps.google.com/?q=${addr}" target="_blank" class="directory-click-row" style="color:#fff; text-decoration:none;">📍 ${townData.address}</a>
                        <div style="margin-top:10px; display:flex; gap:10px;">
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${addr}" target="_blank" style="background:#333; color:#fff; padding:5px; text-decoration:none; border-radius:4px; font-size:11px;">Google Maps</a>
                            <a href="https://waze.com/ul?q=${addr}&navigate=yes" target="_blank" style="background:#333; color:#fff; padding:5px; text-decoration:none; border-radius:4px; font-size:11px;">Waze</a>
                        </div>`;
                }
            }
        } catch(e) {
            console.error("Failed to load maps", e);
        }
    }

    // --- 6. HISTORY (Right Column) ---
    async function loadHistory() {
        try {
            const res = await fetch(URLS.history);
            const data = await res.json();
            const cont = document.getElementById('history-json-container');
            if (cont) {
                cont.innerHTML = '';
                const items = Array.isArray(data) ? data : data.history || [];
                items.slice(0,4).forEach(h => {
                    cont.innerHTML += `<div style="border-bottom:1px solid #333; padding:10px 0;">
                        <span style="color:var(--town-detail); font-weight:bold; font-size:12px;">${h.year||h.date}</span>
                        <p style="margin:5px 0 0 0; color:#ccc; font-size:11px;">${h.event||h.title}</p>
                    </div>`;
                });
            }
        } catch(e) {
            console.error("Failed to load history", e);
        }
    }

    // --- 7. PARTNERS (Scattered & Bottom Strip) ---
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    async function loadPartners() {
        try {
            const res = await fetch(URLS.partners);
            const data = await res.json();
            const partners = data.filter(p => p.county && p.county.toLowerCase().includes('clay'));
            
            if(partners.length > 0) {
                const cleanPool = shuffleArray([...partners]);
                
                // Right Column Top
                const pRight = cleanPool[0];
                const rightImg = document.getElementById('partner-image-right');
                const rightLink = document.getElementById('partner-link-right');
                if (rightImg && rightLink) {
                    rightImg.src = pRight.image;
                    rightLink.innerText = pRight.name;
                    rightLink.href = pRight.websiteUrl;
                }
                
                // Ticker Top
                const tickerLink = document.getElementById('ticker-link');
                if (tickerLink) {
                    tickerLink.innerText = pRight.name;
                    tickerLink.href = pRight.websiteUrl;
                }

                // Bottom Strip
                const strip = document.getElementById('bottom-partners-strip');
                if (strip) {
                    strip.innerHTML = '';
                    cleanPool.slice(0,5).forEach(p => {
                        strip.innerHTML += `
                            <div class="showcase-card-body">
                                <div class="showcase-media-canvas"><img src="${p.image}"></div>
                                <a href="${p.websiteUrl}" target="main-content-window" class="showcase-action-link">${p.name}</a>
                            </div>`;
                    });
                }
            }
        } catch(e) {
            console.error("Failed to load partners", e);
        }
    }

    // --- 8. LOUISVILLE IMAGES (Bottom Gallery) ---
    async function loadImages() {
        try {
            const res = await fetch(URLS.images);
            const data = await res.json();
            const gal = document.getElementById('louisville-images-gallery');
            if (gal) {
                gal.innerHTML = '';
                data.slice(0,5).forEach(img => {
                    gal.innerHTML += `
                        <div class="showcase-card-body">
                            <div class="showcase-media-canvas"><img src="${img.url || img.image || img}"></div>
                        </div>`;
                });
            }
        } catch(e) {
            console.error("Failed to load gallery images", e);
        }
    }

    // --- 9. FIREBASE GAS (Right Column) ---
    function initFirebaseGas() {
        try {
            const fbConfig = { databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com", projectId: "smlc-fuel-monitor" };
            if(!firebase.apps.length) firebase.initializeApp(fbConfig);
            firebase.database().ref('fuel_prices/48026').on('value', (snap) => {
                const val = snap.val();
                if(val) {
                    const regEl = document.getElementById('lv-reg');
                    const dieEl = document.getElementById('lv-die');
                    const timeEl = document.getElementById('lv-time');
                    if (regEl) regEl.innerText = val.reg || "--.--";
                    if (dieEl) dieEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
                    if (timeEl) timeEl.innerText = val.date ? `Updated: ${val.date}` : "Live Sync";
                }
            });
        } catch(e){
            console.error("Failed to initialize Firebase Gas", e);
        }
    }

    // Initialize All
    document.addEventListener('DOMContentLoaded', () => {
        loadAssets();
        loadMenu();
        loadCalendar();
        loadCenterNews();
        loadMaps();
        loadHistory();
        loadPartners();
        loadImages();
        initFirebaseGas();
        
        // Setup 12-second loop for rotating partners
        setInterval(loadPartners, 12000);
    });

})();
