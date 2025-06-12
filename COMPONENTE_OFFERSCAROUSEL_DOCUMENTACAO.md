# OffersCarousel - Documentação Técnica Completa

> **⚠️ ATENÇÃO: Este componente está FINALIZADO e aprovado pelo usuário. NÃO alterar sem autorização expressa.**

## 📋 Visão Geral

O OffersCarousel é um componente React de carrossel de produtos em promoção para o site TurattiMT, totalmente funcional e otimizado.

## 🎯 Especificações Finais Aprovadas

### Layout e Dimensões

- **Cards**: 4 visíveis simultaneamente, altura fixa de 520px
- **Largura do card**: 256px + 40px de gap = 296px total
- **Navegação**: Automática a cada 4 segundos
- **Indicadores**: Máximo de 9 pontos de navegação

### Estrutura do Card (ordem dos elementos)

1. **Badge de desconto** (canto superior direito)
2. **Imagem do produto** (altura 192px)
3. **Título do produto** (min-height 2.5rem, line-clamp-2)
4. **Seção de preços** (min-height 4.5rem)
   - Preço original riscado
   - Preço promocional em azul
   - Valor da economia
5. **Contador regressivo** (tamanho "large", mb-0)
6. **Botão "Ver Produto"** (sempre na parte inferior)

### Sistema de Imagens

- **URLs funcionais**: Unsplash com dimensões 400x400
- **Fallback**: Placeholder SVG personalizado TURATTI
- **Função**: `construirUrlImagem()` suporta URLs completas e caminhos relativos
- **Tratamento de erro**: Automaticamente substitui por placeholder

### Formatação

- **Moeda**: Padrão brasileiro (R$ 1.234,56)
- **Função**: `formatarMoeda()` usando Intl.NumberFormat pt-BR
- **Desconto**: Calculado e exibido em porcentagem no badge

### Contador Regressivo

- **Tamanho**: "large" (px-4 py-3, text-base, icon w-5 h-5)
- **Cor**: Gradiente vermelho com animação pulse
- **Espaçamento**: Sem margem inferior (mb-0)
- **Posição**: Centralizado e com largura total

### Navegação

- **Auto-play**: 4 segundos por slide
- **Controles**: Setas laterais + indicadores
- **Limitação**: Máximo 9 indicadores para não sobrecarregar UI
- **Responsividade**: Pausa auto-play ao interagir, retoma após 8s

## 🗄️ Dados do Banco

### Produtos em Promoção

- **Total**: 15 produtos com promocao_mes = true
- **Período**: 20/01/2025 até 15/02/2025
- **Descontos**: 12% a 25% de desconto
- **Marcas**: Bosch, Black & Decker, Schulz, Bambozzi, Gedore, etc.

### Estrutura da Consulta

```sql
SELECT * FROM produtos
WHERE promocao_mes = true
AND promocao_data_fim IS NOT NULL
ORDER BY preco DESC
LIMIT 20
```

## 🎨 Classes CSS Principais

### Container

```css
.flex-shrink-0.w-64.h-[520px].bg-white.rounded-lg.border.border-gray-200;
```

### Imagem

```css
.h-48.bg-gray-50.p-4.relative.overflow-hidden.flex-shrink-0
```

### Contador

```css
.min-h-[3rem].flex.items-center.justify-center.mt-2.mb-0;
```

### Botão

```css
.w-full.bg-blue-600.hover: bg-blue-700.text-white.font-medium.py-2.px-4.rounded-lg;
```

## 🔧 Funcionalidades Implementadas

### ✅ Recursos Ativos

- [x] Carrossel infinito com duplicação automática
- [x] Auto-navegação com pausa inteligente
- [x] Contador regressivo em tempo real
- [x] Sistema de imagens com fallback
- [x] Formatação brasileira de moeda
- [x] Layout responsivo e padronizado
- [x] Loading states e empty states
- [x] Animações CSS personalizadas

### ❌ Recursos Removidos (por solicitação)

- [x] ~~Botão "Ver Produto" no hover da imagem~~
- [x] ~~Campo de categoria acima do título~~
- [x] ~~Espaçamento grande entre contador e botão~~

## 📱 Responsividade

- **Desktop**: 4 cards visíveis
- **Tablet**: Mantém 4 cards (scroll horizontal se necessário)
- **Mobile**: 4 cards com scroll lateral

## 🚀 Performance

- **Lazy loading**: Automático nas imagens
- **Memoização**: produtosDuplicados com React.useMemo
- **Debounce**: Auto-play inteligente com timers otimizados
- **Cleanup**: useEffect com limpeza de intervalos

## 🔄 Estados do Componente

1. **Loading**: Skeleton cards com animação
2. **Empty**: Mensagem quando não há promoções
3. **Populated**: Carrossel funcional com produtos
4. **Error**: Fallback para placeholder de imagens

## 📊 Métricas de Uso

- **Produtos exibidos**: 15 em rotação
- **Tempo de exibição**: 4s por slide
- **Navegação manual**: Pausa de 8s antes de retomar
- **Indicadores**: Limitados a 9 para UX otimizada

---

## ⚠️ IMPORTANTE

**Este componente está em estado FINAL e APROVADO. Qualquer alteração deve ser previamente autorizada pelo usuário responsável.**

**Arquivo**: `src/components/ui/OffersCarousel.tsx`
**Dependências**: `CountdownTimer.tsx`
**API**: `/api/produtos?promocao=true&limit=20`

---

_Documentação criada em: Janeiro 2025_
_Status: FINALIZADO E APROVADO_
