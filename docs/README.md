# Documentação do Projeto LangGraph.js Gen UI Examples

## 📋 Índice da Documentação

- [`trip-planner-flow.md`](./trip-planner-flow.md) - **Documentação Completa do Trip Planner Agent**

## 🚀 Como Usar Esta Documentação

Durante o desenvolvimento, consulte regularmente a documentação para:

### 1. **Entender Responsabilidades**

Cada seção detalha exatamente o que cada componente deve fazer:

- **Nós do Grafo**: classify, extraction, callTools
- **Roteamento**: Lógica de transição entre nós
- **Componentes UI**: accommodations-list, restaurants-list
- **Utilitários**: get-accommodations, format-messages

### 2. **Verificar Fluxo de Execução**

Acompanhe a sequência completa de processamento:

```
START → classify/extraction → callTools → END
```

### 3. **Localizar Implementações**

Links diretos para arquivos e funções específicas em:

- `src/agent/trip-planner/`
- `src/agent-uis/trip-planner/`

### 4. **Manter Consistência**

Padrões e convenções estabelecidas:

- Estado imutável entre transições
- Validação com Zod schemas
- UI tipada com LangGraph SDK
- Error handling robusto

## 🗺️ Navegação Rápida

### **Arquivos Principais**

| Componente          | Localização                                  | Responsabilidade          |
| ------------------- | -------------------------------------------- | ------------------------- |
| **Grafo Principal** | `src/agent/trip-planner/index.ts`            | Configuração e roteamento |
| **Tipos**           | `src/agent/trip-planner/types.ts`            | Definições TypeScript     |
| **Classificação**   | `src/agent/trip-planner/nodes/classify.ts`   | Relevância de dados       |
| **Extração**        | `src/agent/trip-planner/nodes/extraction.ts` | Dados estruturados        |
| **Ferramentas**     | `src/agent/trip-planner/nodes/tools.ts`      | Execução e UI             |

### **Interfaces de Usuário**

| Componente       | Localização                                       | Propósito            |
| ---------------- | ------------------------------------------------- | -------------------- |
| **Acomodações**  | `src/agent-uis/trip-planner/accommodations-list/` | Lista de hospedagem  |
| **Restaurantes** | `src/agent-uis/trip-planner/restaurants-list/`    | Opções gastronômicas |

### **Utilitários**

| Função                 | Localização                                          | Uso                 |
| ---------------------- | ---------------------------------------------------- | ------------------- |
| **get-accommodations** | `src/agent/trip-planner/utils/get-accommodations.ts` | Props para UI       |
| **format-messages**    | `src/agent/utils/format-messages.ts`                 | Formatação para LLM |

## 📚 Cenários de Consulta

### **Durante Desenvolvimento de Novos Recursos**

1. Consulte **"Pontos de Extensão"** em `trip-planner-flow.md`
2. Verifique **"Padrões Estabelecidos"** para manter consistência
3. Use **"Fluxos de Erro"** para tratamento adequado

### **Durante Debug de Problemas**

1. Consulte **"Fluxo de Controle"** para entender roteamento
2. Verifique **"Detalhamento dos Nós"** para lógica específica
3. Use **"Debugging e Monitoramento"** para ferramentas disponíveis

### **Durante Refatoração**

1. Consulte **"Arquitetura Geral"** para visão sistêmica
2. Verifique **"Estado do Agente"** para estruturas de dados
3. Use **"Integração com Sistema Maior"** para dependências

## 🔧 Comandos Úteis para Desenvolvimento

### **Executar o Projeto**

```bash
pnpm install
pnpm dev
```

### **Testar Trip Planner**

```bash
# Navegar para http://localhost:5173
# Selecionar "Trip Planner" no menu
# Testar fluxo completo: entrada → classificação → extração → ferramentas
```

### **Debug com LangSmith**

```bash
# Verificar tags: ["langsmith:nostream"] nos logs
# Monitorar tool_calls e state transitions
```

## 💡 Dicas de Desenvolvimento

### **Melhores Práticas**

- ✅ Sempre consulte a documentação antes de fazer alterações
- ✅ Mantenha consistência com padrões estabelecidos
- ✅ Teste fluxo completo após modificações
- ✅ Valide dados com Zod schemas
- ✅ Use UI tipada para novos componentes

### **Evite**

- ❌ Modificar estado diretamente (use updates)
- ❌ Pular validação de dados críticos
- ❌ Ignorar tratamento de erros
- ❌ Quebrar tipagem existente
- ❌ Adicionar funcionalidades sem documentar

## 📞 Suporte

Para dúvidas sobre a implementação:

1. Consulte `trip-planner-flow.md` para detalhes técnicos
2. Verifique código fonte nos links fornecidos
3. Use ferramentas de debug mencionadas na documentação

---

**Última atualização**: 25 de setembro de 2025  
**Foco**: Trip Planner Agent exclusivamente
