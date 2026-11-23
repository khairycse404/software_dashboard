/* ==========================================================
   Team Penguins · MATE ROV 2027 · Software Lead Dashboard
   Vanilla JS, no dependencies. Works from file:// (index.html).
   ========================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     DATA
     --------------------------------------------------------- */

  // Section 1 · architecture blocks (left -> right) and the links between them
  const NODES = [
    {
      icon: "🖥️", tier: "Topside", name: "React GUI + YOLO AI", sub: "Laptop · RTX GPU",
      role: "The pilot's cockpit and the heavy brain: HUD, joystick input, YOLO11-OBB detection, 3D reconstruction and the in-browser caliper.",
      ask: "Ask: GUI team + AI team"
    },
    {
      icon: "🔌", tier: "Tether", name: "Ethernet", sub: "Cat6 · ROS 2 + uStreamer",
      role: "One Gigabit cable carries two separate things: ROS 2 messages (isolated with ROS_DOMAIN_ID=42) and raw camera streams from uStreamer.",
      ask: "Ask: ROS team"
    },
    {
      icon: "🍓", tier: "Onboard", name: "Raspberry Pi 4", sub: "Ubuntu · ROS 2 Jazzy",
      role: "The router. It forwards video and messages and runs the micro-ROS agent. It does NOT think: target CPU under 15% and under 48 °C.",
      ask: "Ask: ROS team"
    },
    {
      icon: "🔗", tier: "Bridge", name: "UART / Micro-ROS", sub: "921600 baud",
      role: "A dedicated serial wire that makes the ESP32 a real ROS 2 participant. If the heartbeat dies here, the failsafe triggers.",
      ask: "Ask: ROS + Embedded"
    },
    {
      icon: "⚙️", tier: "Real-time", name: "ESP32", sub: "FreeRTOS · 100 Hz loop",
      role: "The reflexes. Two-Pass Mixer, PID, current limiting (DPMS) and the auto-ascent failsafe all run here, independent of network quality.",
      ask: "Ask: Embedded team"
    },
    {
      icon: "🌀", tier: "Actuation", name: "ESCs + Thrusters", sub: "6 × PWM",
      role: "Electronic speed controllers turn the ESP32's PWM signals into thrust. This is the only part that physically moves the vehicle.",
      ask: "Ask: Embedded + Electrical"
    }
  ];
  const LINKS = [
    { label: "Commands ⇄ Video", both: true },
    { label: "ROS 2 topics ⇄ Video", both: true },
    { label: "Serial ⇄ DDS", both: true },
    { label: "Thrust setpoints", both: false },
    { label: "PWM", both: false }
  ];

  // Section 2 · the arsenal. owner keys: ai | ros | emb | gui
  const OWNER = { ai: "AI / CV team", ros: "ROS team", emb: "Embedded team", gui: "GUI team" };
  const CARDS = [
    { id: "p1", prio: "#1", cat: "control", title: "Two-Pass Mixer", tag: "Stable at full stick",
      what: "Thruster math in two passes: stabilization (roll, pitch, yaw) gets motor power first, driving only uses what is left.",
      why: "The ROV never tips over when the pilot floors it, so judges see rock-steady footage and a clearly smarter control design.",
      who: ["emb"] },
    { id: "p2", prio: "#2", cat: "comms", title: "uStreamer Passthrough", tag: "Cool Pi, fast video",
      what: "Camera frames go straight from the Linux kernel onto the network, so the Pi never re-encodes video.",
      why: "Fixes last year's overheating: Pi CPU under 8%, latency under 35 ms, and the ROS nodes start reliably.",
      who: ["ros"] },
    { id: "p3", prio: "#3", cat: "vision", title: "YOLO11-OBB Perception", tag: "Rotated crab boxes",
      what: "The detector draws tilted boxes that hug each crab instead of a loose axis-aligned rectangle.",
      why: "Less seabed noise, fewer false positives against native crabs, and the box itself gives the carapace size.",
      who: ["ai"] },
    { id: "p4", prio: "#4", cat: "control", title: "Polynomial DPMS", tag: "Never blow the fuse",
      what: "Estimates total current from the thrust commands and scales every thruster by the same factor above 28.5 A.",
      why: "Protects the 30 A fuse and the 5 V logic from brownouts while keeping the pilot's direction exactly the same.",
      who: ["emb"] },
    { id: "p5", prio: "#5", cat: "vision", title: "Dual-USB Stereo Rig", tag: "Depth for $36",
      what: "Two cheap webcams mounted 120 mm apart, calibrated underwater, give a depth map.",
      why: "Real 3D measurement without a camera that costs thousands: a strong cost-versus-capability story.",
      who: ["ai"] },
    { id: "p6", prio: "#6", cat: "vision", title: "Laplacian Gatekeeper", tag: "Only sharp frames",
      what: "Scores every video frame for sharpness and silently drops the blurry ones before 3D reconstruction.",
      why: "Cleaner 3D models in less time, because thruster wash and pilot motion no longer poison the dataset.",
      who: ["ai"] },
    { id: "p7", prio: "#7", cat: "gui", title: "Three.js 3D Caliper", tag: "Click to measure",
      what: "The pilot clicks two points on the 3D model in the browser and the HUD shows the real distance.",
      why: "Judges watch a live, millimetre-level measurement instead of someone holding a ruler to a screen.",
      who: ["gui"] },
    { id: "p8", prio: "#8", cat: "vision", title: "Synthetic Blender Dataset", tag: "Free labeled images",
      what: "A Blender script renders thousands of underwater crab images and writes the labels automatically.",
      why: "A stronger model without endless pool days or hand-drawn boxes, which is a very credible CV story.",
      who: ["ai"] },
    { id: "p9", prio: "#9", cat: "failsafe", title: "Liveliness Auto-Ascent", tag: "Tether cut ≠ crash",
      what: "The ESP32 expects a heartbeat; if it goes quiet for 1 s it stops horizontal thrust and floats up.",
      why: "Shows the judges the vehicle is safe by design, even when the cable or the Pi fails.",
      who: ["ros", "emb"] },
    { id: "p10", prio: "#10", cat: "gui", title: "1-Click Reverse Mode", tag: "Rear tools, no brain-flip",
      what: "One button flips the joystick axes and swaps the main camera to the rear view.",
      why: "Pilots stop mentally inverting controls under time pressure, which means fewer mistakes at the rear gripper.",
      who: ["gui"] },
    { id: "h1", prio: "Hybrid 1", cat: "hybrid", title: "3D Metrology Engine", tag: "Dive to measurement, fast",
      what: "Stereo rig, then Laplacian gate, then Instant-NGP mesh, then the Three.js caliper, as one pipeline.",
      why: "Turns a coral-garden scan into a measured 3D model in about a minute using almost no extra hardware.",
      who: ["ai", "gui"] },
    { id: "h2", prio: "Hybrid 2", cat: "hybrid", title: "Fail-Proof Propulsion Core", tag: "Can't flip, burn or run away",
      what: "Two-Pass Mixer, DPMS current limiting and auto-ascent combined in one 100 Hz ESP32 task.",
      why: "One coherent safety story for the architecture judges: stable, electrically safe and fail-safe.",
      who: ["emb", "ros"] },
    { id: "exp1", prio: "Exp", cat: "vision", title: "Experimental: Real-Time 3D Mapping", tag: "Monocular maps on the fly",
      what: "Bypasses the NeRF pipeline by generating 3D pointmaps directly from the uStreamer feed using monocular foundation models (Depth Anything V2 / DUSt3R).",
      why: "Delivers instantaneous single-pass pool floor mapping and collision awareness in real time, eliminating multi-view orbits and training latency.",
      who: ["ai"] }
  ];
  const FILTERS = [
    ["all", "All"], ["control", "Control"], ["comms", "Comms"], ["vision", "Vision"],
    ["gui", "GUI"], ["failsafe", "Failsafe"], ["hybrid", "Hybrids"]
  ];

  // Section 3 · crash course. Items are concepts to understand, not skills to master.
  const TRACKS = [
    {
      id: "ros", label: "ROS 2", icon: "🧩",
      title: "ROS 2 Track · understand the system, not the syntax",
      intro: "Goal: read the architecture diagram, ask sharp questions and spot problems in a demo.",
      skip: "Skip writing complex C++ nodes for now. Your job is to know what each node does and how they talk.",
      items: [
        { t: "Nodes: independent programs", d: "Know which nodes run on the Pi, which on the topside, and that the ESP32 appears as a node via micro-ROS.", day: "Day 1" },
        { t: "Topics and pub/sub", d: "Follow one command end to end: /pilot/raw_cmd_vel → Gatekeeper → /rov/cmd_vel → ESP32.", day: "Day 1" },
        { t: "ROS_DOMAIN_ID and discovery", d: "Why ID 42 isolates our traffic on the tether and what breaks if two machines disagree.", day: "Day 2" },
        { t: "QoS Liveliness", d: "A heartbeat with a 1 s lease: if it expires, the ESP32 triggers the emergency ascent.", day: "Day 2" },
        { t: "The micro-ROS agent", d: "The bridge between the UART wire and the DDS world; if it dies, the ESP32 goes silent.", day: "Day 2" },
        { t: "Draw the 3-tier architecture from memory", d: "Topside, RPi 4, ESP32, with the job and the key number of each tier.", day: "Day 3" },
        { t: "Debug vocabulary for stand-ups", d: "Recognize what ros2 node list, topic list, topic echo and topic hz tell you.", day: "Day 3" }
      ]
    },
    {
      id: "ai", label: "AI / CV", icon: "👁️",
      title: "AI / CV Track · know how the pipeline thinks",
      intro: "Goal: judge whether the vision team's results are good and explain them to a judge in one minute.",
      skip: "Skip model training setup and PyTorch syntax. Know what goes in, what comes out and what good looks like.",
      items: [
        { t: "YOLO-OBB mechanics", d: "Output is center x, y, width, height and angle. Why a rotated box beats an axis-aligned one on tilted crabs.", day: "Day 3" },
        { t: "Reading the metrics", d: "What mAP, FPS and a false positive mean. Our gates are mAP above 0.95 and a fast, steady frame rate.", day: "Day 4" },
        { t: "Synthetic datasets", d: "Blender renders underwater scenes and exports labels automatically. Why this saves pool time.", day: "Day 4" },
        { t: "Gray-world filtering", d: "Equalize the average of the colour channels so the red light water absorbed comes back.", day: "Day 4" },
        { t: "The inference pipeline", d: "uStreamer → topside → Gray World → TensorRT YOLO → size and count on the HUD.", day: "Day 5" },
        { t: "Stereo and the Laplacian gate", d: "Depth comes from two cameras (Z = f·B / d). Blurry frames are rejected by a sharpness score.", day: "Day 5" },
        { t: "Monocular Depth vs. SLAM vs. 3DGS", d: "Depth estimation gives relative distances per frame; SLAM builds a persistent trajectory map; 3D Gaussian Splatting provides explicit real-time volumetric rendering.", day: "Day 5" }
      ]
    },
    {
      id: "gui", label: "GUI", icon: "🖱️",
      title: "GUI Track · follow the data, ignore the pixels",
      intro: "Goal: know how information reaches the pilot's screen and where latency or bugs can hide.",
      skip: "Skip HTML/CSS styling and component design. Learn the data flow and the 3D idea, not the look.",
      items: [
        { t: "End-to-end data flow", d: "Robot topic → rosbridge → WebSocket → roslibjs → React state → HUD.", day: "Day 5" },
        { t: "WebSockets vs. Serial", d: "The browser talks WebSocket to the Pi. Serial is only the Pi↔ESP32 wire and never touches the GUI.", day: "Day 5" },
        { t: "React state as a single source of truth", d: "Telemetry lives in state; the screen re-renders from it. A stale state means a stale HUD.", day: "Day 6" },
        { t: "Video is a separate channel", d: "Camera streams come straight from uStreamer, apart from control data, so video load cannot delay commands.", day: "Day 6" },
        { t: "Three.js in one picture", d: "Scene, camera, mesh, and a raycaster that turns two clicks into a real distance.", day: "Day 6" },
        { t: "Reverse Mode logic", d: "It negates surge, sway and yaw and swaps the camera. Simple math, big usability win.", day: "Day 6" }
      ]
    },
    {
      id: "lead", label: "Day 7 · Lead Review", icon: "🎯",
      title: "Day 7 · Lead Review · put it together",
      intro: "Goal: turn what you learned into leadership: alignment, accountability and clear gates.",
      skip: "No new theory today. Use the vocabulary you have just built.",
      items: [
        { t: "Teach the architecture to one teammate", d: "Five minutes at a whiteboard. If you can't explain it simply, revisit that tier.", day: "Day 7" },
        { t: "Ask each team lead three questions", d: "What is done, what is blocked, and which verification gate are you working toward?", day: "Day 7" },
        { t: "Set the three gates for the next sprint", d: "Gate 1: Pi under 15% CPU and 48 °C. Gate 2: level attitude and under 28.5 A. Gate 3: mAP above 0.95 and under 5 mm error.", day: "Day 7" }
      ]
    }
  ];

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const STORAGE_KEY = "penguins-dashboard-progress-v1";
  const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7"></polyline></svg>';
  const CHEV_SVG = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';

  /* ---------------------------------------------------------
     AMBIENT BUBBLES
     --------------------------------------------------------- */
  (function bubbles() {
    const host = $(".bubbles");
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 16; i++) {
      const b = document.createElement("span");
      const s = 8 + Math.random() * 34;
      b.style.width = b.style.height = s + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.animationDuration = 14 + Math.random() * 22 + "s";
      b.style.animationDelay = -Math.random() * 30 + "s";
      host.appendChild(b);
    }
  })();

  /* ---------------------------------------------------------
     SECTION 1 · FLOW DIAGRAM
     --------------------------------------------------------- */
  (function renderFlow() {
    const host = $("#flow");
    NODES.forEach((n, i) => {
      const node = el("div", "node");
      node.setAttribute("role", "listitem");
      const btn = el("button", "block",
        `<span class="icon" aria-hidden="true">${n.icon}</span>
         <span class="tier">${n.tier}</span>
         <span class="name">${n.name}</span>
         <span class="sub">${n.sub}</span>`);
      btn.type = "button";
      btn.setAttribute("aria-describedby", "tip-" + i);
      const tip = el("div", "tip", `<strong>${n.name}</strong>${n.role}<em>${n.ask}</em>`);
      tip.id = "tip-" + i;
      tip.setAttribute("role", "tooltip");
      node.append(btn, tip);
      // Tap/click toggles the tooltip (touch devices do not hover)
      btn.addEventListener("click", () => {
        const wasOpen = node.classList.contains("open");
        $$(".node.open", host).forEach(x => x.classList.remove("open"));
        if (!wasOpen) node.classList.add("open");
      });
      host.appendChild(node);

      if (LINKS[i]) {
        const l = el("div", "link" + (LINKS[i].both ? " link--both" : ""),
          `<div class="wire"></div><span class="label">${LINKS[i].label}</span>`);
        l.setAttribute("aria-hidden", "true");
        host.appendChild(l);
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".node")) $$(".node.open", host).forEach(x => x.classList.remove("open"));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") $$(".node.open", host).forEach(x => x.classList.remove("open"));
    });
  })();

  /* ---------------------------------------------------------
     SECTION 2 · ARSENAL CARDS
     --------------------------------------------------------- */
  (function renderArsenal() {
    const chips = $("#filters");
    const grid = $("#cards");

    FILTERS.forEach(([key, label], i) => {
      const c = el("button", "chip", label);
      c.type = "button";
      c.dataset.filter = key;
      c.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      c.addEventListener("click", () => {
        $$(".chip", chips).forEach(x => x.setAttribute("aria-pressed", String(x === c)));
        $$(".card", grid).forEach(card => {
          card.hidden = !(key === "all" || card.dataset.cat === key);
        });
      });
      chips.appendChild(c);
    });

    CARDS.forEach(c => {
      const card = el("article", "card" + (c.cat === "hybrid" ? " card--hybrid" : ""));
      card.dataset.cat = c.cat;
      const bodyId = "card-body-" + c.id;
      const owners = c.who.map(k => `<span class="o-${k}">${OWNER[k]}</span>`).join("");
      card.innerHTML = `
        <button class="card-btn" type="button" aria-expanded="false" aria-controls="${bodyId}">
          <div class="card-top"><span class="prio">${c.prio}</span><span class="cat">${c.cat}</span></div>
          <h3>${c.title}</h3>
          <p class="tagline">${c.tag}</p>
          ${CHEV_SVG}
        </button>
        <div class="card-body" id="${bodyId}">
          <div>
            <dl class="detail">
              <div><dt>What it is</dt><dd>${c.what}</dd></div>
              <div><dt>Why it wins points</dt><dd>${c.why}</dd></div>
              <div><dt>Who owns it</dt><dd class="owner">${owners}</dd></div>
            </dl>
          </div>
        </div>`;
      const btn = $(".card-btn", card);
      btn.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
      });
      grid.appendChild(card);
    });
  })();

  /* ---------------------------------------------------------
     SECTION 3 · CRASH COURSE (tabs + checklist + progress)
     --------------------------------------------------------- */
  (function crashCourse() {
    const tabsEl = $("#tabs");
    const panelsEl = $("#panels");
    const barsEl = $("#trackBars");
    const ringFg = $("#ringFg");
    const ringPct = $("#ringPct");
    const ringCount = $("#ringCount");
    const ringMsg = $("#ringMsg");
    const navLabel = $("#navProgressLabel");
    const navBar = $("#navProgressBar");
    const CIRC = 2 * Math.PI * 52;

    // Load saved state: { "ros-0": true, ... }
    let state = {};
    try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch (e) { state = {}; }
    const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } };

    const total = TRACKS.reduce((n, t) => n + t.items.length, 0);

    TRACKS.forEach((t, ti) => {
      // Tab
      const tab = el("button", "tab", `<span aria-hidden="true">${t.icon}</span><span>${t.label}</span><span class="count" id="count-${t.id}"></span>`);
      tab.type = "button";
      tab.id = "tab-" + t.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", "panel-" + t.id);
      tab.setAttribute("aria-selected", ti === 0 ? "true" : "false");
      tab.tabIndex = ti === 0 ? 0 : -1;
      tab.addEventListener("click", () => selectTab(ti));
      tabsEl.appendChild(tab);

      // Panel
      const panel = el("div", "panel");
      panel.id = "panel-" + t.id;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.hidden = ti !== 0;
      panel.appendChild(el("div", "panel-head",
        `<h3>${t.title}</h3><p>${t.intro}</p><div class="skip"><b>⏭ Skip:</b> ${t.skip}</div>`));
      const ul = el("ul", "checklist");
      t.items.forEach((it, ii) => {
        const key = t.id + "-" + ii;
        const li = document.createElement("li");
        const b = el("button", "item",
          `<span class="box">${CHECK_SVG}</span>
           <span class="txt"><strong>${it.t}</strong><small>${it.d}</small></span>
           <span class="day">${it.day}</span>`);
        b.type = "button";
        b.dataset.key = key;
        b.dataset.track = t.id;
        b.setAttribute("role", "checkbox");
        b.setAttribute("aria-checked", state[key] ? "true" : "false");
        b.addEventListener("click", () => {
          const on = b.getAttribute("aria-checked") !== "true";
          b.setAttribute("aria-checked", String(on));
          if (on) state[key] = true; else delete state[key];
          save();
          update();
        });
        li.appendChild(b);
        ul.appendChild(li);
      });
      panel.appendChild(ul);
      panelsEl.appendChild(panel);

      // Per-track bar in the progress card
      const row = el("li", null,
        `<div class="row"><span>${t.label}</span><span id="bar-text-${t.id}"></span></div>
         <div class="bar"><i id="bar-${t.id}"></i></div>`);
      barsEl.appendChild(row);
    });

    function selectTab(idx) {
      TRACKS.forEach((t, i) => {
        const tab = $("#tab-" + t.id);
        const on = i === idx;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        $("#panel-" + t.id).hidden = !on;
      });
    }
    // Arrow-key navigation across tabs (WAI-ARIA tabs pattern)
    tabsEl.addEventListener("keydown", (e) => {
      const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!keys.includes(e.key)) return;
      const cur = TRACKS.findIndex(t => $("#tab-" + t.id).getAttribute("aria-selected") === "true");
      let next = cur;
      if (e.key === "ArrowRight") next = (cur + 1) % TRACKS.length;
      if (e.key === "ArrowLeft") next = (cur - 1 + TRACKS.length) % TRACKS.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = TRACKS.length - 1;
      e.preventDefault();
      selectTab(next);
      $("#tab-" + TRACKS[next].id).focus();
    });

    const MESSAGES = [
      [0, "Start with the ROS 2 track: it explains how everything connects."],
      [1, "Good start. Keep going, every concept makes the next one easier."],
      [26, "Quarter of the way. You can already follow the architecture."],
      [51, "Over halfway. You're becoming fluent in the team's language."],
      [76, "Almost there. Time to start talking with your team leads."],
      [100, "You're ready to lead. Go run that Day 7 review. 🐧"]
    ];

    function update() {
      let done = 0;
      TRACKS.forEach(t => {
        const n = t.items.filter((_, i) => state[t.id + "-" + i]).length;
        done += n;
        const pct = Math.round((n / t.items.length) * 100);
        $("#count-" + t.id).textContent = n + "/" + t.items.length;
        $("#bar-" + t.id).style.width = pct + "%";
        $("#bar-text-" + t.id).textContent = n + "/" + t.items.length;
      });
      const pct = Math.round((done / total) * 100);
      ringFg.style.strokeDashoffset = String(CIRC * (1 - done / total));
      ringPct.textContent = pct + "%";
      ringCount.textContent = done + " / " + total;
      navLabel.textContent = pct + "%";
      navBar.style.width = pct + "%";
      let msg = MESSAGES[0][1];
      MESSAGES.forEach(([min, text]) => { if (pct >= min) msg = text; });
      ringMsg.textContent = msg;
    }

    $("#resetBtn").addEventListener("click", () => {
      if (!Object.keys(state).length) return;
      if (!window.confirm("Reset all crash-course progress?")) return;
      state = {};
      save();
      $$(".item").forEach(b => b.setAttribute("aria-checked", "false"));
      update();
    });

    update();
  })();

  /* ---------------------------------------------------------
     NAVBAR · highlight current section
     --------------------------------------------------------- */
  (function navSpy() {
    const links = $$(".nav-links a");
    const sections = links.map(a => $("#" + a.dataset.section)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle("active", a.dataset.section === en.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(s => io.observe(s));
  })();
})();
