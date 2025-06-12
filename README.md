# 🚀 Projeto Next.js + TailwindCSS

Uma aplicação moderna e responsiva construída com Next.js 15, TailwindCSS 4 e TypeScript.

## ✨ Características

- **⚡ Next.js 15** - Framework React com App Router
- **🎨 TailwindCSS 4** - CSS utilitário moderno
- **📘 TypeScript** - Tipagem estática
- **🎯 ESLint** - Linting de código
- **📱 Responsivo** - Design adaptável para todos os dispositivos
- **🌙 Modo Escuro** - Suporte automático ao tema escuro
- **♿ Acessível** - Práticas de acessibilidade implementadas
- **🔥 Performance** - Otimizado para velocidade

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
- [Heroicons](https://heroicons.com/) - Biblioteca de ícones
- [ESLint](https://eslint.org/) - Linter de código

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18.x ou superior
- npm, yarn ou pnpm

### Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd web01
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. **Abra no navegador**

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
