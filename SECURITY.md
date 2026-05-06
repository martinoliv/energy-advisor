# 🔒 Auditoria de Segurança — EnergyAdvisor

**Data da auditoria:** Maio 2026
**Versão:** 2.0 (Hardened)

---

## ✅ Defesas implementadas

### 1. Proteção da API Key
| Camada | Implementação |
|---|---|
| Storage | `process.env.ANTHROPIC_API_KEY` (server-side only) |
| Exposure | **Nunca** enviada ao browser |
| Logs | Não aparece em logs |
| Git | `.env.local` no `.gitignore` |

### 2. Rate Limiting
| Limite | Valor |
|---|---|
| Por minuto/IP | 10 pedidos |
| Por hora/IP | 60 pedidos |
| Resposta excedida | HTTP 429 com `Retry-After` |
| Storage | In-memory (sem dependências externas) |

### 3. Validação de Input
- ✅ Tipos permitidos: apenas `text`, `image`, `document`
- ✅ MIME types: apenas `image/jpeg|png|gif|webp` e `application/pdf`
- ✅ Tamanho máximo de ficheiro: 8 MB
- ✅ Tamanho máximo de mensagem: 50.000 caracteres
- ✅ Total de texto: máximo 200.000 caracteres
- ✅ Máximo de mensagens por pedido: 20
- ✅ Validação de role: apenas `user` ou `assistant`
- ✅ Base64 verificado antes de processar

### 4. CORS Restritivo
- ✅ Lista branca de origens permitidas
- ✅ Origens não autorizadas → HTTP 403
- ✅ Header `Vary: Origin` para cache correto
- ✅ Preflight OPTIONS suportado

### 5. Headers de Segurança
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cache-Control: no-store, no-cache, must-revalidate, private
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: (configurada por página)
```

### 6. Defesa contra Prompt Injection
- ✅ **System prompt fixo no servidor** — utilizador não pode alterá-lo
- ✅ Qualquer `system` enviado pelo cliente é **ignorado**
- ✅ System prompt instrui a IA a não executar instruções dentro de documentos
- ✅ Sanitização da saída (apenas `text` blocks reconhecidos)

### 7. Defesa contra DoS
- ✅ Tamanho máximo do body verificado durante streaming
- ✅ Conexão fechada se ultrapassar limite (HTTP 413)
- ✅ Rate limiting por IP
- ✅ Cleanup automático de buckets antigos

### 8. Privacidade & RGPD
- ✅ Modal de consentimento obrigatório
- ✅ Dados processados em memória, nunca persistidos
- ✅ Direito de retirada de consentimento
- ✅ IPs são hashados antes de logging
- ✅ Sem cookies de tracking
- ✅ Sem analytics externos
- ✅ Service Worker não cacheia dados pessoais

### 9. Logging Seguro
- ✅ IPs hashados (não em claro)
- ✅ Sem PII nos logs
- ✅ Não logga conteúdo de mensagens
- ✅ Erros internos genéricos para o utilizador
- ✅ Detalhes técnicos só em `console.error` (server-side)

### 10. Sanitização de Output
- ✅ Filtra resposta da API antes de devolver
- ✅ Apenas campos esperados (`content`, `stop_reason`)
- ✅ Apenas blocos de tipo `text` com strings válidas
- ✅ Mensagens de erro genéricas (não vaza detalhes da API)

---

## 🛡️ Modelo de ameaças mitigado

| Ameaça | Mitigação |
|---|---|
| Roubo de API Key | Server-side only, nunca exposta |
| CSRF (Cross-Site Request Forgery) | CORS + Origin check + SameSite |
| XSS | CSP + `nosniff` + sanitização |
| Clickjacking | `X-Frame-Options: DENY` |
| Prompt Injection | System prompt fixo + instruções defensivas |
| DoS por payload grande | Limite de 8 MB + streaming check |
| DoS por flooding | Rate limit (10/min, 60/hora) |
| MITM | HSTS + HTTPS forçado |
| Information disclosure | Erros genéricos, sem stack traces |
| Privacy leak | Sem persistência, IPs hashados |

---

## ⚠️ Limitações conhecidas

1. **Rate limit in-memory** — não escala entre instâncias da Vercel.
   *Mitigação futura:* migrar para Vercel KV ou Upstash Redis.

2. **Sem autenticação de utilizador** — qualquer pessoa pode usar a app.
   *Mitigação futura:* adicionar magic link ou OAuth se necessário.

3. **CSP com `unsafe-inline`** — necessário para o React inline styles atual.
   *Mitigação futura:* extrair styles para CSS modules.

4. **API key partilhada por todos** — custo agregado.
   *Mitigação futura:* tier de utilizador com keys próprias para uso intensivo.

---

## 🔍 Como reportar vulnerabilidades

Encontraste um problema de segurança?
1. **NÃO** abras issue público no GitHub
2. Envia email a security@[teu-domínio].pt
3. Inclui passos para reproduzir
4. Aguarda 48h para resposta inicial

Política de divulgação responsável: 90 dias.

---

## 📋 Checklist de manutenção

A executar **trimestralmente**:

- [ ] Atualizar dependências (`npm audit`)
- [ ] Revisar logs de rate limiting
- [ ] Verificar lista de origens permitidas
- [ ] Testar fluxo de retirada de RGPD
- [ ] Rodar API key da Anthropic
- [ ] Rever política de privacidade
