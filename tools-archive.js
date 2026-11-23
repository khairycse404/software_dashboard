/* ==========================================================
   Team Penguins · MATE ROV 2027 · Tools Archive & Deep-Linker
   Direct URL format: https://<site>/#tool/<id>
   ========================================================== */
(function () {
  const TOOLS = [
    // --- INFRASTRUCTURE & WORKFLOW ---
    {
      id: "multi-user-rpi",
      name: "Multi-User RPi Workspace",
      category: "Infrastructure",
      owner: "All Software",
      phase: "Q1 · Workshops",
      brief: "Separate Linux accounts on the Raspberry Pi 4 with one shared project directory (/opt/rov_workspace) and rov_team permissions.",
      how: "Each member SSHs in with their own Linux user while sharing code in /opt/rov_workspace (775 permissions) alongside GitHub.",
      why: "Multiple members can develop and test on the same Pi cleanly without overwriting each other's files or breaking root configs.",
      kpi: "All 6–7 members connected with zero permission conflicts"
    },
    {
      id: "tailscale",
      name: "Tailscale Mesh VPN",
      category: "Infrastructure",
      owner: "All Software",
      phase: "Q1 · Workshops / Q2 · R&D",
      brief: "Zero-config private mesh VPN that lets team members securely connect to the Raspberry Pi from home over the internet.",
      how: "One member powers on the RPi at home; Tailscale gives it a private static IP reachable via SSH and ROS without any router port-forwarding.",
      why: "Removes physical access bottlenecks so members can code, debug, and test on real Pi hardware remotely.",
      kpi: "Remote SSH & testing from home in <10 seconds"
    },
    {
      id: "git-prs",
      name: "GitHub Branches & Pull Requests (PRs)",
      category: "Infrastructure",
      owner: "All Software",
      phase: "Q1 · Workshops",
      brief: "Structured version control where members develop on separate branches and submit Pull Requests for review before merging to main.",
      how: "Every feature is built on a feature branch; the Software Lead or Mentor reviews the PR before merging into the main ROV codebase.",
      why: "Prevents accidental broken code right before pool day and enforces shared coding standards across 6–7 members.",
      kpi: "100% of members merge a reviewed PR before Q2 R&D"
    },
    {
      id: "docker",
      name: "Docker & Docker Compose",
      category: "Infrastructure",
      owner: "ROS 2 & Control",
      phase: "Q1 · Workshops",
      brief: "Packages ROS 2 Jazzy and all dependencies into a portable container so every laptop runs the exact same software environment.",
      how: "A single docker-compose.yml with network=host spins up the full ROS 2 workspace identically on any Ubuntu/Windows machine.",
      why: "Eliminates 'it works on my laptop' setup bugs and cuts onboarding time for new Pioneers members from days to minutes.",
      kpi: "Identical ROS 2 environment across 100% of laptops"
    },
    {
      id: "ros2-doctor",
      name: "ros2 doctor & Pre-Dive Self-Test",
      category: "Infrastructure",
      owner: "ROS 2 + GUI",
      phase: "Q1 · Workshops / Q2 · R&D",
      brief: "Automated pre-dive diagnostic check that verifies ROS 2 nodes, network discovery, sensors, and thrusters before arming.",
      how: "Clicking Pre-Dive Self-Test runs ros2 doctor --report, checks IMU/depth/leak heartbeats, and pulses each thruster for 0.5s.",
      why: "Catches disconnected sensors, mismatched QoS, or dead thrusters on deck—never after the ROV is already in the water.",
      kpi: "100% automated PASS/FAIL badge before every dive"
    },

    // --- ROS 2 & CONTROL ---
    {
      id: "ustreamer",
      name: "uStreamer (Zero-Copy V4L2 MJPG)",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q2 · R&D",
      brief: "Ultra-lightweight Linux video streamer that forwards hardware-compressed camera feeds straight from the RPi 4 to the laptop.",
      how: "Reads native MJPEG frames directly from V4L2 kernel ring buffers via zero-copy mmap and streams over TCP—the RPi CPU never decodes pixels.",
      why: "Solves last season's UMVC overheating permanently: drops RPi 4 CPU from ~95% to <15% across 3 simultaneous 1080p cameras.",
      kpi: "<15% RPi CPU · <48°C · <40 ms latency"
    },
    {
      id: "micro-ros",
      name: "Micro-ROS & LIVELINESS Failsafe",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q2 · R&D",
      brief: "Native ROS 2 client running directly on the ESP32 over 921,600-baud UART with an automatic tether-loss safety watchdog.",
      how: "FreeRTOS Core 0 runs the Micro-ROS executor with RMW_QOS_POLICY_LIVELINESS_AUTOMATIC (1.0s lease). If comms drop, Core 1 halts horizontal thrusters, freezes the gripper, and surfaces safely.",
      why: "Eliminates fragile custom serial parsers and guarantees the ROV never runs away or drops a held prop during a comms glitch.",
      kpi: "50 Hz telemetry · <1.0s failsafe trigger · gripper state-freeze"
    },
    {
      id: "two-pass-mixer",
      name: "Two-Pass Attitude-Prioritized 6-DOF Mixer",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q2 · R&D",
      brief: "Smart thruster allocator on ESP32 Core 1 (100 Hz) that protects ROV balance first before allocating forward/sideways speed.",
      how: "Pass 1 reserves motor headroom for Roll/Pitch/Yaw stabilization; Pass 2 compresses linear Surge/Sway/Heave into the remaining headroom.",
      why: "Prevents the ROV from tilting or flipping when the pilot pushes full throttle while fighting currents.",
      kpi: "ROV attitude stays within ±2° under full-stick maneuvers"
    },
    {
      id: "dpms",
      name: "Polynomial DPMS (30A Fuse Protection)",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q2 · R&D",
      brief: "Real-time current limiter on the ESP32 that predicts total thruster amp draw and scales outputs proportionally before blowing the 30A fuse.",
      how: "Models each thruster's current via a 2nd-degree curve (a·u² + b·u + c). If total draw exceeds 28.5A, all thrusters scale by the same factor so the movement direction never twists.",
      why: "Guarantees zero blown competition fuses and prevents 5V logic brownouts during aggressive simultaneous maneuvers.",
      kpi: "Total current strictly capped ≤ 28.5A (0 fuse trips)"
    },
    {
      id: "cascaded-pid",
      name: "Cascaded PID & Gatekeeper Hold",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q2 · R&D",
      brief: "Dual-loop stabilization (outer Angle/Depth loop → inner Gyro-Rate loop) that auto-latches depth and heading when sticks are released.",
      how: "When vertical/yaw stick input returns to neutral, Gatekeeper latches the current depth/heading setpoint and smoothly holds position without fighting pilot commands.",
      why: "Delivers rock-steady hover and overshoot-free turns, letting the pilot focus on mission tasks instead of constantly fighting drift.",
      kpi: "Smooth ±2° attitude & steady depth hold with zero manual toggle"
    },
    {
      id: "lifecycle-nodes",
      name: "ROS 2 Lifecycle Nodes & CRC / WDT",
      category: "ROS 2 & Control",
      owner: "ROS 2 & Control",
      phase: "Q1 · Workshops / Q2 · R&D",
      brief: "Managed ROS 2 node state machines (Unconfigured → Inactive → Active) paired with packet checksums (CRC) and ESP32 Hardware Watchdog.",
      how: "Critical control nodes stay Inactive until sensors pass calibration; CRC catches tether noise and the 200ms Hardware WDT zeros PWM if packets stop.",
      why: "Prevents half-initialized launches and protects motors from corrupted electrical noise on long tethers.",
      kpi: "Structured startup + 200ms hardware watchdog cutoff"
    },
    {
      id: "gazebo-sitl",
      name: "Gazebo ROV Simulation (Full-Stack SITL)",
      category: "ROS 2 & Control",
      owner: "All Software",
      phase: "Q2 · R&D / Q3 · Int + Sim",
      brief: "Virtual 3D pool and ROV physics simulator that lets the Pilot, GUI, and AI test the entire mission before touching real water.",
      how: "Uses Mechanical's ROV URDF/dimensions with virtual cameras, IMU, and depth sensors—feeding live topics straight into our real React HUD and YOLO11-OBB pipeline.",
      why: "Gives the pilot weeks of early driving practice and lets all 3 sub-teams verify full-stack integration without waiting on pool access.",
      kpi: "Complete end-to-end virtual mission run before pool trials"
    },

    // --- GUI & TELEMETRY ---
    {
      id: "foxglove-bridge",
      name: "foxglove_bridge (Binary Telemetry)",
      category: "GUI & Telemetry",
      owner: "GUI & Pilot",
      phase: "Q2 · R&D",
      brief: "High-speed C++ binary WebSocket server replacing heavy JSON rosbridge—streaming 50–100 Hz telemetry with 3×–5× smaller packets.",
      how: "Streams raw binary ROS 2 messages over one lightweight C++ server on the RPi 4 to both our React Pilot HUD and Foxglove Studio simultaneously.",
      why: "Eliminates WebSocket lag on live graphs/3D Digital Twin and gives us an instant 5-second backup screen if the custom React UI ever glitches.",
      kpi: "Zero telemetry lag @ 50–100 Hz · 5-sec backup switchover"
    },
    {
      id: "foxglove-studio",
      name: "Foxglove Studio (Engineering Cockpit)",
      category: "GUI & Telemetry",
      owner: "GUI + ROS 2",
      phase: "Q1 · Workshops / Q4 · Testing",
      brief: "Free ROS 2 visualization and debugging workspace for live PID graphs, 3D orientation, logs, and instant rosbag2 playback.",
      how: "Connects to foxglove_bridge on a second monitor during pool tests—or opens saved rosbag2 files offline—while the Pilot keeps a clean React HUD.",
      why: "Cuts pool debugging time in half and serves as a zero-setup backup monitor at competition.",
      kpi: "Live dual-screen debugging + instant rosbag2 inspection"
    },
    {
      id: "rosbag2",
      name: "rosbag2 ('Fail Once' Flight Recorder)",
      category: "GUI & Telemetry",
      owner: "All Software",
      phase: "Q1 · Workshops / Q4 · Testing",
      brief: "Records every live sensor, telemetry, and camera stream during pool trials so bugs can be replayed and fixed offline on any laptop.",
      how: "Triggered via 1-click record button in the React HUD (ros2 bag record); replayed later with ros2 bag play directly into Foxglove or ROS nodes.",
      why: "Stops wasting limited pool hours trying to reproduce rare bugs—a bug happens ONCE and gets solved cleanly offline.",
      kpi: "100% of pool trials logged & replayable offline"
    },
    {
      id: "threejs-twin",
      name: "Three.js 3D Digital Twin & Virtual Caliper",
      category: "GUI & Telemetry",
      owner: "GUI & Pilot",
      phase: "Q2 · R&D",
      brief: "Live 3D ROV orientation viewer driven by IMU quaternions plus an in-browser 3D point-cloud ruler for measuring underwater objects.",
      how: "Embedded inside our React HUD using Three.js; rotates the virtual ROV live and lets pilots click any two points on reconstructed 3D meshes to measure length in mm/cm.",
      why: "Gives pilots instant spatial awareness in murky water and removes manual guesswork during sizing tasks.",
      kpi: "Live IMU 3D tracking + interactive metric caliper in browser"
    },
    {
      id: "echarts",
      name: "ECharts Live PID/DPMS Plotter & Reverse Mode",
      category: "GUI & Telemetry",
      owner: "GUI & Pilot",
      phase: "Q2 · R&D",
      brief: "Real-time telemetry graphs (Setpoint vs. Depth/Heading & live DPMS amps) paired with 1-Click Reverse Mode and 1-Click Judge Report Export.",
      how: "Renders smooth 50 Hz charts in React, flips [Surge, Sway, Yaw] + camera feed on 1 click for rear-tool ops, and exports timestamped CSV/PDF evidence.",
      why: "Speeds up pool PID tuning, eliminates pilot mental axis-flipping under pressure, and automates competition reporting.",
      kpi: "Live 50 Hz curves · instant axis inversion · 1-click CSV/PDF"
    },

    // --- AI & VISION ---
    {
      id: "grayworld-clahe",
      name: "C++ Gray World + LAB CLAHE",
      category: "AI & Vision",
      owner: "AI & Vision",
      phase: "Q1 · Workshops / Q2 · R&D",
      brief: "Ultra-fast underwater image enhancer that restores lost red wavelengths and murky contrast before AI or 3D scanning sees the frame.",
      how: "Gray World mathematically rebalances blue-green color shift; LAB-space CLAHE boosts local dark-area contrast while capping bright glare spots—compiled in C++.",
      why: "Boosts AI detection accuracy and 3D feature matching by 40–70% in murky pool water with virtually zero delay.",
      kpi: "< 2 ms per frame (30+ FPS real-time)"
    },
    {
      id: "v4l2-ctl",
      name: "v4l2-ctl Manual Exposure Lock (Sun Glare Fix)",
      category: "AI & Vision",
      owner: "AI + GUI + Mech",
      phase: "Q1 · Workshops / Q2 · R&D",
      brief: "Live camera hardware exposure, gain, and white-balance controls exposed right inside the GUI to stop sunlight glare from clipping frames to pure white.",
      how: "Disables webcam Auto-Exposure via Linux v4l2-ctl before diving, paired with a $5 mechanical lens hood/polarizer and CLAHE.",
      why: "Software can't recover pure white clipped pixels—stopping saturation at the camera sensor solves our #1 competition vision threat.",
      kpi: "Zero white-out glare clipping during outdoor/bright pool runs"
    },
    {
      id: "blender-synthetic",
      name: "Blender Synthetic Dataset Generator (bpy)",
      category: "AI & Vision",
      owner: "AI & Vision",
      phase: "Q2 · R&D",
      brief: "Python script inside Blender that auto-renders thousands of labeled underwater training images with randomized glare, turbidity, and angles.",
      how: "Places 3D models of 2027 competition targets in a virtual underwater scene and exports thousands of auto-labeled OBB training pairs in hours.",
      why: "Eliminates days of manual photo labeling and trains our AI to handle harsh sunlight glare before we even get pool time.",
      kpi: "5,000+ auto-labeled training images within 48h of Rulebook"
    },
    {
      id: "yolo11-obb",
      name: "TensorRT YOLO11-OBB + ByteTrack",
      category: "AI & Vision",
      owner: "AI & Vision",
      phase: "Q2 · R&D",
      brief: "Rotated bounding-box object detector (YOLO11-OBB) running on topside RTX GPU paired with ByteTrack multi-frame ID tracking.",
      how: "Predicts tight rotated boxes [x, y, w, h, angle] in FP16 TensorRT (cutting 35% seabed background noise) while ByteTrack assigns persistent IDs across frames.",
      why: "Accurately classifies and sizes tilted underwater targets (like crabs/props) without ever double-counting when the camera pans.",
      kpi: "mAP > 0.95 · > 60 FPS (< 14 ms) · zero double-counting"
    },
    {
      id: "colmap-ngp",
      name: "Camera 3D R&D (COLMAP + Instant-NGP & Dual-USB Stereo)",
      category: "AI & Vision",
      owner: "AI & Vision",
      phase: "Q2 · R&D",
      brief: "Under-study 2027 innovation to automate 3D reconstruction & sizing using standard $18 webcams—no $1,000 depth camera needed.",
      how: "Laplacian sharpness filter drops blurry frames → COLMAP + Instant-NGP builds a 3D mesh on the laptop GPU (plus testing an 80–120mm Dual-USB stereo rig); SolidWorks remains our safe fallback.",
      why: "Targets the Best Computer Vision award at near-zero hardware cost while keeping zero competition risk.",
      kpi: "3D mesh in < 60s · ±5 mm accuracy (SolidWorks fallback ready)"
    }
  ];

  const categories = ["All", "Infrastructure", "ROS 2 & Control", "GUI & Telemetry", "AI & Vision"];
  let activeCat = "All";
  let searchQuery = "";

  const filtersEl = document.getElementById("toolFilters");
  const gridEl = document.getElementById("toolsGrid");
  const searchEl = document.getElementById("toolSearch");
  const modalEl = document.getElementById("toolModal");
  const modalBody = document.getElementById("toolModalBody");
  const modalClose = document.getElementById("toolModalClose");

  if (!gridEl) return;

  function renderFilters() {
    filtersEl.innerHTML = categories.map(cat =>
      `<button type="button" class="filter-btn ${cat === activeCat ? "is-active" : ""}" data-cat="${cat}">${cat}</button>`
    ).join("");
    filtersEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCat = btn.dataset.cat;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const q = searchQuery.trim().toLowerCase();
    const filtered = TOOLS.filter(t => {
      const catOk = activeCat === "All" || t.category === activeCat;
      const qOk = !q || (t.name + " " + t.brief + " " + t.owner + " " + t.category + " " + t.id).toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (!filtered.length) {
      gridEl.innerHTML = `<p class="tools-empty">No tools match "${searchQuery}". Try another keyword.</p>`;
      return;
    }

    gridEl.innerHTML = filtered.map(t => `
      <article class="tool-card" data-tool-id="${t.id}" tabindex="0" role="button" aria-label="Open brief for ${t.name}">
        <div class="tool-card__top">
          <span class="tool-tag">${t.category}</span>
          <span class="tool-phase">${t.phase}</span>
        </div>
        <h3>${t.name}</h3>
        <p>${t.brief}</p>
        <div class="tool-card__foot">
          <span class="tool-kpi">${t.kpi}</span>
          <span class="tool-open">Open brief →</span>
        </div>
      </article>
    `).join("");

    gridEl.querySelectorAll(".tool-card").forEach(card => {
      const open = () => openToolModal(card.dataset.toolId, true);
      card.addEventListener("click", open);
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  function openToolModal(id, updateHash) {
    const tool = TOOLS.find(t => t.id === id);
    if (!tool) return;

    if (updateHash) {
      history.replaceState(null, "", `#tool/${tool.id}`);
    }

    const directUrl = `${window.location.origin}${window.location.pathname}#tool/${tool.id}`;
    modalBody.innerHTML = `
      <div class="tool-modal__meta">
        <span class="tool-tag">${tool.category}</span>
        <span class="tool-phase">${tool.phase}</span>
        <span class="tool-owner">Owner: ${tool.owner}</span>
      </div>
      <h2 class="tool-modal__title">${tool.name}</h2>
      <div class="tool-modal__block">
        <h4>Quick Brief</h4>
        <p>${tool.brief}</p>
      </div>
      <div class="tool-modal__block">
        <h4>How It Works on Skipper 2.0</h4>
        <p>${tool.how}</p>
      </div>
      <div class="tool-modal__block">
        <h4>Why Team Penguins Uses It</h4>
        <p>${tool.why}</p>
      </div>
      <div class="tool-modal__kpi">
        <strong>Target KPI:</strong> <span>${tool.kpi}</span>
      </div>
      <div class="tool-modal__actions">
        <button type="button" class="btn-copy-link" id="copyToolLinkBtn">Copy Direct Link (#tool/${tool.id})</button>
        <code class="tool-modal__slug">#tool/${tool.id}</code>
      </div>
    `;

    const copyBtn = document.getElementById("copyToolLinkBtn");
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(directUrl).then(() => {
        copyBtn.textContent = "Copied link!";
        setTimeout(() => (copyBtn.textContent = `Copy Direct Link (#tool/${tool.id})`), 1800);
      });
    });

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeToolModal() {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.location.hash.startsWith("#tool/")) {
      history.replaceState(null, "", "#tools-archive");
    }
  }

  function checkHashRoute() {
    const h = window.location.hash || "";
    if (h.startsWith("#tool/")) {
      const id = decodeURIComponent(h.slice(6)).trim();
      const sec = document.getElementById("tools-archive");
      if (sec) sec.scrollIntoView({ behavior: "smooth" });
      openToolModal(id, false);
    }
  }

  if (searchEl) {
    searchEl.addEventListener("input", e => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeToolModal);
  if (modalEl) {
    modalEl.addEventListener("click", e => {
      if (e.target === modalEl) closeToolModal();
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modalEl.classList.contains("is-open")) closeToolModal();
  });
  window.addEventListener("hashchange", checkHashRoute);

  renderFilters();
  renderGrid();
  checkHashRoute();
})();
