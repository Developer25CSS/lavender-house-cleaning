/* ============================================================
   Site chat widget — fully scripted, zero ongoing cost (no LLM
   API calls). Answers common questions via keyword matching and
   quick-reply buttons, and hands off to a human for anything else.
   ============================================================ */
(function () {
  var TOPICS = [
    {
      label: "Pricing",
      keywords: ["price", "cost", "how much", "rate", "pricing"],
      reply: "Flat rates by home size, starting at $150 for a studio/1-bedroom basic clean. See the full table on our <a href=\"services.html\">Services &amp; Pricing</a> page, or get an instant quote on <a href=\"payment.html\">Book &amp; Pay</a>.",
    },
    {
      label: "Book a cleaning",
      keywords: ["book", "schedule", "appointment", "reserve"],
      reply: "You can book online in under a minute at <a href=\"payment.html\">Book &amp; Pay</a>, or fill out a quote request on our <a href=\"booking.html\">Booking</a> page and we'll text you back.",
    },
    {
      label: "Service areas",
      keywords: ["area", "location", "city", "denver", "colorado springs", "do you serve", "cover"],
      reply: "We serve 149+ cities across Colorado statewide. Check the full list on our <a href=\"service-areas.html\">Service Areas</a> page.",
    },
    {
      label: "Minimum / hours",
      keywords: ["minimum", "how long", "hours"],
      reply: "There's a 2-hour minimum on every booking. Most standard cleans run 2-4 hours depending on home size.",
    },
    {
      label: "Careers / pay",
      keywords: ["job", "hire", "hiring", "apply", "career", "work for", "pay rate"],
      reply: "We're hiring across Colorado at $25-$30/hr, your choice. Check out <a href=\"hiring.html\">Careers</a> and take the quick application quiz.",
    },
    {
      label: "Payment",
      keywords: ["pay online", "deposit", "card", "stripe", "refund"],
      reply: "You can pay online by card via <a href=\"payment.html\">Book &amp; Pay</a> — a $50 deposit holds your spot, or pay in full. See our <a href=\"refund-policy.html\">Refund Policy</a> for cancellations.",
    },
  ];

  var FALLBACK = "I'm not sure about that one — want to talk to a person instead? " +
    "<a href=\"tel:14425880028\">Call 442.588.0028</a> or <a href=\"sms:14425880028\">text us</a>.";

  function matchTopic(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < TOPICS.length; i++) {
      if (TOPICS[i].keywords.some(function (k) { return lower.indexOf(k) !== -1; })) {
        return TOPICS[i];
      }
    }
    return null;
  }

  function build() {
    var bubble = document.createElement('button');
    bubble.textContent = '💬';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.style.cssText = 'position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;' +
      'background:var(--lav-700,#6f57b4);color:#fff;border:none;font-size:24px;cursor:pointer;' +
      'box-shadow:0 8px 20px rgba(0,0,0,.25);z-index:9999;';

    var panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;bottom:86px;right:20px;width:320px;max-width:calc(100vw - 40px);' +
      'max-height:70vh;background:#fff;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.28);' +
      'display:none;flex-direction:column;overflow:hidden;z-index:9999;font-family:inherit;';

    panel.innerHTML =
      '<div style="background:var(--lav-700,#6f57b4);color:#fff;padding:14px 16px;font-weight:700;">Ask Lavender</div>' +
      '<div id="cwLog" style="flex:1;overflow-y:auto;padding:12px;font-size:.9rem;max-height:320px;"></div>' +
      '<div id="cwQuick" style="padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid #eee;"></div>' +
      '<form id="cwForm" style="display:flex;border-top:1px solid #eee;">' +
      '<input id="cwInput" type="text" placeholder="Type a question…" style="flex:1;border:none;padding:10px;font-size:.9rem;outline:none;">' +
      '<button type="submit" style="border:none;background:var(--lav-700,#6f57b4);color:#fff;padding:0 16px;cursor:pointer;">Send</button>' +
      '</form>';

    document.body.appendChild(bubble);
    document.body.appendChild(panel);

    var log = panel.querySelector('#cwLog');
    var quick = panel.querySelector('#cwQuick');
    var form = panel.querySelector('#cwForm');
    var input = panel.querySelector('#cwInput');

    function addMessage(html, fromUser) {
      var msg = document.createElement('div');
      msg.style.cssText = 'margin-bottom:10px;padding:8px 12px;border-radius:10px;max-width:85%;' +
        (fromUser ? 'background:var(--cream,#f4eef8);margin-left:auto;' : 'background:#f1f1f1;');
      msg.innerHTML = html;
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    }

    function respond(text) {
      addMessage(text, true);
      var topic = matchTopic(text);
      setTimeout(function () { addMessage(topic ? topic.reply : FALLBACK, false); }, 300);
    }

    TOPICS.forEach(function (t) {
      var btn = document.createElement('button');
      btn.textContent = t.label;
      btn.style.cssText = 'font-size:.78rem;padding:5px 10px;border-radius:999px;border:1px solid #ddd;background:#fff;cursor:pointer;';
      btn.addEventListener('click', function () { respond(t.label); });
      quick.appendChild(btn);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value.trim()) return;
      respond(input.value.trim());
      input.value = '';
    });

    bubble.addEventListener('click', function () {
      var isOpen = panel.style.display === 'flex';
      panel.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen && !log.children.length) {
        addMessage("Hi! I'm the Lavender House Cleaning assistant. Ask me about pricing, booking, service areas, or pick a topic below.", false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
