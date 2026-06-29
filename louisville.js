/* ==========================================================================
   MASTER DEVELOPMENT PROTOCOL - HIGHLY LOCALIZED CENTRAL OPERATIONS MOTOR
   ========================================================================== */
/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE SPECIFIC DATA ARRAY MAPPINGS */
/* NYT Timestamp: 2026-06-28 21:20:00 */
(function() {
	const CURRENT_SITE_TOWN = "louisville";

	// Rigid boundary filter defining the exact communities within Clay County, IL
	const CLAY_COUNTY_TOWNS = ["louisville", "flora", "clay city", "xenia", "sailor springs", "iola", "bible grove", "hord", "ingraham", "wendelin"];

	const URLS = {
		config: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/config.json",
		assets: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/assets.json",
		menu: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/menu.json",
		partners: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/slideshow/partners.json",
		history: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/townjson/louisville.json",
		images: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/town-images.json",
		footer: "https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/footer.json",
		news: "https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json",
		bulletin: "https://script.google.com/macros/s/AKfycbz_nol3WlVM6_8FKN1V2aVeW5jZRa54gWs13lVEHVhx07xpzjMmedBd5vRdVyPiSemopA/exec"
	};

	let internalSequenceIndex = 0;
	let masterSlideshowLoopTrack = null;
	let globallyStoredAddressText = "607 W Clark Ave, Flora, IL 62401";

	function enforceUtmRouterUrl(baseLink, sourceName = "SMLC") {
		try {
			if (!baseLink || baseLink === "#" || baseLink.startsWith("javascript:") || baseLink.startsWith("tel:") || baseLink.startsWith("mailto:")) {
				return baseLink;
			}
			const urlObj = new URL(baseLink, window.location.origin);
			urlObj.searchParams.set('utm_source', sourceName);
			urlObj.searchParams.set('utm_medium', 'digital_town_square');
			urlObj.searchParams.set('utm_campaign', CURRENT_SITE_TOWN + '_delivery');
			urlObj.searchParams.set('v', '1.27');
			return urlObj.toString();
		} catch (e) { return baseLink; }
	}

	function shuffleArray(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
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

	function evaluateAdaptivePortalThemeCycles() {
		const portalWrapper = document.getElementById('adaptive-time-portal-chassis');
		if(!portalWrapper) return;
		try {
			const formatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Chicago' });
			const chicagoHour = parseInt(formatter.format(new Date()), 10);
			if (chicagoHour >= 19 || chicagoHour < 6) {
				portalWrapper.classList.add('dark-theme-active');
			} else {
				portalWrapper.classList.remove('dark-theme-active');
			}
		} catch(e) {}
	}

	function formatSystemTimeStringToCleanLayout(rawTimeStr) {
		if (!rawTimeStr) return "Scheduled Hours";
		if (String(rawTimeStr).includes("T")) {
			try {
				const parsedDateObj = new Date(rawTimeStr);
				if (!isNaN(parsedDateObj.getTime())) {
					let hours = parsedDateObj.getUTCHours();
					const minutes = parsedDateObj.getUTCMinutes().toString().padStart(2, '0');
					const ampm = hours >= 12 ? 'pm' : 'am';
					hours = hours % 12;
					hours = hours ? hours : 12;
					return `${hours}:${minutes}${ampm}`;
				}
			} catch (e) {}
		}
		return String(rawTimeStr);
	}

	function bootScorestreamEmbedWidgetDynamic() {
		try {
			const targetContainer = document.querySelector('.scorestream-widget-container');
			if (targetContainer) {
				targetContainer.innerHTML = '';
				const iframeElementNode = document.createElement('iframe');
				iframeElementNode.src = "https://scorestream.com/widgets/scoreboards/horz?userWidgetId=68601";
				iframeElementNode.style.width = "100%";
				iframeElementNode.style.height = "150px";
				iframeElementNode.style.border = "none";
				iframeElementNode.style.overflow = "hidden";
				iframeElementNode.setAttribute('scrolling', 'no');
				targetContainer.appendChild(iframeElementNode);
			}
		} catch (e) {}
	}

	function parseCleanFriendlyDomainName(rawUrl) {
		if (!rawUrl || rawUrl === '#') return '';
		try {
			let hostname = new URL(rawUrl).hostname;
			hostname = hostname.replace('www.', '');
			return hostname.split('.')[0];
		} catch (e) {
			return 'website';
		}
	}

	function makeAllTextUrlsClickable(rawHtmlText) {
		if (!rawHtmlText) return "";
		const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<]+)/gi;
		return rawHtmlText.replace(urlRegex, (capturedUrl) => {
			return `<a href="${enforceUtmRouterUrl(capturedUrl)}" target="current-tab" style="word-break: break-all; text-decoration: underline;">${capturedUrl}</a>`;
		});
	}

	async function runStrategicSlideshowEngine() {
		const targetChassisBox = document.getElementById('louisville-town-slideshow-matrix');
		if (!targetChassisBox) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			const dataset = await res.json();
			let parsedAssetCollectorPool = [];
			if (dataset.network_towns) {
				for (const townKey in dataset.network_towns) {
					if (townKey.toLowerCase() === CURRENT_SITE_TOWN) {
						const individualTownObject = dataset.network_towns[townKey];
						if (individualTownObject.categories && Array.isArray(individualTownObject.categories)) {
							individualTownObject.categories.forEach(categoryBlock => {
								if (categoryBlock.images && Array.isArray(categoryBlock.images)) {
									categoryBlock.images.forEach(imageRecord => {
										parsedAssetCollectorPool.push(imageRecord);
									});
								}
							});
						}
					}
				}
			}
			if (parsedAssetCollectorPool.length === 0) return;

			function triggerNextSlideSequence() {
				const activeNodeAsset = parsedAssetCollectorPool[internalSequenceIndex % parsedAssetCollectorPool.length];
				const absoluteSourcePath = activeNodeAsset.url || activeNodeAsset.image;
				const interactiveTextLabel = activeNodeAsset.name || "SMLC Local Asset Element View";
				const dynamicTrackingHref = activeNodeAsset.source_url || "#";

				targetChassisBox.innerHTML = `
					<div class="slideshow-engine-node-wrapper">
						<div class="slideshow-image-mask-viewport">
							<img src="${absoluteSourcePath}" alt="${activeNodeAsset.alt || interactiveTextLabel}" class="lightbox-triggerable-element" data-story="" data-url="${dynamicTrackingHref}" />
						</div>
						<a href="${enforceUtmRouterUrl(dynamicTrackingHref)}" target="current-tab" class="slideshow-action-link-caption-node">${interactiveTextLabel}</a>
					</div>
				`;
				internalSequenceIndex++;
				bindGlobalLightboxClickHandlers();
			}
			triggerNextSlideSequence();
			if (masterSlideshowLoopTrack) clearInterval(masterSlideshowLoopTrack);
			masterSlideshowLoopTrack = setInterval(triggerNextSlideSequence, 8000);
		} catch (e) {}
	}

	async function processSection4TownMatrixEngine() {
		const container = document.getElementById('section4-towns-matrix-root');
		if (!container) return;
		try {
			const response = await fetch('https://raw.githubusercontent.com/Werewolf3788/Testpages/main/json/section4.json');
			const data = await response.json();
			
			if (Array.isArray(data) && data.length > 0) {
				container.innerHTML = '';
				const louisvilleData = data.filter(item => item.Town && item.Town.toLowerCase() === CURRENT_SITE_TOWN);

				louisvilleData.forEach(item => {
					const cardNode = document.createElement('div');
					cardNode.className = 'section4-towns-matrix-wrapper';
					
					cardNode.innerHTML = `
						<div class="section4-left-prose-pane">
							${item.Description2}
						</div>
						<div class="section4-right-media-pane">
							<h3 class="section4-centered-title">${item.Title}</h3>
							<div class="section4-images-row">
								<div class="section4-image-column">
									<div class="section4-image-container-frame">
										<img src="${item.ImageUrl1}" alt="${item.Header1}" class="lightbox-triggerable-element" data-story="${item.Description1}" data-url="${item.ImageUrl1}" />
									</div>
									<span class="section4-header-label">${item.Header1}</span>
								</div>
								<div class="section4-image-column">
									<div class="section4-image-container-frame">
										<img src="${item.ImageUrl2}" alt="${item.Header2}" class="lightbox-triggerable-element" data-story="${item.Description1}" data-url="${item.ImageUrl2}" />
									</div>
									<span class="section4-header-label">${item.Header2}</span>
								</div>
							</div>
							<div class="section4-description1-footer">
								${makeAllTextUrlsClickable(item.Description1)}
							</div>
						</div>
					`;
					container.appendChild(cardNode);
				});
				
				bindGlobalLightboxClickHandlers();
			}
		} catch (e) {}
	}

	async function dispatchHistoricalLedgerStream() {
		const targetFeedContainer = document.getElementById('history-json-container');
		if (!targetFeedContainer) return;
		try {
			const res = await fetch(`${URLS.history}?v=${Date.now()}`);
			const dynamicPayload = await res.json();
			if (dynamicPayload && Array.isArray(dynamicPayload.history)) {
				targetFeedContainer.innerHTML = '';
				dynamicPayload.history.forEach((record) => {
					const boxCardNode = document.createElement('div');
					boxCardNode.className = 'timeline-horizontal-box-card';
					let imageStringHTML = record.image_url ? `<div class="timeline-box-media-frame"><img src="${record.image_url}" class="lightbox-triggerable-element" data-story="${record.description}" data-url="#" alt="${record.event}" /></div>` : '';
					
					boxCardNode.innerHTML = `
						<year1 class="timeline-box-year-stamp">${record.year}</year1>
						<HistTitle1 class="timeline-box-event-headline">${record.event}</HistTitle1>
						<layout-prose class="timeline-box-snippet-prose">${record.description}</layout-prose>
						${imageStringHTML}
					`;
					targetFeedContainer.appendChild(boxCardNode);
					boxCardNode.addEventListener('click', (e) => {
						if (e.target.classList.contains('lightbox-triggerable-element')) return;
						openPortalLightbox(record.event, `Year: ${record.year}`, record.description, record.image_url || "", "#");
					});
				});
				bindGlobalLightboxClickHandlers();
			}
		} catch (e) {}
	}

	async function renderSystemPartnersDistributed() {
		const topStrip = document.getElementById('top-partners-strip-matrix');
		if (!topStrip) return;
		try {
			const res = await fetch(`${URLS.partners}?v=${Date.now()}`);
			const partnerStripDataset = await res.json();
			
			if (Array.isArray(partnerStripDataset)) {
				let html = '';
				shuffleArray([...partnerStripDataset]).forEach(p => {
					html += `
						<div class="showcase-card-body">
							<div class="showcase-media-canvas">
								<img src="${p.img}" alt="${p.label}" class="lightbox-triggerable-element" data-story="" data-url="${p.link}" />
							</div>
							<a href="${enforceUtmRouterUrl(p.link)}" target="current-tab" class="showcase-action-link" style="font-size:12px; display:block; text-align:center; margin-top:8px;">${p.label}</a>
						</div>`;
				});
				topStrip.innerHTML = html;
				bindGlobalLightboxClickHandlers();
			}
		} catch (e) {}
	}

	async function renderSection8TownShowcaseStrip() {
		const stripMatrix = document.getElementById('section8-town-images-matrix');
		if (!stripMatrix) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			const data = await res.json();
			let filteredLouisvilleAssets = [];

			if (data.network_towns) {
				for (const townKey in data.network_towns) {
					if (townKey.toLowerCase() === CURRENT_SITE_TOWN) {
						const townObj = data.network_towns[townKey];
						if (townObj.categories && Array.isArray(townObj.categories)) {
							townObj.categories.forEach(cat => {
								if (Array.isArray(cat.images)) {
									cat.images.forEach(img => {
										if (img.id !== "global_biz_spotlight") {
											filteredLouisvilleAssets.push(img);
										}
									});
								}
							});
						}
					}
				}
			}

			if (filteredLouisvilleAssets.length === 0) {
				stripMatrix.innerHTML = "<p style='text-align:center; padding:20px; color:#fff;'>No regional specific arrays matched.</p>";
				return;
			}

			shuffleArray(filteredLouisvilleAssets);

			let htmlOutput = '';
			filteredLouisvilleAssets.forEach(p => {
				htmlOutput += `
					<div class="showcase-card-body">
						<div class="showcase-media-canvas">
							<img src="${p.url}" alt="${p.alt || p.name}" class="lightbox-triggerable-element" data-story="" data-url="${p.source_url}" />
						</div>
						<a href="${enforceUtmRouterUrl(p.source_url)}" target="current-tab" class="showcase-action-link" style="font-size:12px; display:block; text-align:center; margin-top:8px;">${p.name}</a>
					</div>`;
			});
			stripMatrix.innerHTML = htmlOutput;
			bindGlobalLightboxClickHandlers();
		} catch (e) {
			stripMatrix.innerHTML = "<p style='text-align:center; padding:20px; color:#fff;'>Showcase loop synchronization interruption.</p>";
		}
	}

	/* ARMORED CALENDAR ENGINE - DECOUPLED FROM INLINE GLOBAL ROUTER WINDOW FUNCTIONS */
	async function loadBulletinCalendarFeed() {
		const list = document.getElementById('event-list');
		if(!list) return;
		try {
			const response = await fetch(URLS.bulletin);
			const events = await response.json();

			if (events && events.length > 0) {
				list.innerHTML = '';
				
				const nowCST = fetchChicagoTime();
				const boundaryForwardCST = new Date(nowCST.getTime() + (30 * 24 * 60 * 60 * 1000));
				
				// Added specific historical boundary offset multiplier to shield timezone rollbacks safely
				const currentDayFloor = new Date(nowCST.getFullYear(), nowCST.getMonth(), nowCST.getDate() - 1, 0, 0, 0, 0);

				let parsedValidEntries = [];
				events.forEach(item => {
					if(!item || !item.date) return;
					let evDate = new Date(item.date);
					if (isNaN(evDate.getTime())) evDate = new Date(String(item.date).replace(/-/g, "/"));
					if (isNaN(evDate.getTime())) return;

					// Your explicit 30-day structural calendar layer loop filter
					if (evDate >= currentDayFloor && evDate <= boundaryForwardCST) {
						parsedValidEntries.push({ ...item, computedDateObj: evDate });
					}
				});

				if(parsedValidEntries.length === 0) {
					list.innerHTML = "<p style='text-align:center; padding: 20px; color: inherit; font-style:italic;'>No active dispatches scheduled at this time.</p>";
					return;
				}

				parsedValidEntries.sort((a, b) => a.computedDateObj - b.computedDateObj);

				parsedValidEntries.forEach(item => {
					const targetCleanNameString = String(item.name || "SMLC Community Update");
					const cleanHumanDateStr = item.computedDateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
					const isoDateString = item.computedDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "").split("T")[0];
					const locationString = String(item.location || "Clay County Area Region");
					
					const cleanTimeSpan = formatSystemTimeStringToCleanLayout(item.time);
					const rawLongDescriptionText = String(item.details || item.description || "");
					const shortenedBriefSnippetText = rawLongDescriptionText.length > 85 ? rawLongDescriptionText.substring(0, 85) + "..." : rawLongDescriptionText;

					const googleCalTemplateUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(targetCleanNameString)}&dates=${isoDateString}/${isoDateString}&details=${encodeURIComponent(rawLongDescriptionText)}&location=${encodeURIComponent(locationString)}&sf=true&output=xml`;
					const base64AppleCalendarHrefString = "data:text/calendar;charset=utf8," + encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${targetCleanNameString}\nLOCATION:${locationString}\nDTSTART:${isoDateString}\nDTEND:${isoDateString}\nDESCRIPTION:${rawLongDescriptionText}\nEND:VEVENT\nEND:VCALENDAR`);

					const div = document.createElement('div');
					div.className = 'event-item';
					div.innerHTML = `
						<div class="event-date">${cleanHumanDateStr}</div>
						<div class="event-title">${targetCleanNameString}</div>
						<div style="font-size: 14px; line-height: 1.4;">
							<strong>Where:</strong> <span class="map-link-router-node custom-event-blue-link" style="cursor:pointer; text-decoration:underline; font-weight:bold;" data-address="${locationString}">${locationString}</span> <br> 
							<strong>Time:</strong> ${cleanTimeSpan}
						</div>
						<div class="event-brief-desc">"${shortenedBriefSnippetText}"</div>
						<div><span class="read-more-trigger">READ MORE</span></div>
						<div class="cal-links">
							<span>ADD TO CALENDAR</span> <br>
							<a href="${googleCalTemplateUrl}" target="_blank" class="cal-text-link">GOOGLE</a>
							<span style="color:#777; margin: 0 5px;">|</span>
							<a href="${base64AppleCalendarHrefString}" download="${targetCleanNameString.replace(/[^a-zA-Z0-9]/g, '_')}.ics" class="cal-text-link">APPLE / OUTLOOK</a>
						</div>
					`;
					
					div.querySelector('.read-more-trigger').addEventListener('click', (e) => {
						e.stopPropagation();
						
						let detailsBoxMarkupHTML = '';
						if (rawLongDescriptionText.trim().length > 0) {
							detailsBoxMarkupHTML = `<div class="lightbox-description-card-box" style="display:block;"><p>${rawLongDescriptionText}</p></div>`;
						}

						const modularLightboxBodyHTML = `
							<div class="lightbox-meta-prose-row"><strong>Scheduled Date:</strong> ${cleanHumanDateStr}</div>
							<div class="lightbox-meta-prose-row"><strong>Target Location:</strong> <span class="map-link-router-node" style="cursor:pointer; text-decoration:underline; font-weight:bold; color:#cc0000;" data-address="${locationString}">${locationString}</span></div>
							<div class="lightbox-meta-prose-row"><strong>Time Window:</strong> ${cleanTimeSpan}</div>
							${detailsBoxMarkupHTML}
							<div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
								<a href="${googleCalTemplateUrl}" target="_blank" style="background:#000; color:#fff !important; font-weight:bold; padding:8px 14px; border-radius:4px; text-transform:uppercase; font-size:11px; text-decoration:none; border:1px solid #222;">Google Calendar</a>
								<a href="${base64AppleCalendarHrefString}" download="${targetCleanNameString.replace(/[^a-zA-Z0-9]/g, '_')}.ics" style="background:#fff; color:#222 !important; font-weight:bold; padding:8px 14px; border-radius:4px; text-transform:uppercase; font-size:11px; text-decoration:none; border:1px solid #222; box-shadow:2px 2px 0px #222;">iCal / Apple</a>
							</div>
						`;
						openPortalLightbox(targetCleanNameString, `SMLC Immersive Event Synchronization Panel`, modularLightboxBodyHTML, "", "#");
						bindInlineMapRouterNodeClicks();
					});

					list.appendChild(div);
				});

				bindInlineMapRouterNodeClicks();
			} else {
				list.innerHTML = "<p style='text-align:center; padding: 20px; color: inherit; font-style:italic;'>No active dispatches scheduled at this time.</p>";
			}
		} catch (e) {
			list.innerHTML = "<p style='text-align:center; padding: 20px;'>Wire synchronization channel interruption loop.</p>";
		}
	}

	function bindInlineMapRouterNodeClicks() {
		document.querySelectorAll('.map-link-router-node').forEach(node => {
			node.removeEventListener('click', handleMapLinkClickAction);
			node.addEventListener('click', handleMapLinkClickAction);
		});
	}

	function handleMapLinkClickAction(e) {
		e.stopPropagation();
		const targetedAddressString = this.getAttribute('data-address');
		// FIXED: Enforce wrapped global invocation checking parameters safely to completely sidestep early setup loops
		if(targetedAddressString && typeof window.triggerSmartMapRouter === 'function') { 
			window.triggerSmartMapRouter(targetedAddressString); 
		}
	}

	/* INTELLIGENT COMPREHENSIVE COUNTY BOUNDARY FILTERING MOTOR */
	async function parseSMLCNewsroomFeed() {
		const newsNode = document.getElementById('json-news-container');
		if(!newsNode) return;
		
		const headerChassisLabel = document.querySelector('.newspaper-header-border-fixed .dynamic-text-element-fixed');
		if (headerChassisLabel) {
			headerChassisLabel.innerHTML = "📰 Louisville Local News: SMLC HQ.";
		}

		try {
			const res = await fetch(URLS.news);
			const payload = await res.json();
			if(Array.isArray(payload)) {
				const filteredArticles = payload.filter(art => {
					const title = (art.title || "").toLowerCase();
					const story = (art.full_story || "").toLowerCase();
					const haystack = `${title} ${story}`;

					// Phase 1: Scan for explicit state-level or county-wide safety networks/infrastructure programs
					const isStateOrGlobalCounty = haystack.includes("state") || 
												  haystack.includes("idph") || 
												  haystack.includes("snap") || 
												  haystack.includes("food stamps") || 
												  haystack.includes("medicaid") || 
												  haystack.includes("health department") || 
												  haystack.includes("secretary of state") ||
												  (haystack.includes("clay county") && !CLAY_COUNTY_TOWNS.some(t => t !== CURRENT_SITE_TOWN && haystack.includes(t)));

					// Phase 2: Check for current town tags or athletic co-op definitions
					const isCurrentTownTarget = haystack.includes(CURRENT_SITE_TOWN) || 
												haystack.includes("nc ") || 
												haystack.includes("north clay");

					// Phase 3: Identify if the story mentions any other neighboring town inside Clay County
					const targetedNeighborTown = CLAY_COUNTY_TOWNS.find(town => town !== CURRENT_SITE_TOWN && haystack.includes(town));

					if (isCurrentTownTarget) return true;
					if (isStateOrGlobalCounty && !targetedNeighborTown) return true;
					return false;
				});

				newsNode.innerHTML = '';
				if(filteredArticles.length === 0) {
					newsNode.innerHTML = `<p style="text-align:center; padding:20px; font-style:italic;">No recent archives matched.</p>`;
					return;
				}

				filteredArticles.forEach((n) => {
					const card = document.createElement('div');
					card.className = 'clipping-card-container';
					let imgHTML = (n.image || n.image_url) ? `<div class="clipping-card-image-box"><img src="${n.image || n.image_url}" class="lightbox-triggerable-element" data-story="" data-url="${n.link || '#'}" alt="${n.title}" /></div>` : '';

					card.innerHTML = `
						${imgHTML}
						<h3>${n.title}</h3>
						<p class="clipping-card-text">"${(n.full_story || '').substring(0, 110)}..."</p>
						<a class="clipping-card-action-btn">Read Full Story</a>
					`;
					
					const triggerFullModalView = () => {
						const modularLightboxBodyHTML = `
							<div class="lightbox-description-card-box" style="display:block; margin-top:0;"><p>${n.full_story || ""}</p></div>
						`;
						openPortalLightbox(n.title, n.date || "News Room Archive", modularLightboxBodyHTML, n.image || n.image_url || "", n.link || "#");
					};

					card.querySelector('.clipping-card-action-btn').addEventListener('click', (e) => { e.stopPropagation(); triggerFullModalView(); });
					card.addEventListener('click', (e) => {
						if (e.target.classList.contains('lightbox-triggerable-element') || e.target.classList.contains('clipping-card-action-btn')) return;
						triggerFullModalView();
					});

					newsNode.appendChild(card);
				});
				bindGlobalLightboxClickHandlers();
			}
		} catch(e){}
	}

	function initFirebaseGasIndexEngine() {
		try {
			const fbConfig = { databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com", projectId: "smlc-fuel-monitor" };
			if(!firebase.apps.length) firebase.initializeApp(fbConfig);
			const targetedNodeId = '48026';

			firebase.database().ref('fuel_prices/' + targetedNodeId).on('value', (snap) => {
				const val = snap.val();
				if(val) {
					const regNode = document.getElementById('lv-reg');
					const dieNode = document.getElementById('lv-die');
					const timeNode = document.getElementById('lv-time');
					if(regNode) regNode.innerText = val.reg || "--.--";
					if(dieNode) dieNode.innerText = (val.dsl && val.dsl !== "0") ? val.dsl : "---";
					if(timeNode) timeNode.innerText = val.date ? `Updated: ${val.date}` : "Live Sync";
				}
			});
		} catch(e) {}
	}

	async function loadSpotlightBusinessAssetModule() {
		const imgWrap = document.getElementById('global-spotlight-media-container');
		const linkWrap = document.getElementById('global-spotlight-link-wrapper');
		if (!imgWrap) return;
		try {
			const res = await fetch(`${URLS.images}?v=${Date.now()}`);
			const registry = await res.json();
			let spotlightAsset = registry?.global_assets?.find(asset => asset.id === "global_biz_spotlight");
			if (spotlightAsset) {
				imgWrap.className = "full-bleed-spotlight-frame";
				
				imgWrap.innerHTML = `<img src="${spotlightAsset.url}" alt="${spotlightAsset.name}" class="lightbox-triggerable-element" data-story="" data-url="${spotlightAsset.source_url}" />`;
				
				linkWrap.innerHTML = `
					<div style="font-size:22px !important; font-weight:900; text-align:center; margin-top: 12px;">
						<a href="${enforceUtmRouterUrl(spotlightAsset.source_url)}" target="current-tab" style="color: var(--louis-black) !important; text-decoration: underline !important;">
							${spotlightAsset.name}
						</a>
					</div>`;
					
				bindGlobalLightboxClickHandlers();
			}
		} catch (e) {}
	}

	function bindGlobalLightboxClickHandlers() {
		document.querySelectorAll('.lightbox-triggerable-element, .polaroid-wrap img, .timeline-box-media-frame img').forEach(item => {
			item.removeEventListener('click', triggerDynamicLightboxModal);
			item.addEventListener('click', triggerDynamicLightboxModal);
		});
	}

	function triggerDynamicLightboxModal(e) {
		e.stopPropagation();
		const imgUrl = this.src || "";
		const altTitle = this.alt || "SMLC Community Digital Matrix Content View";
		const descriptionText = this.getAttribute('data-story') || "";
		const targetedHref = this.getAttribute('data-url') || "#";
		
		let modularLightboxBodyHTML = '';
		if (descriptionText.trim().length > 0) {
			modularLightboxBodyHTML = `<div class="lightbox-description-card-box" style="display:block; margin-top:0;"><p>${descriptionText}</p></div>`;
		} else if (targetedHref !== '#') {
			const dynamicLabel = parseCleanFriendlyDomainName(targetedHref);
			modularLightboxBodyHTML = `
				<div style="font-size:14px; color:#222; text-align:center; padding:10px 0;">
					Go to: <a href="${enforceUtmRouterUrl(targetedHref)}" target="current-tab" style="color:var(--link-bright-blue) !important; font-weight:bold; text-decoration:underline;">www.${dynamicLabel}.net</a>
				</div>`;
		}
		
		openPortalLightbox(altTitle, "Local Image", modularLightboxBodyHTML, imgUrl, targetedHref);
	}

	window.openPortalLightbox = function(title, meta, story, imgUrl, targetSourceUrl) {
		const mask = document.getElementById('portal-lightbox');
		if (!mask) return;
		
		document.getElementById('lightbox-title').innerText = title;
		document.getElementById('lightbox-meta').innerText = meta;
		
		document.getElementById('lightbox-story').innerHTML = makeAllTextUrlsClickable(story);
		
		const leftCell = mask.querySelector('.Lightbox-Left-Cell');
		const mapContainerBlock = document.getElementById('lightbox-maps-render-viewport');
		const imgNode = document.getElementById('lightbox-img');

		if (imgUrl) {
			if(imgNode) imgNode.src = imgUrl;
			document.getElementById('lightbox-media-box').style.display = 'flex';
			if(mapContainerBlock) mapContainerBlock.style.display = 'none';
			leftCell.style.flex = "12";
		} else {
			document.getElementById('lightbox-media-box').style.display = 'none';
			if(mapContainerBlock) mapContainerBlock.style.display = 'block';
			leftCell.style.flex = "1 1 55%";

			const matchLocAddressStr = story.match(/data-address="([^"]*)"/i) || story.match(/<strong>Target Location:<\/strong> <span class="map-link-router-node"[^>]*>(.*?)<\/span>/i);
			const cleanExtractedAddress = matchLocAddressStr ? (matchLocAddressStr[1] || matchLocAddressStr[2]) : "Louisville, IL 62858";
			
			if(mapContainerBlock) {
				mapContainerBlock.innerHTML = `<iframe width="100%" height="100%" style="border:0; min-height:100%;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=${encodeURIComponent(cleanExtractedAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>`;
			}
		}

		const trackingLink = document.getElementById('lightbox-external-link');
		if (!targetSourceUrl || targetSourceUrl === '#') {
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

	window.triggerSmartMapRouter = function(addressStr) {
		const overlay = document.getElementById('app-routing-overlay');
		const grid = document.getElementById('routing-options-grid');
		if (!overlay || !grid) return;

		const encodedAddress = encodeURIComponent(addressStr);
		grid.innerHTML = `
			<a href="https://maps.google.com/?q=${encodedAddress}" target="_blank" class="routing-app-btn">Google Maps App</a>
			<a href="maps://?daddr=${encodedAddress}" target="_blank" class="routing-app-btn">Apple Maps App</a>
			<a href="https://waze.com/ul?q=${encodedAddress}&navigate=yes" target="_blank" class="routing-app-btn">Waze App System Link</a>
		`;
		overlay.classList.add('active-show');
	};

	window.closeRoutingOverlay = function() {
		const overlay = document.getElementById('app-routing-overlay');
		if (overlay) overlay.classList.remove('active-show');
	};

	async function loadGlobalFooterDataMatrix() {
		const footerNode = document.getElementById('global-footer-container');
		if (!footerNode) return;
		try {
			const res = await fetch(`${URLS.footer}?v=${Date.now()}`);
			const raw = await res.json();
			const f = raw.footer_data;
			
			let targetEmailAddress = f.contact_info.email.address || "Scott.Robinson@skventuresigns.com";
			let rawAddressText = f.contact_info.address.text || "607 W Clark Ave, Effingham, IL 62401";
			globallyStoredAddressText = rawAddressText;

			const section10EmailLink = document.getElementById('section10-dynamic-email-anchor');
			if(section10EmailLink) {
				section10EmailLink.href = `mailto:${targetEmailAddress}`;
				section10EmailLink.innerText = targetEmailAddress;
			}

			let numbersHTMLBlocks = '';
			if (Array.isArray(f.contact_info.phone)) {
				f.contact_info.phone.forEach((p, index) => {
					numbersHTMLBlocks += `<span class="footer-value" onclick="window.location.href='tel:${p.number.replace(/[^0-9]/g, '')}'">${p.number}</span>`;
					if(index < f.contact_info.phone.length - 1) { 
						numbersHTMLBlocks += `<span class="footer-split-text-divider-span">or</span>`; 
					}
				});
			}

			footerNode.innerHTML = `
				<div class="footer-primary-row-chassis">
					<div class="footer-matrix-block-cell left-align-cell">
						<p class="footer-label">Give us a call</p>
						<div class="footer-value-row">${numbersHTMLBlocks}</div>
					</div>
					<div class="footer-matrix-block-cell center-align-cell">
						<p class="footer-label">Send us an Email</p>
						<div class="footer-value-row">
							<span class="footer-value" onclick="window.location.href='mailto:${targetEmailAddress}'">${targetEmailAddress}</span>
						</div>
					</div>
					<div class="footer-matrix-block-cell right-align-cell">
						<p class="footer-label">Visit our office</p>
						<div class="footer-value-row">
							<span class="footer-value" onclick="window.triggerSmartMapRouter('${globallyStoredAddressText}')">${globallyStoredAddressText}</span>
						</div>
					</div>
				</div>
				<div class="footer-copyright-bottom-row">
					<p class="footer-copyright-text">${f.copyright || "© 2026 S&K Ventures. All rights reserved."}</p>
				</div>
			`;
		} catch (e) {}
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
				link.setAttribute('target', 'current-tab');
				if (item.name.toLowerCase() === CURRENT_SITE_TOWN) link.className = 'active';
				li.appendChild(link);
				menuContainer.appendChild(li);
			});
		} catch (e) {}
	}

	async function loadGlobalAssets() {
		const headerBox = document.getElementById('global-header-container');
		if (!headerBox) return;
		try {
			const res = await fetch(`${URLS.assets}?v=${Date.now()}`);
			const assets = await res.json();
			const imgPath = assets.global_assets?.header_image?.url || "https://raw.githubusercontent.com/skventuresigns-design/media/main/smlc-web.png";
			headerBox.innerHTML = `<a href="${enforceUtmRouterUrl('https://staging.supportmylocalcommunity.com/')}" target="current-tab"><img src="${imgPath}" alt="Header" /></a>`;
		} catch (e) {}
	}

	function initGlobalTabFocusController() {
		const channel = new BroadcastChannel('smlc_navigation_hub');
		document.addEventListener('click', (e) => {
			const anchor = e.target.closest('a');
			if (anchor && anchor.getAttribute('target') === 'current-tab') {
				const destUrl = anchor.href;
				e.preventDefault();
				channel.postMessage({ action: 'jump_focus', url: destUrl });
				window.location.href = destUrl;
			}
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		loadGlobalAssets();
		generateDynamicMenu();
		runStrategicSlideshowEngine();
		processSection4TownMatrixEngine();
		dispatchHistoricalLedgerStream();
		renderSystemPartnersDistributed();
		renderSection8TownShowcaseStrip();
		loadBulletinCalendarFeed();
		parseSMLCNewsroomFeed();
		initFirebaseGasIndexEngine();
		loadSpotlightBusinessAssetModule();
		loadGlobalFooterDataMatrix();
		runChicagoClockLoop();
		evaluateAdaptivePortalThemeCycles();
		initGlobalTabFocusController();
		bootScorestreamEmbedWidgetDynamic();

		const lightboxMask = document.getElementById('portal-lightbox');
		if (lightboxMask) {
			lightboxMask.addEventListener('click', function(e) {
				if (e.target === lightboxMask) closePortalLightbox();
			});
		}
		const routingOverlay = document.getElementById('app-routing-overlay');
		if (routingOverlay) {
			routingOverlay.addEventListener('click', function(e) {
				if (e.target === routingOverlay) closeRoutingOverlay();
			});
		}
	});
})();
