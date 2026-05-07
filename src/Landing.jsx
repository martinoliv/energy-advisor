import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

.lp * { box-sizing: border-box; margin: 0; padding: 0; }
.lp { background: #FAFAFA; color: #0D0D1A; font-family: "Inter", system-ui, sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; min-height: 100vh; font-size: 14px; }
.lp a { color: inherit; text-decoration: none; }
.lp ::selection { background: rgba(0,184,148,0.15); color: #00976E; }

/* NAV */
.lp nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 14px 40px; display: flex; align-items: center; justify-content: space-between; background: rgba(250,250,250,0.9); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(13,13,26,0.07); }
.lp .logo { display: flex; align-items: center; gap: 8px; font-family: "Syne",sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; }
.lp .logo-icon { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg,#00B894,#6C3CE1); display: flex; align-items: center; justify-content: center; }
.lp .logo-icon svg { width: 14px; height: 14px; }
.lp .nav-cta { padding: 8px 18px; background: #0D0D1A; color: #fff; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: "Inter",sans-serif; transition: background 0.2s; }
.lp .nav-cta:hover { background: #6C3CE1; }

/* HERO */
.lp .hero { padding: 110px 40px 80px; max-width: 1300px; margin: 0 auto; }
@media (max-width: 768px) { .lp .hero { padding: 90px 20px 60px; } .lp nav { padding: 12px 20px; } }
.lp .hero-chip { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 100px; background: rgba(0,184,148,0.08); border: 1px solid rgba(0,184,148,0.2); font-family: "JetBrains Mono",monospace; font-size: 10px; color: #00976E; letter-spacing: 0.05em; margin-bottom: 24px; }
.lp .chip-dot { width: 5px; height: 5px; border-radius: 50%; background: #00B894; animation: lp-blink 2s ease infinite; flex-shrink: 0; }
@keyframes lp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.lp h1 { font-family: "Syne",sans-serif; font-size: clamp(36px,5vw,64px); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 16px; max-width: 700px; }
.lp .h1-muted { color: #9090AA; }
.lp .h1-accent { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.lp .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-top: 40px; }
@media (max-width: 900px) { .lp .hero-grid { grid-template-columns: 1fr; gap: 36px; } }

.lp .hero-sub { font-size: 15px; line-height: 1.6; color: #555570; max-width: 420px; margin-bottom: 28px; }
.lp .hero-sub strong { color: #0D0D1A; font-weight: 600; }
.lp .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
.lp .btn-main { padding: 12px 22px; background: #0D0D1A; color: #fff; border-radius: 10px; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; border: none; cursor: pointer; font-family: "Inter",sans-serif; box-shadow: 0 4px 16px rgba(13,13,26,0.15); }
.lp .btn-main:hover { background: #6C3CE1; transform: translateY(-1px); }
.lp .btn-sec { padding: 12px 20px; background: #fff; border: 1.5px solid rgba(13,13,26,0.12); border-radius: 10px; font-size: 13px; font-weight: 500; color: #555570; display: inline-flex; align-items: center; gap: 7px; transition: all 0.2s; cursor: pointer; font-family: "Inter",sans-serif; }
.lp .btn-sec:hover { border-color: rgba(13,13,26,0.25); color: #0D0D1A; }
.lp .trust-row { display: flex; gap: 16px; flex-wrap: wrap; }
.lp .trust-item { font-size: 12px; color: #9090AA; display: flex; align-items: center; gap: 5px; }
.lp .trust-ok { color: #00B894; font-weight: 700; }

/* Pulse card */
.lp .pulse-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.1); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(13,13,26,0.08); position: relative; overflow: hidden; }
.lp .pulse-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,#00B894,#6C3CE1); }
.lp .pulse-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.lp .pulse-label { font-family: "JetBrains Mono",monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #9090AA; }
.lp .live { display: flex; align-items: center; gap: 4px; font-family: "JetBrains Mono",monospace; font-size: 9px; color: #00B894; }
.lp .live-dot { width: 4px; height: 4px; border-radius: 50%; background: #00B894; animation: lp-blink 1.5s ease infinite; }
.lp .price-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-top: 1px solid rgba(13,13,26,0.06); }
.lp .price-row:first-of-type { border-top: none; }
.lp .price-name { font-size: 12px; font-weight: 500; }
.lp .price-badge { font-family: "JetBrains Mono",monospace; font-size: 8px; padding: 1px 5px; border-radius: 4px; margin-left: 4px; background: rgba(0,184,148,0.1); color: #00976E; }
.lp .price-val { font-family: "JetBrains Mono",monospace; font-size: 13px; font-weight: 600; }
.lp .pv-best { color: #00976E; }
.lp .pv-bad { color: #E53E3E; }
.lp .price-delta { font-family: "JetBrains Mono",monospace; font-size: 9px; color: #9090AA; margin-left: 4px; }

/* MARQUEE */
.lp .marquee-wrap { padding: 18px 0; background: #0D0D1A; overflow: hidden; }
.lp .marquee-track { display: flex; gap: 40px; animation: lp-marquee 25s linear infinite; width: max-content; }
@keyframes lp-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.lp .marquee-item { font-family: "JetBrains Mono",monospace; font-size: 11px; color: rgba(255,255,255,0.35); white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.lp .marquee-val { color: #00D4AA; font-weight: 600; }

/* STATS */
.lp .stats-band { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid rgba(13,13,26,0.07); border-bottom: 1px solid rgba(13,13,26,0.07); background: #fff; }
@media (max-width: 768px) { .lp .stats-band { grid-template-columns: repeat(2,1fr); } }
.lp .stat-box { padding: 32px 28px; border-right: 1px solid rgba(13,13,26,0.07); }
.lp .stat-box:last-child { border-right: none; }
@media (max-width: 768px) { .lp .stat-box { padding: 24px 20px; border-right: none; border-bottom: 1px solid rgba(13,13,26,0.07); } }
.lp .stat-num { font-family: "Syne",sans-serif; font-size: clamp(32px,4vw,52px); font-weight: 800; letter-spacing: -0.03em; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lp .stat-label { font-size: 12px; color: #9090AA; margin-top: 6px; max-width: 150px; line-height: 1.4; }

/* MARKET */
.lp .market-section { padding: 100px 40px; max-width: 1300px; margin: 0 auto; }
@media (max-width: 768px) { .lp .market-section { padding: 60px 20px; } }
.lp .eyebrow { font-family: "JetBrains Mono",monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #00976E; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
.lp .eyebrow::before { content: ""; width: 20px; height: 1.5px; background: #00B894; border-radius: 1px; }
.lp .section-h2 { font-family: "Syne",sans-serif; font-weight: 800; font-size: clamp(26px,4vw,42px); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 8px; }
.lp .section-h2 .grad { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lp .section-sub { font-size: 13px; color: #777790; max-width: 480px; line-height: 1.55; margin-bottom: 40px; }

.lp .market-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: start; }
@media (max-width: 900px) { .lp .market-grid { grid-template-columns: 1fr; } }

/* Bar chart */
.lp .chart-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.08); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(13,13,26,0.06); }
.lp .chart-title { font-family: "Syne",sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 3px; }
.lp .chart-sub { font-size: 11px; color: #9090AA; margin-bottom: 20px; }
.lp .bars { display: flex; flex-direction: column; gap: 8px; }
.lp .bar-row { display: grid; grid-template-columns: 90px 1fr 70px; gap: 8px; align-items: center; }
.lp .bar-lbl { font-size: 11px; font-weight: 500; color: #555570; text-align: right; }
.lp .bar-track { height: 26px; background: #F0F0F5; border-radius: 6px; overflow: hidden; }
.lp .bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 10px; font-family: "JetBrains Mono",monospace; font-size: 10px; font-weight: 600; }
.lp .bar-save { font-family: "JetBrains Mono",monospace; font-size: 10px; text-align: right; }
.lp .source-note { font-family: "JetBrains Mono",monospace; font-size: 9px; color: #B0B0C0; margin-top: 14px; letter-spacing: 0.04em; }

/* Donut chart */
.lp .donut-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.08); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(13,13,26,0.06); }
.lp .donut-title { font-family: "Syne",sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 3px; }
.lp .donut-sub { font-size: 11px; color: #9090AA; margin-bottom: 20px; }
.lp .donut-wrap { display: flex; align-items: center; gap: 24px; }
.lp .donut-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.lp .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.lp .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lp .legend-name { flex: 1; color: #555570; }
.lp .legend-val { font-family: "JetBrains Mono",monospace; font-weight: 600; font-size: 11px; }

/* Market list */
.lp .market-list { display: flex; flex-direction: column; gap: 5px; }
.lp .market-row { display: grid; grid-template-columns: 22px 1fr auto; gap: 10px; align-items: center; background: #fff; border: 1.5px solid rgba(13,13,26,0.07); border-radius: 10px; padding: 11px 14px; transition: all 0.18s; }
.lp .market-row:hover { border-color: rgba(13,13,26,0.15); box-shadow: 0 4px 16px rgba(13,13,26,0.07); transform: translateX(3px); }
.lp .mrank { font-family: "JetBrains Mono",monospace; font-size: 10px; color: #9090AA; }
.lp .mrank.top { color: #00976E; font-weight: 600; }
.lp .mname { font-size: 12px; font-weight: 600; color: #0D0D1A; }
.lp .mbadge { font-family: "JetBrains Mono",monospace; font-size: 8px; padding: 1px 5px; border-radius: 4px; margin-top: 2px; display: inline-block; }
.lp .mright { text-align: right; }
.lp .mprice { font-family: "JetBrains Mono",monospace; font-size: 13px; font-weight: 700; }
.lp .msave { font-family: "JetBrains Mono",monospace; font-size: 9px; color: #00976E; }

/* HOW */
.lp .how-section { padding: 80px 40px; background: #fff; border-top: 1px solid rgba(13,13,26,0.07); }
@media (max-width: 768px) { .lp .how-section { padding: 60px 20px; } }
.lp .how-inner { max-width: 1300px; margin: 0 auto; }
.lp .how-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 36px; }
@media (max-width: 900px) { .lp .how-grid { grid-template-columns: 1fr; } }
.lp .how-card { background: #FAFAFA; border: 1.5px solid rgba(13,13,26,0.07); border-radius: 14px; padding: 28px; transition: all 0.2s; position: relative; overflow: hidden; }
.lp .how-card:hover { background: #fff; border-color: rgba(13,13,26,0.14); box-shadow: 0 8px 28px rgba(13,13,26,0.08); transform: translateY(-3px); }
.lp .how-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(135deg,#00B894,#6C3CE1); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
.lp .how-card:hover::before { transform: scaleX(1); }
.lp .how-icon { font-size: 24px; margin-bottom: 14px; }
.lp .how-num { font-family: "Syne",sans-serif; font-size: 40px; font-weight: 800; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.25; line-height: 1; margin-bottom: 12px; }
.lp .how-title { font-family: "Syne",sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.lp .how-desc { font-size: 13px; color: #666680; line-height: 1.6; }

/* CALC */
.lp .calc-section { padding: 100px 40px; max-width: 1300px; margin: 0 auto; }
@media (max-width: 768px) { .lp .calc-section { padding: 60px 20px; } }
.lp .calc-card { background: #fff; border: 1.5px solid rgba(13,13,26,0.1); border-radius: 18px; padding: 36px; box-shadow: 0 8px 32px rgba(13,13,26,0.08); max-width: 680px; margin: 0 auto; }
.lp .calc-label { display: flex; justify-content: space-between; align-items: baseline; font-family: "JetBrains Mono",monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9090AA; margin-bottom: 12px; }
.lp .calc-val { font-family: "Syne",sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lp input[type="range"] { width: 100%; height: 4px; background: #EEEEF5; border-radius: 4px; -webkit-appearance: none; cursor: pointer; outline: none; }
.lp input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: #00B894; border-radius: 50%; cursor: grab; box-shadow: 0 2px 8px rgba(0,184,148,0.35),0 0 0 4px rgba(0,184,148,0.1); }
.lp .range-hint { display: flex; justify-content: space-between; font-family: "JetBrains Mono",monospace; font-size: 9px; color: #B0B0C0; margin-top: 5px; }
.lp .results { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; padding-top: 28px; border-top: 1px solid rgba(13,13,26,0.07); }
@media (max-width: 560px) { .lp .results { grid-template-columns: 1fr; } }
.lp .result-box { background: #F7F7FA; border: 1px solid rgba(13,13,26,0.07); border-radius: 12px; padding: 18px; }
.lp .result-box.best { background: rgba(0,184,148,0.04); border-color: rgba(0,184,148,0.2); }
.lp .result-lbl { font-family: "JetBrains Mono",monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #9090AA; margin-bottom: 6px; }
.lp .result-num { font-family: "Syne",sans-serif; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; color: #0D0D1A; }
.lp .result-num.grad { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lp .result-sub { font-size: 11px; color: #9090AA; margin-top: 3px; }
.lp .calc-cta { text-align: center; margin-top: 28px; }

/* CTA */
.lp .cta-section { padding: 60px 40px 100px; max-width: 1300px; margin: 0 auto; }
@media (max-width: 768px) { .lp .cta-section { padding: 40px 20px 70px; } }
.lp .cta-box { border-radius: 22px; overflow: hidden; position: relative; background: linear-gradient(135deg,#0A1A2E,#1A0A2E,#0A2A1A); padding: 80px 60px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
@media (max-width: 768px) { .lp .cta-box { padding: 52px 24px; } }
.lp .cta-glow-l { position: absolute; top: -40px; right: -40px; width: 320px; height: 320px; background: radial-gradient(circle,rgba(108,60,225,0.25),transparent 65%); }
.lp .cta-glow-r { position: absolute; bottom: -40px; left: -20px; width: 280px; height: 280px; background: radial-gradient(circle,rgba(0,184,148,0.2),transparent 65%); }
.lp .cta-inner { position: relative; z-index: 1; }
.lp .cta-h2 { font-family: "Syne",sans-serif; font-weight: 800; font-size: clamp(28px,4vw,48px); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 12px; color: #fff; }
.lp .cta-h2 span { background: linear-gradient(135deg,#00B894,#6C3CE1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lp .cta-sub { font-size: 14px; color: rgba(255,255,255,0.5); max-width: 360px; margin: 0 auto 32px; }
.lp .btn-white { padding: 13px 26px; background: #fff; color: #0D0D1A; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; border: none; cursor: pointer; font-family: "Inter",sans-serif; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.lp .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }
.lp .cta-pills { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
.lp .cta-pill { font-family: "JetBrains Mono",monospace; font-size: 10px; color: rgba(255,255,255,0.4); padding: 4px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); border-radius: 100px; }

/* FOOTER */
.lp footer { border-top: 1px solid rgba(13,13,26,0.07); padding: 48px 40px 32px; max-width: 1300px; margin: 0 auto; }
@media (max-width: 768px) { .lp footer { padding: 40px 20px 28px; } }
.lp .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 36px; }
@media (max-width: 768px) { .lp .footer-grid { grid-template-columns: 1fr 1fr; gap: 20px; } }
.lp .footer-about { font-size: 12px; color: #9090AA; line-height: 1.6; margin-top: 12px; max-width: 260px; }
.lp .footer-col h4 { font-family: "JetBrains Mono",monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #9090AA; margin-bottom: 12px; }
.lp .footer-col a { display: block; font-size: 12px; color: #9090AA; padding: 4px 0; transition: color 0.15s; cursor: pointer; }
.lp .footer-col a:hover { color: #00976E; }
.lp .footer-bottom { display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid rgba(13,13,26,0.07); font-family: "JetBrains Mono",monospace; font-size: 9px; color: #B0B0C0; letter-spacing: 0.05em; }
@media (max-width: 768px) { .lp .footer-bottom { flex-direction: column; gap: 10px; } }

@keyframes lp-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.lp .reveal { animation: lp-fadeUp 0.7s ease both; }
.lp .d1{animation-delay:.1s} .lp .d2{animation-delay:.2s}
.lp .scroll-reveal { opacity:0; transform:translateY(20px); transition:opacity 0.65s ease,transform 0.65s ease; }
.lp .scroll-reveal.in { opacity:1; transform:translateY(0); }
.lp .d-1{transition-delay:.1s} .lp .d-2{transition-delay:.2s}
`;

const MARQUEE = [
  ["Endesa Digital","0,1292"],["EDP Digital","0,1337"],["G9 Energy","0,1348"],
  ["Goldenergy","0,1399"],["Plenitude","0,1418"],["Iberdrola","0,1465"],
  ["Galp Plus","0,1538"],["SU Eletricidade","0,1603"],
];

const DONUT_DATA = [
  { label: "Nunca mudaram", pct: 67, color: "#6C3CE1" },
  { label: "Já mudaram 1x", pct: 22, color: "#00B894" },
  { label: "Mudaram 2x+", pct: 11, color: "#E2E2F0" },
];

function DonutChart({ data }) {
  const size = 120, r = 44, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F5" strokeWidth="16" />
      {data.map((d, i) => {
        const dash = (d.pct / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#0D0D1A" fontSize="18" fontWeight="800" fontFamily="Syne,sans-serif">67%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#9090AA" fontSize="8" fontFamily="Inter,sans-serif">nunca mudaram</text>
    </svg>
  );
}

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
    style.id = "lp-css";
    style.textContent = CSS;
    document.head.appendChild(style);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    setTimeout(() => document.querySelectorAll(".scroll-reveal").forEach(el => obs.observe(el)), 100);

    return () => { document.getElementById("lp-css")?.remove(); obs.disconnect(); };
  }, []);

  const go = () => navigate("/app");

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
        <button className="nav-cta" onClick={go}>Analisar fatura →</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="reveal">
          <div className="hero-chip"><span className="chip-dot"></span>Dados atualizados · Abril 2026</div>
          <h1>Estás a pagar <span className="h1-muted">demasiado</span><br/>pela <span className="h1-accent">energia.</span></h1>
        </div>
        <div className="hero-grid">
          <div className="reveal d1">
            <p className="hero-sub">A diferença entre o fornecedor mais caro e o mais barato chega a <strong>240€/ano</strong>. A IA analisa a tua fatura em 8 segundos.</p>
            <div className="hero-actions">
              <button className="btn-main" onClick={go}>Analisar a minha fatura →</button>
              <a href="#mercado" className="btn-sec">Ver mercado</a>
            </div>
            <div className="trust-row">
              <div className="trust-item"><span className="trust-ok">✓</span>Gratuito</div>
              <div className="trust-item"><span className="trust-ok">✓</span>Sem registo</div>
              <div className="trust-item"><span className="trust-ok">✓</span>RGPD</div>
              <div className="trust-item"><span className="trust-ok">✓</span>8 segundos</div>
            </div>
          </div>
          <div className="reveal d2">
            <div className="pulse-card">
              <div className="pulse-hdr">
                <span className="pulse-label">Mercado · Abril 2026</span>
                <span className="live"><span className="live-dot"></span>€/kWh</span>
              </div>
              {[["Endesa Digital","0,1292","pv-best","100% REN."],["EDP Digital","0,1337","pv-best","100% REN."],["G9 Energy","0,1348","",""],["Goldenergy","0,1399","",""],["Iberdrola","0,1465","",""],["SU Eletricidade","0,1603","pv-bad",""]].map(([name,price,cls,badge],i) => (
                <div key={i} className="price-row">
                  <div><span className="price-name">{name}</span>{badge && <span className="price-badge">{badge}</span>}</div>
                  <div><span className={`price-val ${cls}`}>{price}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE,...MARQUEE].map((item,i) => (
            <span key={i} className="marquee-item">{item[0]} <span className="marquee-val">{item[1]}€/kWh</span> <span style={{color:"rgba(255,255,255,0.12)"}}>·</span></span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-band">
        {[["30+","Fornecedores em tempo real"],["240€","Poupança média anual"],["8s","Análise por IA"],["0","Dados guardados"]].map(([n,l],i) => (
          <div key={i} className="stat-box scroll-reveal"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      {/* MARKET */}
      <section className="market-section" id="mercado">
        <div className="scroll-reveal">
          <div className="eyebrow">Mercado liberalizado · Abril 2026</div>
          <h2 className="section-h2">Comparativo de <span className="grad">fornecedores.</span></h2>
          <p className="section-sub">417 kWh/mês · 6,9 kVA · sem IVA · débito direto</p>
        </div>

        {/* Charts row */}
        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:24,marginBottom:24}}>
          {/* Bar chart */}
          <div className="chart-card scroll-reveal">
            <div className="chart-title">Preço €/kWh por fornecedor</div>
            <div className="chart-sub">Diferença máxima de 24% entre o mais barato e o mais caro</div>
            <div className="bars">
              {[["Endesa","76%","linear-gradient(90deg,#00B894,#00976E)","#fff","0,1292€","#00976E","−240€/ano"],
                ["EDP Digital","79%","linear-gradient(90deg,#00A882,#008B6A)","#fff","0,1337€","#00976E","−203€/ano"],
                ["G9 Energy","80%","linear-gradient(90deg,#52C69B,#3DAE82)","#fff","0,1348€","#00976E","−194€/ano"],
                ["Goldenergy","83%","#E8E8F0","#777790","0,1399€","#9090AA","−151€/ano"],
                ["Iberdrola","87%","#E8E8F0","#777790","0,1465€","#9090AA","−96€/ano"],
                ["Galp Plus","91%","rgba(229,62,62,0.1)","#E53E3E","0,1538€","#E53E3E","−38€/ano"],
                ["SU Elétric.","100%","rgba(229,62,62,0.18)","#E53E3E","0,1603€","#E53E3E","referência"],
              ].map(([lbl,w,bg,color,price,sc,sv],i) => (
                <div key={i} className="bar-row">
                  <div className="bar-lbl">{lbl}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:w,background:bg,color}}>{price}</div></div>
                  <div className="bar-save" style={{color:sc}}>{sv}</div>
                </div>
              ))}
            </div>
            <p className="source-note">Fonte: ERSE · ComparaJá · ECO Sapo · Abril 2026</p>
          </div>

          {/* Donut + mini stats */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="donut-card scroll-reveal d-1">
              <div className="donut-title">Famílias que nunca mudaram</div>
              <div className="donut-sub">Portugal · Estudo DECO 2025</div>
              <div className="donut-wrap">
                <DonutChart data={DONUT_DATA} />
                <div className="donut-legend">
                  {DONUT_DATA.map((d,i) => (
                    <div key={i} className="legend-item">
                      <div className="legend-dot" style={{background:d.color}}></div>
                      <span className="legend-name">{d.label}</span>
                      <span className="legend-val" style={{color:d.color}}>{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini card — poupança */}
            <div className="chart-card scroll-reveal d-2" style={{padding:20}}>
              <div className="chart-title" style={{marginBottom:16}}>Poupança potencial / ano</div>
              {[["Endesa vs SU Elétric.","#00B894","240€"],["EDP vs SU Elétric.","#2D9B6A","203€"],["G9 Energy vs SU","#52C69B","194€"]].map(([lbl,color,val],i) => (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderTop:i>0?"1px solid rgba(13,13,26,0.06)":"none"}}>
                  <span style={{fontSize:11,color:"#555570"}}>{lbl}</span>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="market-list scroll-reveal">
          {[["01","top","Endesa Digital","rgba(0,184,148,0.1)","#00976E","100% renovável","#00976E","0,1292€","−240€/ano"],
            ["02","top","EDP Digital DD+FE","rgba(0,184,148,0.1)","#00976E","100% renovável","#00976E","0,1337€","−203€/ano"],
            ["03","top","G9 Energy","#F0F0F5","#9090AA","preço fixo 12m","#0D0D1A","0,1348€","−194€/ano"],
            ["04","","Goldenergy Digital","#F0F0F5","#9090AA","preço fixo","#555570","0,1399€","−151€/ano"],
            ["05","","Plenitude Tendência","rgba(245,158,11,0.08)","#F59E0B","indexada","#555570","0,1418€","−135€/ano"],
            ["06","","Iberdrola Smart","rgba(0,184,148,0.08)","#00976E","100% renovável","#9090AA","0,1465€","−96€/ano"],
            ["07","","SU Eletricidade","rgba(229,62,62,0.08)","#E53E3E","regulado","#E53E3E","0,1603€","referência"],
          ].map(([rank,cls,name,bb,bc,badge,pc,price,sv],i) => (
            <div key={i} className="market-row">
              <div className={`mrank ${cls}`}>{rank}</div>
              <div><div className="mname">{name}</div><span className="mbadge" style={{background:bb,color:bc}}>{badge}</span></div>
              <div className="mright"><div className="mprice" style={{color:pc}}>{price}</div><div className="msave" style={{color:pc==="E53E3E"?"#9090AA":"#00976E"}}>{sv}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <div className="how-section" id="como">
        <div className="how-inner">
          <div className="scroll-reveal">
            <div className="eyebrow">Como funciona</div>
            <h2 className="section-h2">Três passos. <span className="grad">Uma decisão melhor.</span></h2>
          </div>
          <div className="how-grid scroll-reveal">
            {[["📄","01","Carrega a fatura","PDF ou foto. A IA extrai consumo, potência e tarifa automaticamente."],
              ["🤖","02","IA compara o mercado","Cruzamento com 30+ tarifas atualizadas em Portugal."],
              ["⚡","03","Recebes o Top 3","Gráfico, simulador interativo e poupança exata em segundos."],
            ].map(([icon,num,title,desc],i) => (
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
          <div className="eyebrow">Simulador</div>
          <h2 className="section-h2">Quanto podes <span className="grad">poupar?</span></h2>
          <p className="section-sub" style={{marginBottom:32}}>Arrasta o slider e vê a diferença em tempo real.</p>
        </div>
        <div className="calc-card scroll-reveal">
          <div style={{marginBottom:24}}>
            <div className="calc-label">
              <span>Consumo mensal</span>
              <span className="calc-val">{kwh} kWh</span>
            </div>
            <input type="range" min="50" max="2000" value={kwh} step="10" onChange={e => setKwh(+e.target.value)}/>
            <div className="range-hint"><span>50 kWh</span><span>1000 kWh</span><span>2000 kWh</span></div>
          </div>
          <div className="results">
            <div className="result-box">
              <div className="result-lbl">Pagas hoje (SU Elétric.)</div>
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
            <button className="btn-main" onClick={go}>Análise com a minha fatura →</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-box scroll-reveal">
          <div className="cta-glow-l"></div><div className="cta-glow-r"></div>
          <div className="cta-inner">
            <h2 className="cta-h2">Descobre quanto<br/><span>pagas a mais.</span></h2>
            <p className="cta-sub">Grátis · Sem registo · RGPD · 8 segundos</p>
            <button className="btn-white" onClick={go}>Começar análise →</button>
            <div className="cta-pills">
              <div className="cta-pill">🔒 RGPD</div>
              <div className="cta-pill">⚡ 8s</div>
              <div className="cta-pill">✓ Dados não guardados</div>
              <div className="cta-pill">📱 PWA</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="logo"><div className="logo-icon"><svg viewBox="0 0 17 17" fill="none"><path d="M10 2L5 9.5h5l-2 5.5L15 7.5H10L12 2z" fill="#fff" strokeLinejoin="round"/></svg></div>EnergyAdvisor</div>
            <p className="footer-about">Agente de IA para análise de fornecedores de energia em Portugal. RGPD total.</p>
          </div>
          <div className="footer-col"><h4>Produto</h4><a onClick={go}>Aplicação</a><a href="#como">Como funciona</a><a href="#calc">Simulador</a></div>
          <div className="footer-col"><h4>Legal</h4><a href="#">Privacidade</a><a href="#">Termos</a><a href="https://cnpd.pt" target="_blank" rel="noreferrer">CNPD</a></div>
          <div className="footer-col"><h4>Dados</h4><a href="https://erse.pt" target="_blank" rel="noreferrer">ERSE</a><a href="https://comparaja.pt" target="_blank" rel="noreferrer">ComparaJá</a></div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 EnergyAdvisor · Portugal 🇵🇹</div>
          <div>ERSE · ComparaJá · ECO · Abril 2026</div>
        </div>
      </footer>
    </div>
  );
}
