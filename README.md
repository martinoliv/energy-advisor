# ⚡ EnergyAdvisor

Agente de IA para análise de fornecedores de energia com Top 3, gráfico comparativo e simulador de consumo.

---

## 🚀 Deploy na Vercel (passo a passo)

### 1. Pré-requisitos
- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com) (gratuita)
- [Node.js](https://nodejs.org) instalado (v18+)
- API Key da Anthropic: [console.anthropic.com](https://console.anthropic.com)

---

### 2. Preparar o projeto

```bash
# Instalar dependências
npm install

# Testar localmente (opcional)
cp .env.example .env.local
# Edita .env.local e coloca a tua ANTHROPIC_API_KEY
npm run dev
```

---

### 3. Colocar no GitHub

```bash
# Na pasta do projeto
git init
git add .
git commit -m "first commit"

# Cria um repositório no github.com e depois:
git remote add origin https://github.com/SEU_USER/energy-advisor.git
git push -u origin main
```

---

### 4. Deploy na Vercel

**Opção A — Interface web (mais fácil):**
1. Vai a [vercel.com](https://vercel.com) → "Add New Project"
2. Importa o teu repositório do GitHub
3. Nas configurações, adiciona a variável de ambiente:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (a tua chave)
4. Clica em **Deploy** ✅

**Opção B — CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
# Quando perguntar sobre variáveis de ambiente, adiciona ANTHROPIC_API_KEY
```

---

### 5. Resultado

A Vercel dá-te uma URL tipo:
```
https://energy-advisor-xyz.vercel.app
```

Partilha com quem quiseres! 🎉

---

## 🗂 Estrutura do projeto

```
energy-advisor/
├── api/
│   └── chat.js          ← Backend seguro (API key aqui)
├── src/
│   ├── App.jsx           ← Frontend React
│   └── main.jsx          ← Entry point
├── index.html
├── package.json
├── vercel.json           ← Config da Vercel
├── vite.config.js
└── .env.example          ← Exemplo de variáveis de ambiente
```

---

## 🔒 Segurança

- A `ANTHROPIC_API_KEY` **nunca** é exposta ao browser
- O frontend chama `/api/chat` (o nosso servidor)
- O servidor é que chama a API da Anthropic com a key
- O ficheiro `.env.local` está no `.gitignore` (nunca vai para o GitHub)

---

## 📄 Formato do documento a carregar

```
Fornecedor: EDP Comercial
Preço: 0.1842 €/kWh
Energia Verde: 100%
Avaliação: 4.2/5
Fidelização: 12 meses
Extras: Desconto 10% nos primeiros 3 meses

Fornecedor: Galp Energia
Preço: 0.1765 €/kWh
Energia Verde: 60%
Avaliação: 3.8/5
Fidelização: 24 meses
```
