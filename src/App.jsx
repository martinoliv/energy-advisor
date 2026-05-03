import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `És um especialista em energia e fornecedores de eletricidade/gás em Portugal e Europa.

Quando o utilizador enviar um documento com dados de fornecedores, deves:
1. Analisar todos os fornecedores presentes
2. Avaliar com base em: preço (€/kWh), condições contratuais, energia verde (%), avaliação clientes, fidelização, benefícios extra
3. Selecionar o TOP 3 melhores fornecedores
4. Retornar OBRIGATORIAMENTE um JSON estruturado assim (antes da explicação em texto):

<SIMULATION_JSON>
[
  {
    "rank": 1,
    "nome": "Nome do Fornecedor",
    "preco_kwh": 0.1842,
    "energia_verde": 80,
    "avaliacao": 4.5,
    "fidelizacao_meses": 12,
    "poupanca_anual_estimada": 120,
    "pontos_fortes": ["Preço competitivo", "100% renovável"],
    "pontos_fracos": ["Fidelização longa"],
    "recomendacao": "Melhor custo-benefício geral"
  },
  { "rank": 2 },
  { "rank": 3 }
]
</SIMULATION_JSON>

Depois do JSON, explica a análise em português de forma clara e amigável.
Para perguntas de seguimento sem documento, responde como assistente especialista em energia.
Se não houver documento, pede ao utilizador para carregar um ficheiro.`;

const MEDAL_COLORS = ["#F59E0B", "#94A3B8", "#B45309"];
const MEDAL_BG = ["rgba(245,158,11,0.08)", "rgba(148,163,184,0.06)", "rgba(180,83,9,0.08)"];
const MEDAL_LABELS = ["🥇 Melhor Escolha", "🥈 2ª Opção", "🥉 3ª Opção"];

function parseSimulation(text) {
  const match = text.match(/<SIMULATION_JSON>([\s\S]*?)<\/SIMULATION_JSON>/);
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch { return null; }
}

function cleanText(text) {
  return text.replace(/<SIMULATION_JSON>[\s\S]*?<\/SIMULATION_JSON>/g, "").trim();
}

function PriceChart({ data }) {
  const max = Math.max(...data.map(d => d.preco_kwh || 0)) * 1.25 || 1;
  const W = 300, H = 110, padL = 8, padR = 8, barW = 60;
  const usable = W - padL - padR;
  const gap = (usable - barW * 3) / 2;

  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "10px", padding: "12px 10px 8px", marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#475569", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.08em" }}>
        COMPARATIVO DE PREÇO (€/kWh)
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} style={{ overflow: "visible" }}>
        {data.map((d, i) => {
          const bh = d.preco_kwh ? ((d.preco_kwh / max) * H) : 4;
          const x = padL + i * (barW + gap);
          const y = H - bh;
          return (
            <g key={i}>
              <rect x={x} y={0} width={barW} height={H} fill="rgba(30,41,59,0.5)" rx="5" />
              <rect x={x} y={y} width={barW} height={bh} fill={MEDAL_COLORS[i]} rx="5" opacity="0.85" />
              <text x={x + barW / 2} y={Math.max(y - 4, 10)} textAnchor="middle"
                fill={MEDAL_COLORS[i]} fontSize="9.5" fontWeight="700" fontFamily="monospace">
                {d.preco_kwh ? d.preco_kwh.toFixed(4) : "—"}
              </text>
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fill="#64748B" fontSize="9">
                {(d.nome || "").split(" ")[0]}
              </text>
            </g>
          );
        })}
        <line x1={padL - 2} y1={H} x2={W - padR + 2} y2={H} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function ConsumptionSimulator({ data }) {
  const [kwh, setKwh] = useState(200);
  const results = data.map(f => ({
    ...f,
    mensal: f.preco_kwh ? (f.preco_kwh * kwh).toFixed(2) : null,
    anual: f.preco_kwh ? (f.preco_kwh * kwh * 12).toFixed(2) : null,
  }));
  const best = results[0];
  const second = results[1];
  const poupanca = best?.anual && second?.anual
    ? (parseFloat(second.anual) - parseFloat(best.anual)).toFixed(0) : null;

  return (
    <div style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(14,165,233,0.14)", borderRadius: "11px", padding: "13px", marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#0EA5E9", fontWeight: "700", marginBottom: "10px", letterSpacing: "0.07em" }}>
        ⚡ SIMULADOR DE CONSUMO MENSAL
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <input type="range" min="50" max="800" step="10" value={kwh}
          onChange={e => setKwh(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#0EA5E9", cursor: "pointer" }} />
        <div style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "7px", padding: "4px 10px", fontSize: "13px", fontWeight: "800", color: "#38BDF8", minWidth: "68px", textAlign: "center" }}>
          {kwh} kWh
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "#334155", marginBottom: "11px" }}>Arrasta para ajustar o teu consumo</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {results.map((f, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.55)", borderRadius: "8px", padding: "9px 11px", borderLeft: `2px solid ${MEDAL_COLORS[i]}` }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#E2E8F0" }}>{f.nome}</div>
              <div style={{ fontSize: "9px", color: "#475569" }}>{MEDAL_LABELS[i]}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "17px", fontWeight: "800", color: MEDAL_COLORS[i] }}>{f.mensal ? `${f.mensal} €` : "—"}</div>
              <div style={{ fontSize: "9px", color: "#475569" }}>{f.anual ? `${f.anual} €/ano` : ""}</div>
            </div>
          </div>
        ))}
      </div>
      {poupanca && parseFloat(poupanca) > 0 && (
        <div style={{ marginTop: "9px", textAlign: "center", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: "7px", padding: "7px", fontSize: "11px", color: "#22C55E", fontWeight: "600" }}>
          💚 Com <strong>{best?.nome}</strong> poupas até <strong>{poupanca} €/ano</strong> vs a 2ª opção
        </div>
      )}
    </div>
  );
}

function SimulationCards({ data }) {
  return (
    <div style={{ margin: "6px 0 14px" }}>
      <PriceChart data={data} />
      <ConsumptionSimulator data={data} />
      <div style={{ fontSize: "10px", color: "#475569", fontWeight: "700", marginBottom: "7px", letterSpacing: "0.07em" }}>ANÁLISE DETALHADA</div>
      {data.map((f, i) => (
        <div key={i} style={{ background: MEDAL_BG[i], border: `1px solid ${MEDAL_COLORS[i]}28`, borderLeft: `3px solid ${MEDAL_COLORS[i]}`, borderRadius: "11px", padding: "13px", marginBottom: "9px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: `${MEDAL_COLORS[i]}15`, padding: "3px 10px", borderBottomLeftRadius: "8px", fontSize: "9px", fontWeight: "700", color: MEDAL_COLORS[i], letterSpacing: "0.06em" }}>{MEDAL_LABELS[i]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "5px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9", marginBottom: "2px" }}>{f.nome}</div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>{f.recomendacao}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "19px", fontWeight: "800", color: MEDAL_COLORS[i] }}>{f.preco_kwh ? `${f.preco_kwh.toFixed(4)} €` : "—"}</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>por kWh</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", margin: "9px 0" }}>
            {[{ label: "Verde", value: `${f.energia_verde ?? "?"}%`, icon: "🌿" }, { label: "Rating", value: `${f.avaliacao ?? "?"}/5`, icon: "⭐" }, { label: "Fideliz.", value: `${f.fidelizacao_meses ?? "?"}m`, icon: "📅" }].map((item, j) => (
              <div key={j} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "7px", padding: "6px", textAlign: "center" }}>
                <div style={{ fontSize: "13px" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#E2E8F0" }}>{item.value}</div>
                <div style={{ fontSize: "9px", color: "#64748B" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <div>
              <div style={{ fontSize: "9px", color: "#22C55E", marginBottom: "3px", fontWeight: "700" }}>✓ VANTAGENS</div>
              {(f.pontos_fortes || []).map((p, j) => <div key={j} style={{ fontSize: "10px", color: "#94A3B8", padding: "1px 0" }}>• {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "9px", color: "#EF4444", marginBottom: "3px", fontWeight: "700" }}>✗ DESVANTAGENS</div>
              {(f.pontos_fracos || []).map((p, j) => <div key={j} style={{ fontSize: "10px", color: "#94A3B8", padding: "1px 0" }}>• {p}</div>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  const simulation = !isUser ? parseSimulation(msg.content) : null;
  const displayText = !isUser ? cleanText(msg.content) : msg.content;
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "14px" }}>
      {!isUser && (
        <div style={{ width: "29px", height: "29px", borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", marginRight: "8px", flexShrink: 0, marginTop: "3px" }}>⚡</div>
      )}
      <div style={{ maxWidth: "88%" }}>
        {simulation && <SimulationCards data={simulation} />}
        {displayText && (
          <div style={{ background: isUser ? "linear-gradient(135deg, #0EA5E9, #6366F1)" : "rgba(30,41,59,0.8)", color: "#F1F5F9", padding: "10px 13px", borderRadius: isUser ? "17px 17px 4px 17px" : "17px 17px 17px 4px", fontSize: "13px", lineHeight: "1.65", border: isUser ? "none" : "1px solid rgba(148,163,184,0.07)", whiteSpace: "pre-wrap" }}>
            {displayText}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnergyAgent() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Olá! 👋 Sou o teu assistente especialista em energia.\n\nCarrega um ficheiro (PDF ou TXT) com os dados dos fornecedores — analiso o Top 3, mostro um gráfico comparativo e um simulador de consumo interativo.\n\nTambém podes fazer perguntas sobre tarifas, contratos ou dicas de poupança!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docData, setDocData] = useState(null);
  const [docName, setDocName] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function handleFile(file) {
    if (!file) return;
    setDocName(file.name);
    const isPDF = file.type === "application/pdf";
    const reader = new FileReader();
    reader.onload = e => {
      if (isPDF) setDocData({ type: "pdf", base64: e.target.result.split(",")[1] });
      else setDocData({ type: "text", content: e.target.result });
    };
    isPDF ? reader.readAsDataURL(file) : reader.readAsText(file);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text && !docData) return;
    const userMessage = text || `Analisa o documento "${docName}" e dá-me o Top 3 fornecedores.`;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    const apiHistory = messages.slice(1).map(m => ({ role: m.role, content: cleanText(m.content) || m.content }));

    let userContent;
    if (docData) {
      userContent = docData.type === "pdf"
        ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: docData.base64 } }, { type: "text", text: userMessage }]
        : `${userMessage}\n\n--- DOCUMENTO ---\n${docData.content}`;
      setDocData(null);
    } else {
      userContent = userMessage;
    }

    try {
      // ✅ Chama o NOSSO backend seguro, não a Anthropic diretamente
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [...apiHistory, { role: "user", content: userContent }]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro do servidor");
      const reply = data.content?.find(b => b.type === "text")?.text || "Erro ao processar resposta.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${err.message || "Erro de ligação. Tenta novamente."}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020B18", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#F1F5F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=Space+Mono:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#1E3A5F;border-radius:4px}
        textarea{resize:none;font-family:inherit}
        textarea:focus{outline:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg-in{animation:slideUp 0.25s ease}
        .upbtn:hover{border-color:rgba(14,165,233,0.45)!important;background:rgba(14,165,233,0.05)!important}
      `}</style>

      <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(148,163,184,0.07)", background: "rgba(2,11,24,0.97)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ width: "37px", height: "37px", borderRadius: "10px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 0 16px rgba(14,165,233,0.22)", flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "-0.025em" }}>Energy<span style={{ color: "#0EA5E9" }}>Advisor</span></div>
          <div style={{ fontSize: "9px", color: "#334155", fontFamily: "'Space Mono', monospace" }}>TOP 3 · GRÁFICO · SIMULADOR</div>
        </div>
        {docName && (
          <div style={{ marginLeft: "auto", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.22)", borderRadius: "7px", padding: "3px 8px", fontSize: "10px", color: "#38BDF8", display: "flex", alignItems: "center", gap: "5px" }}>
            📄 {docName.length > 16 ? docName.slice(0, 16) + "…" : docName}
            <span onClick={() => { setDocName(null); setDocData(null); }} style={{ cursor: "pointer", color: "#475569", fontWeight: "800" }}>✕</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 13px" }}>
        {messages.map((msg, i) => <div key={i} className="msg-in"><Message msg={msg} /></div>)}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "29px", height: "29px", borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>⚡</div>
            <div style={{ display: "flex", gap: "4px", padding: "10px 13px", background: "rgba(30,41,59,0.8)", borderRadius: "17px 17px 17px 4px", border: "1px solid rgba(148,163,184,0.07)" }}>
              {[0, 1, 2].map(j => <div key={j} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0EA5E9", animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!docName && (
        <div style={{ padding: "0 13px 7px" }}>
          <div className="upbtn" onClick={() => fileRef.current?.click()} style={{ border: "1px dashed rgba(148,163,184,0.14)", borderRadius: "10px", padding: "10px 13px", display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", transition: "all 0.2s", background: "rgba(15,23,42,0.3)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>📄</div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8" }}>Carregar dados dos fornecedores</div>
              <div style={{ fontSize: "10px", color: "#475569" }}>PDF ou TXT · tarifas, condições, avaliações</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "10px", color: "#0EA5E9", fontWeight: "700", background: "rgba(14,165,233,0.1)", padding: "3px 8px", borderRadius: "5px", flexShrink: 0 }}>Upload</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      <div style={{ padding: "9px 13px 16px", borderTop: "1px solid rgba(148,163,184,0.07)" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.09)", borderRadius: "13px", padding: "8px 10px" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={docName ? `Perguntar sobre "${docName}"…` : "Escreve a tua pergunta…"} rows={1}
            style={{ flex: 1, background: "transparent", border: "none", color: "#F1F5F9", fontSize: "13px", lineHeight: "1.5", maxHeight: "88px", overflowY: "auto" }} />
          <button onClick={sendMessage} disabled={loading || (!input.trim() && !docData)}
            style={{ width: "33px", height: "33px", borderRadius: "8px", border: "none", background: loading || (!input.trim() && !docData) ? "rgba(100,116,139,0.22)" : "linear-gradient(135deg, #0EA5E9, #6366F1)", cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, transition: "all 0.2s", boxShadow: (!loading && (input.trim() || docData)) ? "0 0 11px rgba(14,165,233,0.3)" : "none" }}>↑</button>
        </div>
        <div style={{ textAlign: "center", fontSize: "9px", color: "#1E293B", marginTop: "5px" }}>Enter para enviar · Shift+Enter nova linha</div>
      </div>
    </div>
  );
}
