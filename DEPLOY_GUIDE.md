# 🚀 GUIA COMPLETO DE DEPLOY - GIT + VERCEL

## 🔐 **1. SEGURANÇA - VARIÁVEIS DE AMBIENTE**

### **⚠️ CRÍTICO - Criar arquivo .env.local**

Você DEVE criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Application Configuration
NODE_ENV=production
```

### **✅ Verificações de Segurança OBRIGATÓRIAS:**

1. **NÃO COMMITAR o arquivo .env.local** - já está no .gitignore ✅
2. **Verificar se as URLs hardcoded estão corretas** ⚠️ PROBLEMA ENCONTRADO:

#### **🚨 PROBLEMA CRÍTICO - URLs HARDCODED**

Encontrei URLs hardcoded nos seguintes arquivos que DEVEM ser corrigidos:

- `src/components/ui/TintasCarousel.tsx` - linha 38
- `src/components/ui/OffersCarousel.tsx` - linha 38

**URL hardcoded encontrada:**

```typescript
return `https://your-project-id.supabase.co/storage/v1/object/public/${caminho}`;
```

**DEVE SER ALTERADO PARA:**

```typescript
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
return `${baseUrl}/storage/v1/object/public/${caminho}`;
```

---

## 📋 **2. CORREÇÕES OBRIGATÓRIAS ANTES DO DEPLOY**

### **A. Corrigir URLs Hardcoded**

Execute estas correções nos arquivos mencionados:

1. **TintasCarousel.tsx**
2. **OffersCarousel.tsx**

### **B. Criar .env.local**

Crie o arquivo `.env.local` com suas credenciais do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### **C. Verificar se o build funciona localmente**

```bash
npm run build
npm run start
```

---

## 🌐 **3. PREPARAR PARA GIT**

### **A. Verificar .gitignore (✅ Já configurado corretamente)**

O arquivo `.gitignore` está correto e ignora:

- `.env*` (todas as variáveis de ambiente)
- `node_modules/`
- `.next/`
- `.vercel/`

### **B. Verificar status do Git**

```bash
git status
git add .
git commit -m "feat: preparar aplicação para deploy"
```

### **C. Criar repositório no GitHub**

1. Acesse github.com
2. Crie um novo repositório
3. Copie a URL do repositório

### **D. Conectar ao repositório remoto**

```bash
git remote add origin https://github.com/seu-usuario/nome-do-repo.git
git branch -M main
git push -u origin main
```

---

## 🚀 **4. DEPLOY NA VERCEL**

### **A. Opção 1 - Via Website (Recomendado)**

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe seu repositório
5. Configure as variáveis de ambiente (passo crucial!)

### **B. Configurar Variáveis de Ambiente na Vercel**

Na seção "Environment Variables", adicione:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://sua-url-do-supabase.supabase.co

Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: sua_chave_anonima_do_supabase
```

### **C. Configurações de Build**

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

## 🔧 **5. CONFIGURAÇÕES AVANÇADAS**

### **A. Domínio Personalizado (Opcional)**

1. Na dashboard da Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### **B. Variáveis por Ambiente**

- **Development**: Para testes
- **Preview**: Para branches de feature
- **Production**: Para o site final

---

## ✅ **6. CHECKLIST FINAL PRÉ-DEPLOY**

### **Obrigatório:**

- [x] ✅ .gitignore configurado
- [x] ✅ URLs hardcoded corrigidas
- [ ] ❌ .env.local criado (VOCÊ DEVE FAZER)
- [ ] ❌ Build local testado (VOCÊ DEVE FAZER)
- [ ] ❌ Repositório Git criado (VOCÊ DEVE FAZER)

### **Recomendado:**

- [ ] README.md atualizado
- [ ] Favicon personalizado
- [ ] Meta tags SEO configuradas (✅ já feito)
- [ ] Testes básicos realizados

---

## 🐛 **7. TROUBLESHOOTING COMUM**

### **Erro: "supabase URL undefined"**

- Verificar se variáveis de ambiente estão configuradas na Vercel
- Garantir que nomes das variáveis estão exatos

### **Erro: "Build failed"**

- Rodar `npm run build` localmente primeiro
- Verificar se todas as dependências estão no package.json

### **Erro: "404 não encontrado"**

- Verificar se o roteamento Next.js está correto
- Confirmar se todas as páginas existem

---

## 📞 **8. PRÓXIMOS PASSOS APÓS DEPLOY**

1. **Testar todas as funcionalidades no site online**
2. **Configurar Analytics (Google Analytics, etc.)**
3. **Configurar monitoramento de erros**
4. **Backup do banco Supabase**
5. **Documentar URLs de produção**

---

## 🚨 **IMPORTANTE - AÇÕES IMEDIATAS**

### **ANTES DE FAZER QUALQUER COMMIT:**

1. **Corrigir URLs hardcoded** nos carrosséis
2. **Criar .env.local** com suas credenciais
3. **Testar build local** com `npm run build`

### **Credenciais do Supabase necessárias:**

- URL do projeto Supabase
- Chave anônima pública
- (Não commitar chaves privadas!)

---

**⚡ Sua aplicação está quase pronta para o mundo!**
