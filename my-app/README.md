# Trello Clone - Vue.js To-Do List 

Uma aplicação completa de gerenciamento de tarefas estilo Trello, desenvolvida em Vue.js 3 com TypeScript, funcionalidade de drag-and-drop e design responsivo.

## 🚀 Funcionalidades

### ✨ Principais Recursos

- **Drag & Drop**: Arraste e solte tarefas entre colunas e reordene colunas

- **Design Responsivo**: Interface otimizada para desktop, tablet e mobile

- **Gerenciamento de Tarefas**: Crie, edite e delete tarefas com facilidade

- **Labels Coloridas**: Organize tarefas com etiquetas coloridas

- **Assignees**: Atribua tarefas a membros da equipe

- **Datas de Vencimento**: Defina e acompanhe prazos

- **Checklists**: Acompanhe o progresso com listas de verificação

- **Comentários e Anexos**: Indicadores visuais para interações

### 🎨 Interface

- **Header Dinâmico**: Navegação intuitiva com busca e perfil do usuário

- **Board Interativo**: Visualização em colunas estilo Kanban

- **Modal de Edição**: Interface completa para edição de tarefas

- **Navegação Mobile**: Bottom navigation para dispositivos móveis

- **Notificações**: Sistema de toast para feedback do usuário

### 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis

- **Touch Friendly**: Interações adaptadas para toque

- **Safe Areas**: Suporte para dispositivos com notch

- **Orientação**: Adaptação automática para landscape/portrait

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript reativo

- **TypeScript**: Tipagem estática para maior robustez

- **Vue Router**: Roteamento SPA

- **VueDraggable**: Biblioteca para drag-and-drop

- **Vite**: Build tool moderna e rápida

- **CSS3**: Estilos modernos com variáveis CSS e flexbox/grid

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 20.19.0+ ou 22.12.0+

- npm ou yarn

### Instalação

```bash
# Entre no diretório
cd my-app

# Instale as dependências (se necessário)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build-only

# Preview da build
npm run preview

# Verificação de tipos
npm run type-check

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Header.vue       # Cabeçalho principal
│   ├── BoardHeader.vue  # Cabeçalho do board
│   ├── ColumnDraggable.vue # Coluna com drag-and-drop
│   ├── TaskCardDraggable.vue # Card de tarefa
│   ├── TaskModal.vue    # Modal de edição
│   ├── BottomNavigation.vue # Navegação mobile
│   ├── LoadingSpinner.vue # Componente de loading
│   └── ToastNotification.vue # Notificações
├── views/               # Páginas/Views
│   └── BoardViewDraggable.vue # View principal do board
├── composables/         # Composables Vue
│   └── useDragAndDrop.ts # Lógica de drag-and-drop
├── assets/             # Assets estáticos
│   └── styles/         # Estilos globais
│       ├── global.css  # Estilos base
│       └── mobile.css  # Estilos mobile
├── router/             # Configuração de rotas
│   └── index.ts
├── App.vue             # Componente raiz
└── main.ts             # Ponto de entrada
```

## 🎯 Como Usar

### Navegação Principal

1. **Header**: Contém logo, navegação, busca e perfil do usuário

1. **Board Header**: Título do board, membros e ações do board

1. **Colunas**: Listas de tarefas organizadas em colunas

### Gerenciamento de Tarefas

1. **Criar Tarefa**: Clique em "Add a card" em qualquer coluna

1. **Editar Tarefa**: Clique em qualquer tarefa para abrir o modal

1. **Mover Tarefa**: Arraste e solte entre colunas

1. **Deletar Tarefa**: Use o botão delete no modal de edição

### Funcionalidades do Modal

- **Título**: Campo obrigatório para o nome da tarefa

- **Descrição**: Texto livre para detalhes adicionais

- **Labels**: Etiquetas coloridas para categorização

- **Data de Vencimento**: Prazo para conclusão

- **Assignees**: Membros responsáveis pela tarefa

### Drag & Drop

- **Tarefas**: Arraste pelo card para mover entre colunas

- **Colunas**: Arraste pelo handle superior para reordenar

- **Feedback Visual**: Indicadores durante o movimento

### Mobile

- **Bottom Navigation**: 4 seções principais (Inbox, Planner, Board, Switch)

- **Touch Gestures**: Suporte completo a gestos de toque

- **Responsive Design**: Interface adaptada para telas pequenas

## 🎨 Personalização

### Cores das Labels

- **Red**: Urgente/Crítico

- **Orange**: Alta prioridade

- **Yellow**: Média prioridade

- **Green**: Baixa prioridade/Concluído

- **Blue**: Informação/Documentação

- **Purple**: Revisão/Aprovação

- **Pink**: Design/UI

- **Sky**: Desenvolvimento

- **Lime**: Teste/QA

- **Black**: Bloqueado/Arquivado

### Dados de Exemplo

O projeto vem com dados de exemplo que incluem:

- 5 colunas: Backlog, In Progress, Code Review, Ready for Testing, Awaiting Release

- 19 tarefas de exemplo com diferentes estados

- 4 membros da equipe com avatares coloridos

- Diferentes tipos de badges (datas, checklists, comentários, anexos)

## 📱 Compatibilidade

### Navegadores Suportados

- Chrome 90+

- Firefox 88+

- Safari 14+

- Edge 90+

### Dispositivos Testados

- **Desktop**: Windows, macOS, Linux

- **Tablet**: iPad, Android tablets

- **Mobile**: iPhone, Android phones

## 🔧 Desenvolvimento

### Configuração do IDE

- **VS Code**: Recomendado com extensão Vue (Official)

- **Vue DevTools**: Para debugging no navegador

- **TypeScript**: Suporte completo com vue-tsc

### Padrões de Código

- **Composition API**: Vue 3 com script setup

- **TypeScript**: Tipagem em todos os componentes

- **ESLint + Prettier**: Formatação automática

- **CSS Modules**: Estilos scoped por componente

## 🚀 Deploy

### Build de Produção

```bash
npm run build-only
```

### Arquivos Gerados

- `dist/index.html`: Página principal

- `dist/assets/`: CSS e JS otimizados

- Tamanho total: ~360KB (JS) + ~27KB (CSS)

### Hospedagem

Compatível com qualquer servidor web estático:

- Netlify

- Vercel

- GitHub Pages

- Firebase Hosting

- AWS S3

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ usando Vue.js 3, TypeScript e Vite**

Para mais informações sobre Vue.js, visite: [https://vuejs.org/](https://vuejs.org/)