# 📋 DOCUMENTAÇÃO OFICIAL - HEADER PADRÃO TURATTIMT

## 🚨 **AVISO IMPORTANTE**

**Este é o header PADRÃO e OFICIAL do projeto TurattiMT. NÃO deve ser modificado sem autorização expressa do proprietário do projeto.**

---

## 📊 **ESPECIFICAÇÕES TÉCNICAS**

### **Arquivo Principal**

- **Localização**: `src/components/ui/Header.tsx`
- **Tipo**: Componente React com TypeScript
- **Framework**: Next.js 15
- **Estilização**: TailwindCSS

### **Dependências**

```typescript
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
```

---

## 🎨 **DESIGN E LAYOUT**

### **Cores Padrão (Tailwind Blue)**

- **Primária**: `blue-600` (#2563eb)
- **Secundária**: `blue-500` (#3b82f6)
- **Backgrounds**: `blue-50`, `blue-100`
- **Transparências**: `blue-600/10`, `blue-500/50`

### **Estrutura Visual**

1. **Header Principal** (altura: `h-16` mobile, `h-20` desktop)
2. **Mega Menu Desktop** (altura: `h-14`)
3. **Menu Mobile** (altura variável com scroll)

### **Responsividade**

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 768px` (sm-md)
- **Desktop**: `> 768px` (md+)

---

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### **1. Logo Dinâmica**

- **API**: `/api/logos?tipo=azul&posicao=cabecalho`
- **Fallback**: Ícone SparklesIcon com "TurattiMT"
- **Tamanhos**: `h-10` (mobile) → `h-16` (desktop)

### **2. Campo de Busca**

- **Desktop**: Integrado na barra superior
- **Mobile**: Separado abaixo da logo
- **Funcionalidade**: Submit com handleSearch
- **Ícone**: Lupa sem bordas (apenas hover de cor)

### **3. Mega Menu Desktop**

- **Abertura**: Automática no hover (`onMouseEnter`/`onMouseLeave`)
- **Filtro**: Apenas categorias COM subcategorias
- **Layout**: Grid responsivo (2-4 colunas)
- **Animações**: Transições suaves de 300ms

### **4. Menu Mobile**

- **Toggle**: Botão hambúrguer/X
- **Scroll**: Altura máxima com overflow
- **Fechamento**: Automático ao clicar em links
- **Limite**: 8 subcategorias por categoria + "Ver todas"

### **5. Navegação Principal**

```typescript
const menuItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];
```

---

## 📱 **RESPONSIVIDADE DETALHADA**

### **Mobile (< 640px)**

- Logo: `h-10`, ícones `w-6 h-6`
- Padding: `px-4`, `py-2`
- Busca: Campo separado abaixo
- Menu: Overlay completo

### **Tablet (640px - 768px)**

- Logo: `h-16`, ícones `w-7 h-7`
- Padding: `px-6`, `py-4`
- Transição suave entre layouts

### **Desktop (> 768px)**

- Logo: `h-16`, ícones `w-6 h-6`
- Busca: Integrada na barra
- Mega menu: Dropdown completo

---

## 🎯 **CARACTERÍSTICAS ESPECIAIS**

### **Ícones com Presença Visual**

- **Stroke weight**: `stroke-2` em todos os ícones
- **Tamanhos aumentados**: Mais visibilidade
- **Shadows**: `shadow-sm hover:shadow-md` nos botões
- **Font weight**: `font-semibold` nos textos importantes

### **Animações e Transições**

- **Duração padrão**: 300ms
- **Easing**: `transition-all duration-300`
- **Hover states**: Cores e escalas suaves
- **Loading states**: Indicadores visuais

### **Filtros Inteligentes**

```typescript
// Apenas categorias com subcategorias aparecem
.filter((categoria) => categoria.subcategorias && categoria.subcategorias.length > 0)
```

---

## 🔌 **INTEGRAÇÕES API**

### **1. Logos**

```typescript
const fetchLogo = async () => {
  const response = await fetch("/api/logos?tipo=azul&posicao=cabecalho");
  const data = await response.json();
  setLogo(data.length > 0 ? data[0] : null);
};
```

### **2. Categorias**

```typescript
const fetchCategorias = async () => {
  const response = await fetch("/api/categorias?include_subcategorias=true");
  const data = await response.json();
  setCategorias(data);
};
```

---

## 🎨 **CLASSES TAILWIND PRINCIPAIS**

### **Container e Layout**

```css
sticky top-0 z-50
container mx-auto px-4 sm:px-6
flex items-center justify-between
```

### **Cores e Backgrounds**

```css
bg-white/95 backdrop-blur-md
bg-blue-600 text-white
hover:text-blue-600 hover:bg-blue-50
```

### **Responsividade**

```css
h-16 sm:h-20
w-6 h-6 sm:w-7 sm:h-7
px-4 sm:px-6 py-2 sm:py-4
```

---

## 📋 **ESTADOS E HOOKS**

### **Estados Principais**

```typescript
const [logo, setLogo] = useState<any>(null);
const [categorias, setCategorias] = useState<any[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);
```

### **Effects**

- **Scroll detection**: Para backdrop blur
- **Data fetching**: Logo e categorias
- **Cleanup**: Event listeners

---

## 🚀 **PERFORMANCE**

### **Otimizações Implementadas**

- **Lazy loading**: Componentes condicionais
- **Event delegation**: Handlers otimizados
- **CSS transitions**: Hardware acceleration
- **API caching**: Redução de requests

### **Bundle Size**

- **Heroicons**: Tree-shaking ativo
- **TailwindCSS**: Purge automático
- **TypeScript**: Compilação otimizada

---

## 🔒 **REGRAS DE PRESERVAÇÃO**

### **❌ PROIBIDO ALTERAR**

1. **Estrutura base** do componente
2. **Sistema de cores** (Tailwind Blue)
3. **Responsividade** implementada
4. **Funcionalidades** principais
5. **Integrações API** existentes

### **✅ PERMITIDO APENAS COM AUTORIZAÇÃO**

1. Ajustes de **conteúdo textual**
2. **Novos itens** de menu
3. **Melhorias de performance**
4. **Correções de bugs**
5. **Atualizações de dependências**

---

## 📞 **SUPORTE E MANUTENÇÃO**

### **Contato para Alterações**

- **Proprietário**: Autorização necessária
- **Tipo**: Solicitação formal
- **Documentação**: Atualização obrigatória

### **Versionamento**

- **Versão atual**: 1.0.0 (Padrão Oficial)
- **Próximas versões**: Apenas com aprovação
- **Rollback**: Sempre disponível

---

## 📝 **CHANGELOG**

### **v1.0.0 - VERSÃO PADRÃO OFICIAL**

- ✅ Header totalmente responsivo
- ✅ Ícones com presença visual aumentada
- ✅ Mega menu com filtro de categorias
- ✅ Menu mobile otimizado
- ✅ Integração completa com APIs
- ✅ Sistema de cores padronizado (Tailwind Blue)
- ✅ Animações e transições suaves
- ✅ Performance otimizada

---

## 🎯 **CONCLUSÃO**

Este header representa o **padrão oficial** do projeto TurattiMT, desenvolvido com as melhores práticas de:

- **UX/UI Design**
- **Responsividade**
- **Performance**
- **Acessibilidade**
- **Manutenibilidade**

**🚨 LEMBRE-SE: Qualquer alteração deve ser previamente autorizada para manter a integridade e qualidade do projeto.**

---

_Documentação criada em: Janeiro 2025_  
_Status: OFICIAL - NÃO MODIFICAR SEM AUTORIZAÇÃO_
