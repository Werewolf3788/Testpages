/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE */
/* NYT Timestamp: 2026-06-16 05:05:12 */

(function() {
	const activeTown = document.body.getAttribute('data-town') || 'louisville';

	// Absolute production endpoints routing directly to your test sandbox hubs
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

	let masterPartnersArray = [];
	let localNewsMemory = [];

	// 1. TIMING & CHICAGO CLOCK ENGINE (Strict 30-Day Limit Constraints)
	function fetchChicagoTime() {
		try {
			const opts = {
				timeZone: 'America/Chicago',
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
			};
			const formatter = new Intl.DateTimeFormat('en-US', opts);
			const blocks = formatter.formatToParts(new Date());
			const dMap = {};
			blocks.forEach(b => dMap[b.type] = b.value);
			return new Date(dMap.year, dMap.month - 1, dMap.day, dMap.hour, dMap.minute, dMap.second);
		} catch(e) { return new Date(); }
	}

	function runChicagoClockLoop() {
		const label = document.getElementById('chicago-clock');
		if(!label) return;
		try {
			label.innerText = new Date().toLocaleTimeString("en-US", {
				timeZone: "America/Chicago",
				hour: "2-digit", minute: "2-digit"
			});
		} catch(e){}
	}
	setInterval(runChicagoClockLoop, 10000);
	runChicagoClockLoop();

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const currentMonthLabel = monthNames[fetchChicagoTime().getMonth()];
	const monthTagline = document.getElementById('month-tagline');
	if(monthTagline) {
		monthTagline.innerText = `${currentMonthLabel} Dispatches & Happenings`;
	}

	// 2. DYNAMIC BRAND HEADER SYSTEM (Accurately parsing nested assets.json)
	async function loadGlobalAssets() {
		const headerBox = document.getElementById('global-header-container');
		if (!headerBox) return;
		try {
			const res = await fetch(`${URLS.assets}?v=${Date.now()}`);
			const assets = await res.json();
			
			// Navigates your deep nested target parameters safely: global_assets.header_image.url
			const imgPath = assets.global_assets?.header_image?.url || assets.header_image || "./assets/images/header_banner.jpg";
			const altText = assets.global_assets?.header_image?.alt || "SMLC Community Banner";
			
			headerBox.innerHTML = `
				<a href="https://staging.supportmylocalcommunity.com/" target="main-content-window">
					<img src="${imgPath}" alt="${altText}" />
				</a>`;
		} catch (e) {
			console.error("Asset matrix resolution failure", e);
		}
	}

	// 3. MENU INJECTION ENGINE (Bypasses local restrictions using menu.json target nodes)
	async function generateDynamicMenu() {
		const menuContainer = document.getElementById('dynamic-menu-links');
		if (!menuContainer) return;
		try {
			const response = await fetch(`${URLS.menu}?v=${Date.now()}`);
			const menuItems = await response.json();
			menuContainer.innerHTML = '';

			menuItems.forEach(item => {
				const li = document.createElement('li');
				const link = document.createElement('a');
				link.href = item.url;
				link.textContent = item.name;
				link.setAttribute('target', 'main-content-window');
				
				if (item.name.toLowerCase() === activeTown.toLowerCase()) {
					link.className = 'active';
				}
				li.appendChild(link);
				menuContainer.appendChild(li);
			});
		} catch (e) {
			console.error("Menu connection error", e);
		}
	}

	// 4. LIVE EVENTS CALENDAR (Strict 30-Day Filter via America/Chicago Clock Baseline)
	async function loadBulletinCalendar() {
		const listNode = document.getElementById('divi-event-list');
		if(!listNode) return;
		try {
			const res = await fetch(`${URLS.bulletin}?feed=true&v=${Date.now()}`);
			const rawEvents = await res.json();
			if(Array.isArray(rawEvents) && rawEvents.length > 0) {
				const nowCST = fetchChicagoTime();
				const boundaryCST = new Date(nowCST.getTime() + (30 * 24 * 60 * 60 * 1000));

				listNode.innerHTML = '';
				let activeLogCount = 0;

				rawEvents.forEach(item => {
					if(!item.date || activeLogCount >= 6) return;
					
					// Assemble exact baseline object string parameters safely for evaluation checks
					const evDate = new Date(`${item.date} ${item.time || '12:00 AM'}`);
					if(!isNaN(evDate) && (evDate < nowCST || evDate > boundaryCST)) return;

					activeLogCount++;
					const div = document.createElement('div');
					div.className = 'divi-event-item';
					div.innerHTML = `
						<div class="divi-event-date">${item.date}</div>
						<div class="divi-event-title">${item.name || item.title}</div>
						<div class="event-info-text">
							<strong>Where:</strong> ${item.location || 'Clay County'}<br>
							<strong>Time:</strong> ${item.time || 'TBA'}
						</div>`;
					listNode.appendChild(div);
				});

				if(activeLogCount === 0) {
					listNode.innerHTML = `<p style="text-align:center; font-style:italic; padding:20px; color:#222;">No events matching current timeframe.</p>`;
				}
			}
		} catch(e) { listNode.innerHTML = `<p style="padding:20px; color:#cc0000;">Sync Error.</p>`; }
	}

	// 5. LOCAL NEWS ARCHIVE FILTER ENGINE
	async function parseSMLCNewsroom() {
		const targetNode = document.getElementById('json-news-container');
		if(!targetNode) return;
		try {
			const res = await fetch(`${URLS.news}?v=${Date.now()}`);
			const payload = await res.json();
			if(Array.isArray(payload)) {
				const filtered = payload.filter(art => (art.title + art.full_story).toLowerCase().includes(activeTown.toLowerCase()));
				targetNode.innerHTML = '';
				
				if(filtered.length === 0) {
					targetNode.innerHTML = `<div class="text-center py-6 italic text-neutral-600">No recent archives for this region.</div>`;
					return;
				}

				filtered.slice(0, 3).forEach(n => {
					targetNode.innerHTML += `
						<div class="newspaper-card">
							<h3>${n.title}</h3>
							<p>${(n.full_story || '').substring(0, 140)}...</p>
						</div>`;
				});
			}
		} catch(e){}
	}

	// 6. MAPS ENGINE MODULE (Parsing maps.json graphics structure accurately)
	async function loadRegionalMapsEngine() {
		const mapContainer = document.getElementById('dynamic-map-container');
		if (!mapContainer) return;
		try {
			const res = await fetch(`${URLS.maps}?v=${Date.now()}`);
			const mapsManifest = await res.json();
			
			// Extracts the proper dynamic profile mapping node target object field safely
			const profile = mapsManifest.maps?.[activeTown] || mapsManifest.maps?.['louisville'];
			if (profile) {
				mapContainer.innerHTML = `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas" style="border-color: rgba(255,255,255,0.15); margin-bottom:12px;">
							<img src="${profile.src}" alt="${profile.alt}" style="width:100%; height:100%; object-fit:cover;" />
						</div>
						<span class="inline-block text-xs font-mono font-bold text-neutral-400 uppercase">${profile.name} Geographic Map</span>
					</div>`;
			}
		} catch (e) {
			mapContainer.innerHTML = `<div class="feed-loading">Map resource disconnected.</div>`;
		}
	}

	// 7. HISTORY ARCHIVE LOADER
	async function loadHistoryLogs() {
		const cont = document.getElementById('history-json-container');
		if (!cont) return;
		try {
			const res = await fetch(`${URLS.history}?v=${Date.now()}`);
			const data = await res.json();
			cont.innerHTML = '';
			const items = Array.isArray(data) ? data : data.history || [];
			
			if(items.length === 0) { cont.innerHTML = `<div class="feed-loading">Logs empty.</div>`; return; }

			items.slice(0, 4).forEach(h => {
				cont.innerHTML += `
					<div style="border-bottom:1px solid #333; padding:10px 0; text-align:left;">
						<span style="color:var(--town-detail); font-weight:bold; font-size:12px;">${h.year || h.date}</span>
						<p style="margin:5px 0 0 0; color:#ccc; font-size:11px; line-height:1.4;">${h.event || h.title || h.text}</p>
					</div>`;
			});
		} catch(e) { cont.innerHTML = `<div class="feed-loading">Archive resting...</div>`; }
	}

	// 8. SCATTERED PARTNERS ENGINE (Rotates Right column + footer strips every 12s without row replication)
	function shuffleArray(array) {
		let currentIndex = array.length, randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	function executePartnersDistribution() {
		if (masterPartnersArray.length === 0) return;
		const freshPool = shuffleArray([...masterPartnersArray]);

		// Card 1: Right Column Showcase Widget Target Elements
		const rightPartner = freshPool[0];
		const rightImg = document.getElementById('partner-image-right');
		const rightLink = document.getElementById('partner-link-right');
		if (rightImg && rightLink) {
			rightImg.src = rightPartner.image;
			rightLink.innerText = rightPartner.name;
			rightLink.href = rightPartner.websiteUrl;
		}

		// Card 2: Top Spotlight Marquee Link Node
		const tickerLink = document.getElementById('ticker-link');
		if (tickerLink) {
			tickerLink.innerText = freshPool[1 % freshPool.length].name;
			tickerLink.href = freshPool[1 % freshPool.length].websiteUrl;
		}

		// Cards 3-7: Complete Solid Bottom 5 Horizontal Strip Row
		const stripContainer = document.getElementById('bottom-partners-strip');
		if (stripContainer) {
			stripContainer.innerHTML = '';
			// Shuffles another slice array to guarantee zero card block duplication in same line rows
			const stripPool = shuffleArray([...masterPartnersArray]);
			stripPool.slice(0, 5).forEach(p => {
				stripContainer.innerHTML += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas"><img src="${p.image}" style="width:100%; height:100%; object-fit:cover;" /></div>
						<a href="${p.websiteUrl}" target="main-content-window" class="showcase-action-link">${p.name}</a>
					</div>`;
			});
		}
	}

	async function initPartnersNetwork() {
		try {
			const res = await fetch(`${URLS.partners}?v=${Date.now()}`);
			const data = await res.json();
			masterPartnersArray = data.filter(p => p.county && p.county.toLowerCase().includes('clay'));
			if(masterPartnersArray.length > 0) {
				executePartnersDistribution();
				setInterval(executePartnersDistribution, 12000); // Strict 12s automation processing loop
			}
		} catch(e) {}
	}

	// 9. GALLERY MODULE
	async function loadGalleryImages() {
		const gallery = document.getElementById('louisville-images-gallery');
		if (!gallery) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			const data = await res.json();
			gallery.innerHTML = '';
			data.slice(0, 5).forEach(img => {
				gallery.innerHTML += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas">
							<img src="${img.url || img.image || img}" style="width:100%; height:100%; object-fit:cover;" />
						</div>
					</div>`;
			});
		} catch(e){}
	}

	// 10. FIREBASE REALTIME PRICE DATABASE CONNECTORS
	function initFirebaseGasIndex() {
		try {
			const fbConfig = { databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com", projectId: "smlc-fuel-monitor" };
			if(!firebase.apps.length) firebase.initializeApp(fbConfig);
			firebase.database().ref('fuel_prices/48026').on('value', (snap) => {
				const val = snap.val();
				if(val) {
					document.getElementById('lv-reg').innerText = val.reg || "--.--";
					document.getElementById('lv-die').innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
					document.getElementById('lv-time').innerText = val.date ? `Updated: ${val.date}` : "Live Sync";
				}
			});
		} catch(e){}
	}

	// Assembly Execution Loop Trigger Elements
	document.addEventListener('DOMContentLoaded', () => {
		loadGlobalAssets();
		generateDynamicMenu();
		loadBulletinCalendar();
		parseSMLCNewsroom();
		loadRegionalMapsEngine();
		loadHistoryLogs();
		initPartnersNetwork();
		loadGalleryImages();
		initFirebaseGasIndex();
	});
})();
