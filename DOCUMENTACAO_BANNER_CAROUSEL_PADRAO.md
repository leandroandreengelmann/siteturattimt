# 📋 DOCUMENTAÇÃO OFICIAL - BANNER CAROUSEL PADRÃO TURATTIMT

**STATUS: OFICIAL - NÃO MODIFICAR SEM AUTORIZAÇÃO**  
**Versão:** 1.1.0 (Padrão Oficial - FINAL)  
**Data:** 11 de Junho de 2025  
**Componente:** BannerCarousel  
**PROTEÇÃO:** Componente finalizado e protegido pelo usuário

---

## 🎯 ESPECIFICAÇÕES TÉCNICAS

### Localização

- **Arquivo:** `src/components/ui/BannerCarousel.tsx`
- **Tipo:** Componente Client-Side React
- **Framework:** Next.js 15 + TypeScript
- **Estilo:** TailwindCSS

### Dependências

```typescript
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
```

---

## 🎨 DESIGN E LAYOUT

### Características Visuais

- **Altura fixa:** 500px (conforme especificação)
- **Largura:** 100% da tela (responsivo)
- **Tema:** Neutro com fundo escuro (bg-gray-900)
- **Efeitos:** SEM hover/zoom (removido conforme solicitação)
- **Transições:** Suaves nos controles e indicadores

### Estrutura Visual

```
┌─────────────────────────────────────┐
│          BANNER PRINCIPAL           │
│        (500px altura fixa)          │
│                                     │
│  [◀]              [▶]              │ ← Controles (hover)
│                                     │
│  Título do Banner                   │
│  Descrição (se disponível)          │
│                                     │
│       ● ○ ○ ○                      │ ← Indicadores
└─────────────────────────────────────┘
```

---

## ⚙️ FUNCIONALIDADES

### 1. Carregamento de Dados

- **API:** `/api/banners`
- **Filtro:** Apenas banners ativos (`ativo: true`)
- **Ordenação:** Campo `ordem` (ascendente)
- **Cache:** Não implementado (busca direta)

### 2. Auto-Navegação

- **Intervalo:** 5 segundos entre transições
- **Pausa:** 10 segundos após interação manual
- **Condição:** Só funciona com 2+ banners

### 3. Controles Manuais

- **Botões anterior/próximo:** Aparecem no hover
- **Indicadores:** Pontos clicáveis na parte inferior
- **Gestos:** Não implementado (apenas controles visuais)

### 4. Estados do Componente

- **Loading:** Esqueleto animado com pulse
- **Vazio:** Mensagem amigável com ícone
- **Erro:** Capturado no console
- **Funcionando:** Carrossel completo

---

## 📊 INTERFACE DE DADOS

### Tipo Banner

```typescript
interface Banner {
  id: number;
  titulo: string;
  descricao?: string;
  imagem_url: string;
  link_destino?: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}
```

### Campos Obrigatórios

- `id`: Identificador único
- `titulo`: Título do banner
- `imagem_url`: URL da imagem
- `ativo`: Status de ativação
- `ordem`: Ordem de exibição

### Campos Opcionais

- `descricao`: Texto adicional
- `link_destino`: URL para redirecionamento

---

## 🔧 INTEGRAÇÃO COM APIs

### Endpoint Principal

```
GET /api/banners
```

### Resposta Esperada

```json
[
  {
    "id": 1,
    "titulo": "Banner Principal",
    "descricao": "Descrição do banner",
    "imagem_url": "https://exemplo.com/banner.jpg",
    "link_destino": "https://exemplo.com/destino",
    "ativo": true,
    "ordem": 1,
    "created_at": "2025-06-11T12:00:00Z",
    "updated_at": "2025-06-11T12:00:00Z"
  }
]
```

---

## 📱 RESPONSIVIDADE

### Comportamento

- **Mobile:** Altura mantida (500px), controles adaptados
- **Tablet:** Funcionalidade completa
- **Desktop:** Experiência otimizada com hover

### Controles Adaptativos

- **Botões:** Sempre visíveis em mobile
- **Indicadores:** Espaçamento otimizado
- **Texto:** Tamanhos responsivos (`text-3xl md:text-5xl`)

---

## 🎪 COMPORTAMENTOS ESPECIAIS

### 1. Links Externos

- **Condição:** Se `link_destino` estiver preenchido
- **Comportamento:** `target="_blank"` + `rel="noopener noreferrer"`
- **Área clicável:** Imagem inteira

### 2. Overlay de Conteúdo

- **Gradiente:** `bg-gradient-to-t from-black/50`
- **Posição:** Parte inferior do banner
- **Conteúdo:** Título + descrição (se disponível)

### 3. Controles de Navegação

- **Visibilidade:** `opacity-0 group-hover:opacity-100`
- **Estilo:** Backdrop blur com transparência
- **Posição:** Centralizado verticalmente nas laterais

---

## 🎨 CLASSES TAILWIND UTILIZADAS

### Container Principal

```css
relative w-full h-[500px] overflow-hidden bg-gray-900 group
```

### Imagens

```css
w-full h-full object-cover
```

### Controles

```css
absolute left-4 top-1/2 transform -translate-y-1/2 p-3
bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full
transition-all duration-300 opacity-0 group-hover:opacity-100
```

### Indicadores

```css
w-3 h-3 rounded-full transition-all duration-300
bg-white/50 (inativo) | bg-white (ativo)
```

---

## 🚀 USO E IMPLEMENTAÇÃO

### Importação

```typescript
import BannerCarousel from "@/components/ui/BannerCarousel";
```

### Uso Básico

```typescript
export default function Page() {
  return (
    <div>
      <Header />
      <BannerCarousel />
      <main>{/* Conteúdo da página */}</main>
    </div>
  );
}
```

### Posicionamento Recomendado

- **Após:** Componente Header
- **Antes:** Conteúdo principal da página
- **Largura:** 100% (sem containers limitadores)

---

## 🔒 REGRAS DE PRESERVAÇÃO - COMPONENTE PROTEGIDO

### ❌ COMPONENTE FINALIZADO - NÃO ALTERAR

**⚠️ IMPORTANTE:** Este componente foi finalizado pelo usuário e está completamente protegido.

- **QUALQUER ALTERAÇÃO** requer autorização explícita do usuário
- Altura fixa de 500px
- Estrutura de dados da interface Banner
- Auto-navegação de 5 segundos
- Integração com `/api/banners`
- Comportamento de links externos
- Estados de loading/vazio/erro
- Layout e visual
- Lógica de funcionamento
- Classes CSS e estilos

### ✅ PERMITIDO APENAS

- Alteração de conteúdo via banco de dados
- Ordem dos banners (campo `ordem`)
- Status ativo/inativo (campo `ativo`)

### 🔧 MANUTENÇÕES CRÍTICAS

**Apenas com autorização expressa:**

- Correção de bugs críticos
- Atualizações de segurança

---

## 📈 VERSIONAMENTO

### v1.0.0 (Atual)

- ✅ Altura fixa de 500px
- ✅ Integração completa com API
- ✅ Auto-navegação funcional
- ✅ Controles manuais
- ✅ Estados de loading/vazio
- ✅ Links externos seguros
- ✅ Responsividade completa
- ✅ Hover removido das imagens

### Próximas Versões

- Implementação de gestos touch
- Cache de dados
- Lazy loading de imagens
- Suporte a vídeos

---

## 🔍 TROUBLESHOOTING

### Problemas Comuns

1. **Banners não aparecem**

   - Verificar API `/api/banners`
   - Confirmar banners ativos no banco
   - Checar campo `ordem`

2. **Auto-navegação não funciona**

   - Verificar se há 2+ banners
   - Confirmar estado `isAutoPlaying`

3. **Imagens não carregam**

   - Validar URLs no campo `imagem_url`
   - Verificar CORS se externas

4. **Links não redirecionam**
   - Confirmar campo `link_destino`
   - Testar URLs manualmente

---

## 📞 SUPORTE

**Desenvolvedor:** Assistente IA  
**Projeto:** TurattiMT Web  
**Contato:** Via sistema de desenvolvimento

**IMPORTANTE:** Este é o componente de banner PADRÃO do site. Qualquer modificação deve ser previamente autorizada e documentada.
