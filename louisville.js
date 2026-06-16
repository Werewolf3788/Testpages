(function() {
	// DYNAMIC CONFIGURATION & DATA ENDPOINTS
	const APPS_SCRIPT_BULLETIN_URL = "https://script.google.com/macros/s/AKfycbwtunjBquRf8yjnYdpMNMglMQB6n0j4pHSNke-9yADxZ3-9HvJqXT2DdVTUjdhRroGcxQ/exec";
	const SMLC_LOCAL_NEWS_JSON = "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json";
	const MERCHANT_SPREADSHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwXvTxCrAM-1tVTG4Rhg8Oka186yumxK3nebWyE61pD_jt-hhlo-d4D0iv05P4pm0Ag7JH-tAiwzbo/pub?output=csv";
	const PARTNERS_JSON_URL = "json/partners.json";

	const WIRE_FEEDS = [
		"https://www.google.com/alerts/feeds/16385066500020016213/7900491242905665188",
		"https://www.google.com/alerts/feeds/16385066500020016213/6707108232262016148",
		"https://www.google.com/alerts/feeds/16385066500020016213/14281446210139084731",
		"https://www.google.com/alerts/feeds/16385066500020016213/68970857447932436"
	];
	
	const townHistoryTree = [
		"https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/louisville.json"
	];

	let masterPartnersArray = [];
	let localNewsMemory = [];

	// 1. TIMING & CLOCK SERVICES
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
	if(document.getElementById('month-label')) {
		document.getElementById('month-label').innerText = `${currentMonthLabel} Dispatches`;
	}

	// UTILITY METADATA & URL PARSERS
	function extractProperty(item, possibleKeys) {
		for (const key of possibleKeys) {
			if (item[key] !== undefined && item[key] !== null) return String(item[key]).trim();
			const lowerKey = key.toLowerCase();
			for (const actualKey in item) {
				if (actualKey.toLowerCase() === lowerKey && item[actualKey] !== undefined && item[actualKey] !== null) {
					return String(item[actualKey]).trim();
				}
			}
		}
		return '';
	}

	function generateUtmUrl(baseLink, mediumToken, labelName) {
		if(!baseLink || baseLink === "#" || baseLink === "") return "#";
		try {
			const url = new URL(baseLink.trim().replace(/[\r\n\t ]+/g, ''));
			url.searchParams.set('utm_source', 'supportmylocalcommunity');
			url.searchParams.set('utm_medium', mediumToken);
			url.searchParams.set('utm_campaign', 'louisville_portal');
			if(labelName) url.searchParams.set('context', labelName.toLowerCase().replace(/[^a-z0-9]/g, '_'));
			return url.toString();
		} catch(e) { return baseLink; }
	}

	// 2. NAVIGATION BAR ENGINE
	async function generateDynamicMenu() {
		const menuContainer = document.getElementById('dynamic-menu-links');
		if (!menuContainer) return;
		try {
			const response = await fetch(`json/menu.json?v=${Date.now()}`);
			const menuItems = await response.json();
			const currentUrl = window.location.href;
			menuContainer.innerHTML = '';

			menuItems.forEach(item => {
				const li = document.createElement('li');
				const link = document.createElement('a');
				link.href = item.url;
				link.textContent = item.name;
				link.setAttribute('target', 'main-content-window');
				if (currentUrl.includes(item.url)) link.className = 'active';
				li.appendChild(link);
				menuContainer.appendChild(li);
			});
		} catch (e) {
			menuContainer.innerHTML = `<li><a href="https://staging.supportmylocalcommunity.com/" target="main-content-window" class="active">Home</a></li>`;
		}
	}
	generateDynamicMenu();

	// 3. LIGHTBOX POP-OUT ENGINE
	window.openPortalLightbox = function(title, label, meta, story, imageSrc, externalUrl) {
		document.getElementById('lightbox-title').innerText = title;
		document.getElementById('lightbox-label').innerText = label;
		document.getElementById('lightbox-meta').innerText = meta;
		document.getElementById('lightbox-story').innerText = story;
		
		const mediaBox = document.getElementById('lightbox-media-box');
		const imgNode = document.getElementById('lightbox-img');
		const outboundNode = document.getElementById('lightbox-external-link');

		if(imageSrc) {
			imgNode.src = imageSrc;
			mediaBox.classList.add('show-media');
		} else {
			mediaBox.classList.remove('show-media');
		}

		if(externalUrl && externalUrl !== '#') {
			outboundNode.href = generateUtmUrl(externalUrl, 'lightbox_link_click', title);
			outboundNode.classList.remove('hidden');
		} else {
			outboundNode.classList.add('hidden');
		}

		const mask = document.getElementById('portal-lightbox');
		mask.classList.add('active-show');
		document.body.classList.add('modal-lock');
	};

	window.closePortalLightbox = function() {
		const mask = document.getElementById('portal-lightbox');
		mask.classList.remove('active-show');
		document.body.classList.remove('modal-lock');
	};

	window.triggerNewsroomLightbox = function(index) {
		const article = localNewsMemory[index];
		if(!article) return;
		openPortalLightbox(article.title, 'Louisville Local Dispatch', `Date: ${article.date}`, article.fullStory, article.image, article.link);
	};

	// 4. BULLETIN CALENDAR LAYER
	async function loadBulletinCalendar() {
		const listNode = document.getElementById('divi-event-list');
		if(!listNode) return;
		try {
			const res = await fetch(`${APPS_SCRIPT_BULLETIN_URL}?feed=true&v=${Date.now()}`);
			const rawEvents = await res.json();
			if(Array.isArray(rawEvents) && rawEvents.length > 0) {
				const nowChicago = fetchChicagoTime();
				listNode.innerHTML = '';
				rawEvents.slice(0, 8).forEach(item => {
					const t = extractProperty(item, ['name', 'title', 'event']);
					const d = extractProperty(item, ['date', 'displayDate', 'eventDate']);
					const card = document.createElement('div');
					card.className = "p-3 rounded bg-black/50 border border-neutral-900 flex flex-col gap-1 text-xs text-neutral-300 cursor-pointer hover:border-louisGold/40 transition";
					card.onclick = () => openPortalLightbox(t, 'Community Bulletin', `Date: ${d}`, item.details || 'No additional details logged.', null, '#');
					card.innerHTML = `
						<div class="flex justify-between items-center text-[10px] font-mono font-bold text-red-500"><span>${d}</span></div>
						<h4 class="font-bold text-white leading-tight">${t}</h4>
					`;
					listNode.appendChild(card);
				});
			}
		} catch(e) { listNode.innerHTML = `<div class="feed-loading">Feed currently resting...</div>`; }
	}
	loadBulletinCalendar();

	// 5. LOCAL DISPATCH ARCHIVE EXTRACTOR
	async function parseSMLCNewsroom() {
		const targetNode = document.getElementById('json-news-container');
		if(!targetNode) return;
		try {
			const res = await fetch(`${SMLC_LOCAL_NEWS_JSON}?v=${Date.now()}`);
			const payload = await res.json();
			if(Array.isArray(payload)) {
				const filtered = payload.filter(art => (art.title + art.full_story).toLowerCase().includes('louisville'));
				localNewsMemory = filtered.map(art => ({ title: art.title, date: cleanDateStrings(art.date), fullStory: art.full_story, image: art.image, link: art.link }));
				targetNode.innerHTML = '';
				localNewsMemory.forEach((article, index) => {
					const node = document.createElement('div');
					node.className = "newspaper-card p-5 rounded-lg flex flex-col gap-1.5";
					node.setAttribute('onclick', `triggerNewsroomLightbox(${index})`);
					node.innerHTML = `<h3>${article.title}</h3><p>${article.fullStory.substring(0, 140)}...</p>`;
					targetNode.appendChild(node);
				});
			}
		} catch(e){}
	}
	parseSMLCNewsroom();

	// 6. WIRE FEED RSS GENERATOR
	async function compileRegionalWireFeeds() {
		const target = document.getElementById('rss-feed-container');
		if(!target) return;
		target.innerHTML = `<div class="feed-loading">Querying active network feeds...</div>`;
	}
	compileRegionalWireFeeds();

	// 7. PARTNER AUTOMATION SHUFFLE ENGINE (12-Second Loop Overrides)
	function shuffleArray(array) {
		let currentIndex = array.length, randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	function runPartnerPipeline() {
		if (masterPartnersArray.length === 0) return;

		// 1. Update Top Sidebar Showcase Component
		const sidebarPartner = masterPartnersArray[Math.floor(Math.random() * masterPartnersArray.length)];
		const sideImg = document.getElementById('partner-image');
		const sideLink = document.getElementById('partner-link');
		if (sideImg && sideLink) {
			sideImg.style.opacity = '0';
			setTimeout(() => {
				sideImg.src = sidebarPartner.image;
				sideImg.style.opacity = '1';
				sideLink.innerText = sidebarPartner.name;
				sideLink.onclick = () => window.open(generateUtmUrl(sidebarPartner.websiteUrl, 'sidebar_showcase', sidebarPartner.name), 'main-content-window');
				sideImg.parentElement.onclick = () => openPortalLightbox(sidebarPartner.name, 'Partner Showcase', 'Visual Assets', '', sidebarPartner.image, sidebarPartner.websiteUrl);
			}, 300);
		}

		// 2. Update Top Header Ticker Link Component
		const tickerPartner = masterPartnersArray[Math.floor(Math.random() * masterPartnersArray.length)];
		const tickerNode = document.getElementById('ticker-link');
		if(tickerNode) {
			tickerNode.innerText = tickerPartner.name;
			tickerNode.href = generateUtmUrl(tickerPartner.websiteUrl, 'ticker_marquee', tickerPartner.name);
		}

		// 3. Update Bottom 5-Card Banner Strip Row (Guarantees No Duplicates)
		const cleanPool = shuffleArray([...masterPartnersArray]);
		for (let i = 0; i < 5; i++) {
			const cardImg = document.getElementById(`bottom-card-img-${i}`);
			const cardLink = document.getElementById(`bottom-card-link-${i}`);
			const partner = cleanPool[i % cleanPool.length]; // Fallback loop if pool is under 5

			if (cardImg && cardLink && partner) {
				cardImg.style.opacity = '0';
				(function(p, imgEl, linkEl) {
					setTimeout(() => {
						imgEl.src = p.image;
						imgEl.style.opacity = '1';
						linkEl.innerText = p.name;
						linkEl.onclick = () => window.open(generateUtmUrl(p.websiteUrl, 'footer_row_strip', p.name), 'main-content-window');
						imgEl.parentElement.onclick = () => openPortalLightbox(p.name, 'Partner Showcase', 'Visual Assets', '', p.image, p.websiteUrl);
					}, 300);
				})(partner, cardImg, cardLink);
			}
		}
	}

	async function initPartnersNetwork() {
		try {
			const res = await fetch(`${PARTNERS_JSON_URL}?v=${Date.now()}`);
			const data = await res.json();
			masterPartnersArray = data.filter(p => p.county.toLowerCase().includes('clay'));
			if(masterPartnersArray.length > 0) {
				runPartnerPipeline();
				setInterval(runPartnerPipeline, 12000); // Strict 12-Second Loop Execution Interval
			}
		} catch(e) {}
	}
	initPartnersNetwork();

	// 8. TECTONIC TIMELINE ARRAYS
	function executeHistoryQueryTree() {
		const target = document.getElementById('history-json-container');
		if(target) target.innerHTML = `<div class="feed-loading">Syncing historical indexes...</div>`;
	}
	executeHistoryQueryTree();
})();
