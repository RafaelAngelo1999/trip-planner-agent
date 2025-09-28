# 🎨 Card Design System - Guia de Estilo

Este documento define o padrão de design para cards de confirmação/status usado na aplicação LangGraph UI.

## 📋 Estrutura Base

### Container Principal

```tsx
<div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-2xl mx-auto overflow-hidden">
```

**Características:**

- Fundo branco sólido
- Bordas arredondadas médias (`rounded-2xl`)
- Sombra pronunciada (`shadow-xl`)
- Borda sutil cinza (`border-slate-200/60`)
- Largura máxima de 2xl (672px)
- Centralizado horizontalmente
- Overflow oculto para bordas arredondadas

## 🎨 Paleta de Cores

### Cores Primárias (Azul)

```css
/* Headers e elementos principais */
from-blue-400 via-blue-500 to-blue-600   /* Gradiente header */
bg-blue-50 to-indigo-50/30               /* Gradiente seções */
text-blue-600, text-blue-700, text-blue-800  /* Textos */
border-blue-200/60, border-blue-100      /* Bordas */

/* Backgrounds de seções */
bg-blue-50/50     /* Seções secundárias */
bg-blue-50/30     /* Notas/alertas */
```

### Cores de Status

```css
/* Sucesso (Verde) */
text-green-600    /* Status positivo */

/* Erro/Cancelamento (Vermelho) */
text-red-600      /* Status negativo */

/* Neutro (Cinza) */
text-gray-500     /* Textos secundários */
text-gray-600     /* Textos informativos */
text-slate-800    /* Textos principais */
```

## 🏗️ Componentes

### 1. Header (Topo do Card)

```tsx
<div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 px-6 py-4">
  <div className="flex items-center gap-3">
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-white">{emoji} Título Principal</h1>
      <p className="text-blue-100 text-sm mt-0.5 font-medium">
        Subtítulo explicativo
      </p>
    </div>
  </div>
</div>
```

**Variações de Ícones:**

- ✅ `CheckCircle` - Confirmações/Sucessos
- ❌ `XCircle` - Cancelamentos/Erros
- ℹ️ `Info` - Informações gerais

### 2. Container do Conteúdo

```tsx
<div className="p-6 space-y-4">{/* Conteúdo aqui */}</div>
```

**Características:**

- Padding uniforme de 24px (`p-6`)
- Espaçamento vertical entre elementos (`space-y-4`)

### 3. Seção Principal (PNR/Código)

```tsx
<div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-5 border border-blue-200/60">
  {/* Badge do tipo */}
  <div className="mb-3">
    <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md border border-blue-200/60">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
        CÓDIGO PNR
      </span>
    </div>
  </div>

  {/* Código principal com botão de cópia */}
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="text-2xl font-black text-slate-800 tracking-wider">
      {codigo}
    </div>
    <button
      onClick={handleCopy}
      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
      title="Copiar"
    >
      <Copy className="h-4 w-4" />
    </button>
  </div>

  {/* Feedback de cópia */}
  {copied && (
    <div className="text-xs text-blue-600 font-medium mb-2">
      ✅ Código copiado!
    </div>
  )}

  {/* Status */}
  <div className="flex items-center justify-center gap-2 mb-2">
    <StatusIcon className="h-4 w-4 text-{status-color}-600" />
    <span className="text-lg font-bold text-{status-color}-600">{status}</span>
  </div>

  {/* Data/hora */}
  <div className="text-xs text-gray-500">
    {acao} em {data}
  </div>
</div>
```

### 4. Seções de Informações

```tsx
<div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
    {emoji} Título da Seção
  </h3>
  <div className="space-y-1 text-sm text-gray-600">
    <p>• Item 1</p>
    <p>• Item 2</p>
    <p>• Item 3</p>
  </div>
</div>
```

### 5. Nota Importante

```tsx
<div className="bg-blue-50/30 border border-blue-200/50 rounded-xl p-3">
  <p className="text-xs text-blue-700 text-center">
    📝 Texto da nota importante
  </p>
</div>
```

## 📏 Tipografia

### Hierarquia de Texto

```css
/* Títulos principais */
text-xl font-bold           /* H1 - Headers */
text-lg font-bold           /* H2 - Status */
text-sm font-semibold       /* H3 - Seções */

/* Códigos/Valores */
text-2xl font-black tracking-wider  /* Códigos principais */

/* Textos corpo */
text-sm font-medium         /* Subtítulos */
text-sm                     /* Corpo normal */
text-xs                     /* Textos pequenos */

/* Estados especiais */
uppercase tracking-wider    /* Labels/badges */
```

## 🎭 Estados e Interações

### Botões

```css
/* Botão principal (azul) */
bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg

/* Estados */
transition-all duration-200   /* Transições suaves */
hover:shadow-lg              /* Sombra no hover */
```

### Animações

```css
animate-pulse               /* Indicadores ativos */
animate-ping               /* Alertas urgentes */
```

## 📱 Responsividade

### Breakpoints

- Mobile: Layout vertical, padding reduzido
- Tablet: `max-w-2xl` mantido
- Desktop: Centralizado com margem automática

### Ajustes Mobile

```css
/* Reduzir padding em telas pequenas */
px-4 py-3    /* Em vez de px-6 py-4 */
p-4          /* Em vez de p-6 */
```

## 🔧 Variações por Contexto

### Card de Sucesso (Booking Confirmado)

- **Header:** Azul com `CheckCircle`
- **Status:** Verde (`text-green-600`)
- **Emoji:** ✅

### Card de Cancelamento

- **Header:** Azul com `XCircle`
- **Status:** Vermelho (`text-red-600`)
- **Emoji:** ❌

### Card de Informação

- **Header:** Azul com `Info`
- **Status:** Azul (`text-blue-600`)
- **Emoji:** ℹ️

## 📋 Template Base

```tsx
import { useState } from "react";
import { Icon, Copy } from "lucide-react";
import { format } from "date-fns";

interface CardProps {
  toolCallId: string;
  data: DataType;
}

export default function CustomCard(props: CardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{emoji} Título</h1>
            <p className="text-blue-100 text-sm mt-0.5 font-medium">
              Subtítulo
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        {/* Seção principal */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-5 border border-blue-200/60">
          {/* Badge */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md border border-blue-200/60">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                CÓDIGO
              </span>
            </div>
          </div>

          {/* Código + cópia */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-2xl font-black text-slate-800 tracking-wider">
              {props.data.code}
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              title="Copiar"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Feedback */}
          {copied && (
            <div className="text-xs text-blue-600 font-medium mb-2">
              ✅ Código copiado!
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon className="h-4 w-4 text-{color}-600" />
            <span className="text-lg font-bold text-{color}-600">
              {props.data.status}
            </span>
          </div>

          {/* Data */}
          <div className="text-xs text-gray-500">
            {action} em{" "}
            {format(new Date(props.data.date), "dd/MM/yyyy às HH:mm")}
          </div>
        </div>

        {/* Seções adicionais */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
            💡 Informações
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            {/* Conteúdo específico */}
          </div>
        </div>

        {/* Nota importante */}
        <div className="bg-blue-50/30 border border-blue-200/50 rounded-xl p-3">
          <p className="text-xs text-blue-700 text-center">
            📝 Nota importante
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Aplicação

Este design system pode ser aplicado em:

- ✅ Confirmações de reserva
- ❌ Cancelamentos
- 📄 Emissão de documentos
- 💳 Processamento de pagamentos
- 📧 Confirmações de email
- 🎫 Geração de tickets
- 📦 Status de pedidos

**Mantenha sempre:**

- Consistência visual
- Feedback de interações
- Hierarquia clara
- Acessibilidade
- Responsividade
