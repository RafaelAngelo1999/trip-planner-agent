# Design System - Flights UI

Este documento descreve o sistema de design implementado no componente flights-list e serve como referência para desenvolvimento de novos componentes no projeto.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Componentes Base](#componentes-base)
- [Padrões de Layout](#padrões-de-layout)
- [Estados e Interações](#estados-e-interações)
- [Sistema de Tags](#sistema-de-tags)
- [Modais e Overlays](#modais-e-overlays)
- [Accordions](#accordions)
- [Formulários](#formulários)
- [Animações e Transições](#animações-e-transições)

---

## 🎨 Visão Geral

O design system segue uma abordagem **premium e moderna**, utilizando:

- **Gradientes sutis** para criar profundidade
- **Bordas arredondadas** para suavidade visual
- **Sombras em camadas** para hierarquia
- **Emojis temáticos** para melhor UX
- **Estados interativos** responsivos
- **Cores semânticas** para diferenciação de contexto

---

## 🎯 Paleta de Cores

### Cores Primárias

```css
/* Azul (Voos de Ida) */
from-blue-400 to-blue-600      /* Ícones e elementos principais */
from-blue-500 to-blue-600      /* Headers e seções */
from-blue-600 to-indigo-700    /* Headers principais */

/* Roxo (Voos de Volta) */
from-purple-400 to-purple-600  /* Ícones de volta */
from-purple-500 to-purple-600  /* Headers de volta */
```

### Cores Secundárias

```css
/* Preços */
from-emerald-600 to-green-600  /* Valores monetários */

/* Estados */
from-green-100 to-emerald-200  /* Sucesso/Direto */
from-orange-100 to-amber-200   /* Atenção/Conexões */
from-red-100 to-pink-200       /* Erro/Bagagem não incluída */
from-blue-100 to-indigo-200    /* Info/Bagagem incluída */
```

### Cores Neutras

```css
/* Textos */
text-slate-800    /* Títulos principais */
text-slate-600    /* Subtítulos */
text-slate-500    /* Textos secundários */
text-slate-400    /* Labels e metadados */

/* Backgrounds */
from-slate-50 to-blue-50/30    /* Cards principais */
border-slate-200/60            /* Bordas sutis */
```

---

## ✍️ Tipografia

### Hierarquia de Títulos

```css
/* H1 - Título Principal */
text-xl font-bold

/* H2 - Subtítulos de Seção */
text-lg font-bold

/* H3 - Títulos de Card */
text-base font-bold

/* H4 - Títulos Pequenos */
text-sm font-bold
```

### Textos de Corpo

```css
/* Texto Principal */
text-base font-medium

/* Texto Secundário */
text-sm font-medium

/* Labels e Metadados */
text-xs font-medium uppercase tracking-wide

/* Preços */
text-2xl font-black (cards principais)
text-xl font-black (modal)
```

### Pesos de Fonte

- `font-medium`: Textos padrão
- `font-semibold`: Textos de destaque
- `font-bold`: Títulos
- `font-black`: Preços e elementos de maior destaque

---

## 🧩 Componentes Base

### Cards Principais

```css
/* Container base */
bg-white rounded-3xl shadow-2xl border border-slate-200/60

/* Cards internos */
bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-slate-200/60 hover:border-blue-300/60 hover:shadow-lg transition-all duration-300
```

### Ícones Circulares

```css
/* Azul (Ida) */
bg-gradient-to-r from-blue-400 to-blue-600 rounded-full p-2.5 shadow-md

/* Roxo (Volta) */
bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-2.5 shadow-md

/* Tamanhos */
h-5 w-5  /* Padrão */
h-4 w-4  /* Pequeno */
h-6 w-6  /* Grande */
```

---

## 🏗️ Padrões de Layout

### Headers Premium

```css
/* Header Principal */
bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4

/* Subheaders */
bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-4 py-2.5 mb-3
```

### Containers de Conteúdo

```css
/* Container Principal */
max-w-7xl mx-auto overflow-hidden

/* Padding Interno */
p-6 space-y-6  /* Modal */
p-3            /* Container compacto */
p-4 mb-4       /* Card interno */
```

### Grid Layouts

```css
/* Responsivo padrão */
grid grid-cols-1 md:grid-cols-2 gap-4

/* Carousel */
md:basis-1/2 lg:basis-1/3
```

---

## ⚡ Estados e Interações

### Hover States

```css
/* Cards */
hover:border-blue-300/60 hover:shadow-lg transition-all duration-300

/* Botões */
hover:from-blue-700 hover:to-indigo-700 transition-all duration-300

/* Backgrounds interativos */
hover:bg-slate-50/50 transition-colors duration-200
```

### Estados de Loading

```css
/* Animações */
animate-pulse   /* Ícones de loading */
animate-ping    /* Indicadores */

/* Skeleton */
bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-5xl mx-auto
```

### Estados Disabled

```css
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 🏷️ Sistema de Tags

### Tags de Informação

```css
/* Base das tags */
px-3 py-1.5 rounded-full text-xs font-bold shadow-md border

/* Estados específicos */
/* Sucesso */
bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300/50

/* Atenção */
bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border-orange-300/50

/* Erro */
bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300/50

/* Info */
bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 border-blue-300/50
```

### Tags de Filtro

```css
/* Passageiros */
bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800

/* Datas */
bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800
```

---

## 🪟 Modais e Overlays

### Modal Base

```css
/* Overlay */
fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4

/* Container do Modal */
bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-4xl w-full max-h-[90vh] overflow-y-auto
```

### Header do Modal

```css
bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4
```

### Botão de Fechar

```css
text-white/80 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-xl backdrop-blur-sm
```

---

## 🎵 Accordions

### Estrutura Base

```css
/* Container */
bg-white rounded-2xl border border-slate-200/60 shadow-sm

/* Botão de Toggle */
w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors duration-200

/* Conteúdo Expandido */
px-4 pb-4 border-t border-slate-200/60 bg-slate-50/30
```

### Ícone de Expansão

```css
/* ChevronDown com rotação */
h-5 w-5 text-slate-400 transition-transform duration-200
rotate-180  /* Quando expandido */
```

### Cards Internos dos Accordions

```css
/* Seções organizadas */
grid grid-cols-2 gap-4

/* Cards de detalhes */
bg-white rounded-xl p-3 border border-slate-200/60
```

---

## 📝 Formulários

### Inputs Base

```css
/* Input padrão */
w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200

/* Input com erro */
border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200
```

### Labels

```css
block text-sm font-bold text-slate-700 mb-2
```

### Mensagens de Erro

```css
text-red-500 text-xs mt-1 font-medium
```

### Validação Visual

```css
/* Estados baseados em validação */
$ {
  nameerror? "border-red-300" : "border-slate-300";
}
```

---

## 🎬 Animações e Transições

### Transições Padrão

```css
transition-all duration-300    /* Elementos complexos */
transition-colors duration-200 /* Mudanças de cor */
transition-transform duration-200 /* Rotações */
```

### Hover Effects

```css
/* Escala sutil */
transform hover:scale-[1.02]

/* Sombras dinâmicas */
shadow-lg hover:shadow-xl
```

### Loading States

```css
animate-pulse  /* Conteúdo carregando */
animate-ping   /* Indicadores */
```

---

## 🎯 Botões

### Botão Primário

```css
bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-lg
```

### Botão Secundário

```css
variant="outline" flex-1 py-4 text-lg font-semibold rounded-xl
```

### Botão de Ação (Cards)

```css
w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0
```

---

## 🚀 Elementos Especiais

### Preços

```css
/* Gradiente de texto */
bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent

/* Formatação brasileira */
{price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
```

### Emojis Temáticos

- ✈️ Voos de ida
- 🔄 Voos de volta
- 🎯 Voos diretos
- 🧳 Bagagem incluída
- ⚠️ Bagagem não incluída
- 💰 Valores monetários
- 👥 Passageiros
- 📅 Datas
- 🎫 Reservas

### Diferenciação Ida/Volta

```css
/* Condicionais para cores */
$ {
  isreturn? "from-purple-400 to-purple-600" : "from-blue-400 to-blue-600";
}
$ {
  isreturn? "text-purple-600" : "text-blue-600";
}
$ {
  isreturn? "rotate-180" : "";
}
```

---

## 📱 Responsividade

### Breakpoints

```css
md:basis-1/2      /* Tablet */
lg:basis-1/3      /* Desktop */
md:grid-cols-2    /* Forms em tablet+ */
```

### Espaçamentos Adaptativos

```css
px-6 py-4    /* Desktop */
px-4 py-3    /* Mobile */
gap-3        /* Padrão */
gap-2        /* Compacto */
```

---

## ✅ Checklist para Novos Componentes

- [ ] Utilizar paleta de cores definida
- [ ] Aplicar gradientes para profundidade
- [ ] Incluir estados de hover/focus
- [ ] Adicionar transições suaves
- [ ] Usar emojis temáticos apropriados
- [ ] Implementar responsividade
- [ ] Validar acessibilidade
- [ ] Manter consistência tipográfica
- [ ] Aplicar bordas arredondadas
- [ ] Usar sombras em camadas
- [ ] Implementar loading states quando aplicável

---

## 🔗 Dependências

### Ícones

- **Lucide React**: `X`, `Plane`, `Clock`, `Users`, `ChevronDown`

### Componentes UI

- **Button**: `../../../components/ui/button`
- **Carousel**: `../../../components/ui/carousel`

### Utilitários

- **date-fns**: Formatação de datas
- **Tailwind CSS**: Sistema de classes utilitárias

---

_Este design system foi desenvolvido para proporcionar uma experiência premium e consistente em toda a aplicação, mantendo a usabilidade e acessibilidade como prioridades._
