import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `És um especialista em energia e fornecedores de eletricidade/gás em Portugal e Europa.
Nunca guardes, repitas ou faças referência a dados pessoais do utilizador fora do contexto estritamente necessário para a análise. Trata toda a informação com confidencialidade máxima.

Tens dois modos:

--- MODO 1: ANÁLISE DE FATURA ---
Quando receberes uma fatura (PDF ou imagem):
1. Extrai: fornecedor atual, preço €/kWh, consumo mensal kWh, valor mensal €, potência kVA, tipo de tarifa
2. Compara com fornecedores portugueses (EDP, Galp, Iberdrola, Endesa, Gold Energy, etc.)
3. Calcula poupança potencial
4. Retorna OBRIGATORIAMENTE antes do texto:

<BILL_ANALYSIS>
{
  "fatura": {
    "fornecedor_atual": "Nome",
    "preco_kwh_atual": 0.1842,
    "consumo_mensal_kwh": 200,
    "valor_mensal_eur": 36.84,
    "potencia_kva": 6.9,
    "tipo_tarifa": "simples"
  },
  "alternativas": [
    {
      "rank": 1,
      "nome": "Fornecedor",
      "preco_kwh": 0.1720,
      "poupanca_mensal": 12.44,
      "poupanca_anual": 149.28,
      "energia_verde": 80,
      "fidelizacao_meses": 12,
      "pontos_fortes": ["Mais barato"],
      "recomendacao": "Melhor opção"
    }
  ]
}
</BILL_ANALYSIS>

--- MODO 2: LISTA DE FORNECEDORES ---
Retorna OBRIGATORIAMENTE antes do texto:
<SIMULATION_JSON>
[
  {
    "rank": 1,
    "nome": "Fornecedor",
    "preco_kwh": 0.1842,
    "energia_verde": 80,
    "avaliacao": 4.5,
    "fidelizacao_meses": 12,
    "poupanca_anual_estimada": 120,
    "pontos_fortes": ["Preço competitivo"],
    "pontos_fracos": ["Fidelização longa"],
    "recomendacao": "Melhor custo-benefício"
  }
]
</SIMULATION_JSON>

Responde sempre em português claro e amigável.`;

const MEDAL_COLORS = ["#F59E0B", "#94A3B8", "#B45309"];
const MEDAL_LABELS = ["🥇 Melhor Opção", "🥈 2ª Opção", "🥉 3ª Opção"];

function parseJSON(text, tag) {
  const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch { return null; }
}
function cleanText(text) {
  return text.replace(/<BILL_ANALYSIS>[\s\S]*?<\/BILL_ANALYSIS>/g, "").replace(/<SIMULATION_JSON>[\s\S]*?<\/SIMULATION_JSON>/g, "").trim();
}

// ─── RGPD: Modal de consentimento ───────────────────────────────────────────
function ConsentModal({ onAccept, onDecline }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "#0D1626", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "16px", maxWidth: "420px", width: "100%", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ fontSize: "22px" }}>🔒</div>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "#F1F5F9" }}>Privacidade e Proteção de Dados</div>
          </div>
          <div style={{ fontSize: "11px", color: "#475569", fontFamily: "monospace" }}>Regulamento (UE) 2016/679 — RGPD</div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.6", marginBottom: "14px" }}>
            Para analisar a tua fatura ou comparar fornecedores, este assistente processa temporariamente os dados do documento que carregas.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
            {[
              { icon: "✅", text: "Os dados são usados exclusivamente para análise nesta sessão" },
              { icon: "✅", text: "Nenhum dado pessoal é guardado, armazenado ou partilhado" },
              { icon: "✅", text: "A sessão termina quando fechas o browser" },
              { icon: "✅", text: "Não recolhemos nome, morada, NIF ou dados de pagamento" },
              { icon: "⚠️", text: "Recomendamos que redijas dados sensíveis (IBAN, etc.) antes de carregar" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "13px", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                <span style={{ fontSize: "12px", color: "#94A3B8", lineHeight: "1.5" }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Expandable legal */}
          <div onClick={() => setExpanded(e => !e)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: expanded ? "10px" : "0", color: "#0EA5E9", fontSize: "11px", fontWeight: "600" }}>
            <span style={{ transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(90deg)" : "none" }}>▶</span>
            Informação legal completa (RGPD Art. 13)
          </div>

          {expanded && (
            <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "8px", padding: "12px", fontSize: "11px", color: "#64748B", lineHeight: "1.7", marginBottom: "10px" }}>
              <strong style={{ color: "#94A3B8" }}>Responsável pelo tratamento:</strong> O operador desta aplicação.<br /><br />
              <strong style={{ color: "#94A3B8" }}>Finalidade:</strong> Análise comparativa de tarifas de energia elétrica e gás natural, exclusivamente para fornecer recomendações ao titular dos dados.<br /><br />
              <strong style={{ color: "#94A3B8" }}>Base jurídica:</strong> Consentimento do titular (Art. 6.º, n.º 1, al. a) do RGPD).<br /><br />
              <strong style={{ color: "#94A3B8" }}>Prazo de conservação:</strong> Os dados são processados em memória durante a sessão e eliminados automaticamente no seu término. Não existe persistência em base de dados.<br /><br />
              <strong style={{ color: "#94A3B8" }}>Transferências:</strong> O documento é enviado à API da Anthropic (EUA) para processamento por IA, ao abrigo de cláusulas contratuais-tipo (Art. 46.º do RGPD).<br /><br />
              <strong style={{ color: "#94A3B8" }}>Direitos:</strong> Tens direito de acesso, retificação, apagamento, portabilidade, limitação e oposição ao tratamento, nos termos dos Arts. 15.º a 22.º do RGPD. Podes também apresentar reclamação à CNPD (cnpd.pt).<br /><br />
              <strong style={{ color: "#94A3B8" }}>Retirada do consentimento:</strong> Podes retirar o consentimento a qualquer momento, cessando a utilização da aplicação.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={onAccept} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 20px rgba(14,165,233,0.3)" }}>
            ✓ Aceito — Iniciar análise
          </button>
          <button onClick={onDecline} style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "10px", color: "#64748B", fontSize: "12px", cursor: "pointer" }}>
            Recusar e sair
          </button>
          <div style={{ textAlign: "center", fontSize: "10px", color: "#334155", marginTop: "4px" }}>
            Ao aceitar, confirmas que leste e concordas com o tratamento descrito acima.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RGPD: Banner inferior ────────────────────────────────────────────────
function PrivacyBanner({ onRevoke }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ padding: "4px 13px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "10px" }}>🔒</span>
        <span style={{ fontSize: "10px", color: "#334155" }}>Sessão protegida · Dados não guardados</span>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span onClick={() => setShow(s => !s)} style={{ fontSize: "10px", color: "#475569", cursor: "pointer", textDecoration: "underline" }}>Privacidade</span>
        <span onClick={onRevoke} style={{ fontSize: "10px", color: "#EF4444", cursor: "pointer", textDecoration: "underline" }}>Retirar consentimento</span>
      </div>
      {show && (
        <div style={{ position: "fixed", bottom: "70px", left: "13px", right: "13px", background: "#0D1626", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "10px", padding: "12px", zIndex: 50, fontSize: "11px", color: "#64748B", lineHeight: "1.6", boxShadow: "0 -8px 24px rgba(0,0,0,0.4)" }}>
          <strong style={{ color: "#94A3B8" }}>Proteção de dados:</strong> Os documentos carregados são processados apenas durante esta sessão para fins de análise comparativa de energia. Nenhum dado é armazenado permanentemente. O processamento é realizado pela API Anthropic com base no teu consentimento (RGPD Art. 6.º al. a). Para reclamações: <span style={{ color: "#0EA5E9" }}>cnpd.pt</span>
          <div onClick={() => setShow(false)} style={{ marginTop: "8px", textAlign: "right", color: "#0EA5E9", cursor: "pointer", fontWeight: "600" }}>Fechar</div>
        </div>
      )}
    </div>
  );
}

// ─── Componentes de visualização ─────────────────────────────────────────
function BillCard({ fatura }) {
  return (
    <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#818CF8", fontWeight: "700", marginBottom: "10px", letterSpacing: "0.07em" }}>📄 A TUA FATURA ATUAL</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { label: "Fornecedor", value: fatura.fornecedor_atual, icon: "🏢" },
          { label: "Preço/kWh", value: fatura.preco_kwh_atual ? `${fatura.preco_kwh_atual.toFixed(4)} €` : "—", icon: "⚡" },
          { label: "Consumo mensal", value: fatura.consumo_mensal_kwh ? `${fatura.consumo_mensal_kwh} kWh` : "—", icon: "📊" },
          { label: "Valor mensal", value: fatura.valor_mensal_eur ? `${fatura.valor_mensal_eur.toFixed(2)} €` : "—", icon: "💶" },
          { label: "Potência", value: fatura.potencia_kva ? `${fatura.potencia_kva} kVA` : "—", icon: "🔌" },
          { label: "Tarifa", value: fatura.tipo_tarifa || "—", icon: "🕐" },
        ].map((item, i) => (
          <div key={i} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "8px", padding: "8px 10px", display: "flex", gap: "7px", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: "9px", color: "#475569" }}>{item.label}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#E2E8F0" }}>{String(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlternativeCards({ alternativas }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#475569", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.07em" }}>MELHORES ALTERNATIVAS PARA TI</div>
      {alternativas.map((f, i) => (
        <div key={i} style={{ background: i === 0 ? "rgba(245,158,11,0.08)" : "rgba(30,41,59,0.5)", border: `1px solid ${MEDAL_COLORS[i]}28`, borderLeft: `3px solid ${MEDAL_COLORS[i]}`, borderRadius: "11px", padding: "13px", marginBottom: "9px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: `${MEDAL_COLORS[i]}15`, padding: "3px 10px", borderBottomLeftRadius: "8px", fontSize: "9px", fontWeight: "700", color: MEDAL_COLORS[i] }}>{MEDAL_LABELS[i]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "4px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9" }}>{f.nome}</div>
              <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>{f.recomendacao}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "18px", fontWeight: "800", color: MEDAL_COLORS[i] }}>{f.preco_kwh ? `${f.preco_kwh.toFixed(4)} €` : "—"}</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>por kWh</div>
            </div>
          </div>
          {f.poupanca_anual && (
            <div style={{ margin: "10px 0", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#86EFAC" }}>💚 Poupança estimada</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#22C55E" }}>{Number(f.poupanca_anual).toFixed(0)} €/ano</div>
                <div style={{ fontSize: "9px", color: "#475569" }}>{f.poupanca_mensal ? `${Number(f.poupanca_mensal).toFixed(2)} €/mês` : ""}</div>
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", margin: "8px 0" }}>
            {[{ label: "Verde", value: `${f.energia_verde ?? "?"}%`, icon: "🌿" }, { label: "Fideliz.", value: `${f.fidelizacao_meses ?? "?"}m`, icon: "📅" }].map((item, j) => (
              <div key={j} style={{ background: "rgba(15,23,42,0.5)", borderRadius: "7px", padding: "6px", textAlign: "center" }}>
                <div style={{ fontSize: "13px" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#E2E8F0" }}>{item.value}</div>
                <div style={{ fontSize: "9px", color: "#64748B" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "9px", color: "#22C55E", marginBottom: "3px", fontWeight: "700" }}>✓ VANTAGENS</div>
          {(f.pontos_fortes || []).map((p, j) => <div key={j} style={{ fontSize: "10px", color: "#94A3B8", padding: "1px 0" }}>• {p}</div>)}
        </div>
      ))}
    </div>
  );
}

function PriceChart({ data }) {
  const max = Math.max(...data.map(d => d.preco_kwh || 0)) * 1.25 || 1;
  const W = 300, H = 100, padL = 8, padR = 8, barW = 60;
  const gap = (W - padL - padR - barW * 3) / 2;
  return (
    <div style={{ background: "rgba(15,23,42,0.6)", borderRadius: "10px", padding: "12px 10px 8px", marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#475569", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.08em" }}>COMPARATIVO DE PREÇO (€/kWh)</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} style={{ overflow: "visible" }}>
        {data.map((d, i) => {
          const bh = d.preco_kwh ? (d.preco_kwh / max) * H : 4;
          const x = padL + i * (barW + gap);
          const y = H - bh;
          return (
            <g key={i}>
              <rect x={x} y={0} width={barW} height={H} fill="rgba(30,41,59,0.5)" rx="5" />
              <rect x={x} y={y} width={barW} height={bh} fill={MEDAL_COLORS[i]} rx="5" opacity="0.85" />
              <text x={x + barW / 2} y={Math.max(y - 4, 10)} textAnchor="middle" fill={MEDAL_COLORS[i]} fontSize="9.5" fontWeight="700" fontFamily="monospace">{d.preco_kwh ? d.preco_kwh.toFixed(4) : "—"}</text>
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fill="#64748B" fontSize="9">{(d.nome || "").split(" ")[0]}</text>
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
  const results = data.map(f => ({ ...f, mensal: f.preco_kwh ? (f.preco_kwh * kwh).toFixed(2) : null, anual: f.preco_kwh ? (f.preco_kwh * kwh * 12).toFixed(2) : null }));
  const poupanca = results[0]?.anual && results[1]?.anual ? (parseFloat(results[1].anual) - parseFloat(results[0].anual)).toFixed(0) : null;
  return (
    <div style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(14,165,233,0.14)", borderRadius: "11px", padding: "13px", marginBottom: "10px" }}>
      <div style={{ fontSize: "10px", color: "#0EA5E9", fontWeight: "700", marginBottom: "10px", letterSpacing: "0.07em" }}>⚡ SIMULADOR DE CONSUMO</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <input type="range" min="50" max="800" step="10" value={kwh} onChange={e => setKwh(Number(e.target.value))} style={{ flex: 1, accentColor: "#0EA5E9", cursor: "pointer" }} />
        <div style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "7px", padding: "4px 10px", fontSize: "13px", fontWeight: "800", color: "#38BDF8", minWidth: "68px", textAlign: "center" }}>{kwh} kWh</div>
      </div>
      <div style={{ fontSize: "10px", color: "#334155", marginBottom: "10px" }}>Arrasta para ajustar</div>
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
          💚 Com <strong>{results[0]?.nome}</strong> poupas até <strong>{poupanca} €/ano</strong>
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
        <div key={i} style={{ background: i === 0 ? "rgba(245,158,11,0.08)" : "rgba(30,41,59,0.4)", border: `1px solid ${MEDAL_COLORS[i]}28`, borderLeft: `3px solid ${MEDAL_COLORS[i]}`, borderRadius: "11px", padding: "13px", marginBottom: "9px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: `${MEDAL_COLORS[i]}15`, padding: "3px 10px", borderBottomLeftRadius: "8px", fontSize: "9px", fontWeight: "700", color: MEDAL_COLORS[i] }}>{MEDAL_LABELS[i]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9" }}>{f.nome}</div>
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
              {(f.pontos_fortes || []).map((p, j) => <div key={j} style={{ fontSize: "10px", color: "#94A3B8" }}>• {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "9px", color: "#EF4444", marginBottom: "3px", fontWeight: "700" }}>✗ DESVANTAGENS</div>
              {(f.pontos_fracos || []).map((p, j) => <div key={j} style={{ fontSize: "10px", color: "#94A3B8" }}>• {p}</div>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  const billData = !isUser ? parseJSON(msg.content, "BILL_ANALYSIS") : null;
  const simData = !isUser ? parseJSON(msg.content, "SIMULATION_JSON") : null;
  const displayText = !isUser ? cleanText(msg.content) : msg.content;
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "14px" }}>
      {!isUser && <div style={{ width: "29px", height: "29px", borderRadius: "50%", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", marginRight: "8px", flexShrink: 0, marginTop: "3px" }}>⚡</div>}
      <div style={{ maxWidth: "88%" }}>
        {billData && <div><BillCard fatura={billData.fatura} />{billData.alternativas && <AlternativeCards alternativas={billData.alternativas} />}</div>}
        {simData && <SimulationCards data={simData} />}
        {displayText && (
          <div style={{ background: isUser ? "linear-gradient(135deg, #0EA5E9, #6366F1)" : "rgba(30,41,59,0.8)", color: "#F1F5F9", padding: "10px 13px", borderRadius: isUser ? "17px 17px 4px 17px" : "17px 17px 17px 4px", fontSize: "13px", lineHeight: "1.65", border: isUser ? "none" : "1px solid rgba(148,163,184,0.07)", whiteSpace: "pre-wrap" }}>
            {displayText}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────
export default function EnergyAgent() {
  const [consent, setConsent] = useState(null); // null=pending, true=accepted, false=declined
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Olá! 👋 Sou o teu assistente especialista em energia.\n\n🧾 Carrega a tua fatura (PDF ou imagem) — analiso e comparo com o mercado\n📊 Ou carrega uma lista de fornecedores — mostro o Top 3 com simulador\n\nO que preferes fazer?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docData, setDocData] = useState(null);
  const [docName, setDocName] = useState(null);
  const [docType, setDocType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef(null);
  const billRef = useRef(null);
  const suppRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  if (consent === false) {
    return (
      <div style={{ minHeight: "100vh", background: "#020B18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#94A3B8", textAlign: "center", padding: "32px" }}>
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#F1F5F9", marginBottom: "8px" }}>Consentimento não dado</div>
          <div style={{ fontSize: "13px", marginBottom: "24px" }}>Sem o teu consentimento não é possível processar documentos de energia.</div>
          <button onClick={() => setConsent(null)} style={{ padding: "10px 20px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "8px", color: "#0EA5E9", cursor: "pointer", fontSize: "13px" }}>
            Rever consentimento
          </button>
        </div>
      </div>
    );
  }

  function handleFile(file, mode) {
    if (!file) return;
    setDocName(file.name);
    setDocType(mode);
    setShowMenu(false);
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = e => {
      if (isPDF || isImage) setDocData({ type: isPDF ? "pdf" : "image", base64: e.target.result.split(",")[1], mediaType: file.type });
      else setDocData({ type: "text", content: e.target.result });
    };
    (isPDF || isImage) ? reader.readAsDataURL(file) : reader.readAsText(file);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text && !docData) return;
    const userMessage = docData && docType === "bill" ? (text || `Analisa a minha fatura "${docName}" e diz-me onde posso poupar.`) : docData && docType === "suppliers" ? (text || `Analisa os fornecedores do ficheiro "${docName}" e dá-me o Top 3.`) : text;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    const apiHistory = messages.slice(1).map(m => ({ role: m.role, content: cleanText(m.content) || m.content }));
    let userContent;
    if (docData) {
      if (docData.type === "pdf") userContent = [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: docData.base64 } }, { type: "text", text: userMessage }];
      else if (docData.type === "image") userContent = [{ type: "image", source: { type: "base64", media_type: docData.mediaType, data: docData.base64 } }, { type: "text", text: userMessage }];
      else userContent = `${userMessage}\n\n--- DOCUMENTO ---\n${docData.content}`;
      setDocData(null);
      setDocName(null);
      setDocType(null);
    } else { userContent = userMessage; }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, system: SYSTEM_PROMPT, messages: [...apiHistory, { role: "user", content: userContent }] })
      });
      const rawText = await res.text();
      if (!rawText || rawText.trim() === "") throw new Error("Resposta vazia. Tenta novamente.");
      let data;
      try { data = JSON.parse(rawText); } catch { throw new Error(`Resposta inválida do servidor.`); }
      if (!res.ok) throw new Error(data?.error?.message || `Erro HTTP ${res.status}`);
      const reply = data.content?.find(b => b.type === "text")?.text || "Sem resposta. Tenta novamente.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${err.message}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020B18", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#F1F5F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#1E3A5F;border-radius:4px}
        textarea{resize:none;font-family:inherit}
        textarea:focus{outline:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg-in{animation:slideUp 0.25s ease}
        .menu-opt:hover{background:rgba(255,255,255,0.04)!important}
        input[type=range]{height:4px;border-radius:4px}
      `}</style>

      {consent === null && <ConsentModal onAccept={() => setConsent(true)} onDecline={() => setConsent(false)} />}

      {/* Header */}
      <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(148,163,184,0.07)", background: "rgba(2,11,24,0.97)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ width: "37px", height: "37px", borderRadius: "10px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 0 16px rgba(14,165,233,0.22)", flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "15px", letterSpacing: "-0.025em" }}>Energy<span style={{ color: "#0EA5E9" }}>Advisor</span></div>
          <div style={{ fontSize: "9px", color: "#334155", fontFamily: "monospace" }}>FATURA · TOP 3 · SIMULADOR</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          {docName && (
            <div style={{ background: docType === "bill" ? "rgba(99,102,241,0.1)" : "rgba(14,165,233,0.08)", border: `1px solid ${docType === "bill" ? "rgba(99,102,241,0.3)" : "rgba(14,165,233,0.22)"}`, borderRadius: "7px", padding: "3px 8px", fontSize: "10px", color: docType === "bill" ? "#818CF8" : "#38BDF8", display: "flex", alignItems: "center", gap: "5px" }}>
              {docType === "bill" ? "🧾" : "📊"} {docName.length > 14 ? docName.slice(0, 14) + "…" : docName}
              <span onClick={() => { setDocName(null); setDocData(null); setDocType(null); }} style={{ cursor: "pointer", color: "#475569", fontWeight: "800" }}>✕</span>
            </div>
          )}
          <div title="Sessão protegida RGPD" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "6px", padding: "3px 7px", fontSize: "10px", color: "#22C55E", fontWeight: "600" }}>🔒 RGPD</div>
        </div>
      </div>

      {/* Messages */}
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

      {/* Upload menu */}
      {!docName && (
        <div style={{ padding: "0 13px 4px", position: "relative" }}>
          {showMenu && (
            <div style={{ position: "absolute", bottom: "calc(100% + 4px)", left: "13px", right: "13px", background: "#0D1626", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px", overflow: "hidden", zIndex: 20, boxShadow: "0 -8px 24px rgba(0,0,0,0.4)" }}>
              {[
                { ref: billRef, mode: "bill", icon: "🧾", color: "#818CF8", title: "A minha fatura de energia", desc: "PDF ou imagem · analiso e comparo com o mercado", accept: ".pdf,image/*" },
                { ref: suppRef, mode: "suppliers", icon: "📊", color: "#0EA5E9", title: "Lista de fornecedores", desc: "TXT, CSV ou PDF com dados dos fornecedores", accept: ".pdf,.txt,.csv" },
              ].map((opt, i) => (
                <div key={opt.mode}>
                  <div className="menu-opt" onClick={() => opt.ref.current?.click()} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "11px", cursor: "pointer", transition: "background 0.15s", borderBottom: i === 0 ? "1px solid rgba(148,163,184,0.07)" : "none" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${opt.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{opt.icon}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: opt.color }}>{opt.title}</div>
                      <div style={{ fontSize: "10px", color: "#475569", marginTop: "1px" }}>{opt.desc}</div>
                    </div>
                  </div>
                  <input ref={opt.ref} type="file" accept={opt.accept} style={{ display: "none" }} onChange={e => handleFile(e.target.files[0], opt.mode)} />
                </div>
              ))}
            </div>
          )}
          <div onClick={() => setShowMenu(m => !m)} style={{ border: `1px dashed ${showMenu ? "rgba(14,165,233,0.4)" : "rgba(148,163,184,0.14)"}`, borderRadius: "10px", padding: "10px 13px", display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", transition: "all 0.2s", background: showMenu ? "rgba(14,165,233,0.04)" : "rgba(15,23,42,0.3)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>📎</div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8" }}>Carregar documento</div>
              <div style={{ fontSize: "10px", color: "#475569" }}>Fatura de energia ou lista de fornecedores</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "13px", color: "#475569", transition: "transform 0.2s", transform: showMenu ? "rotate(180deg)" : "none" }}>▾</div>
          </div>
        </div>
      )}

      {/* Privacy banner */}
      <PrivacyBanner onRevoke={() => setConsent(null)} />

      {/* Input */}
      <div style={{ padding: "8px 13px 14px", borderTop: "1px solid rgba(148,163,184,0.07)" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.09)", borderRadius: "13px", padding: "8px 10px" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={docName ? `Perguntar sobre "${docName}"…` : "Escreve a tua pergunta…"}
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", color: "#F1F5F9", fontSize: "13px", lineHeight: "1.5", maxHeight: "88px", overflowY: "auto" }} />
          <button onClick={sendMessage} disabled={loading || (!input.trim() && !docData)}
            style={{ width: "33px", height: "33px", borderRadius: "8px", border: "none", background: loading || (!input.trim() && !docData) ? "rgba(100,116,139,0.22)" : "linear-gradient(135deg, #0EA5E9, #6366F1)", cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, transition: "all 0.2s", boxShadow: (!loading && (input.trim() || docData)) ? "0 0 11px rgba(14,165,233,0.3)" : "none" }}>↑</button>
        </div>
        <div style={{ textAlign: "center", fontSize: "9px", color: "#1E293B", marginTop: "5px" }}>Enter para enviar · Shift+Enter nova linha</div>
      </div>
    </div>
  );
}
