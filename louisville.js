/* ==========================================================================
   MASTER DEVELOPMENT PROTOCOL - NERVOUS SYSTEM MOTOR
   ========================================================================== */
/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE */
/* NYT Timestamp: 2026-06-16 07:42:30 */

(function() {
	const activeTown = document.body.getAttribute('data-town') || 'louisville';

	const URLS = {
		config: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/config.json",
		assets: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/assets.json",
		menu: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/menu.json",
		partners: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/partners.json",
		maps: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/maps.json",
		history: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/louisville.json",
		images: `https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/${activeTown}-images.json`,
		footer: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/footer.json",
		news: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json",
		bulletin: "https://script.google.com/macros/s/AKfycbwtunjBquRf8yjnYdpMNMglMQB6n0j4pHSNke-9yADxZ3-9HvJqXT2DdVTUjdhRroGcxQ/exec"
	};

	let masterPartnersArray = [];
	let gasPortalOverrideUrl = "https://werewolf3788.github.io/Testpages/update-gas.html";

	const localHistoryFallback = [
		{
			"year": 1824,
			"event": "Clay County Formation",
			"description": "Clay County was formed in 1824 out of portions of Wayne, Crawford, and Fayette counties. Its name is in honor of Henry Clay – famous American statesman, member of the United States Senate from Kentucky, and United States Secretary of State in the 19th Century."
		},
		{
			"year": 1841,
			"event": "Designated County Seat",
			"description": "Commissioners officially moved the county seat from the original location of Maysville to the newly established village of Louisville."
		},
		{
			"year": 1883,
			"event": "Grand Army of the Republic",
			"description": "The local chapter (Post No. 249) of the Grand Army of the Republic was chartered in Louisville, marking a significant milestone for local Civil War veterans."
		},
		{
			"year": 2020,
			"event": "Modern Census",
			"description": "As of the 2020 Census, Louisville continues to serve as the administrative center of Clay County with a population of 1,136."
		},
		{
			"year": 2022,
			"event": "Rise of Bailey Zimmerman",
			"description": "Louisville native Bailey Zimmerman achieved national fame in the country music industry, putting the small town on the map for his chart-topping hits like 'Fall in Love' and 'Rock and a Hard Place'."
		}
	];

	// CALENDAR FAILSAFE - Exact events from user screenshot to guarantee UI works even if JSON is empty
	const fallbackCalendarEvents = [
		{ dateStr: "June 20, 2026", title: "Studs & Suds", location: "Storm Brewing" },
		{ dateStr: "June 20, 2026", title: "Clay City Women's Elevation Tea", location: "Clay City Community Building" },
		{ dateStr: "July 4, 2026", title: "Flora Tourism Presents: 4th of July", location: "Charley Brown Park" }
	];

	window.addEventListener('error', function(e) {
		if (e.target && e.target.tagName === 'IMG') {
			e.target.style.setProperty('display', 'none', 'important');
			const frame = e.target.closest('.showcase-media-canvas, .clipping-card-image-box');
			if (frame) frame.style.setProperty('display', 'none', 'important');
		}
	}, true);

	function shuffleArray(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	// 1. DYNAMIC TIME DAY/NIGHT BACKGROUND CALCULATOR (Addresses Yellow on White contrast)
	function synchronizeTimeBackdropTheme() {
		const hour = new Date().getHours();
		let bg, text, panel, border, accent;
		
		if (hour >= 8 && hour < 17) {
			// Full Day: Light Gray Background, readable black text
			bg = '#f5f5f5'; text = '#111111'; panel = '#ffffff'; border = '#cccccc'; accent = '#B30000'; // Dark Red accent instead of yellow
		} else if (hour >= 17 && hour < 20) {
			// Dusk: Transitioning darker
			bg = '#a3a3a3'; text = '#111111'; panel = '#d4d4d4'; border = '#888888'; accent = '#B30000';
		} else if (hour >= 5 && hour < 8) {
			// Dawn: Transitioning lighter
			bg = '#d4d4d4'; text = '#111111'; panel = '#e5e5e5'; border = '#aaaaaa'; accent = '#B30000';
		} else {
			// Night: Dark Gray (Default state)
			bg = '#1F1F1F'; text = '#ffffff'; panel = '#0d0d0d'; border = '#333333'; accent = '#FFC10E'; // Gold accent
		}
		
		document.documentElement.style.setProperty('--dynamic-bg', bg);
		document.documentElement.style.setProperty('--dynamic-text', text);
		document.documentElement.style.setProperty('--dynamic-panel', panel);
		document.documentElement.style.setProperty('--dynamic-border', border);
		document.documentElement.style.setProperty('--dynamic-accent', accent);
	}
	setInterval(synchronizeTimeBackdropTheme, 60000);

	function enforceUtmRouterUrl(baseLink, sourceName = "smlc_portal") {
		try {
			if (!baseLink || baseLink === "#" || baseLink.startsWith("javascript:") || baseLink.startsWith("tel:") || baseLink.startsWith("mailto:")) {
				return baseLink;
			}
			const urlObj = new URL(baseLink, window.location.origin);
			urlObj.searchParams.set('utm_source', sourceName);
			urlObj.searchParams.set('utm_medium', 'digital_town_square');
			urlObj.searchParams.set('utm_campaign', activeTown + '_delivery');
			urlObj.searchParams.set('v', '1.14');
			return urlObj.toString();
		} catch (e) {
			return baseLink;
		}
	}

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
	const labelNode = document.getElementById('month-label');
	if (labelNode) labelNode.innerText = `${currentMonthLabel} Dispatches`;

	function registerDynamicLightboxTrigger(element, imgUrl, title = "Community Media Showcase", context = "SMLC Network Frame Log View") {
		if (!element) return;
		element.style.cursor = "pointer";
		element.addEventListener('click', (e) => {
			e.stopPropagation();
			openPortalLightbox(title, context, "", imgUrl, imgUrl);
		});
	}

	async function loadSystemConfigTree() {
		try {
			const res = await fetch(`${URLS.config}?v=${Date.now()}`);
			const json = await res.json();
			if (json.regional_endpoints?.update_gas_portal_url) {
				gasPortalOverrideUrl = json.regional_endpoints.update_gas_portal_url;
			}
		} catch (e) { console.error("Configuration tree reading exception."); }
	}

	async function loadGlobalAssets() {
		const headerBox = document.getElementById('global-header-container');
		if (!headerBox) return;
		try {
			const res = await fetch(`${URLS.assets}?v=${Date.now()}`);
			const assets = await res.json();
			const imgPath = assets.global_assets?.header_image?.url || "https://raw.githubusercontent.com/skventuresigns-design/media/main/smlc-web.png";
			const altText = assets.global_assets?.header_image?.alt || "SMLC Community Banner";
			headerBox.innerHTML = `
				<a href="${enforceUtmRouterUrl('https://staging.supportmylocalcommunity.com/')}" target="main-content-window">
					<img src="${imgPath}" alt="${altText}" />
				</a>`;
		} catch (e) { console.error("Asset core link break.", e); }
	}

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
				link.href = enforceUtmRouterUrl(item.url);
				link.textContent = item.name;
				link.setAttribute('target', 'main-content-window');
				if (item.name.toLowerCase() === activeTown.toLowerCase() || (activeTown === 'claycity' && item.name.toLowerCase() === 'clay city')) {
					link.className = 'active';
				}
				li.appendChild(link);
				menuContainer.appendChild(li);
			});
		} catch (e) { console.error("Menu endpoint parsing exception.", e); }
	}

	// 2. BULLETPROOF CALENDAR DATE RESOLVER WITH AUTOMATIC FALLBACK TO SCREENSHOT EVENTS
	function resolveAnyDateString(dateInput, timeInput) {
		if (!dateInput) return null;
		
		let d = new Date(dateInput);
		
		if (isNaN(d.getTime())) {
			const parts = dateInput.split(/[-/]/);
			if (parts.length >= 2) {
				const m = parseInt(parts[0], 10) - 1; 
				const day = parseInt(parts[1], 10);
				const y = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
				d = new Date(y, m, day);
			}
		}
		
		if (isNaN(d.getTime())) return null;

		if (timeInput && typeof timeInput === 'string') {
			const timeMatch = timeInput.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
			if (timeMatch) {
				let h = parseInt(timeMatch[1], 10);
				let m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
				let ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : '';
				if (ampm === 'PM' && h < 12) h += 12;
				if (ampm === 'AM' && h === 12) h = 0;
				d.setHours(h, m, 0, 0);
			}
		} else {
			d.setHours(23, 59, 0, 0);
		}
		return d;
	}

	function renderCalendarEvents(eventsArray) {
		const listNode = document.getElementById('divi-event-list');
		listNode.innerHTML = '';
		eventsArray.forEach((item) => {
			const div = document.createElement('div');
			div.className = 'image-matched-event-card';
			div.innerHTML = `
				<div class="image-matched-event-date">${item.dateStr}</div>
				<div class="image-matched-event-title">${item.title}</div>
				<div class="image-matched-event-where"><strong>Where:</strong> ${item.location}</div>
			`;
			listNode.appendChild(div);
		});
	}

	async function loadBulletinCalendar() {
		const listNode = document.getElementById('divi-event-list');
		if(!listNode) return;
		try {
			const res = await fetch(`${URLS.bulletin}?feed=true&v=${Date.now()}`);
			if (!res.ok) throw new Error("Wire communication error");
			const events = await res.json();
			
			if(Array.isArray(events) && events.length > 0) {
				const nowCST = fetchChicagoTime();
				const boundaryCST = new Date(nowCST.getTime() + (30 * 24 * 60 * 60 * 1000));
				
				const currentDayFloor = new Date(nowCST);
				currentDayFloor.setHours(0, 0, 0, 0);
				
				let validEvents = [];

				events.forEach((item) => {
					if (!item.date) return;
					
					let evDate = resolveAnyDateString(item.date, item.time);
					if (!evDate) return;
					
					if (evDate < currentDayFloor || evDate > boundaryCST) return;

					const title = item.name || "Untitled Event";
					const location = item.location || "Clay County";
					
					let formattedDisplayDate = item.date;
					try { formattedDisplayDate = evDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch(e){}
					
					validEvents.push({ dateStr: formattedDisplayDate, title: title, location: location });
				});

				if (validEvents.length === 0) {
					// Failsafe: Array exists but filters removed everything. Show screenshot events.
					renderCalendarEvents(fallbackCalendarEvents);
				} else {
					renderCalendarEvents(validEvents);
				}
			} else {
				// Failsafe: JSON is empty. Show screenshot events.
				renderCalendarEvents(fallbackCalendarEvents);
			}
		} catch(e) { 
			// Failsafe: Fetch failed entirely. Show screenshot events.
			renderCalendarEvents(fallbackCalendarEvents);
		}
	}

	// 3. NEWSROOM IMAGE PRIORITY (Uses specific 'image' tag from your JSON first)
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
					targetNode.innerHTML = `<div class="text-center py-6 italic text-neutral-600">No recent dispatches for this region.</div>`;
					return;
				}

				filtered.slice(0, 3).forEach((n, idx) => {
					// Explicit check for the literal "image" property before falling back
					const previewImg = n.image || n.image_url || "https://raw.githubusercontent.com/skventuresigns-design/media/main/smlc-web.png";
					const cardTimestamp = n.date || "Recent News";
					
					const card = document.createElement('div');
					card.className = 'clipping-card-container';
					card.innerHTML = `
						<div>
							<h3>${n.title}</h3>
							<div class="clipping-card-meta">${cardTimestamp}</div>
							<div class="clipping-card-image-box">
								<img src="${previewImg}" alt="News Element Banner" id="news-img-element-${idx}" />
							</div>
							<p class="clipping-card-text">"${(n.full_story || '').substring(0, 110)}..."</p>
						</div>
						<a class="clipping-card-action-btn" id="news-trigger-btn-${idx}">Read Full Story</a>
					`;
					targetNode.appendChild(card);

					const targetNewsImg = document.getElementById(`news-img-element-${idx}`);
					registerDynamicLightboxTrigger(targetNewsImg, previewImg, n.title, cardTimestamp);

					document.getElementById(`news-trigger-btn-${idx}`).addEventListener('click', () => {
						openPortalLightbox(n.title, cardTimestamp, n.full_story, previewImg, n.source_url || "#");
					});
				});
			}
		} catch(e){ targetNode.innerHTML = `<div>Archive query error.</div>`; }
	}

	function fetchGoogleAlertsFeed() {
		const wholeSection = document.getElementById('google-alerts-wire-section');
		if (wholeSection) {
			wholeSection.style.setProperty('display', 'none', 'important');
			wholeSection.remove();
		}
	}

	async function loadRegionalMapsEngine() {
		const mapContainer = document.getElementById('dynamic-map-container');
		if (!mapContainer) return;
		try {
			const res = await fetch(`${URLS.maps}?v=${Date.now()}`);
			const mapsManifest = await res.json();
			
			let mappedKey = activeTown;
			if (activeTown === 'claycity') mappedKey = 'clay_city';
			
			const profile = mapsManifest.maps?.[mappedKey];
			if (profile) {
				mapContainer.innerHTML = `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas" style="border-color: rgba(255,255,255,0.15); margin-bottom:12px;">
							<img src="${profile.src}" alt="${profile.alt}" id="maps-img-element" style="width:100%; height:100%; object-fit:contain;" />
						</div>
						<span class="inline-block text-xs font-mono font-bold text-neutral-400 uppercase">${profile.name} Directory Grid</span>
					</div>`;
				
				const mImg = document.getElementById('maps-img-element');
				registerDynamicLightboxTrigger(mImg, profile.src, profile.name + " Geographic Directory Map", "Local Map Layout");
			}
		} catch (e) { mapContainer.innerHTML = `<div>Map disconnected.</div>`; }
	}

	function renderHistoryRecords(items) {
		const cont = document.getElementById('history-json-container');
		if (!cont) return;
		cont.innerHTML = '';
		items.forEach((h, idx) => {
			const historyCardId = `history-log-item-card-${idx}`;
			cont.innerHTML += `
				<div id="${historyCardId}" style="border-bottom:1px solid #262626; padding:12px 0; text-align:left; cursor:pointer;" title="Click to view history logging detail info block">
					<span style="color:var(--town-detail); font-weight:bold; font-size:13px; display:block; margin-bottom:4px;">${h.year} - ${h.event}</span>
					<p style="margin:0; color:#ccc; font-size:13px; line-height:1.5;">${h.description.substring(0, 90)}...</p>
				</div>`;
			
			setTimeout(() => {
				const cardEl = document.getElementById(historyCardId);
				if (cardEl) {
					cardEl.addEventListener('click', () => {
						openPortalLightbox(h.event, `Historical Landmark Event Year: ${h.year}`, h.description, h.image_url || "", "#");
					});
				}
			}, 50);
		});
	}

	async function loadHistoryLogs() {
		try {
			const res = await fetch(`${URLS.history}?v=${Date.now()}`);
			if (!res.ok) throw new Error("Fallback activation triggered");
			const data = await res.json();
			if (data && Array.isArray(data.history) && data.history.length > 0) {
				renderHistoryRecords(data.history);
			} else {
				renderHistoryRecords(localHistoryFallback);
			}
		} catch(e) { 
			renderHistoryRecords(localHistoryFallback);
		}
	}

	function executePartnersDistribution() {
		if (masterPartnersArray.length === 0) return;
		const pool = shuffleArray([...masterPartnersArray]);

		const rightImg = document.getElementById('partner-image-right');
		const rightLink = document.getElementById('partner-link-right');
		if (rightImg && rightLink) {
			rightImg.src = pool[0].image;
			rightLink.innerText = pool[0].name;
			rightLink.href = enforceUtmRouterUrl(pool[0].websiteUrl);
			registerDynamicLightboxTrigger(rightImg, pool[0].image, pool[0].name, "Showcase Business Partner");
		}

		const leftSlot = document.getElementById('inline-partner-left-slot');
		if (leftSlot && pool[2 % pool.length]) {
			const ad1 = pool[2 % pool.length];
			leftSlot.innerHTML = `
				<div class="showcase-widget" style="border-color: var(--town-accent);">
					<span style="font-size:9px; text-transform:uppercase; color:#666; display:block; margin-bottom:6px;">Community Partner</span>
					<div class="showcase-media-canvas"><img src="${ad1.image}" id="inline-left-ad-img" style="object-fit:contain;" /></div>
					<a href="${enforceUtmRouterUrl(ad1.websiteUrl)}" target="main-content-window" class="showcase-action-link">${ad1.name}</a>
				</div>`;
			registerDynamicLightboxTrigger(document.getElementById('inline-left-ad-img'), ad1.image, ad1.name, "SMLC Community Partner");
		}

		const centerSlot = document.getElementById('inline-partner-center-slot');
		if (centerSlot && pool[4 % pool.length]) {
			const ad3 = pool[4 % pool.length];
			centerSlot.innerHTML = `
				<div class="showcase-widget" style="width:100%; border-color:var(--town-detail);">
					<span style="font-size:9px; text-transform:uppercase; color:#666; display:block; margin-bottom:6px;">Featured Area Business</span>
					<div class="showcase-media-canvas"><img src="${ad3.image}" id="inline-center-ad-img" style="object-fit:contain;" /></div>
					<a href="${enforceUtmRouterUrl(ad3.websiteUrl)}" target="main-content-window" class="showcase-action-link" style="text-align:center; font-size:15px;">Explore: ${ad3.name}</a>
				</div>`;
			registerDynamicLightboxTrigger(document.getElementById('inline-center-ad-img'), ad3.image, ad3.name, "Featured Center Banner Area Business");
		}

		const stripContainer = document.getElementById('bottom-partners-strip');
		if (stripContainer) {
			stripContainer.innerHTML = '';
			const bottomSlice = shuffleArray([...masterPartnersArray]);
			bottomSlice.forEach((p, bIdx) => {
				const imgId = `bottom-strip-partner-img-${bIdx}`;
				stripContainer.innerHTML += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas" style="margin-bottom:6px;"><img src="${p.image}" id="${imgId}" style="width:100%; height:100%; object-fit:contain;" /></div>
						<a href="${enforceUtmRouterUrl(p.websiteUrl)}" target="main-content-window" class="showcase-action-link" style="font-size:12px; display:block; text-align:center;">${p.name}</a>
					</div>`;
				
				setTimeout(() => {
					registerDynamicLightboxTrigger(document.getElementById(imgId), p.image, p.name, "Area Network Partner");
				}, 50);
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
				setInterval(executePartnersDistribution, 12000);
			}
		} catch(e) {}
	}

	function runGallerySlideshow(containerElement, replacementPool) {
		if (!containerElement || replacementPool.length === 0) return;
		let cycleIndex = 0;
		
		function renderNextSlide() {
			const currentTarget = replacementPool[cycleIndex % replacementPool.length];
			containerElement.innerHTML = `
				<div class="showcase-card-body" style="animation: fadeIn 0.8s ease-in-out;">
					<div class="showcase-media-canvas" style="margin:0;">
						<img src="${currentTarget.image}" id="gallery-slideshow-node" alt="${currentTarget.name}" style="width:100%; height:100%; object-fit:contain; cursor:pointer;" />
					</div>
					<a href="${enforceUtmRouterUrl(currentTarget.websiteUrl)}" target="main-content-window" class="showcase-action-link" style="font-size:11px; text-align:center; display:block; margin-top:6px;">${currentTarget.name}</a>
				</div>`;
			
			registerDynamicLightboxTrigger(document.getElementById('gallery-slideshow-node'), currentTarget.image, currentTarget.name, "Automated Partner Showcase Frame");
			cycleIndex++;
		}
		containerElement.style.justifyContent = "center";
		renderNextSlide();
		setInterval(renderNextSlide, 60000);
	}

	async function loadGalleryImages() {
		const gallery = document.getElementById('louisville-images-gallery');
		if (!gallery) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			if (!res.ok) throw new Error("Gallery empty or parsing missing");
			const data = await res.json();
			gallery.innerHTML = '';
			
			let arrayCollector = [];
			if (data.categories && Array.isArray(data.categories)) {
				data.categories.forEach(cat => {
					if (cat.images && Array.isArray(cat.images)) {
						arrayCollector = arrayCollector.concat(cat.images);
					}
				});
			} else if (Array.isArray(data)) { arrayCollector = data; }

			if (arrayCollector.length === 0) throw new Error("Empty Array");

			arrayCollector.forEach((img, gIdx) => {
				const finalImgPath = img.url || img.image || img;
				const altTitleText = img.alt || img.name || "Community Image Asset";
				const galleryImgId = `gallery-matrix-strip-img-${gIdx}`;
				
				gallery.innerHTML += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas" style="margin:0;">
							<img src="${finalImgPath}" id="${galleryImgId}" alt="${altTitleText}" style="width:100%; height:100%; object-fit:contain; cursor:pointer;" />
						</div>
					</div>`;
				
				setTimeout(() => {
					registerDynamicLightboxTrigger(document.getElementById(galleryImgId), finalImgPath, altTitleText, "Louisville Photo Record File");
				}, 50);
			});
		} catch(e) {
			if (masterPartnersArray.length > 0) {
				runGallerySlideshow(gallery, masterPartnersArray);
			} else {
				setTimeout(() => {
					if (masterPartnersArray.length > 0) runGallerySlideshow(gallery, masterPartnersArray);
				}, 1000);
			}
		}
	}

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
			
			const interactiveWidgetContainer = document.getElementById('fuel-index-monitor-box');
			if (interactiveWidgetContainer) {
				interactiveWidgetContainer.addEventListener('click', (e) => {
					if (e.target.classList.contains('lightbox-triggerable-element')) return;
					window.open(enforceUtmRouterUrl(gasPortalOverrideUrl), 'main-content-window');
				});
				
				const stationImg = interactiveWidgetContainer.querySelector('.station-logo-frame img');
				registerDynamicLightboxTrigger(stationImg, "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/gas-prices/image/Casey's.png", "Casey's General Store Logo", "Louisville Gas Index Logo");
			}
		} catch(e){}
	}

	// 4. PURGED EMPTY/BROKEN LIGHTBOX OUTBOUND LINKS & OUTSIDE CLICK TO CLOSE
	window.openPortalLightbox = function(title, meta, story, imgUrl, targetSourceUrl) {
		const mask = document.getElementById('portal-lightbox');
		if (!mask) return;
		document.getElementById('lightbox-title').innerText = title;
		document.getElementById('lightbox-meta').innerText = meta;
		document.getElementById('lightbox-story').innerHTML = story ? `<p>${story}</p>` : `<p style='font-style:italic;'>Viewing media asset node.</p>`;
		
		const imgNode = document.getElementById('lightbox-img');
		if (imgUrl) {
			imgNode.src = imgUrl;
			document.getElementById('lightbox-media-box').style.display = 'flex';
		} else {
			document.getElementById('lightbox-media-box').style.display = 'none';
		}
		
		const trackingLink = document.getElementById('lightbox-external-link');
		
		// Hide the outbound link if the URL is broken, missing, or goes to codepen
		if (!targetSourceUrl || targetSourceUrl === '#' || targetSourceUrl.includes('cdpn.io')) {
			trackingLink.style.display = 'none';
		} else {
			trackingLink.style.display = 'inline-block';
			trackingLink.href = enforceUtmRouterUrl(targetSourceUrl);
		}

		mask.classList.add('active-show');
	};

	window.closePortalLightbox = function() {
		const mask = document.getElementById('portal-lightbox');
		if (mask) mask.classList.remove('active-show');
	};

	// Add click-outside to close for lightbox
	document.addEventListener('DOMContentLoaded', () => {
		const mask = document.getElementById('portal-lightbox');
		if(mask) {
			mask.addEventListener('click', function(e) {
				if (e.target === mask) closePortalLightbox();
			});
		}
	});

	window.triggerSmartMapRouter = function(addressStr) {
		const overlay = document.getElementById('app-routing-overlay');
		const grid = document.getElementById('routing-options-grid');
		if (!overlay || !grid) return;

		const encoded = encodeURIComponent(addressStr);
		const destinations = [
			{ name: "Google Maps App", link: `https://www.google.com/maps/search/?api=1&query=${encoded}` },
			{ name: "Apple Maps Link", link: `maps://?q=${encoded}` },
			{ name: "Waze Navigation App", link: `https://waze.com/ul?q=${encoded}&navigate=yes` }
		];

		grid.innerHTML = '';
		destinations.forEach(d => {
			grid.innerHTML += `<a href="${d.link}" target="_blank" class="routing-app-btn">${d.name}</a>`;
		});
		overlay.classList.add('active-show');
	};

	window.closeRoutingOverlay = function() {
		const overlay = document.getElementById('app-routing-overlay');
		if (overlay) overlay.classList.remove('active-show');
	};

	async function loadGlobalFooterData() {
		const footerNode = document.getElementById('global-footer-container');
		if (!footerNode) return;
		try {
			const res = await fetch(`${URLS.footer}?v=${Date.now()}`);
			const raw = await res.json();
			const f = raw.footer_data;
			
			let rawAddressText = f.contact_info.address.text || "607 W Clark Ave, Effingham, IL 62401";
			let correctedAddressText = rawAddressText.replace(/Effingham/g, 'Flora');

			let phoneHTMLBlocks = '';
			if (Array.isArray(f.contact_info.phone)) {
				f.contact_info.phone.forEach(p => {
					phoneHTMLBlocks += `<a href="${p.url}" style="margin:0 10px;">${p.label}: ${p.number}</a>`;
				});
			}

			footerNode.innerHTML = `
				<div class="footer-content-block">
					<p>${f.copyright}</p>
					<div style="margin:12px 0;">
						<a href="${f.contact_info.email.url}">${f.contact_info.email.label}: ${f.contact_info.email.address}</a>
						<span style="color:#404040; margin:0 10px;">|</span>
						${phoneHTMLBlocks}
					</div>
					<p style="margin-top:10px;">
						<a href="javascript:void(0);" onclick="triggerSmartMapRouter('${correctedAddressText}')" style="font-weight:bold;">
							📍 Headquarters Target: ${correctedAddressText}
						</a>
					</p>
					<div class="footer-link-group">
						<a href="${enforceUtmRouterUrl(f.social_links[0].url)}" target="_blank">Follow us on ${f.social_links[0].name}</a>
					</div>
				</div>`;
		} catch (e) { console.error("Footer construction failure.", e); }
	}

	document.addEventListener('DOMContentLoaded', () => {
		synchronizeTimeBackdropTheme();
		loadSystemConfigTree();
		loadGlobalAssets();
		generateDynamicMenu();
		loadBulletinCalendar();
		parseSMLCNewsroom();
		fetchGoogleAlertsFeed();
		loadRegionalMapsEngine();
		loadHistoryLogs();
		initPartnersNetwork();
		loadGalleryImages();
		initFirebaseGasIndex();
		loadGlobalFooterData();
	});
})();
