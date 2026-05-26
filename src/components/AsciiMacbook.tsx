import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
  char: string;
}

interface AsciiMacbookProps {
  isBackground?: boolean;
}

export default function AsciiMacbook({ isBackground = false }: AsciiMacbookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ ry: 0, rx: 0.35 }); // Initial tilt down a bit

  // Terminal logs / text overlays beside the laptop
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIALIZING SYSTEM CORE...",
    "READY_STATE_OK: TRUE",
    "GATHERING BIO DATA...",
    "ABEDINEGO_IS_SE_STUDENT: TRUE",
  ]);

  // Append rotating text simulation
  useEffect(() => {
    const logs = [
      "COMPILING COMPONENT STACK...",
      "SYNCING LOCAL_THEME_CACHING...",
      "EMERGE_PORTFOLIO_LAUNCH: OK",
      "FETCHING RECRUITER_LOGS...",
      "MODERN_3D_TERMINAL_GRID: ACTIVE",
      "BUFFER_STREAM: 100% SECURE",
      "RAFIKI_MODULE: LOADED",
      "ACTIVE_SE_HONORS_SEM: 2026",
    ];
    const interval = setInterval(() => {
      setTerminalLogs((prev) => {
        const next = [...prev];
        next.shift();
        next.push(logs[Math.floor(Math.random() * logs.length)]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Responsive sizing
    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = containerRef.current.clientWidth;
      // Responsive height
      height = containerRef.current.clientHeight || Math.max(320, Math.min(width * 0.55, 420));
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Track mouse coordinates inside container
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Normalize values between -1 and 1
      mouseRef.current.targetX = x / (rect.width / 2);
      mouseRef.current.targetY = y / (rect.height / 2);
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // Prepare ambient glowing data particles emitting from keyboard
    const particles: Particle[] = [];
    const maxParticles = 35;
    const chars = ["1", "0", "+", "-", "[", "]", "{", "}", ";", "<", ">", "*", "$"];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 60,
        y: 0,
        z: (Math.random() - 0.5) * 45,
        speedY: 0.3 + Math.random() * 0.4,
        opacity: Math.random(),
        life: 0,
        maxLife: 60 + Math.random() * 120,
        char: chars[Math.floor(Math.random() * chars.length)]
      });
    }

    // Laptop Dimensions Config
    const scaleFactor = isBackground ? 2.3 : 1.0;
    const theta = 18 * Math.PI / 180; // Lid open tilt: 18 degrees leaning back

    // System Rotation State
    let time = 0;

    // Helper functions for 3D projections
    const project = (x: number, y: number, z: number, rx: number, ry: number) => {
      // 1. Rotation about Y-axis (slow automatic rotation + mouse target delta)
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      let y1 = y;

      // 2. Rotation about X-axis (tilt perspective + mouse delta)
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;
      let x2 = x1;

      // Perspective scale calculations
      const cameraDistance = 350;
      const fov = 340;
      const fScale = fov / (cameraDistance + z2);

      // Relative screen output coordinates offset to canvas center
      const cx = width / 2;
      const cy = isBackground ? height / 2 : height / 2 + 10; // Slightly shifted down for a base pedestal feeling in component mode

      return {
        x: cx + x2 * fScale * scaleFactor,
        y: cy - y2 * fScale * scaleFactor,
        visible: z2 > -cameraDistance,
        scale: fScale
      };
    };

    // Draw line connecting projected points
    const drawLine3D = (
      p1: { x: number; y: number; z: number },
      p2: { x: number; y: number; z: number },
      color: string,
      widthSize: number,
      rx: number,
      ry: number
    ) => {
      const proj1 = project(p1.x, p1.y, p1.z, rx, ry);
      const proj2 = project(p2.x, p2.y, p2.z, rx, ry);

      if (!proj1.visible || !proj2.visible) return;

      ctx.beginPath();
      ctx.moveTo(proj1.x, proj1.y);
      ctx.lineTo(proj2.x, proj2.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = widthSize;
      ctx.stroke();
    };

    // Main 3D render tick loop
    const render = () => {
      if (!ctx || !canvas) return;

      // Clear dark background with transparent canvas for dynamic background or default zinc-950
      if (isBackground) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "#09090B"; // Matches tailwind zinc-950 perfectly
        ctx.fillRect(0, 0, width, height);
      }

      // Render a subtle technical grid network at the bottom (only in normal component mode)
      if (!isBackground) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.02)";
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 24) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let j = 0; j < height; j += 24) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(width, j);
          ctx.stroke();
        }
      }

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      time += 0.007; // Slow timeline speed
      // Automatic main rotation + interactive mouse wobble offsets
      const ry = time + mouseRef.current.x * 0.4;
      const rx = 0.38 + mouseRef.current.y * 0.25; // Tilt bound checks

      // Draw aesthetic outer perimeter terminal glow circle beneath
      const basePedestalProj = project(0, -3, 0, rx, ry);
      if (basePedestalProj.visible) {
        ctx.beginPath();
        ctx.ellipse(basePedestalProj.x, basePedestalProj.y + 4, 90 * basePedestalProj.scale, 32 * basePedestalProj.scale, 0, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          basePedestalProj.x, basePedestalProj.y + 4, 10,
          basePedestalProj.x, basePedestalProj.y + 4, 90 * basePedestalProj.scale
        );
        grad.addColorStop(0, "rgba(16, 185, 129, 0.14)");
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.03)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Define 3D coordinates for MacBook parts
      // Width (68), Depth (46), Thickness (3), screenHeight (42)
      const w = 34;
      const d = 23;
      const th = -3;
      const sh = 38;

      // LOWER BASE BOTTOM PLATE
      const bBL = { x: -w, y: th, z: -d };
      const bBR = { x: w, y: th, z: -d };
      const bFR = { x: w, y: th, z: d };
      const bFL = { x: -w, y: th, z: d };

      // LOWER BASE TOP SURFACE
      const tBL = { x: -w + 0.5, y: 0, z: -d + 0.5 };
      const tBR = { x: w - 0.5, y: 0, z: -d + 0.5 };
      const tFR = { x: w - 0.5, y: 0, z: d - 0.5 };
      const tFL = { x: -w + 0.5, y: 0, z: d - 0.5 };

      // DRAW VERTICAL FILL FACES CHASSIS (glowing emerald wires)
      const wireMainColor = "rgba(16, 185, 129, 0.7)";
      const wireSubColor = "rgba(16, 185, 129, 0.25)";
      const wireGlowColor = "rgba(16, 185, 129, 0.4)";

      // Connect Bottom Base Plate Frame
      drawLine3D(bBL, bBR, wireSubColor, 1, rx, ry);
      drawLine3D(bBR, bFR, wireSubColor, 1, rx, ry);
      drawLine3D(bFR, bFL, wireSubColor, 1, rx, ry);
      drawLine3D(bFL, bBL, wireSubColor, 1, rx, ry);

      // Connect Top Base Plate Frame
      drawLine3D(tBL, tBR, wireMainColor, 1.5, rx, ry);
      drawLine3D(tBR, tFR, wireMainColor, 1.5, rx, ry);
      drawLine3D(tFR, tFL, wireMainColor, 1.5, rx, ry);
      drawLine3D(tFL, tBL, wireMainColor, 1.5, rx, ry);

      // Vertical Connectors (Give it 3D extrusion)
      drawLine3D(bBL, tBL, wireSubColor, 1, rx, ry);
      drawLine3D(bBR, tBR, wireSubColor, 1, rx, ry);
      drawLine3D(bFR, tFR, wireSubColor, 1, rx, ry);
      drawLine3D(bFL, tFL, wireSubColor, 1, rx, ry);

      // TOUCHPAD OUTLINE
      const tpL = 10;
      const tpW = 12;
      const tpStart = d - 10;
      const tpEnd = d - 1;
      const p1 = { x: -tpW, y: 0, z: tpStart };
      const p2 = { x: tpW, y: 0, z: tpStart };
      const p3 = { x: tpW, y: 0, z: tpEnd };
      const p4 = { x: -tpW, y: 0, z: tpEnd };
      drawLine3D(p1, p2, wireSubColor, 1, rx, ry);
      drawLine3D(p2, p3, wireSubColor, 1, rx, ry);
      drawLine3D(p3, p4, wireSubColor, 1, rx, ry);
      drawLine3D(p4, p1, wireSubColor, 1, rx, ry);

      // KEYBOARD GRID IN 3D (Draw individual key rows in perspective!)
      const numRows = 5;
      const numCols = 10;
      const keyAreaStartDepth = -d + 4;
      const keyAreaEndDepth = tpStart - 3;
      const keyAreaWidth = w - 4;

      for (let row = 0; row < numRows; row++) {
        const rowPct = row / (numRows - 1);
        const zCoord = keyAreaStartDepth + rowPct * (keyAreaEndDepth - keyAreaStartDepth);

        // Horizontal line for this keyboard row
        const rowLeft = { x: -keyAreaWidth, y: 0, z: zCoord };
        const rowRight = { x: keyAreaWidth, y: 0, z: zCoord };
        drawLine3D(rowLeft, rowRight, "rgba(16, 185, 129, 0.22)", 1, rx, ry);

        // Draw individual keys in these rows (little dashes/nodes resembling high-tech keys)
        for (let col = 0; col <= numCols; col++) {
          const colPct = col / numCols;
          const xCoord = -keyAreaWidth + colPct * (keyAreaWidth * 2);
          const keyVertex = { x: xCoord, y: 0, z: zCoord };
          const pKey = project(keyVertex.x, keyVertex.y, keyVertex.z, rx, ry);
          if (pKey.visible) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
            ctx.fillRect(pKey.x - 1, pKey.y - 1, 2, 2);
          }
        }
      }

      // UPPER SCREEN / DISPLAY LID (Hinged at Z = -d, rotates UP by angle and backwards by theta)
      const hingeZ = -d + 1;
      
      // Calculate coordinates of screen corners relative to hinge
      const yLidLocal = sh * Math.cos(theta);
      const zLidLocal = -sh * Math.sin(theta);

      // FRONT LID SCREEN CORNERS
      const sBL = { x: -w, y: 0, z: hingeZ };
      const sBR = { x: w, y: 0, z: hingeZ };
      const sTR = { x: w - 0.2, y: yLidLocal, z: hingeZ + zLidLocal };
      const sTL = { x: -w + 0.2, y: yLidLocal, z: hingeZ + zLidLocal };

      // Connect screen front wires
      drawLine3D(sBL, sBR, wireMainColor, 1.5, rx, ry);
      drawLine3D(sBR, sTR, wireMainColor, 1.5, rx, ry);
      drawLine3D(sTR, sTL, wireMainColor, 1.5, rx, ry);
      drawLine3D(sTL, sBL, wireMainColor, 1.5, rx, ry);

      // BACK LID CASING CORNERS (Gives the lid physical thickness)
      const tLid = 2; // thickness in units
      const dyNorm = -tLid * Math.sin(theta);
      const dzNorm = -tLid * Math.cos(theta);

      const bBL_back = { x: -w, y: dyNorm, z: hingeZ + dzNorm };
      const bBR_back = { x: w, y: dyNorm, z: hingeZ + dzNorm };
      const bTR_back = { x: w - 0.2, y: yLidLocal + dyNorm, z: hingeZ + zLidLocal + dzNorm };
      const bTL_back = { x: -w + 0.2, y: yLidLocal + dyNorm, z: hingeZ + zLidLocal + dzNorm };

      // Connect screen back wires
      drawLine3D(bBL_back, bBR_back, wireSubColor, 1, rx, ry);
      drawLine3D(bBR_back, bTR_back, wireSubColor, 1, rx, ry);
      drawLine3D(bTR_back, bTL_back, wireSubColor, 1, rx, ry);
      drawLine3D(bTL_back, bBL_back, wireSubColor, 1, rx, ry);

      // Connect depth links
      drawLine3D(sBL, bBL_back, wireSubColor, 0.8, rx, ry);
      drawLine3D(sBR, bBR_back, wireSubColor, 0.8, rx, ry);
      drawLine3D(sTR, bTR_back, wireSubColor, 0.8, rx, ry);
      drawLine3D(sTL, bTL_back, wireSubColor, 0.8, rx, ry);

      // SCREEN INNER BEZEL (inset of display)
      const border = 2.5;
      const ibBL = { x: -w + border, y: border * Math.cos(theta), z: hingeZ - border * Math.sin(theta) };
      const ibBR = { x: w - border, y: border * Math.cos(theta), z: hingeZ - border * Math.sin(theta) };
      const ibTR = { x: w - border, y: yLidLocal - border * Math.cos(theta), z: hingeZ + zLidLocal + border * Math.sin(theta) };
      const ibTL = { x: -w + border, y: yLidLocal - border * Math.cos(theta), z: hingeZ + zLidLocal + border * Math.sin(theta) };

      drawLine3D(ibBL, ibBR, "rgba(16, 185, 129, 0.35)", 1, rx, ry);
      drawLine3D(ibBR, ibTR, "rgba(16, 185, 129, 0.35)", 1, rx, ry);
      drawLine3D(ibTR, ibTL, "rgba(16, 185, 129, 0.35)", 1, rx, ry);
      drawLine3D(ibTL, ibBL, "rgba(16, 185, 129, 0.35)", 1, rx, ry);

      // MULTIPLEX DIGITAL DATA INSIDE SCREEN: Glowing Matrix scan matrix lines & visual waves
      const rowsScan = 8;
      const colsScan = 14;
      const timeOffset = Date.now() * 0.003;

      for (let r = 0; r < rowsScan; r++) {
        const rp = (r + 1.2) / (rowsScan + 1.4);
        const yL = rp * (sh - border * 2);

        // Screen row 3D anchors left & right
        const scrLeft = {
          x: -w + border + 1,
          y: yL * Math.cos(theta),
          z: hingeZ - yL * Math.sin(theta)
        };
        const scrRight = {
          x: w - border - 1,
          y: yL * Math.cos(theta),
          z: hingeZ - yL * Math.sin(theta)
        };

        const pl = project(scrLeft.x, scrLeft.y, scrLeft.z, rx, ry);
        const pr = project(scrRight.x, scrRight.y, scrRight.z, rx, ry);

        if (pl.visible && pr.visible) {
          // Micro-flickering terminal sweep scan-lines inside LCD panel
          ctx.beginPath();
          ctx.moveTo(pl.x, pl.y);
          ctx.lineTo(pr.x, pr.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.07 + Math.sin(timeOffset + r) * 0.04})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Render glowing data cells on screen matrix (like lines of code running on screen)
        for (let c = 0; c < colsScan; c++) {
          const cp = (c + 1) / (colsScan + 2);
          const xL = -w + border + cp * (w * 2 - border * 2);

          // Point in 3D representing code character placement
          const charPt = {
            x: xL,
            y: yL * Math.cos(theta),
            z: hingeZ - yL * Math.sin(theta)
          };

          const pChar = project(charPt.x, charPt.y, charPt.z, rx, ry);
          if (pChar.visible) {
            // Generate some matrix noise
            const indexHash = (r * 13 + c * 7 + Math.floor(timeOffset * 0.45)) % 40;
            if (indexHash < 12) {
              ctx.fillStyle = `rgba(16, 185, 129, ${0.45 + Math.sin(timeOffset + c + r) * 0.35})`;
              ctx.font = `bold ${Math.max(4, 5.5 * pChar.scale)}px monospace`;
              
              const codeChar = indexHash % 2 === 0 ? "1" : "0";
              ctx.fillText(codeChar, pChar.x, pChar.y);
            } else if (indexHash < 15) {
              // Tiny horizontal lines mimicking terminal code characters
              ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
              ctx.fillRect(pChar.x, pChar.y, pChar.scale * 3.5, pChar.scale * 0.8);
            }
          }
        }
      }

      // 3D FLOATING GLOWING GLYPH/TEXT STREAM IN FRONT OF DISPLAY (like holograms coming out of laptop)
      const holoHeightIdx = 32 + Math.sin(time * 3) * 3;
      const holoPtLeft = { x: -w * 0.8, y: holoHeightIdx * Math.cos(theta) + 4, z: hingeZ - holoHeightIdx * Math.sin(theta) + 12 };
      const pHolo = project(holoPtLeft.x, holoPtLeft.y, holoPtLeft.z, rx, ry);
      if (pHolo.visible) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
        ctx.font = `650 ${Math.max(6, 7 * pHolo.scale)}px monospace`;
        ctx.fillText("/** HELLO WORLD */", pHolo.x, pHolo.y);
      }

      // DYNAMIC AMBIENT FLOATING STEAM PARTICLES
      particles.forEach((p) => {
        // Increment height
        p.y += p.speedY;
        p.life++;

        // Project coordinate 
        const pLoc = project(p.x, p.y, p.z, rx, ry);
        if (pLoc.visible) {
          const depthAlpha = Math.max(0, 1 - p.y / 50);
          const pulseAlpha = Math.sin(timeOffset * 0.8 + p.x) * 0.3 + 0.6;
          ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity * depthAlpha * pulseAlpha})`;
          ctx.font = `${Math.max(4, 6 * pLoc.scale)}px monospace`;
          ctx.fillText(p.char, pLoc.x, pLoc.y);
        }

        // Handle recycling
        if (p.life > p.maxLife || p.y > 60) {
          p.x = (Math.random() - 0.5) * 60;
          p.y = 0;
          p.z = (Math.random() - 0.5) * 45;
          p.life = 0;
          p.maxLife = 60 + Math.random() * 120;
          p.opacity = Math.random();
        }
      });

      // Loop
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBackground]);

  if (isBackground) {
    return (
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent overflow-hidden" 
        id="ascii-bg-container"
      >
        <canvas 
          ref={canvasRef} 
          className="pointer-events-none select-none opacity-[0.25] dark:opacity-[0.35] w-full h-full block" 
        />
      </div>
    );
  }

  return (
    <div 
      className="w-full bg-[#09090B] border border-neutral-900 rounded-lg overflow-hidden flex flex-col items-center select-none shadow-2xl relative"
      id="ascii-frame-container"
    >
      {/* HUD aesthetic header frame */}
      <div className="w-full bg-neutral-950/70 py-2.5 px-4 border-b border-neutral-900 flex justify-between items-center text-neutral-500 font-mono text-[10px] tracking-wider z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-ping" />
          <span className="text-neutral-400 font-bold">TERMINAL_MACBOOK_3D.EXE</span>
        </div>
        <div className="flex items-center gap-3">
          <span>COORDINATES: ROTATING</span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline">GLOW MODE: MONOCHROME</span>
        </div>
      </div>

      {/* Main visual splitter grid */}
      <div ref={containerRef} className="w-full grid grid-cols-1 md:grid-cols-12 gap-0 relative">
        
        {/* Left Interactive 3D Canvas wrapper (7/12 grid span) */}
        <div className="md:col-span-8 relative min-h-[320px] md:min-h-[400px] flex items-center justify-center">
          <canvas 
            ref={canvasRef} 
            className="block cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-shadow duration-300" 
          />
          <div className="absolute bottom-3 left-4 font-mono text-[9px] text-neutral-500 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">&#8646;</span> HOVER MOUSE TO ROTATE ENGINE
          </div>
        </div>

        {/* Right side HUD digital terminal stream feed (4/12 grid span) */}
        <div className="md:col-span-4 bg-neutral-950/40 border-l border-neutral-900 p-4 md:p-6 flex flex-col justify-between font-mono text-[11px] text-neutral-400 space-y-4 relative leading-relaxed">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <span className="text-emerald-500 font-bold font-mono text-xs">DIAGNOSTICS</span>
              <span className="text-neutral-600 text-[9px] uppercase">Telemetry</span>
            </div>

            {/* Custom interactive statistics block */}
            <div className="space-y-1.5 font-mono text-neutral-400">
              <div className="flex justify-between">
                <span className="text-neutral-500">ENGINEER:</span>
                <span className="text-neutral-200 font-semibold uppercase">ABED.ISHIMWE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">PROJECTS COUNT:</span>
                <span className="text-emerald-500 font-bold">4 PRIMARY MODULES</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ACADEMICS SEM:</span>
                <span className="text-neutral-200 uppercase">USIU HONORS SE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">SYS CORE STATUS:</span>
                <span className="text-emerald-500 font-bold uppercase animate-pulse">OPTIMIZED</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-neutral-500 block text-[9px] uppercase tracking-wider">LIVE ACTIVITY STREAMS</span>
            <div className="bg-[#0e0e11] border border-neutral-900 rounded-xs p-3 space-y-2 h-[120px] overflow-hidden flex flex-col justify-end">
              {terminalLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-1.5 transition-all duration-300 text-[10px] ${
                    index === terminalLogs.length - 1 ? "text-emerald-500 animate-pulse font-semibold" : "text-neutral-500"
                  }`}
                >
                  <span className="text-neutral-600 font-black">&gt;</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-3 text-[9px] text-neutral-600 flex justify-between items-center bg-transparent">
            <span>SYS_BUILD_SHA: ABED-2026</span>
            <span>SECURE CHASSIS</span>
          </div>

        </div>

      </div>
    </div>
  );
}
