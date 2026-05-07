import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .lp * { box-sizing: border-box; margin: 0; padding: 0; }
  .lp { background: #fff; color: #0D0D1A; font-family: "Inter", system-ui, sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; min-height: 100vh; }
  .lp a { color: inherit; text-decoration: none; }
  .lp ::selection { background: rgba(0,184,148,0.15); color: #00976E; }

  .lp nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 16px 40px; display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.88); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(13,13,26,0.08);
  }
  .lp .logo { display: flex; align-items: center; gap: 10px; font-family: "Syne", sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #0D0D1A; cursor: pointer; }
  .lp .logo-icon { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg,#00B894,#6C3CE1); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,184,148,0.3); flex-shrink: 0; }
  .lp .logo-icon svg { width: 17px; height: 17px; }
  .lp .nav-links { display: flex; gap: 32px; font-size: 14px; font-weight: 500; color: #444460; }
  .lp .nav-links a:hover { color: #0D0D1A; }
  .lp .nav-cta { padding: 10px 22px; background: #0D0D1A; color: #fff; border-radius: 100px; font-size: 13px; font-weight: 600; transition: all 0.2s; cursor: pointer; border: none; }
  .lp .nav-cta:hover { background: #6C3CE1; transform: translateY(-1px); }
  @media (max-width: 768px) { .lp nav { padding: 14px 20px; } .lp .nav-links { display: none; } }

  .lp .hero { padding: 160px 40px 120px; max-width: 1400px; margin: 0 auto; position: relative; }
  .lp .hero-bg-num { position: absolute; right: -20px; top: 80px; font-family: "Syne",sans-serif; font-size: clamp(200px,25vw,380px); font-weight: 800; color: transparent; -webkit-text-stroke: 1.5px rgba(13,13,26,0.05); pointer-events: none; user-select: none; line-height: 1; }
  .lp .hero-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; background: rgba(0,184,148,0.08); border: 1px solid rgba(0,184,148,0.2); font-family: "JetBrains Mono",monospace; font-size: 11px; color: #00976E; letter-spacing: 0.05em; margin-bottom: 32px; }
  .lp .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: #00B894; animation: lp-blink 2s ease infinite; flex-shrink: 0; }
  @keyframes lp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .lp h1 { font-family: "Syne",sans-serif; font-size: clamp(52px,9vw,120px); font-weight: 800; line-height: 0.92; letter-spacing: -0.05em; margin-bottom: 40px; max-width: 1100px; }
  .lp .h1-muted { color: #9090AA; }
  .lp .h1-accent { display: inline-block; position: relative; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp .h1-accent::after { content: ""; position: absolute; left: 0; right: 0; bottom: -8px; height: 5px; border-radius: 3px; background: linear-gradient(135deg,#00B894,#6C3CE1); }
  .lp .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center; margin-top: 48px; }
  @media (max-width: 900px) { .lp .hero-grid { grid-template-columns: 1fr; gap: 48px; } }
  .lp .hero-lede { font-size: 18px; line-height: 1.65; color: #444460; max-width: 500px; margin-bottom: 36px; }
  .lp .hero-lede strong { color: #0D0D1A; font-weight: 600; }
  .lp .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
  .lp .btn-main { padding: 16px 28px; background: #0D0D1A; color: #fff; border-radius: 14px; font-weight: 700; font-size: 15px; display: inline-flex; align-items: center; gap: 10px; transition: all 0.2s; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(13,13,26,0.2); font-family: "Inter",sans-serif; }
  .lp .btn-main:hover { background: #6C3CE1; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(108,60,225,0.3); }
  .lp .btn-sec { padding: 16px 24px; background: #F7F7FA; border: 1.5px solid rgba(13,13,26,0.14); border-radius: 14px; font-size: 14px; font-weight: 500; color: #444460; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; cursor: pointer; font-family: "Inter",sans-serif; }
  .lp .btn-sec:hover { background: #EEEEF5; color: #0D0D1A; }
  .lp .hero-trust { display: flex; gap: 10px; flex-wrap: wrap; }
  .lp .trust-pill { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9090AA; background: #F7F7FA; border: 1px solid rgba(13,13,26,0.08); border-radius: 100px; padding: 5px 12px; }
  .lp .trust-ok { color: #00B894; font-weight: 700; }

  .lp .pulse-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.14); border-radius: 22px; padding: 24px; box-shadow: 0 12px 48px rgba(13,13,26,0.12); position: relative; overflow: hidden; }
  .lp .pulse-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(135deg,#00B894,#6C3CE1); }
  .lp .pulse-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .lp .pulse-title { font-family: "JetBrains Mono",monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #9090AA; }
  .lp .live { display: flex; align-items: center; gap: 5px; font-family: "JetBrains Mono",monospace; font-size: 10px; color: #00B894; }
  .lp .live-dot { width: 5px; height: 5px; border-radius: 50%; background: #00B894; animation: lp-blink 1.5s ease infinite; }
  .lp .price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid rgba(13,13,26,0.08); }
  .lp .price-row:first-of-type { border-top: none; }
  .lp .price-name { font-size: 13px; font-weight: 500; }
  .lp .price-badge { font-family: "JetBrains Mono",monospace; font-size: 9px; padding: 2px 6px; border-radius: 5px; margin-left: 5px; background: rgba(0,184,148,0.1); color: #00976E; }
  .lp .price-val { font-family: "JetBrains Mono",monospace; font-size: 14px; font-weight: 600; }
  .lp .pv-best { color: #00976E; }
  .lp .pv-bad { color: #E53E3E; }
  .lp .price-delta { font-family: "JetBrains Mono",monospace; font-size: 10px; color: #9090AA; margin-left: 5px; }

  .lp .marquee-wrap { padding: 28px 0; background: #0D0D1A; overflow: hidden; }
  .lp .marquee-track { display: flex; gap: 48px; animation: lp-marquee 22s linear infinite; width: max-content; }
  @keyframes lp-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .lp .marquee-item { font-family: "JetBrains Mono",monospace; font-size: 12px; color: rgba(255,255,255,0.4); white-space: nowrap; display: flex; align-items: center; gap: 8px; }
  .lp .marquee-val { color: #00D4AA; font-weight: 600; }

  .lp .stats-section { padding: 100px 40px; background: #F7F7FA; border-top: 1px solid rgba(13,13,26,0.08); border-bottom: 1px solid rgba(13,13,26,0.08); }
  .lp .stats-inner { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); }
  @media (max-width: 768px) { .lp .stats-inner { grid-template-columns: repeat(2,1fr); } .lp .stats-section { padding: 60px 20px; } }
  .lp .stat-box { padding: 0 40px; border-right: 1px solid rgba(13,13,26,0.08); }
  .lp .stat-box:last-child { border-right: none; }
  @media (max-width: 768px) { .lp .stat-box { padding: 24px 20px; border-right: none; border-bottom: 1px solid rgba(13,13,26,0.08); } }
  .lp .stat-num { font-family: "Syne",sans-serif; font-size: clamp(44px,6vw,72px); font-weight: 800; letter-spacing: -0.04em; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp .stat-label { font-size: 13px; color: #9090AA; margin-top: 8px; max-width: 160px; line-height: 1.4; }

  .lp .market-section { padding: 140px 40px; max-width: 1400px; margin: 0 auto; }
  @media (max-width: 768px) { .lp .market-section { padding: 80px 20px; } }
  .lp .eyebrow { font-family: "JetBrains Mono",monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #00976E; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
  .lp .eyebrow::before { content: ""; width: 24px; height: 2px; background: #00B894; border-radius: 1px; }
  .lp .section-h2 { font-family: "Syne",sans-serif; font-weight: 800; font-size: clamp(36px,5vw,64px); letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px; }
  .lp .section-h2 .grad { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp .section-lede { font-size: 17px; color: #444460; max-width: 540px; line-height: 1.65; margin-bottom: 56px; }
  .lp .market-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: start; }
  @media (max-width: 900px) { .lp .market-grid { grid-template-columns: 1fr; } }
  .lp .chart-card { background: #F7F7FA; border: 1.5px solid rgba(13,13,26,0.14); border-radius: 22px; padding: 32px; box-shadow: 0 4px 24px rgba(13,13,26,0.08); }
  .lp .chart-title { font-family: "Syne",sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .lp .chart-sub { font-size: 12px; color: #9090AA; margin-bottom: 28px; }
  .lp .bars { display: flex; flex-direction: column; gap: 10px; }
  .lp .bar-row { display: grid; grid-template-columns: 110px 1fr 72px; gap: 10px; align-items: center; }
  .lp .bar-lbl { font-size: 12px; font-weight: 500; color: #444460; text-align: right; }
  .lp .bar-track { height: 32px; background: #EEEEF5; border-radius: 8px; overflow: hidden; }
  .lp .bar-fill { height: 100%; border-radius: 8px; display: flex; align-items: center; padding-left: 12px; font-family: "JetBrains Mono",monospace; font-size: 11px; font-weight: 600; }
  .lp .bar-save { font-family: "JetBrains Mono",monospace; font-size: 11px; text-align: right; }
  .lp .source-note { font-family: "JetBrains Mono",monospace; font-size: 10px; color: #9090AA; margin-top: 16px; letter-spacing: 0.04em; }

  .lp .market-list { display: flex; flex-direction: column; gap: 6px; }
  .lp .market-row { display: grid; grid-template-columns: 24px 1fr auto; gap: 12px; align-items: center; background: #fff; border: 1.5px solid rgba(13,13,26,0.08); border-radius: 14px; padding: 14px 16px; transition: all 0.2s; }
  .lp .market-row:hover { border-color: rgba(13,13,26,0.14); box-shadow: 0 4px 24px rgba(13,13,26,0.08); transform: translateX(4px); }
  .lp .mrank { font-family: "JetBrains Mono",monospace; font-size: 11px; color: #9090AA; }
  .lp .mrank.top { color: #00976E; font-weight: 600; }
  .lp .mname { font-size: 13px; font-weight: 600; color: #0D0D1A; }
  .lp .mbadge { font-family: "JetBrains Mono",monospace; font-size: 9px; padding: 2px 6px; border-radius: 5px; margin-top: 3px; display: inline-block; }
  .lp .mright { text-align: right; }
  .lp .mprice { font-family: "JetBrains Mono",monospace; font-size: 14px; font-weight: 700; }
  .lp .msave { font-family: "JetBrains Mono",monospace; font-size: 10px; color: #00976E; }

  .lp .how-section { padding: 140px 40px; border-top: 1px solid rgba(13,13,26,0.08); background: #F7F7FA; }
  @media (max-width: 768px) { .lp .how-section { padding: 80px 20px; } }
  .lp .how-inner { max-width: 1400px; margin: 0 auto; }
  .lp .how-grid { margin-top: 60px; display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  @media (max-width: 900px) { .lp .how-grid { grid-template-columns: 1fr; } }
  .lp .how-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.08); border-radius: 22px; padding: 36px; transition: all 0.25s; position: relative; overflow: hidden; }
  .lp .how-card:hover { border-color: rgba(13,13,26,0.14); box-shadow: 0 12px 48px rgba(13,13,26,0.12); transform: translateY(-4px); }
  .lp .how-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(135deg,#00B894,#6C3CE1); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .lp .how-card:hover::before { transform: scaleX(1); }
  .lp .how-num { font-family: "Syne",sans-serif; font-size: 56px; font-weight: 800; letter-spacing: -0.04em; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.3; line-height: 1; margin-bottom: 16px; }
  .lp .how-icon { font-size: 28px; margin-bottom: 16px; }
  .lp .how-title { font-family: "Syne",sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 10px; }
  .lp .how-desc { font-size: 14px; color: #444460; line-height: 1.7; }

  .lp .calc-section { padding: 140px 40px; max-width: 1400px; margin: 0 auto; }
  @media (max-width: 768px) { .lp .calc-section { padding: 80px 20px; } }
  .lp .calc-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.14); border-radius: 24px; padding: 48px; box-shadow: 0 12px 48px rgba(13,13,26,0.12); max-width: 700px; margin: 0 auto; position: relative; overflow: hidden; }
  .lp .calc-card::after { content: ""; position: absolute; bottom: -60px; right: -60px; width: 280px; height: 280px; background: radial-gradient(circle,rgba(0,184,148,0.06),transparent 70%); }
  .lp .calc-label { display: flex; justify-content: space-between; align-items: baseline; font-family: "JetBrains Mono",monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9090AA; margin-bottom: 14px; }
  .lp .calc-label-val { font-family: "Syne",sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp input[type="range"] { width: 100%; height: 4px; background: #EEEEF5; border-radius: 4px; -webkit-appearance: none; cursor: pointer; outline: none; }
  .lp input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #00B894; border-radius: 50%; cursor: grab; box-shadow: 0 2px 8px rgba(0,184,148,0.4),0 0 0 5px rgba(0,184,148,0.1); }
  .lp .range-hint { display: flex; justify-content: space-between; font-family: "JetBrains Mono",monospace; font-size: 10px; color: #9090AA; margin-top: 6px; }
  .lp .results { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 36px; padding-top: 36px; border-top: 1px solid rgba(13,13,26,0.08); }
  @media (max-width: 580px) { .lp .results { grid-template-columns: 1fr; } }
  .lp .result-box { background: #F7F7FA; border: 1px solid rgba(13,13,26,0.08); border-radius: 14px; padding: 20px; }
  .lp .result-box.best { background: rgba(0,184,148,0.04); border-color: rgba(0,184,148,0.2); }
  .lp .result-lbl { font-family: "JetBrains Mono",monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9090AA; margin-bottom: 8px; }
  .lp .result-num { font-family: "Syne",sans-serif; font-size: 36px; font-weight: 800; letter-spacing: -0.03em; color: #0D0D1A; }
  .lp .result-num.grad { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp .result-sub { font-size: 12px; color: #9090AA; margin-top: 4px; }
  .lp .calc-cta { text-align: center; margin-top: 36px; position: relative; z-index: 1; }

  .lp .cta-section { padding: 80px 40px 120px; max-width: 1400px; margin: 0 auto; }
  @media (max-width: 768px) { .lp .cta-section { padding: 60px 20px 80px; } }
  .lp .cta-box { border-radius: 28px; overflow: hidden; position: relative; background: linear-gradient(135deg,#0A1A2E,#1A0A2E,#0A2A1A); padding: 100px 60px; text-align: center; border: 1px solid rgba(255,255,255,0.08); }
  @media (max-width: 768px) { .lp .cta-box { padding: 60px 28px; } }
  .lp .cta-glow-l { position: absolute; top: -40px; right: -40px; width: 400px; height: 400px; background: radial-gradient(circle,rgba(108,60,225,0.25),transparent 65%); }
  .lp .cta-glow-r { position: absolute; bottom: -40px; left: -20px; width: 360px; height: 360px; background: radial-gradient(circle,rgba(0,184,148,0.2),transparent 65%); }
  .lp .cta-inner { position: relative; z-index: 1; }
  .lp .cta-tag { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; font-family: "JetBrains Mono",monospace; font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 0.06em; margin-bottom: 28px; }
  .lp .cta-h2 { font-family: "Syne",sans-serif; font-weight: 800; font-size: clamp(36px,5vw,64px); letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 16px; color: #fff; }
  .lp .cta-h2 span { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp .cta-sub { font-size: 17px; color: rgba(255,255,255,0.55); max-width: 400px; margin: 0 auto 40px; }
  .lp .btn-white { padding: 16px 32px; background: #fff; color: #0D0D1A; border-radius: 14px; font-weight: 700; font-size: 15px; display: inline-flex; align-items: center; gap: 10px; transition: all 0.2s; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2); font-family: "Inter",sans-serif; }
  .lp .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .lp .cta-pills { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 28px; }
  .lp .cta-pill { font-family: "JetBrains Mono",monospace; font-size: 11px; color: rgba(255,255,255,0.45); padding: 5px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; }

  .lp footer { border-top: 1px solid rgba(13,13,26,0.08); padding: 60px 40px 40px; max-width: 1400px; margin: 0 auto; }
  @media (max-width: 768px) { .lp footer { padding: 48px 20px 32px; } }
  .lp .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
  @media (max-width: 768px) { .lp .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; } }
  .lp .footer-about { font-size: 13px; color: #9090AA; line-height: 1.6; margin-top: 14px; max-width: 280px; }
  .lp .footer-col h4 { font-family: "JetBrains Mono",monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #9090AA; margin-bottom: 14px; }
  .lp .footer-col a { display: block; font-size: 13px; color: #9090AA; padding: 5px 0; transition: color 0.15s; }
  .lp .footer-col a:hover { color: #00976E; }
  .lp .footer-bottom { display: flex; justify-content: space-between; padding-top: 28px; border-top: 1px solid rgba(13,13,26,0.08); font-family: "JetBrains Mono",monospace; font-size: 10px; color: #9090AA; letter-spacing: 0.05em; }
  @media (max-width: 768px) { .lp .footer-bottom { flex-direction: column; gap: 12px; } }

  @keyframes lp-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .lp .reveal { animation: lp-fadeUp 0.8s ease both; }
  .lp .d1{animation-delay:.1s} .lp .d2{animation-delay:.2s}
  .lp .scroll-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.75s ease,transform 0.75s ease; }
  .lp .scroll-reveal.in { opacity:1; transform:translateY(0); }
  .lp .delay-1{transition-delay:.1s} .lp .delay-2{transition-delay:.2s}
`;

const MARQUEE_ITEMS = [
  ["Endesa Digital","0,1292"], ["EDP Digital","0,1337"], ["G9 Energy","0,1348"],
  ["Goldenergy","0,1399"], ["Plenitude","0,1418"], ["Iberdrola","0,1465"],
  ["Galp Plus","0,1538"], ["SU Eletricidade","0,1603"],
];

export default function Landing() {
  const navigate = useNavigate();
  const [kwh, setKwh] = useState(300);

  const PA = 0.1603, PB = 0.1292;
  const curM = Math.round(kwh * PA);
  const curA = Math.round(kwh * PA * 12);
  const bestM = Math.round(kwh * PB);
  const save = Math.round((kwh * PA - kwh * PB) * 12);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "landing-css";
    style.textContent = CSS;
    document.head.appendChild(style);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".scroll-reveal").forEach(el => obs.observe(el));

    return () => {
      document.getElementById("landing-css")?.remove();
      obs.disconnect();
    };
  }, []);

  const goApp = () => navigate("/app");

  const MarqueeItems = () => [...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
    <>
      <div key={i} className="marquee-item">{item[0]} <span className="marquee-val">{item[1]}€/kWh</span></div>
      <div className="marquee-item" style={{color:"rgba(255,255,255,0.15)"}}>·</div>
    </>
  ));

  return (
    <div className="lp">
      {/* NAV */}
      <nav>
        <div className="logo" onClick={() => window.scrollTo(0,0)}>
          <div className="logo-icon">
            <svg viewBox="0 0 17 17" fill="none"><path d="M10 2L5 9.5h5l-2 5.5L15 7.5H10L12 2z" fill="#fff" strokeLinejoin="round"/></svg>
          </div>
          EnergyAdvisor
        </div>
        <div className="nav-links">
          <a href="#mercado">Mercado</a>
          <a href="#como">Como funciona</a>
          <a href="#calc">Simulador</a>
        </div>
        <button className="nav-cta" onClick={goApp}>Analisar fatura →</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-num">240€</div>
        <div className="reveal">
          <div className="hero-chip"><span className="chip-dot"></span> Dados atualizados · Abril 2026</div>
          <h1>
            Estás a pagar<br/>
            <span className="h1-muted">demasiado</span><br/>
            <span className="h1-accent">pela energia.</span>
          </h1>
        </div>
        <div className="hero-grid">
          <div className="reveal d1">
            <p className="hero-lede">Em Portugal, <strong>67% das famílias</strong> nunca mudaram de fornecedor. A diferença entre o mais caro e o mais barato chega a <strong>240€/ano</strong>. Carrega a tua fatura — a IA encontra a melhor opção em 8 segundos.</p>
            <div className="hero-actions">
              <button className="btn-main" onClick={goApp}>Analisar a minha fatura →</button>
              <a href="#mercado" className="btn-sec">Ver mercado</a>
            </div>
            <div className="hero-trust">
              <div className="trust-pill"><span className="trust-ok">✓</span>Gratuito</div>
              <div className="trust-pill"><span className="trust-ok">✓</span>Sem registo</div>
              <div className="trust-pill"><span className="trust-ok">✓</span>RGPD</div>
              <div className="trust-pill"><span className="trust-ok">✓</span>8 segundos</div>
            </div>
          </div>
          <div className="reveal d2">
            <div className="pulse-card">
              <div className="pulse-hdr">
                <span className="pulse-title">Mercado · Abril 2026</span>
                <span className="live"><span className="live-dot"></span>€/kWh</span>
              </div>
              {[["Endesa Digital","0,1292","best","100% REN.",true],["EDP Digital","0,1337","best","100% REN.",true],["G9 Energy","0,1348","","",false],["Goldenergy","0,1399","","",false],["Iberdrola","0,1465","","",false],["SU Eletricidade","0,1603","bad","",false]].map(([name,price,cls,badge],i) => (
                <div key={i} className="price-row">
                  <div><span className="price-name">{name}</span>{badge && <span className="price-badge">{badge}</span>}</div>
                  <div><span className={`price-val ${cls==="best"?"pv-best":cls==="bad"?"pv-bad":""}`}>{price}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <MarqueeItems/>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-section">
        <div className="stats-inner">
          {[["30+","Fornecedores analisados em tempo real"],["240€","Poupança média anual — família com 4 pessoas"],["8s","Tempo médio de análise da fatura por IA"],["0","Dados pessoais guardados — RGPD total"]].map(([num,label],i) => (
            <div key={i} className="stat-box scroll-reveal"><div className="stat-num">{num}</div><div className="stat-label">{label}</div></div>
          ))}
        </div>
      </div>

      {/* MARKET */}
      <section className="market-section" id="mercado">
        <div className="scroll-reveal">
          <div className="eyebrow">Mercado liberalizado · Abril 2026</div>
          <h2 className="section-h2">Preços dos <span className="grad">fornecedores.</span></h2>
          <p className="section-lede">Para família tipo (417 kWh/mês, 6,9 kVA). Preços sem IVA com débito direto. Diferença máxima de 24%.</p>
        </div>
        <div className="market-grid">
          <div className="chart-card scroll-reveal">
            <div className="chart-title">Comparativo €/kWh</div>
            <div className="chart-sub">Ordenado do mais barato ao mais caro</div>
            <div className="bars">
              {[["Endesa","76%","linear-gradient(90deg,#00B894,#00976E)","#fff","0,1292€","#00976E","−240€/ano"],["EDP Digital","79%","linear-gradient(90deg,#00A882,#008B6A)","#fff","0,1337€","#00976E","−203€/ano"],["G9 Energy","80%","linear-gradient(90deg,#52C69B,#3DAE82)","#fff","0,1348€","#00976E","−194€/ano"],["Goldenergy","83%","#EEEEF5","#9090AA","0,1399€","#9090AA","−151€/ano"],["Iberdrola","87%","#EEEEF5","#9090AA","0,1465€","#9090AA","−96€/ano"],["Galp Plus","91%","rgba(229,62,62,0.1)","#E53E3E","0,1538€","#E53E3E","−38€/ano"],["SU Elétric.","100%","rgba(229,62,62,0.15)","#E53E3E","0,1603€","#E53E3E","referência"]].map(([lbl,w,bg,color,price,saveColor,save],i) => (
                <div key={i} className="bar-row">
                  <div className="bar-lbl">{lbl}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:w,background:bg,color}}>{price}</div></div>
                  <div className="bar-save" style={{color:saveColor}}>{save}</div>
                </div>
              ))}
            </div>
            <p className="source-note">Fonte: ERSE · ComparaJá · ECO · Abril 2026 · sem IVA</p>
          </div>
          <div className="scroll-reveal delay-1">
            <div className="market-list">
              {[["01","top","Endesa Digital","rgba(0,184,148,0.1)","#00976E","100% renovável","#00976E","0,1292€","−240€/ano"],["02","top","EDP Digital DD+FE","rgba(0,184,148,0.1)","#00976E","100% renovável","#00976E","0,1337€","−203€/ano"],["03","top","G9 Energy","#EEEEF5","#9090AA","preço fixo 12m","#0D0D1A","0,1348€","−194€/ano"],["04","","Goldenergy Digital","#EEEEF5","#9090AA","preço fixo","#444460","0,1399€","−151€/ano"],["05","","Plenitude Tendência","rgba(245,158,11,0.1)","#F59E0B","indexada","#444460","0,1418€","−135€/ano"],["06","","Iberdrola Smart","rgba(0,184,148,0.1)","#00976E","100% renovável","#9090AA","0,1465€","−96€/ano"],["07","","SU Eletricidade","rgba(229,62,62,0.1)","#E53E3E","regulado","#E53E3E","0,1603€","referência"]].map(([rank,cls,name,badgeBg,badgeColor,badge,priceColor,price,sv],i) => (
                <div key={i} className="market-row">
                  <div className={`mrank ${cls}`}>{rank}</div>
                  <div><div className="mname">{name}</div><span className="mbadge" style={{background:badgeBg,color:badgeColor}}>{badge}</span></div>
                  <div className="mright"><div className="mprice" style={{color:priceColor}}>{price}</div><div className="msave" style={{color:priceColor==="#E53E3E"?"#9090AA":"#00976E"}}>{sv}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <div className="how-section" id="como">
        <div className="how-inner">
          <div className="scroll-reveal">
            <div className="eyebrow">Como funciona</div>
            <h2 className="section-h2">Três passos.<br/><span className="grad">Uma decisão melhor.</span></h2>
          </div>
          <div className="how-grid scroll-reveal">
            {[["📄","01","Carrega a tua fatura","PDF ou foto da fatura. A IA lê, extrai consumo, potência e tarifa. Processado em memória — nada é guardado."],["🤖","02","A IA compara o mercado","O agente cruza os teus dados com 30+ tarifas em Portugal e calcula a poupança real para o teu perfil."],["⚡","03","Recebes o Top 3","Recomendação personalizada com gráfico comparativo, simulador de consumo e poupança anual exata."]].map(([icon,num,title,desc],i) => (
              <div key={i} className="how-card">
                <div className="how-icon">{icon}</div>
                <div className="how-num">{num}</div>
                <div className="how-title">{title}</div>
                <div className="how-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CALC */}
      <section className="calc-section" id="calc">
        <div className="scroll-reveal">
          <div className="eyebrow">Simulador de poupança</div>
          <h2 className="section-h2">Quanto podes <span className="grad">poupar?</span></h2>
          <p className="section-lede">Ajusta o consumo e vê quanto poupas migrando para o fornecedor mais barato.</p>
        </div>
        <div className="calc-card scroll-reveal">
          <div style={{marginBottom:28}}>
            <div className="calc-label">
              <span>Consumo mensal</span>
              <span className="calc-label-val">{kwh} kWh</span>
            </div>
            <input type="range" min="50" max="2000" value={kwh} step="10" onChange={e => setKwh(+e.target.value)}/>
            <div className="range-hint"><span>50 kWh</span><span>1000 kWh</span><span>2000 kWh</span></div>
          </div>
          <div className="results">
            <div className="result-box">
              <div className="result-lbl">Pagas hoje (médio)</div>
              <div className="result-num">{curM}€</div>
              <div className="result-sub">{curA}€/ano</div>
            </div>
            <div className="result-box best">
              <div className="result-lbl">Com Endesa Digital</div>
              <div className="result-num grad">{bestM}€</div>
              <div className="result-sub">↓ {save}€ poupados/ano</div>
            </div>
          </div>
          <div className="calc-cta">
            <button className="btn-main" onClick={goApp}>Análise personalizada com a minha fatura →</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-box scroll-reveal">
          <div className="cta-glow-l"></div>
          <div className="cta-glow-r"></div>
          <div className="cta-inner">
            <div className="cta-tag"><span className="live-dot" style={{background:"#00B894"}}></span>30+ fornecedores analisados</div>
            <h2 className="cta-h2">Descobre quanto<br/><span>pagas a mais.</span></h2>
            <p className="cta-sub">Análise gratuita. Sem registo. Conforme RGPD. Demora apenas 8 segundos.</p>
            <button className="btn-white" onClick={goApp}>Começar análise →</button>
            <div className="cta-pills">
              <div className="cta-pill">🔒 RGPD Compliant</div>
              <div className="cta-pill">⚡ 8 segundos</div>
              <div className="cta-pill">✓ Dados não guardados</div>
              <div className="cta-pill">📱 PWA instalável</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="logo">
              <div className="logo-icon"><svg viewBox="0 0 17 17" fill="none"><path d="M10 2L5 9.5h5l-2 5.5L15 7.5H10L12 2z" fill="#fff" strokeLinejoin="round"/></svg></div>
              EnergyAdvisor
            </div>
            <p className="footer-about">Agente de IA para análise de fornecedores de energia em Portugal. RGPD total. Sem dados pessoais guardados.</p>
          </div>
          <div className="footer-col"><h4>Produto</h4><a onClick={goApp} style={{cursor:"pointer"}}>Aplicação</a><a href="#como">Como funciona</a><a href="#calc">Simulador</a><a href="#mercado">Mercado</a></div>
          <div className="footer-col"><h4>Legal</h4><a href="#">Privacidade</a><a href="#">Termos</a><a href="https://cnpd.pt" target="_blank" rel="noreferrer">CNPD</a></div>
          <div className="footer-col"><h4>Recursos</h4><a href="https://erse.pt" target="_blank" rel="noreferrer">ERSE</a><a href="https://simuladorprecos.erse.pt" target="_blank" rel="noreferrer">Simulador ERSE</a></div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 EnergyAdvisor · Feito em Portugal 🇵🇹</div>
          <div>Dados: ERSE · ComparaJá · ECO Sapo · Abril 2026</div>
        </div>
      </footer>
    </div>
  );
}
