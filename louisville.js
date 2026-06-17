/**
 * PROJECT: Ourflora / Support My Local Community - Clay County, IL
 * PURPOSE: Standalone Bulletin Event Processing Engine
 * LEAD DEVELOPER: Werewolf3788
 * TIMESTAMP: June 17, 2026 4:35 PM [New York Time]
 * VERSION: 1.4 (Object Key Normalization)
 */

/* NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE */

// This is your live Google Script URL
const BULLETIN_URL = "https://script.google.com/macros/s/AKfycbz_nol3WlVM6_8FKN1V2aVeW5jZRa54gWs13lVEHVhx07xpzjMmedBd5vRdVyPiSemopA/exec";

async function loadEvents() {
    const list = document.getElementById('event-list');
    try {
        // Appending smart cache buster to guarantee real-time updates from the wire
        const response = await fetch(`${BULLETIN_URL}?v=${Date.now()}`);
        const rawEvents = await response.json();

        if (rawEvents && rawEvents.length > 0) {
            list.innerHTML = '';
            
            // Normalize incoming keys cleanly before slicing and printing to prevent property drops
            const events = rawEvents.map(item => {
                return {
                    name: item.name || item.title || "Untitled Event",
                    date: item.date || item.displayDate || "Date TBA",
                    time: item.time || (item.isAllDay ? "All Day" : (item.displayDate && item.displayDate.includes(", ")) ? item.displayDate.split(", ")[1] : "Scheduled"),
                    location: item.location || item.addr || "Clay County, IL",
                    details: item.details || item.desc || "Visit ourflora.com for more details."
                };
            });

            events.slice(-5).reverse().forEach(item => {
                
                const eventDateObj = new Date(item.date);
                const friendlyDate = isNaN(eventDateObj) ? item.date : eventDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                
                const gDate = isNaN(eventDateObj) ? "" : eventDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "").split("T")[0];
                const gCalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.name)}&dates=${gDate}/${gDate}&details=${encodeURIComponent(item.details || 'Local Event')}&location=${encodeURIComponent(item.location)}&sf=true&output=xml`;

                const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${item.name}\nLOCATION:${item.location}\nDTSTART:${gDate}\nDTEND:${gDate}\nDESCRIPTION:${item.details || 'Local Event'}\nEND:VEVENT\nEND:VCALENDAR`;
                const icsData = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);

                const div = document.createElement('div');
                div.className = 'event-item';
                div.innerHTML = `
                    <div class="event-date">${friendlyDate}</div>
                    <div class="event-title">${item.name}</div>
                    <div style="font-size: 14px; line-height: 1.4; color:#333;">
                        <strong>Location:</strong> ${item.location} <br> 
                        <strong>Time:</strong> ${item.time}
                    </div>
                    <div class="cal-links">
                        <span>Add to:</span>
                        <a href="${gCalLink}" target="_blank" class="cal-text-link">Google</a>
                        <span style="color:#777; margin: 0 5px;">|</span>
                        <a href="${icsData}" download="${item.name.replace(/\s+/g, '_')}.ics" class="cal-text-link">Apple / Outlook</a>
                    </div>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = "<p style='text-align:center; padding: 20px;'>No upcoming events on the wire.</p>";
        }
    } catch (e) {
        list.innerHTML = "<p style='text-align:center; padding: 20px;'>Wire connection error.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);
