import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  char: string;
  type: "body" | "handle" | "saucer" | "steam";
  opacity: number;
  size: number;
}

export default function AsciiCupBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Responsive setup
    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight || 500;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Track mouse rotation influence
    const handleMouseMove = (e: MouseEvent) => {
      const rect = window.document.body.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.targetX = x / (rect.width / 2);
      mouseRef.current.targetY = y / (rect.height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Prepare 3D vertices representing the telemetry cup
    const points: Point3D[] = [];
    const chars = ["0", "1", "3", "5", "8", "9", "+", "{", "}", "[", "]", "/", "*", "#", "X", "Y", "A", "B", "E", "D"];

    // 1. Cup Body (Cylinder flaring out at top)
    const cupHeight = 30;
    const baseRadius = 13;
    const topRadius = 24;
    const cupRows = 16;
    const cupCols = 32;

    for (let r = 0; r <= cupRows; r++) {
      const t = r / cupRows; // 0 to 1 progress
      const currentRadius = baseRadius + (topRadius - baseRadius) * t;
      const yCoord = -cupHeight / 2 + t * cupHeight + 4; // Shifted up slightly

      for (let c = 0; c < cupCols; c++) {
        const theta = (c / cupCols) * Math.PI * 2;
        const x = currentRadius * Math.cos(theta);
        const z = currentRadius * Math.sin(theta);
        
        points.push({
          x,
          y: yCoord,
          z,
          char: chars[Math.floor(Math.random() * chars.length)],
          type: "body",
          opacity: 0.4 + 0.6 * Math.abs(Math.sin(theta)),
          size: 7 + Math.random() * 4
        });
      }
    }

    // 2. Saucer/Plate below cup
    const saucerInner = 14;
    const saucerOuter = 45;
    const saucerRows = 4;
    const saucerCols = 40;

    for (let r = 0; r < saucerRows; r++) {
      const t = r / (saucerRows - 1);
      const currentRadius = saucerInner + (saucerOuter - saucerInner) * t;
      // Curved plate slightly rising at outskirts
      const yCoord = -cupHeight / 2 + 1 - (1 - t * t) * 2;

      for (let c = 0; c < saucerCols; c++) {
        const theta = (c / saucerCols) * Math.PI * 2;
        const x = currentRadius * Math.cos(theta);
        const z = currentRadius * Math.sin(theta);

        points.push({
          x,
          y: yCoord,
          z,
          char: chars[Math.floor(Math.random() * chars.length)],
          type: "saucer",
          opacity: 0.25 + 0.35 * Math.abs(Math.sin(theta)),
          size: 6 + Math.random() * 3
        });
      }
    }

    // 3. Cup Handle (C-Curve attached to cup side)
    const handlePointsCount = 28;
    for (let i = 0; i < handlePointsCount; i++) {
      const t = i / (handlePointsCount - 1);
      // Let handle curve outwards along positive X
      const angle = -Math.PI / 2 + t * Math.PI; // -90 deg to +90 deg
      const handleRadiusY = 12;
      const handleRadiusX = 9;

      // Handle center coordinates offset from cup center
      const centerX = 18;
      const centerY = 4;

      const x = centerX + handleRadiusX * Math.cos(angle);
      const y = centerY + handleRadiusY * Math.sin(angle);
      const z = 0; // Curve aligned in YX plane

      // Give handles small offsets in Z to have volumetric width
      const handleSides = 3;
      for (let s = -1; s <= 1; s++) {
        points.push({
          x,
          y,
          z: z + s * 1.5,
          char: chars[Math.floor(Math.random() * chars.length)],
          type: "handle",
          opacity: 0.75,
          size: 7.5
        });
      }
    }

    // 4. Digital Steam Rising (moving particles)
    const numSteam = 18;
    const steamList: { x: number; y: number; z: number; speedY: number; scale: number; curX: number; seed: number; char: string }[] = [];
    
    for (let i = 0; i < numSteam; i++) {
      const r = Math.random() * (topRadius - 4);
      const theta = Math.random() * Math.PI * 2;
      steamList.push({
        x: r * Math.cos(theta),
        y: cupHeight / 2 + 3 + Math.random() * 8, // Just above cup rim
        z: r * Math.sin(theta),
        speedY: 0.12 + Math.random() * 0.18,
        scale: 0.5 + Math.random() * 0.5,
        curX: 0,
        seed: Math.random() * 100,
        char: ["+", "~", "s", "o", "u", "p", "a", "b", "e", "d"][Math.floor(Math.random() * 10)]
      });
    }

    let time = 0;

    // Rotation helper
    const project = (x: number, y: number, z: number, rx: number, ry: number, fScaleValue: number) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Projection with camera position
      const dCam = 280;
      const fovRect = 240;
      const scale = fovRect / (dCam + z2);

      // Center shifts (aligned perfectly centered to look like an beautiful ambient backdrop)
      const cx = width / 2;
      const cy = height / 2;

      return {
        x: cx + x1 * scale * fScaleValue,
        y: cy - y2 * scale * fScaleValue,
        visible: z2 > -dCam,
        depth: z2,
        scale
      };
    };

    // Render loop
    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse updates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      time += 0.0035; // Continuous rotation time

      const ry = time + mouseRef.current.x * 0.35;
      const rx = 0.38 + mouseRef.current.y * 0.2; // Angle tilted down

      // Floating translation up and down
      const floatOffset = Math.sin(time * 2.2) * 5;

      // Draw cup mesh elements with significantly larger scale (6.2)
      const renderedPoints = points.map((p) => {
        const proj = project(p.x, p.y + floatOffset, p.z, rx, ry, 6.2); 
        return { p, proj };
      }).filter((res) => res.proj.visible);

      // Sort back-to-front
      renderedPoints.sort((a, b) => b.proj.depth - a.proj.depth);

      // Render static cup points with enhanced glowing alpha multipliers
      renderedPoints.forEach(({ p, proj }) => {
        const normalizedDepth = (proj.depth + 100) / 200; 
        const depthOpacity = Math.max(0.15, Math.min(0.95, 1 - normalizedDepth));
        
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity * depthOpacity * 0.75})`; // Much brighter emerald glow
        ctx.font = `bold ${Math.max(6, p.size * proj.scale * 1.15)}px monospace`;
        ctx.fillText(p.char, proj.x, proj.y);
      });

      // Render & Animate digital telemetry Steam
      steamList.forEach((st) => {
        // Shift up
        st.y += st.speedY;
        // Sway sideways gently
        st.curX = Math.sin(time * 1.5 + st.seed) * 5;

        // Recalculate loop when floating high
        if (st.y > cupHeight / 2 + 35) {
          const r = Math.random() * (topRadius - 6);
          const theta = Math.random() * Math.PI * 2;
          st.x = r * Math.cos(theta);
          st.y = -cupHeight / 2 + 10; 
          st.z = r * Math.sin(theta);
        }

        const proj = project(st.x + st.curX, st.y + floatOffset, st.z, rx, ry, 6.2);
        if (proj.visible) {
          const decay = Math.max(0, 1 - (st.y - (-cupHeight / 2)) / 50);
          ctx.fillStyle = `rgba(16, 185, 129, ${0.65 * decay})`; // Brighter steam
          ctx.font = `italic ${Math.max(8, 14 * proj.scale)}px monospace`;
          ctx.fillText(st.char, proj.x, proj.y);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      id="ascii-cup-bg-frame"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-[0.55] dark:opacity-[0.75] transition-opacity duration-300" 
      />
    </div>
  );
}
