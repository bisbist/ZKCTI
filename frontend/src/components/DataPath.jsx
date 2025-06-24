import React, { useLayoutEffect, useState, useEffect, useRef } from "react";

export default function DataTunnel({ trigger, refA, refB }) {
    const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
    const [progress, setProgress] = useState(0);
    const [hideTunnel, setHideTunnel] = useState(false);
    const fadeTimeout = useRef();

    // Get tunnel coordinates between the two refs
    useLayoutEffect(() => {
        function updateCoords() {
            const src = refA.current?.getBoundingClientRect();
            const tgt = refB.current?.getBoundingClientRect();
            if (src && tgt) {
                setCoords({
                    x1: src.right,
                    y1: src.top + src.height / 2,
                    x2: tgt.left,
                    y2: tgt.top + tgt.height - 32,
                });
            }
        }
        updateCoords();
        window.addEventListener("resize", updateCoords);
        return () => window.removeEventListener("resize", updateCoords);
    }, [trigger, refA, refB]);

    // Animate progress from 0 to 1 in exactly 2 seconds
    useEffect(() => {
        let raf;
        if (trigger) {
            setProgress(0);
            setHideTunnel(false);
            let start = null;
            const DURATION = 2000;
            const animate = (ts) => {
                if (!start) start = ts;
                const elapsed = ts - start;
                const newProgress = Math.min(1, elapsed / DURATION);
                setProgress(newProgress);
                if (elapsed < DURATION) {
                    raf = requestAnimationFrame(animate);
                } else {
                    // Fade out the tunnel after arrival (truck at B)
                    fadeTimeout.current = setTimeout(() => {
                        setHideTunnel(true);
                    }, 500); // how long the tunnel remains after truck arrives
                }
            };
            raf = requestAnimationFrame(animate);
            return () => {
                raf && cancelAnimationFrame(raf);
                clearTimeout(fadeTimeout.current);
            };
        } else {
            setProgress(0);
            setHideTunnel(false);
            clearTimeout(fadeTimeout.current);
        }
    }, [trigger]);

    const { x1, y1, x2, y2 } = coords;
    const cx = x1 + (x2 - x1) / 2;
    const cy = Math.min(y1, y2) - 80; // Curve control point above panels

    // Quadratic Bezier math for truck position
    function getBezier(t) {
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
        return [bx, by];
    }

    // Truck always follows the path, even after tunnel fades
    const [tx, ty] = getBezier(progress);

    // Only render if active (trigger)
    if (!trigger) return null;

    return (
        <svg
            style={{
                position: "fixed",
                pointerEvents: "none",
                zIndex: 100,
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                overflow: "visible",
            }}
            width="100vw"
            height="100vh"
        >
            {/* Tunnel Glow Path */}
            <defs>
                <linearGradient id="tunnel-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6047F7" />
                    <stop offset="100%" stopColor="#41bc79" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="9" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {/* Tunnel path - fade out after progress=1 */}
            {!hideTunnel && (
                <path
                    d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
                    stroke="url(#tunnel-grad)"
                    strokeWidth={20}
                    fill="none"
                    opacity={progress < 1 ? 0.85 : 0} // fade out as progress ends
                    filter="url(#glow)"
                    style={{
                        transition: progress < 1 ? "none" : "opacity 0.5s cubic-bezier(.4,2,.7,1)",
                    }}
                />
            )}
            {/* Data Bits (circles traveling) - hide when progress >=1 */}
            {!hideTunnel &&
                Array.from({ length: 8 }).map((_, i) => {
                    const phase = ((progress + i * 0.09) % 1);
                    const [bx, by] = getBezier(phase);
                    return (
                        <circle
                            key={i}
                            cx={bx}
                            cy={by}
                            r={5 + 4 * Math.sin(Date.now() / 400 + i)}
                            fill="#ffd65b"
                            opacity={0.53}
                            style={{ filter: "blur(0.5px)" }}
                        />
                    );
                })}
            {/* Truck is always visible, at correct position */}
            <g
                style={{
                    transform: `translate(${tx - 28}px,${ty - 18}px)`,
                    transition: "none"
                }}
            >
                <MailTruckSVG />
            </g>
        </svg>
    );
}

// The truck itself
function MailTruckSVG() {
    return (
        <svg width={56} height={40} viewBox="0 0 56 40" fill="none">
            <rect x="2" y="14" width="32" height="15" rx="7" fill="#6047F7" />
            <rect x="34" y="17" width="15" height="11" rx="5" fill="#ffd65b" />
            <g>
                <rect x="39" y="21" width="7" height="6" rx="2" fill="#fff" />
                <polyline points="39,21 42.5,25 46,21" stroke="#f6b73c" strokeWidth="1.2" fill="none" />
            </g>
            <circle cx="12" cy="32" r="5" fill="#222" />
            <circle cx="42" cy="32" r="5" fill="#222" />
            <ellipse cx="50.5" cy="27" rx="2.1" ry="1.4" fill="#fffcda" opacity="0.73" />
        </svg>
    );
}
