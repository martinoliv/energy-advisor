# ⚡ EnergyAdvisor - PWA

Agente de IA para análise de fornecedores de energia com **conformidade RGPD** completa.
Web app instalável em telemóveis e desktops como uma app nativa.

## ✨ Funcionalidades

- 🧾 Análise de fatura (PDF ou imagem)
- 📊 Comparação de fornecedores (Top 3)
- 📈 Gráfico comparativo
- ⚡ Simulador de consumo interativo
- 🔒 Conformidade RGPD total
- 📱 PWA - instalável em qualquer dispositivo
- 💾 Funciona offline (assets em cache)

---

## 📱 Como instalar (após deploy)

**Android (Chrome):**
1. Abre o site no Chrome
2. Toca no menu ⋮ → "Adicionar ao ecrã principal"
3. Aparece um ícone como uma app

**iOS (Safari):**
1. Abre o site no Safari
2. Toca no botão Partilhar 
3. Toca em "Adicionar ao ecrã principal"

**Desktop (Chrome/Edge):**
1. Abre o site
2. Aparece o ícone de instalar na barra de endereço
3. Clica para instalar como app desktop

---

## 🚀 Deploy na Vercel

### 1. Pré-requisitos
- Conta no GitHub e Vercel
- Node.js v18+
- API Key de console.anthropic.com

### 2. Deploy
```bash
npm install
git add .
git commit -m "deploy"
git push
```

Na Vercel, adiciona variável de ambiente:
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-...`

---

## 🗂 Estrutura

```
energy-advisor/
├── api/
│   ├── chat.js          ← Backend Vercel (produção)
│   └── server.js        ← Backend local (dev)
├── public/
│   ├── manifest.json    ← Configuração PWA
│   ├── sw.js            ← Service Worker
│   ├── icon-192.png     ← Ícone PWA
│   ├── icon-512.png     ← Ícone PWA
│   └── apple-touch-icon.png
├── src/
│   ├── App.jsx          ← App React + RGPD + PWA Install
│   └── main.jsx
├── index.html           ← PWA meta tags
├── package.json
├── vercel.json
└── .env.example
```

---

## 🔒 Conformidade RGPD

- Modal de consentimento obrigatório
- Processamento apenas durante a sessão
- Sem armazenamento de dados pessoais
- Direito de retirada de consentimento
- Headers de segurança no servidor

---

## 💻 Desenvolvimento local

**Terminal 1 (backend):**
```bash
node api/server.js
```

**Terminal 2 (frontend):**
```bash
npm run dev
```

Abrir http://localhost:5173

