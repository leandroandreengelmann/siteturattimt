# 🏗️ TurattiMT - E-commerce de Materiais de Construção

Site moderno e responsivo para venda de materiais de construção, desenvolvido com Next.js 15, TypeScript e TailwindCSS.

## ✨ Funcionalidades

- **🛒 E-commerce Completo** - Catálogo de produtos com categorias
- **🔍 Busca Inteligente** - Autocomplete com sugestões em tempo real
- **🎠 Carrosséis Interativos** - Ofertas, novidades, tintas e elétricos
- **📱 Design Responsivo** - Otimizado para todos os dispositivos
- **⚡ Performance** - Carregamento rápido e otimizado
- **🎨 Animações Fluidas** - Transições suaves e micro-interações
- **🔒 Segurança** - Headers de segurança e validação de dados

## 🛠️ Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/) - Framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [TailwindCSS 4](https://tailwindcss.com/) - Framework CSS utilitário
- [Supabase](https://supabase.com/) - Backend as a Service
- [Heroicons](https://heroicons.com/) - Biblioteca de ícones
- [Vercel](https://vercel.com/) - Plataforma de deploy

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18.x ou superior
- npm, yarn ou pnpm

### Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd turattimt
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp env.example .env.local
   ```

   Edite o arquivo `.env.local` com suas credenciais do Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

4. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

5. **Abra no navegador**

   Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css      # Estilos globais e configuração do TailwindCSS
│   ├── layout.tsx       # Layout raiz da aplicação
│   └── page.tsx         # Página inicial
├── components/          # Componentes reutilizáveis
│   └── ui/              # Componentes de interface
└── lib/                 # Utilitários e helpers
```

## 🎨 Características da Interface

### Hero Section

- Gradiente moderno de fundo
- Tipografia responsiva (5xl em mobile, 7xl em desktop)
- Botões com animações e estados hover
- Texto com gradiente personalizado

### Cards de Recursos

- Layout em grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- Animações hover suaves
- Ícones com transformações
- Modo escuro automático

### Header & Footer

- Navegação responsiva
- Logo com gradiente
- Links com transições suaves
- Footer com informações e links úteis

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com Turbopack
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint

## 🌙 Modo Escuro

O projeto inclui suporte automático ao modo escuro usando:

- `prefers-color-scheme` CSS media query
- Variáveis CSS customizadas para cores
- Classes dark: do TailwindCSS

## ♿ Acessibilidade

- Contraste adequado de cores
- Foco visível em elementos interativos
- Estrutura semântica correta
- Suporte a leitores de tela

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

### Outros Provedores

- **Netlify**: Deploy automático via Git
- **Render**: Suporte nativo ao Next.js
- **Railway**: Deploy com Docker

## 📝 Personalização

### Cores

Edite as variáveis CSS em `src/app/globals.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --accent: #10b981;
  /* ... outras cores */
}
```

### Tipografia

Altere as fontes em `src/app/layout.tsx`:

```tsx
import { Inter, Roboto } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

### Tema TailwindCSS

Configure o tema em `tailwind.config.js` (se necessário):

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },
    },
  },
};
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💡 Próximos Passos

- [ ] Adicionar testes unitários
- [ ] Implementar autenticação
- [ ] Criar sistema de routing
- [ ] Adicionar internacionalização (i18n)
- [ ] Implementar PWA
- [ ] Adicionar analytics

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique os [issues existentes](https://github.com/seu-usuario/seu-repo/issues)
2. Crie um novo issue com detalhes do problema
3. Entre em contato via [email](mailto:seu-email@example.com)

---

⭐ Se este projeto foi útil, considere dar uma estrela no repositório!
