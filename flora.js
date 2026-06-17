/* ==========================================================================
   MASTER DEVELOPMENT PROTOCOL - NERVOUS SYSTEM MOTOR (FLORA EDITION)
   ========================================================================== */
/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I SPECIFICALLY DIDN'T SAY TO CHANGE */
/* NYT Timestamp: 2026-06-17 16:55:00 */

(function() {
	const activeTown = (document.body.getAttribute('data-town') || 'flora').trim().toLowerCase();

	const URLS = {
		config: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/config.json",
		assets: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/assets.json",
		menu: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/menu.json",
		partners: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/partners.json",
		maps: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/maps.json",
		history: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/flora.json",
		images: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/town-images.json",
		footer: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/footer.json",
		news: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json",
		bulletin: "https://script.google.com/macros/s/AKfycbz_nol3WlVM6_8FKN1V2aVeW5jZRa54gWs13lVEHVhx07xpzjMmedBd5vRdVyPiSemopA/exec"
	};

	let masterPartnersArray = [];
	let gasPortalOverrideUrl = "https://werewolf3788.github.io/Testpages/update-gas.html";

	const localHistoryFallback = [
		{
			"year": 1854,
			"event": "Founding and Incorporation",
			"description": "Flora was offically platted in February of 1854, by Samuel White, Ethelred Nixon, and John Brown. The town grew as a central hub along the B&O Railroad line."
		},
		{
			"year": 1872,
			"event": "Construction of B&O Depot",
			"description": "The first Baltimore and Ohio (B&O) Railroad Depot was built, which eventually became a primary economic driver for the community for decades."
		},
		{
			"year": 1917,
			"event": "New B&O Depot Completed",
			"description": "fter the 1872 depot was destroyed by fire in 1916, a new three-story brick depot was completed in 1917, serving as a vital hub for passengers and rail operations."
		},
		{
			"year": 1960,
			"event": "Designated 'Ford Town USA'",
			"description": "Ford Motor Company designated Flora as 'Ford Town USA' and provided over 1,200 residents with new Ford vehicles to drive for one week, a signature moment in the town's history."
		},
		{
			"year": 2020,
			"event": "Modern Census",
			"description": "The 2020 Census recorded a population of 4,803, maintaining Flora's status as the largest community in Clay County."
		}
	];

	// CALENDAR FAILSAFE - Preserving exact structures with your true descriptions and multi-day end targets
	const fallbackCalendarEvents = [
		{ 
			dateStr: "Saturday, June 14, 2026", 
			dateEnd: "Saturday, June 17, 2026",
			title: "The Great Investigation VBS ", 
			location: "Clay City Community Center",
			startTime: "7:00 PM",
			endTime: "9:30 PM",
			details: "Kids & parents....keep these dates in your calendar: June 7th 6-8:30pm FAMILY FUN NIGHT for the entire family. Truth Seeker's Escape Room-Can you unlock the vault? PRE-REGISTRATION for VBS, June 14-17, VBS @ Flora Church of the Nazarene, 12 Parsons Lane, Flora. Keep watching for more info. https://www.facebook.com/events/1014560520968044/"
		},
		{ 
			dateStr: "Saturday, June 20, 2026", 
			title: "Studs & Suds", 
			location: "Storm Brewing",
			startTime: "10:00 AM",
			endTime: "4:00 PM",
			details: "Join the community fundraiser event at Storm Brewing. Local vendors, refreshments, and interactive activities scheduled throughout the day."
		},
		{ 
			dateStr: "Saturday, June 20, 2026", 
			title: "Clay City Women's Elevation Tea", 
			location: "Clay City Community Center",
			startTime: "2:00 PM",
			endTime: "5:00 PM",
			details: "THE OIL SHIFTED FROM THE WELLS TO HER VESSEL\n\nHosted by TTEA Women\n\nThey thought the oil was running low…\nThen the women started pouring.\n\nJoin women from across the region for a luxury afternoon of:\n• High Tea\n• Crowning\n• Empowerment\n• Fellowship\n• Inspiration from Nicole Gentles\n• Faith-centered elevation\n\nMinimum Contribution: $20\n\nReserve Your Seat: https://tteawomen.com/events\nFacebook Event URL: https://www.facebook.com/events/2888637127971863/"
		},
		{ 
			dateStr: "July 4, 2026", 
			title: "Flora Tourism Presents: 4th of July", 
			location: "Charley Brown Park",
			startTime: "6:00 PM",
			endTime: "10:00 PM",
			details: "Flora Tourism Presents: 4th of July\nSaturday, July 4\n\nCharley Brown Park\n🎆 4th of July Celebration – Join Us for a Full Day of Fun! 🎆\nKick off your Independence Day with us starting at 10:00 AM with the All-American Boy & Girl Contest, hosted by Lisa Erbacher – Country Financial! 👑\n\nWhile you're there, grab a bite—Tourism will be serving pork burgers and hot dogs as a fundraiser to support future community events. 🌭🍔\n\n🎉 All Day Activities Include:\n💦 Open swim at the pool\n🎈 5 inflatables for the kids\n🍴 Delicious food vendors: Poe’d Smoked BBQ, Krazy Sweet Treats, and The Fair Lady\n🎶 At 6:00 PM, enjoy live music from The Rewinds, as seen on American Idol, performing through dusk!\n\n🎇 Then get ready…\nAt dusk, we’ll light up the sky with an incredible firework show, ending with an unforgettable 800-shot finale!\nBring your friends, your family, and your red, white, and blue spirit—we’ll see you there!✨ https://www.facebook.com/events/1483128260221259/"
		}
	];

	window.addEventListener('error', function(e) {
		if (e.target && e.target.tagName === 'IMG') {
			e.target.style.setProperty('display', 'none', 'important');
			const frame = e.target.closest('.showcase-media-canvas, .clipping-card-image-box');
			if (frame) {
				frame.style.setProperty('display', 'none', 'important');
				frame.remove();
			}
		}
	}, true);

	function shuffleArray(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function synchronizeTimeBackdropTheme() {
		const hour = new Date().getHours();
		let bg, text, panel, border, accent, readableTint;
		
		if (hour >= 8 && hour < 17) {
			bg = '#f5f5f5'; text = '#111111'; panel = '#ffffff'; border = '#cccccc'; accent = '#8B0000'; readableTint = '#D4D4D4';
		} else if (hour >= 17 && hour < 20) {
			bg = '#a3a3a3'; text = '#111111'; panel = '#d4d4d4'; border = '#888888'; accent = '#8B0000'; readableTint = '#e5e5e5';
		} else if (hour >= 5 && hour < 8) {
			bg = '#d4d4d4'; text = '#111111'; panel = '#e5e5e5'; border = '#aaaaaa'; accent = '#8B0000'; readableTint = '#f0f0f0';
		} else {
			bg = '#1F1F1F'; text = '#ffffff'; panel = '#0d0d0d'; border = '#333333'; accent = '#FFC10E'; readableTint = '#000000';
		}
		
		document.documentElement.style.setProperty('--dynamic-bg', bg);
		document.documentElement.style.setProperty('--dynamic-text', text);
		document.documentElement.style.setProperty('--dynamic-panel', panel);
		document.documentElement.style.setProperty('--dynamic-border', border);
		document.documentElement.style.setProperty('--dynamic-accent', accent);
		document.documentElement.style.setProperty('--dynamic-readable-tint', readableTint);
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
			urlObj.searchParams.set('v', '1.17');
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

	function registerDynamicLightboxTrigger(element, imgUrl, title = "Community Media Showcase", context = "SMLC Network Frame Log View", targetSourceUrl = "#") {
		if (!element) return;
		element.style.cursor = "pointer";
		element.addEventListener('click', (e) => {
			e.stopPropagation();
			openPortalLightbox(title, context, "SMLC Community Image Register Record Asset View.", imgUrl, targetSourceUrl);
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

	/* ==========================================================================
	   INTELLIGENT MULTI-FORMAT DATE AND RANGE PARSING ENGINE
	   ========================================================================== */
	function resolveAnyDateString(dateInput, timeInput) {
		if (!dateInput) return null;
		
		let cleanInput = dateInput.trim();
		
		// Unpack compound date range bounds (e.g. "June 14 - June 17, 2026")
		if (cleanInput.includes(' - ')) {
			cleanInput = cleanInput.split(' - ')[0].trim();
		} else if (cleanInput.includes(' to ')) {
			cleanInput = cleanInput.split(' to ')[0].trim();
		} else if (cleanInput.includes('-')) {
			// Do not split standard ISO "YYYY-MM-DD"
			if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanInput)) {
				const hyphenParts = cleanInput.split('-');
				if (hyphenParts.length > 1) {
					cleanInput = hyphenParts[0].trim();
					// Ensure year matches and gets appended if missing in split segment
					const yearMatch = dateInput.match(/\d{4}/);
					if (yearMatch && !cleanInput.match(/\d{4}/)) {
						cleanInput += ", " + yearMatch[0];
					}
				}
			}
		}
		
		let d = new Date(cleanInput);
		if (isNaN(d.getTime())) {
			// Parsing fallbacks for numerical inputs (e.g. "06/14/2026")
			const parts = cleanInput.split(/[-/]/);
			if (parts.length >= 2) {
				const m = parseInt(parts[0], 10) - 1; 
				const day = parseInt(parts[1], 10);
				const y = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
				d = new Date(y, m, day);
			}
		}
		
		if (isNaN(d.getTime())) {
			// Named Month fallbacks (e.g. "June 14")
			const monthMap = {
				jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11,
				january:0, february:1, march:2, april:3, june:5, july:6, august:7, september:8, october:9, november:10, december:11
			};
			const match = cleanInput.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d+)/i);
			if (match) {
				const m = monthMap[match[1].toLowerCase()];
				const day = parseInt(match[2], 10);
				const yearMatch = cleanInput.match(/\d{4}/);
				const y = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();
				d = new Date(y, m, day);
			}
		}

		if (isNaN(d.getTime())) return null;

		if (timeInput && typeof timeInput === 'string' && timeInput.toLowerCase() !== 'all day') {
			const timeMatch = timeInput.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
			if (timeMatch) {
				let h = parseInt(timeMatch[1], 10);
				let m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
				let ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : '';
				if (ampm === 'PM' && h < 12) h += 12;
				if (ampm === 'AM' && h === 12) h = 0;
				d.setHours(h, m, 0, 0);
			}
		} else {
			d.setHours(0, 0, 0, 0);
		}
		return d;
	}

	function renderCalendarEvents(eventsArray) {
		const listNode = document.getElementById('divi-event-list');
		if(!listNode) return;
		listNode.innerHTML = '';
		eventsArray.forEach((item) => {
			const div = document.createElement('div');
			div.className = 'image-matched-event-card';
			
			const cleanTitle = encodeURIComponent(item.title);
			const cleanLoc = encodeURIComponent(item.location);
			const cleanDesc = encodeURIComponent(item.details || "SMLC Community Calendar Update Node");
			
			const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${cleanTitle}&details=${cleanDesc}&location=${cleanLoc}&sf=true&output=xml`;
			
			const icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:" + item.title + "\nLOCATION:" + item.location + "\nDESCRIPTION:" + (item.details || "") + "\nEND:VEVENT\nEND:VCALENDAR";
			const icsBase64 = "data:text/calendar;base64," + btoa(unescape(encodeURIComponent(icsContent)));
			
			const fullDisplayDetails = item.details || "No summary details added.";
			const briefSnippetText = fullDisplayDetails.length > 120 ? fullDisplayDetails.substring(0, 120) + "..." : fullDisplayDetails;
			const displayedDateHeader = item.dateEnd ? `${item.dateStr} - ${item.dateEnd}` : item.dateStr;

			div.onclick = () => {
				const detailsBodyHTML = `
					<div class="lightbox-info-block-data-node">
						<div><strong>Event:</strong> ${item.title}</div>
						<div style="margin-top:4px;"><strong>Location:</strong> ${item.location}</div>
						<div style="margin-top:4px;"><strong>Date:</strong> ${displayedDateHeader}</div>
						<div style="margin-top:4px;"><strong>Start Time:</strong> ${item.startTime || 'All Day'}</div>
						<div style="margin-top:4px;"><strong>End Time:</strong> ${item.endTime || 'Conclusion'}</div>
					</div>
					<p style="margin-top:16px; font-size:15px; line-height:1.6; border-top:1px dashed #444; padding-top:12px; white-space:pre-line;">${fullDisplayDetails}</p>
					<div class="calendar-action-row-container">
						<a href="${gCalUrl}" target="_blank" class="calendar-action-btn-node">Add to Google Calendar</a>
						<a href="${icsBase64}" download="${item.title.replace(/\s+/g, '_')}.ics" class="calendar-action-btn-node">Download iCal File</a>
					</div>
				`;
				openPortalLightbox(item.title, `Event Synchronization Dashboard`, detailsBodyHTML, "", "#");
			};

			div.innerHTML = `
				<div class="image-matched-event-date">${displayedDateHeader}</div>
				<div class="image-matched-event-title">${item.title}</div>
				<div class="image-matched-event-where"><strong>Where:</strong> ${item.location}</div>
				<div class="image-matched-event-snippet-text">${briefSnippetText}</div>
			`;
			listNode.appendChild(div);
		});
	}

	/* ==========================================================================
	   REAL-TIME CALENDAR MATRIX SYNC ENGINE - PRECISION 30-DAY WINDOW
	   ========================================================================== */
	async function loadBulletinCalendar() {
		try {
			const res = await fetch(`${URLS.bulletin}?feed=true&v=${Date.now()}`);
			if (!res.ok) throw new Error("Wire communication error");
			const rawEvents = await res.json();
			
			if(Array.isArray(rawEvents) && rawEvents.length > 0) {
				const nowCST = fetchChicagoTime(); // Mirror current time completely down to the minute
				const boundaryCST = new Date(nowCST.getTime() + (30 * 24 * 60 * 60 * 1000)); // Precise rolling 30-day millisecond threshold
				
				let validEvents = [];

				rawEvents.forEach((rawItem) => {
					// Precision Structural Translation Block maps Firestore layouts back to parsing keys cleanly
					const item = {
						date: rawItem.date || rawItem.displayDate || "",
						dateEnd: rawItem.dateEnd || rawItem.endDate || null,
						time: rawItem.time || (rawItem.isAllDay ? "All Day" : (rawItem.displayDate && rawItem.displayDate.includes(", ")) ? rawItem.displayDate.split(", ")[1] : "All Day"),
						endTime: rawItem.endTime || "Conclusion",
						name: rawItem.name || rawItem.title || "Untitled Event",
						location: rawItem.location || rawItem.addr || "Clay County",
						details: rawItem.details || rawItem.desc || "",
						recurrence: rawItem.recurrence || rawItem.freq || null,
						recurring: rawItem.recurring || false
					};

					if (!item.date) return;
					
					let evDate = resolveAnyDateString(item.date, item.time);
					
					// Reconstruct evEndDate if written as a range string inside `item.date`
					let evEndDate = null;
					if (item.dateEnd) {
						evEndDate = resolveAnyDateString(item.dateEnd, item.endTime);
					} else if (item.date && (item.date.includes(' - ') || item.date.includes(' to ') || item.date.includes('-'))) {
						let cleanInput = item.date.trim();
						let secondPart = null;
						if (cleanInput.includes(' - ')) {
							secondPart = cleanInput.split(' - ')[1].trim();
						} else if (cleanInput.includes(' to ')) {
							secondPart = cleanInput.split(' to ')[1].trim();
						} else if (cleanInput.includes('-') && !/^\d{4}-\d{2}-\d{2}$/.test(cleanInput)) {
							secondPart = cleanInput.split('-')[1].trim();
						}

						if (secondPart) {
							const hasMonth = /(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/i.test(secondPart);
							if (!hasMonth) {
								const monthMatch = cleanInput.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/i);
								if (monthMatch) {
									secondPart = monthMatch[0] + " " + secondPart;
								}
							}
							evEndDate = resolveAnyDateString(secondPart, item.endTime);
						}
					}
					
					if (!evDate) return;
					
					// Determine reoccurrence configurations
					let recurrenceStr = item.recurrence || (item.recurring ? "weekly" : null);
					let occurrences = [];

					if (recurrenceStr) {
						let current = new Date(evDate.getTime());
						let freq = recurrenceStr.toLowerCase();
						let iterations = 0;
						
						// Project and find all occurrences falling within the [nowCST, boundaryCST] 30-day window
						while (current <= boundaryCST && iterations < 100) {
							iterations++;
							
							let validationCeiling = new Date(current);
							if (!item.time || item.time.toLowerCase() === 'all day') {
								validationCeiling.setHours(23, 59, 59, 999);
							}
							
							if (validationCeiling >= nowCST && current <= boundaryCST) {
								occurrences.push(new Date(current.getTime()));
							}
							
							// Increment based on rule frequency parameters
							if (freq.includes('daily')) {
								current.setDate(current.getDate() + 1);
							} else if (freq.includes('weekly')) {
								current.setDate(current.getDate() + 7);
							} else if (freq.includes('monthly')) {
								current.setMonth(current.getMonth() + 1);
							} else if (freq.includes('yearly')) {
								current.setFullYear(current.getFullYear() + 1);
							} else {
								break;
							}
						}
					} else {
						// Single Instance Event validation tracking
						let validationCeiling = new Date(evDate);
						if (!item.time || item.time.toLowerCase() === 'all day') {
							validationCeiling.setHours(23, 59, 59, 999);
						}
						
						if (evEndDate) {
							let endValidationCeiling = new Date(evEndDate);
							if (!item.endTime) {
								endValidationCeiling.setHours(23, 59, 59, 999);
							}
							if (endValidationCeiling >= nowCST && evDate <= boundaryCST) {
								occurrences.push(evDate);
							}
						} else {
							if (validationCeiling >= nowCST && evDate <= boundaryCST) {
								occurrences.push(evDate);
							}
						}
					}

					// Map and format each valid occurrence
					occurrences.forEach(occDate => {
						const title = item.name || "Untitled Event";
						const location = item.location || "Clay County";
						const descText = item.details || "Join us for this local area community gathering.";
						
						let formattedDisplayDate = item.date;
						try { formattedDisplayDate = occDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch(e){}
						
						let formattedDisplayEndDate = null;
						if (evEndDate) {
							let duration = evEndDate.getTime() - evDate.getTime();
							let currentEndDate = new Date(occDate.getTime() + duration);
							try { formattedDisplayEndDate = currentEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch(e){}
						}

						validEvents.push({ 
							dateStr: formattedDisplayDate, 
							dateEnd: formattedDisplayEndDate,
							title: title, 
							location: location, 
							details: descText,
							startTime: item.time || "All Day",
							endTime: item.endTime || "Conclusion",
							rawDate: occDate
						});
					});
				});

				// Force sequential, chronological sorting of all processed dispatches
				validEvents.sort((a, b) => a.rawDate - b.rawDate);

				if (validEvents.length === 0) {
					renderCalendarEvents(fallbackCalendarEvents);
				} else {
					renderCalendarEvents(validEvents);
				}
			} else {
				renderCalendarEvents(fallbackCalendarEvents);
			}
		} catch(e) { 
			renderCalendarEvents(fallbackCalendarEvents);
		}
	}

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
					registerDynamicLightboxTrigger(targetNewsImg, previewImg, n.title, cardTimestamp, n.source_url || "#");

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
		const mediaContainer = document.getElementById('global-spotlight-media-container');
		const linkContainer = document.getElementById('global-spotlight-link-wrapper');
		if (!mediaContainer || !linkContainer) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			if (!res.ok) throw new Error("Spotlight registry link exception.");
			const registry = await res.json();
			
			let spotlightAsset = null;

			if (registry && Array.isArray(registry.global_assets)) {
				spotlightAsset = registry.global_assets.find(asset => asset.id === "global_biz_spotlight");
			}

			if (spotlightAsset) {
				const finalImg = spotlightAsset.url || spotlightAsset.image;
				const assetName = spotlightAsset.name || "Featured Local Business Spotlight";
				const fallbackAlt = spotlightAsset.alt || assetName;
				const destinationUrl = spotlightAsset.source_url || "#";

				mediaContainer.innerHTML = `<img src="${finalImg}" alt="${fallbackAlt}" id="spotlight-widget-media-node" />`;
				
				linkContainer.innerHTML = `<a href="${enforceUtmRouterUrl(destinationUrl)}" target="main-content-window" class="showcase-action-link dynamic-text-element hover-accent" style="font-size:15px; font-weight:bold; display:block; margin-top:8px;">${assetName}</a>`;
				
				const mediaNode = document.getElementById('spotlight-widget-media-node');
				if (mediaNode) {
					mediaNode.addEventListener('click', (e) => {
						e.stopPropagation();
						openPortalLightbox(assetName, "SMLC Universal Business Spotlight", "Network Wide Featured Partner Profile Overview.", finalImg, destinationUrl);
					});
				}
			} else {
				mediaContainer.innerHTML = `<div class="text-xs italic text-neutral-500">Spotlight reference context offline.</div>`;
			}
		} catch (e) { 
			console.error("[Spotlight Initialization Failure]", e);
			mediaContainer.innerHTML = `<div class="text-xs italic text-neutral-500">Spotlight disconnected.</div>`; 
		}
	}

	function renderHistoryRecords(items) {
		const cont = document.getElementById('history-json-container');
		if (!cont) return;
		cont.innerHTML = '';
		items.forEach((h, idx) => {
			const historyCardId = `history-log-item-card-${idx}`;
			cont.innerHTML += `
				<div id="${historyCardId}" class="history-item-block-row" title="Click to view history logging detail info block">
					<span class="history-item-block-year-label">${h.year} - ${h.event}</span>
					<p class="history-item-block-desc-text">${h.description.substring(0, 90)}...</p>
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
			registerDynamicLightboxTrigger(rightImg, pool[0].image, pool[0].name, "Showcase Business Partner", pool[0].websiteUrl);
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
			registerDynamicLightboxTrigger(document.getElementById('inline-left-ad-img'), ad1.image, ad1.name, "SMLC Community Partner", ad1.websiteUrl);
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
			registerDynamicLightboxTrigger(document.getElementById('inline-center-ad-img'), ad3.image, ad3.name, "Featured Center Banner Area Business", ad3.websiteUrl);
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
					registerDynamicLightboxTrigger(document.getElementById(imgId), p.image, p.name, "Area Network Partner", p.websiteUrl);
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
			
			registerDynamicLightboxTrigger(document.getElementById('gallery-slideshow-node'), currentTarget.image, currentTarget.name, "Automated Partner Showcase Frame", currentTarget.websiteUrl);
			cycleIndex++;
		}
		containerElement.style.justifyContent = "center";
		renderNextSlide();
		setInterval(renderNextSlide, 60000);
	}

	async function loadGalleryImages() {
		const gallery = document.getElementById('flora-images-gallery') || document.getElementById('louisville-images-gallery');
		if (!gallery) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			if (!res.ok) throw new Error("Gallery mapping data link asset failure.");
			const data = await res.json();
			gallery.innerHTML = '';
			
			let arrayCollector = [];

			if (data.network_towns) {
				const keys = Object.keys(data.network_towns);
				const matchedKey = keys.find(k => k.toLowerCase() === activeTown);
				
				if (matchedKey && data.network_towns[matchedKey].categories) {
					data.network_towns[matchedKey].categories.forEach(cat => {
						if (cat.images && Array.isArray(cat.images)) {
							cat.images.forEach(img => {
								const imgId = img.id || '';
								if (imgId !== "flora_biz_01" && imgId !== "global_biz_spotlight") {
									arrayCollector.push(img);
								}
							});
						}
					});
				}
			}

			if (arrayCollector.length === 0) throw new Error("Empty Array");

			arrayCollector.forEach((img, gIdx) => {
				let finalImgPath = img.url || img.image || img;
				
				if (finalImgPath.startsWith('./')) {
					finalImgPath = 'https://raw.githubusercontent.com/Werewolf3788/Testpages/main/' + finalImgPath.substring(2);
				} else if (finalImgPath.startsWith('images/')) {
					finalImgPath = 'https://raw.githubusercontent.com/Werewolf3788/Testpages/main/' + finalImgPath;
				}

				const altTitleText = img.alt || img.name || "Community Image Asset";
				const targetSourceUrl = img.source_url || "#";
				const galleryImgId = `gallery-matrix-strip-img-${gIdx}`;
				
				gallery.innerHTML += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas" style="margin:0;">
							<img src="${finalImgPath}" id="${galleryImgId}" alt="${altTitleText}" style="width:100%; height:100%; object-fit:contain; cursor:pointer;" />
						</div>
					</div>`;
				
				setTimeout(() => {
					const imgEl = document.getElementById(galleryImgId);
					if (imgEl) {
						imgEl.style.cursor = "pointer";
						imgEl.addEventListener('click', (e) => {
							e.stopPropagation();
							openPortalLightbox(altTitleText, `${activeTown.toUpperCase()} Regional Asset Matrix Log`, "SMLC Community Image Register Record Asset View.", finalImgPath, targetSourceUrl);
						});
					}
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
		} finally {
			if (!gallery.children || gallery.children.length === 0 || gallery.innerHTML.trim() === '') {
				const widescreenSectionWrapper = gallery.closest('.widescreen-strip-container');
				if (widescreenSectionWrapper) {
					widescreenSectionWrapper.style.setProperty('display', 'none', 'important');
				}
			}
		}
	}

	function initFirebaseGasIndex() {
		try {
			const fbConfig = { databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com", projectId: "smlc-fuel-monitor" };
			if(!firebase.apps.length) firebase.initializeApp(fbConfig);
			
			if (activeTown === 'flora') {
				firebase.database().ref('fuel_prices/48100').on('value', (snap) => {
					const val = snap.val();
					if(val) {
						const regEl = document.getElementById('flora-caseys-reg');
						const dslEl = document.getElementById('flora-caseys-die');
						if(regEl) regEl.innerText = val.reg || "--.--";
						if(dslEl) dslEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
						if(val.date) document.getElementById('lv-time').innerText = `Updated: ${val.date}`;
					}
				});

				firebase.database().ref('fuel_prices/48101').on('value', (snap) => {
					const val = snap.val();
					if(val) {
						const regEl = document.getElementById('flora-hucks-reg');
						const dslEl = document.getElementById('flora-hucks-die');
						if(regEl) regEl.innerText = val.reg || "--.--";
						if(dslEl) dslEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
					}
				});

				firebase.database().ref('fuel_prices/128128').on('value', (snap) => {
					const val = snap.val();
					if(val) {
						const regEl = document.getElementById('flora-mach1-reg');
						const dslEl = document.getElementById('flora-mach1-die');
						if(regEl) regEl.innerText = val.reg || "--.--";
						if(dslEl) dslEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
					}
				});

				firebase.database().ref('fuel_prices/120226').on('value', (snap) => {
					const val = snap.val();
					if(val) {
						const regEl = document.getElementById('flora-faststop-reg');
						const dslEl = document.getElementById('flora-faststop-die');
						if(regEl) regEl.innerText = val.reg || "--.--";
						if(dslEl) dslEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
					}
				});
			} else {
				firebase.database().ref('fuel_prices/48026').on('value', (snap) => {
					const val = snap.val();
					if(val) {
						const regEl = document.getElementById('lv-reg');
						const dslEl = document.getElementById('lv-die');
						if(regEl) regEl.innerText = val.reg || "--.--";
						if(dslEl) dslEl.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
						if(val.date) document.getElementById('lv-time').innerText = `Updated: ${val.date}`;
					}
				});
			}
			
			const interactiveWidgetContainer = document.getElementById('fuel-index-monitor-box');
			if (interactiveWidgetContainer) {
				interactiveWidgetContainer.addEventListener('click', (e) => {
					if (e.target.classList.contains('lightbox-triggerable-element')) return;
					window.open(enforceUtmRouterUrl(gasPortalOverrideUrl), 'main-content-window');
				});
				
				const stationImg = interactiveWidgetContainer.querySelector('.station-logo-frame img');
				if (stationImg) {
					registerDynamicLightboxTrigger(stationImg, "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/gas-prices/image/Casey's.png", "Casey's General Store Logo", "Regional Gas Index Logo");
				}
			}
		} catch(e){}
	}

	window.openPortalLightbox = function(title, meta, story, imgUrl, targetSourceUrl) {
		const mask = document.getElementById('portal-lightbox');
		if (!mask) return;
		document.getElementById('lightbox-title').innerText = title;
		document.getElementById('lightbox-meta').innerText = meta;
		document.getElementById('lightbox-story').innerHTML = story;
		
		const imgNode = document.getElementById('lightbox-img');
		if (imgUrl) {
			imgNode.src = imgUrl;
			document.getElementById('lightbox-media-box').style.display = 'flex';
		} else {
			document.getElementById('lightbox-media-box').style.display = 'none';
		}
		
		const trackingLink = document.getElementById('lightbox-external-link');
		
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
