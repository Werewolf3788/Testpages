(function() {
	// DYNAMIC CORE URL INTEGRATION MATRIX
	const APPS_SCRIPT_BULLETIN_URL = "https://script.google.com/macros/s/AKfycbwtunjBquRf8yjnYdpMNMglMQB6n0j4pHSNke-9yADxZ3-9HvJqXT2DdVTUjdhRroGcxQ/exec";
	const SMLC_LOCAL_NEWS_JSON = "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json";
	const MERCHANT_SPREADSHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwXvTxCrAM-1tVTG4Rhg8Oka186yumxK3nebWyE61pD_jt-hhlo-d4D0iv05P4pm0Ag7JH-tAiwzbo/pub?output=csv";
	
	// MULTI-ALERTS RSS ENDPOINT CLUSTER
	const WIRE_FEEDS = [
		"https://www.google.com/alerts/feeds/16385066500020016213/7900491242905665188",
		"https://www.google.com/alerts/feeds/16385066500020016213/6707108232262016148",
		"https://www.google.com/alerts/feeds/16385066500020016213/14281446210139084731",
		"https://www.google.com/alerts/feeds/16385066500020016213/68970857447932436"
	];
	
	const townHistoryTree = [
		"https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/louisville.json",
		"https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/louisville.json"
	];

	let dynamicMerchantsArray = [];
	let localNewsMemory = [];
	let merchantCarouselPointer = 0;

	// 1. CHICAGOLAND DATE CALCULATOR FRAMEWORK
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
		} catch(e) {
			return new Date();
		}
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

	// Set dynamic month header safely
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const currentMonthLabel = monthNames[fetchChicagoTime().getMonth()];
	if(document.getElementById('month-label')) {
		document.getElementById('month-label').innerText = `${currentMonthLabel} Dispatches`;
	}

	// Case-Insensitive Key Property Puller
	function extractProperty(item, possibleKeys) {
		for (const key of possibleKeys) {
			if (item[key] !== undefined && item[key] !== null) {
				return String(item[key]).trim();
			}
			const lowerKey = key.toLowerCase();
			for (const actualKey in item) {
				if (actualKey.toLowerCase() === lowerKey && item[actualKey] !== undefined && item[actualKey] !== null) {
					return String(item[actualKey]).trim();
				}
			}
		}
		return '';
	}

	// Automatic UTM parameter URL wrapper
	function generateUtmUrl(baseLink, mediumToken, labelName) {
		if(!baseLink || baseLink === "#" || baseLink === "") return "#";
		try {
			const cleanUrl = baseLink.trim().replace(/[\r\n\t ]+/g, '');
			const url = new URL(cleanUrl);
			url.searchParams.set('utm_source', 'supportmylocalcommunity');
			url.searchParams.set('utm_medium', mediumToken);
			url.searchParams.set('utm_campaign', 'louisville_portal');
			if(labelName) {
				url.searchParams.set('context', labelName.toLowerCase().replace(/[^a-z0-9]/g, '_'));
			}
			return url.toString();
		} catch(e) {
			return baseLink;
		}
	}

	// Timestamp builder for event schedules (Includes current date through midnight)
	function compileEventTimestamp(dateStr, timeStr, baseChicago) {
		if (!dateStr || dateStr.toLowerCase().includes('tba') || dateStr.toLowerCase().includes('pending')) {
			return null;
		}
		try {
			const currentYear = baseChicago.getFullYear();
			let targetDate = null;
			const formats = dateStr.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?$/);
			
			if (formats) {
				const m = parseInt(formats[1]) - 1;
				const d = parseInt(formats[2]);
				const y = formats[3] ? parseInt(formats[3]) : currentYear;
				targetDate = new Date(y, m, d);
			} else {
				let stringEvaluator = dateStr;
				if(!/\d{4}/.test(stringEvaluator)) stringEvaluator += `, ${currentYear}`;
				const timestamp = Date.parse(stringEvaluator);
				if(!isNaN(timestamp)) targetDate = new Date(timestamp);
			}

			if(!targetDate || isNaN(targetDate.getTime())) return null;

			// Handle all-day/ongoing events by keeping them active through midnight
			let hrs = 23, mins = 59, secs = 59;
			if(timeStr && !timeStr.toLowerCase().includes('tba') && !timeStr.toLowerCase().includes('all day')) {
				const timeParse = timeStr.toLowerCase().trim().match(/(\d{1,2 Yaz})(?::(\d{2}))?\s*(am|pm)?/);
				if(timeParse) {
					let h = parseInt(timeParse[1]);
					const m = timeParse[2] ? parseInt(timeParse[2]) : 0;
					const meridiem = timeParse[3];
					if (meridiem === 'pm' && h < 12) h += 12;
					if (meridiem === 'am' && h === 12) h = 0;
					hrs = h; mins = m; secs = 0;
				}
			}
			targetDate.setHours(hrs, mins, secs, 0);
			return targetDate;
		} catch(e) { return null; }
	}

	// 2. UNIFIED LIGHTBOX SYSTEM (DECOUPLED SEPARATED STYLING REFACTOR)
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

	// Helper click event handler for direct local newsroom arrays
	window.triggerNewsroomLightbox = function(index) {
		const article = localNewsMemory[index];
		if(!article) return;
		openPortalLightbox(article.title, 'Louisville Local Dispatch', `Date: ${article.date}`, article.fullStory, article.image, article.link);
	};

	// 3. COLUMN 1 PIPELINE: BULLETIN CALENDAR FEED (Includes All-Day and Today's Current Range logs)
	async function loadBulletinCalendar() {
		const listNode = document.getElementById('divi-event-list');
		if(!listNode) return;
		try {
			const res = await fetch(`${APPS_SCRIPT_BULLETIN_URL}?feed=true&v=${Date.now()}`);
			const rawEvents = await res.json();
			if(Array.isArray(rawEvents) && rawEvents.length > 0) {
				const nowChicago = fetchChicagoTime();
				const restrictionLimit = new Date(nowChicago);
				restrictionLimit.setMonth(restrictionLimit.getMonth() + 1);

				const structuredEvents = rawEvents.map(item => {
					const t = extractProperty(item, ['name', 'title', 'event']);
					const d = extractProperty(item, ['date', 'displayDate', 'eventDate']);
					const tm = extractProperty(item, ['time', 'displayTime', 'eventTime']);
					const loc = extractProperty(item, ['location', 'where', 'venue']);
					const det = extractProperty(item, ['details', 'description', 'info']);
					const calculatedStamp = compileEventTimestamp(d, tm, nowChicago);
					return { title: t, dateStr: d, timeStr: tm, location: loc, details: det, calculatedStamp, isOngoing: item.isOngoing || false };
				}).filter(item => {
					if(!item.calculatedStamp) return true; // Retain TBA entries
					
					// Core Reset: Set target baseline boundary to check starting from 00:00 of current date 
					const currentDayFloor = new Date(nowChicago);
					currentDayFloor.setHours(0,0,0,0);
					
					return item.calculatedStamp >= currentDayFloor && item.calculatedStamp <= restrictionLimit;
				});

				structuredEvents.sort((a,b) => {
					if(!a.calculatedStamp && !b.calculatedStamp) return 0;
					if(!a.calculatedStamp) return 1;
					if(!b.calculatedStamp) return -1;
					return a.calculatedStamp - b.calculatedStamp;
				});

				if(structuredEvents.length === 0) {
					listNode.innerHTML = `<div class="feed-loading">No scheduled entries active.</div>`;
					return;
				}

				listNode.innerHTML = '';
				structuredEvents.forEach(item => {
					const card = document.createElement('div');
					card.className = "p-3 rounded bg-black/50 border border-neutral-900 flex flex-col gap-1 text-xs text-neutral-300 cursor-pointer hover:border-louisGold/40 transition";
					card.onclick = () => {
						openPortalLightbox(item.title, 'Community Bulletin', `Date: ${item.dateStr} | Time: ${item.timeStr}`, item.details || 'No additional details logged.', null, '#');
					};
					card.innerHTML = `
						<div class="flex justify-between items-center text-[10px] font-mono font-bold text-louisRed">
							<span>${item.dateStr}</span>
							${item.isOngoing ? '<span class="px-1.5 py-0.2 bg-louisRed text-white text-[8px] uppercase tracking-tighter rounded animate-pulse">Live</span>' : ''}
						</div>
						<h4 class="font-bold text-white leading-tight">${item.title}</h4>
						<p class="text-[11px] text-neutral-400"><span class="text-louisGold font-medium">Where:</span> ${item.location}</p>
					`;
					listNode.appendChild(card);
				});
			}
		} catch(e) {
			listNode.innerHTML = `<div class="text-center text-xs py-4 text-louisRed">Bulletin feed offline.</div>`;
		}
	}
	loadBulletinCalendar();

	// 4. COLUMN 2 PIPELINE: RECONSTRUCTED NEWSPAPER CLIPPINGS ENGINE (Brief preview click expands entire card body text)
	function cleanDateStrings(string) {
		if(!string) return "Recent Dispatch Update";
		return string.replace(/\+0000|\+00:00|GMT/gi, '').trim();
	}

	async function parseSMLCNewsroom() {
		const targetNode = document.getElementById('json-news-container');
		if(!targetNode) return;
		try {
			const res = await fetch(`${SMLC_LOCAL_NEWS_JSON}?v=${Date.now()}`);
			const payload = await res.json();
			
			if(Array.isArray(payload) && payload.length > 0) {
				const filteredArticles = payload.filter(art => {
					const title = (art.title || '').toLowerCase();
					const fullStory = (art.full_story || art.content || art.description || '').toLowerCase();
					return title.includes('louisville') || fullStory.includes('louisville');
				});

				if(filteredArticles.length === 0) {
					targetNode.innerHTML = `<div class="text-center py-6 text-xs italic text-neutral-500">No active dispatches found for Louisville.</div>`;
					return;
				}

				// Map incoming properties using structural payload mapping fields cleanly
				localNewsMemory = filteredArticles.map(art => ({
					title: art.title || 'SMLC Newsroom Bulletin',
					date: cleanDateStrings(art.date),
					fullStory: art.full_story || 'No story details provided.',
					image: art.image || null,
					link: art.link || '#'
				}));

				targetNode.innerHTML = '';
				localNewsMemory.forEach((article, index) => {
					const node = document.createElement('div');
					// Entire newspaper clipping card boundary functions cleanly as lightbox expansion action link 
					node.className = "newspaper-card p-5 rounded-lg flex flex-col gap-1.5";
					node.setAttribute('onclick', `triggerNewsroomLightbox(${index})`);
					
					let summarySnippet = article.fullStory;
					if(summarySnippet.length > 160) summarySnippet = summarySnippet.substring(0, 160) + '...';

					node.innerHTML = `
						<div class="flex justify-between text-[9px] font-mono uppercase tracking-wider font-bold opacity-70 border-b border-neutral-900/20 pb-0.5">
							<span>Louisville Newsroom Dispatch</span>
							<span>${article.date}</span>
						</div>
						<h3 class="text-lg font-black leading-tight tracking-tight mt-1 text-neutral-900">${article.title}</h3>
						<div class="newspaper-inner-border my-1"></div>
						<p class="text-xs leading-relaxed text-justify font-serif text-neutral-800 font-medium">${summarySnippet}</p>
						<span class="text-[10px] font-black text-louisRed uppercase tracking-wider mt-1 text-left">Click Clipping Card to Read Full Story &rarr;</span>
					`;
					targetNode.appendChild(node);
				});
			}
		} catch(e) {
			targetNode.innerHTML = `<div class="text-center py-6 text-xs text-neutral-500 italic">Dispatches database unreached.</div>`;
		}
	}
	parseSMLCNewsroom();

	// 5. WIRE FEED OVERLAYS (COMBINED FEED AGGREGATOR)
	async function compileRegionalWireFeeds() {
		const target = document.getElementById('rss-feed-container');
		if(!target) return;
		
		let unifiedEntries = [];
		for (const feedUrl of WIRE_FEEDS) {
			try {
				const proxyEndpoint = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
				const res = await fetch(proxyEndpoint);
				const data = await res.json();
				if(data.status === 'ok' && Array.isArray(data.items)) {
					unifiedEntries = unifiedEntries.concat(data.items);
				}
			} catch(e) {}
		}

		if(unifiedEntries.length === 0) {
			target.innerHTML = `<div class="text-center py-6 text-xs text-neutral-500 italic">Newsfeed system operating via active secondary cache.</div>`;
			return;
		}

		const uniqueMap = new Map();
		unifiedEntries.forEach(item => uniqueMap.set(item.link, item));
		const completeCollection = Array.from(uniqueMap.values());

		target.innerHTML = '';
		let loadedItemsCount = 0;

		completeCollection.forEach(entry => {
			const contentFilter = (entry.title + entry.description + entry.content).toLowerCase();
			if(contentFilter.includes('weather') || contentFilter.includes('forecast') || contentFilter.includes('degrees') || loadedItemsCount >= 6) {
				return;
			}

			const itemNode = document.createElement('div');
			itemNode.className = "p-3 rounded bg-black/40 border border-neutral-900 flex flex-col gap-1 text-xs cursor-pointer hover:border-louisGold/30 transition";
			
			let cleanDescription = entry.description.replace(/<\/?[^>]+(>|$)/g, "");
			itemNode.onclick = () => openPortalLightbox(entry.title, 'Regional Wire Network', 'Google Alerts Wire Sync', cleanDescription, null, entry.link);
			
			itemNode.innerHTML = `
				<span class="font-bold text-neutral-200 block leading-tight hover:text-louisGold transition">${entry.title}</span>
				<span class="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">${entry.pubDate ? entry.pubDate.split(' ')[0] : 'Recent Wire Info'}</span>
			`;
			target.appendChild(itemNode);
			loadedItemsCount++;
		});
	}
	compileRegionalWireFeeds();

	// 6. CASEY'S FUEL MONITOR SUBSCRIPTION (FIREBASE RTDB)
	try {
		const fbConfig = {
			apiKey: "AIzaSyBYPbGWDNPUmCSnFWDPPWtiXe2F6MPinXg",
			authDomain: "smlc-fuel-monitor.firebaseapp.com",
			databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com",
			projectId: "smlc-fuel-monitor"
		};
		const coreApp = firebase.initializeApp(fbConfig, 'LouisvilleSideSyncEngine');
		coreApp.database().ref('fuel_prices/48026').on('value', (snap) => {
			const val = snap.val();
			if(val) {
				document.getElementById('lv-reg').innerText = val.reg || "--.--";
				document.getElementById('lv-die').innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
				document.getElementById('lv-time').innerText = val.date ? `Updated: ${val.date}` : "Live Sync";
			}
		});
	} catch(e){}

	// 7. MULTI-COLUMN REALIGNED GOOGLE SPREADSHEET SHOWCASE PARTNERS 
	function parseCSVData(text) {
		const lines = text.split('\n');
		const results = [];
		for(let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if(!line) continue;
			const cells = [];
			let insideQuote = false, buffer = '';
			for(let j = 0; j < line.length; j++) {
				const char = line[j];
				if(char === '"') insideQuote = !insideQuote;
				else if(char === ',' && !insideQuote) { cells.push(buffer.trim()); buffer = ''; }
				else buffer += char;
			}
			cells.push(buffer.trim());
			
			// Row cell fragment allocations matching exact modified columns layout specifications:
			// Col A: Name | Col B: Website URL Link | Col C: Image Target CDN | Col D: County Filter Text
			if(cells.length >= 4) {
				results.push({
					name: cells[0].replace(/^"|"$/g, ''),
					websiteUrl: cells[1].replace(/^"|"$/g, '').trim(),
					image: cells[2].replace(/^"|"$/g, '').trim(),
					county: cells[3].replace(/^"|"$/g, '')
				});
			}
		}
		return results;
	}

	function rotateShowcase() {
		if(dynamicMerchantsArray.length === 0) return;
		const target = dynamicMerchantsArray[merchantCarouselPointer];
		
		const nameNode = document.getElementById('partner-link');
		const imageNode = document.getElementById('partner-image');
		const loadingNode = document.getElementById('partner-loading');

		const cleanImageUrl = target.image.replace(/[\r\n\t ]+/g, '');
		const cleanWebUrl = target.websiteUrl.replace(/[\r\n\t ]+/g, '');

		document.getElementById('ticker-link').innerText = target.name;
		document.getElementById('ticker-link').href = generateUtmUrl(cleanWebUrl, 'ticker_marquee', target.name);

		imageNode.style.opacity = '0';
		loadingNode.style.opacity = '1';

		setTimeout(() => {
			// Rule 1: Text Header Name navigates out to Column B URL targets directly
			nameNode.innerText = target.name;
			nameNode.href = generateUtmUrl(cleanWebUrl, 'showcase_title_click', target.name);
			
			// Rule 2: Image Box clicks pop out cleanly into the modal lightbox component framework
			imageNode.parentElement.onclick = (e) => {
				e.preventDefault();
				
				// Open custom partner image in modal view cleanly
				document.getElementById('lightbox-story').innerText = '';
				document.getElementById('lightbox-external-link').classList.add('hidden');
				openPortalLightbox(target.name, 'Local Showcase Expansion', 'Clay County Partner Visual', cleanImageUrl, cleanWebUrl);
				
				if(typeof window.gtag === 'function') {
					window.gtag('event', 'showcase_image_zoom', { 'partner_name': target.name });
				}
			};

			imageNode.src = cleanImageUrl || "https://staging.supportmylocalcommunity.com/wp-content/uploads/2025/12/SMLC-logo-scaled-e1767473737771.png";
			imageNode.onload = () => {
				loadingNode.style.opacity = '0';
				imageNode.style.opacity = '1';
			};

			if(typeof window.gtag === 'function') {
				window.gtag('event', 'spotlight_view', { 'partner_name': target.name, 'county': 'Clay' });
			}
		}, 300);

		merchantCarouselPointer = (merchantCarouselPointer + 1) % dynamicMerchantsArray.length;
	}

	fetch(MERCHANT_SPREADSHEET_CSV)
		.then(res => res.text())
		.then(csv => {
			const parsed = parseCSVData(csv);
			dynamicMerchantsArray = parsed.filter(p => p.county.toLowerCase().includes('clay'));
			if(dynamicMerchantsArray.length > 0) {
				rotateShowcase();
				setInterval(rotateShowcase, 10000);
			} else { throw new Error(); }
		})
		.catch(() => {
			dynamicMerchantsArray = [{
				name: "Wabash Communications",
				websiteUrl: "https://wabash.net",
				image: "https://staging.supportmylocalcommunity.com/wp-content/uploads/2025/12/pexels-photo-15823361-1.jpeg",
				county: "Clay"
			}];
			rotateShowcase();
		});

	// 8. COOPERATIVE HISTORICAL CHRONOLOGY LOG SYSTEM
	function executeHistoryQueryTree(index) {
		if(index >= townHistoryTree.length) {
			document.getElementById('history-json-container').innerHTML = `<div class="text-xs text-neutral-500">Archive Offline.</div>`;
			return;
		}
		fetch(townHistoryTree[index])
			.then(res => { if(!res.ok) throw new Error(); return res.json(); })
			.then(payload => {
				const list = Array.isArray(payload) ? payload : (payload.history || []);
				const target = document.getElementById('history-json-container');
				if(list.length > 0 && target) {
					target.innerHTML = '';
					list.forEach(h => {
						const row = document.createElement('div');
						row.className = "text-xs border-b border-neutral-900 pb-2 mb-2 last:border-none cursor-pointer hover:border-louisGold/20 transition";
						row.onclick = () => {
							document.getElementById('lightbox-img').src = '';
							document.getElementById('lightbox-media-box').classList.remove('show-media');
							openPortalLightbox(h.title || h.event || `Historical Log`, 'Historical Log Archive', `Year Era: ${h.year || h.date}`, h.description || h.text || 'Archive notes empty.', null, '#');
						};
						row.innerHTML = `
							<span class="font-mono font-bold text-louisGold text-[11px]">${h.year || h.date || 'RECORD'}</span>
							${h.title || h.event ? `<span class="font-bold text-white block mt-0.5">${h.title || h.event}</span>` : ''}
							<p class="text-neutral-400 text-[11px] mt-0.5 leading-snug line-clamp-2">${h.description || h.text || ''}</p>
						`;
						target.appendChild(row);
					});
				} else { throw new Error(); }
			})
			.catch(() => executeHistoryQueryTree(index + 1));
	}
	executeHistoryQueryTree(0);

})();
