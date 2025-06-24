import React, { useEffect, useState } from "react";

function MetaMaskFox({ size = 60, animate = true }) {
    return (
        <svg width={size} height={size} viewBox="0 0 108 108" fill="none">
            <defs>
                <linearGradient id="a" x1="0" y1="0" x2="108" y2="108" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f6851b" />
                    <stop offset="1" stopColor="#e2761b" />
                </linearGradient>
            </defs>
            <polygon points="54,12 90,48 54,36 18,48" fill="url(#a)" />
            <ellipse cx="54" cy="56" rx="22" ry="18" fill="#fff3de" />
            <ellipse cx="44" cy="58" rx="3.8" ry="4.1" fill="#222" />
            <ellipse cx="64" cy="58" rx="3.8" ry="4.1" fill="#222" />
            <ellipse cx="54" cy="67" rx="2.1" ry="2.6" fill="#444" />
            <g>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 100 100"
                    to="20 100 100"
                    dur={animate ? "0.7s" : "0s"}
                    repeatCount="indefinite"
                    direction="alternate"
                />
                <ellipse cx="97" cy="105" rx="9" ry="3.2" fill="#f6851b" opacity="0.8" />
            </g>
        </svg>
    );
}

function isSafari() {
    const ua = window.navigator.userAgent;
    return /Safari/.test(ua) && !/Chrome|Chromium|Android/i.test(ua);
}

// SVG Copy Icon
const CopyIcon = ({ copied }) => (
    <svg
        width="19" height="19" viewBox="0 0 20 20"
        style={{
            marginLeft: 7, verticalAlign: "middle", cursor: "pointer",
            opacity: copied ? 0.4 : 1, transition: "opacity 0.17s"
        }}
        fill={copied ? "#52c41a" : "#555"}
    >
        <rect x="4" y="4" width="12" height="12" rx="2" stroke="#555" strokeWidth="1.5" fill="none" />
        <rect x="7" y="7" width="9" height="9" rx="1.7" fill={copied ? "#a6e7b2" : "#eee"} stroke="none" />
        {copied && (
            <polyline points="8,13 11,15 15,10"
                fill="none"
                stroke="#52c41a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )}
    </svg>
);

// Cute SVG icons for browser logos
const BrowserIcons = {
    Chrome: (
        <svg width="36" height="36" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff" /><circle cx="24" cy="24" r="20" fill="#4285F4" /><path d="M24,24L43.4,13.9A20,20 0 0,1 24,44A20,20 0 0,1 4,24A19.9,19.9 0 0,1 24,4l0,20z" fill="#34A853" /><path d="M24,24L24,4A20,20 0 0,1 43.4,13.9z" fill="#FBBC05" /><path d="M24,24L4,24A20,20 0 0,1 24,4z" fill="#EA4335" /></svg>
    ),
    Brave: (
        <svg width="36" height="36" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#fff" /><g><circle cx="30" cy="30" r="27" fill="#ff6f00" /><text x="13" y="41" fontSize="30" fontWeight="bold" fill="#fff">🦁</text></g></svg>
    ),
    Edge: (
        <svg width="36" height="36" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#fff" /><g><circle cx="30" cy="30" r="27" fill="#0078d7" /><text x="15" y="41" fontSize="32" fontWeight="bold" fill="#fff">e</text></g></svg>
    ),
    Firefox: (
        <svg width="36" height="36" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#fff" /><g><circle cx="30" cy="30" r="27" fill="#ff7139" /><text x="14" y="40" fontSize="32" fontWeight="bold" fill="#fff">🦊</text></g></svg>
    ),
};


export default function MetaMaskWallet({ onConnect, onDisconnect }) {
    const [showPopup, setShowPopup] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [address, setAddress] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!window.ethereum || isSafari()) setShowPopup(true);
    }, []);

    useEffect(() => {
        if (!showPopup) return;
        const close = () => setShowPopup(false);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, [showPopup]);

    useEffect(() => {
        if (!window.ethereum || isSafari()) setShowPopup(true);
        else {
            // Listen for account/network changes
            window.ethereum.on('accountsChanged', accounts => {
                if (accounts.length) {
                    setWalletConnected(true);
                    setAddress(accounts[0]);
                    if (onConnect) onConnect(accounts[0], networkName);
                } else {
                    setWalletConnected(false);
                    setAddress(null);
                    if (onDisconnect) onDisconnect();
                }
            });
            window.ethereum.on('chainChanged', chainId => {
                fetchNetworkName(chainId).then(network => {
                    setNetworkName(network);
                    if (onConnect && walletConnected) onConnect(address, network);
                });
            });
        }
        // Clean up event listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    // Add state for network name
    const [networkName, setNetworkName] = useState("unknown");

    const fetchNetworkName = async (chainId) => {
        const mapping = {
            "0x1": "Ethereum Mainnet",
            "0x5": "Goerli",
            "0xaa36a7": "Sepolia",
            "0x89": "Polygon",
            "0x13881": "Polygon Mumbai"
        };
        return mapping[chainId] || chainId;
    };

    // On connect
    const connectWallet = async (e) => {
        e.stopPropagation();
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setWalletConnected(true);
                setAddress(accounts[0]);
                // Fetch and set network
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                const name = await fetchNetworkName(chainId);
                setNetworkName(name);
                if (onConnect) onConnect(accounts[0], name);
                setShowPopup(false);
            } catch { }
        }
    };

    // const connectWallet = async (e) => {
    //     e.stopPropagation();
    //     if (window.ethereum) {
    //         try {
    //             const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    //             setWalletConnected(true);
    //             setAddress(accounts[0]);
    //             setShowPopup(false);
    //         } catch { }
    //     }
    // };

    // Copy address to clipboard
    const handleCopy = (e) => {
        e.stopPropagation();
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    return (
        <>
            <div style={{ position: "relative", zIndex: 30 }}>
                {walletConnected ? (
                    <span className="wallet-status" style={{
                        display: "inline-flex", alignItems: "center",
                        background: "rgba(252,176,64,0.10)",
                        borderRadius: "9px", padding: "5px 15px 5px 7px",
                        fontSize: "1rem", fontWeight: 500
                    }}>
                        <MetaMaskFox size={28} animate={false} />
                        <span
                            style={{
                                marginLeft: 8,
                                fontFamily: "monospace",
                                fontWeight: 600,
                                color: "#111",         // Black color
                                background: "#fff",
                                padding: "2px 7px",
                                borderRadius: 6,
                                letterSpacing: "0.01em",
                                userSelect: "all"
                            }}
                        >
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </span>
                        <span
                            title={copied ? "Copied!" : "Copy address"}
                            style={{ position: "relative" }}
                            onClick={handleCopy}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === "Enter") handleCopy(e); }}
                            role="button"
                        >
                            <CopyIcon copied={copied} />
                            {copied &&
                                <span style={{
                                    position: "absolute", left: "110%", top: "10%",
                                    background: "#222", color: "#fff", borderRadius: 6,
                                    padding: "2px 8px", fontSize: "0.93rem", opacity: 0.95,
                                    pointerEvents: "none", transition: "opacity 0.17s"
                                }}>Copied!</span>}
                        </span>
                    </span>
                ) : (
                    <button
                        onClick={connectWallet}
                        className="connect-wallet-btn"
                        style={{
                            background: "linear-gradient(90deg, #f6851b, #f6b73c 70%)",
                            color: "#fff", borderRadius: "9px", border: "none",
                            padding: "0.65rem 1.5rem", fontWeight: "bold",
                            boxShadow: "0 2px 12px rgba(245, 133, 27, 0.10)",
                            fontSize: "1.07rem", cursor: "pointer",
                            letterSpacing: "0.04em"
                        }}
                    >
                        <MetaMaskFox size={24} animate={false} />{" "}
                        <span style={{ marginLeft: 8 }}>Connect MetaMask</span>
                    </button>
                )}
            </div>
            {
                showPopup && (
                    <>
                        {/* Blurry glass overlay */}
                        <div
                            style={{
                                position: "fixed",
                                top: 0, left: 0, width: "100vw", height: "100vh",
                                backdropFilter: "blur(7px)",
                                background: "rgba(36,37,53,0.19)",
                                zIndex: 20, transition: "all 0.35s"
                            }}
                        />
                        {/* Animated popup */}
                        <div
                            style={{
                                position: "fixed", top: "50%", left: "50%",
                                transform: "translate(-50%,-50%) scale(1)",
                                background: "rgba(255,255,255,0.97)",
                                borderRadius: "23px",
                                boxShadow: "0 8px 44px rgba(66,54,65,0.16)",
                                padding: "2.3rem 2.7rem",
                                zIndex: 30,
                                minWidth: 370, textAlign: "center",
                                animation: "popzoom 0.6s cubic-bezier(.24,1.2,.6,1) forwards"
                            }}
                        >
                            <style>
                                {`
              @keyframes popzoom {
                0% { transform: translate(-50%,-50%) scale(0.7); opacity:0; }
                100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
              }
              @keyframes waggle { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(15deg); } }
              `}
                            </style>
                            <div style={{
                                fontSize: "3.3rem", marginBottom: "0.2rem", animation: "waggle 1.4s infinite alternate"
                            }}>
                                <MetaMaskFox size={50} animate={false} />
                            </div>
                            <h3 style={{ fontWeight: 700, marginBottom: "0.55rem", fontSize: "1.22rem" }}>
                                MetaMask Not Detected
                            </h3>
                            <p style={{ marginBottom: "0.7rem", color: "#5d5672" }}>
                                Please use a supported browser:
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: "0.7rem", marginBottom: "1.13rem" }}>
                                {Object.entries(BrowserIcons).map(([k, icon]) => (
                                    <span key={k} style={{ textAlign: "center" }}>
                                        {icon}
                                        <div style={{
                                            fontSize: "0.89rem", color: "#333", marginTop: "-4px", fontWeight: 500
                                        }}>{k}</div>
                                    </span>
                                ))}
                            </div>
                            <div style={{
                                background: "rgba(255,180,180,0.15)",
                                padding: "0.5rem 0.8rem",
                                borderRadius: "12px",
                                fontSize: "1.02rem",
                                color: "#e75555",
                                marginBottom: "0.4rem"
                            }}>
                                Safari does <b>not</b> support MetaMask.<br />
                                Please use Chrome, Brave, Edge, or Firefox.
                            </div>
                            <div style={{ marginTop: "1.2rem", color: "#8a8c92", fontSize: "0.98rem" }}>
                                (Click anywhere to dismiss)
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}
