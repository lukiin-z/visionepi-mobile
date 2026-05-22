# ⛑️ VisionEPI Mobile

**Sistema Inteligente de Segurança Industrial**  
Aplicativo mobile para monitoramento de EPIs em ambientes industriais.

FIAP — Engenharia de Computação — 3ECR — 2026  
**Advanced Programming & Mobile Dev** — Prof. Hete Caetano dos Santos

---

## 👥 Integrantes

| Nome              | RM     |
|-------------------|--------|
| Pedro Gonçalves   | 557936 |
| Lucas Baraldi     | 555407 |
| Lucas Zolla       | 557952 |
| Vitor Pantarotto  | 554961 |

---

## 📱 O que o app faz

O **VisionEPI Mobile** é o frontend do sistema de detecção de uso de EPIs
(Equipamentos de Proteção Individual) em ambientes industriais. Ele permite:

- **Visualizar o dashboard** com indicadores de conformidade, zonas de risco
  e últimas detecções do turno
- **Listar registros** de detecção com filtros por status (Crítico / Atenção / Conforme)
  e busca por operador, zona ou câmera
- **Cadastrar novas detecções** manualmente, com seleção de EPIs presentes/ausentes,
  zona, câmera e confiança do modelo — com validação de campos e sugestão automática
  de status de risco
- **Visualizar o detalhe** completo de cada detecção (EPIs, localização, timestamp,
  confiança) e removê-la se necessário
- **Gerenciar alertas** — visualizar alertas gerados e marcá-los como resolvidos

---

## 🚀 Como rodar o app

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) instalado no celular (iOS ou Android)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/lukiin-z/visionepi-mobile.git
cd visionepi-mobile

# 2. Instale as dependências
npm install

# 3. Inicie o Expo
npx expo start
```

### Executar

Após iniciar, escaneie o QR code com o **Expo Go** no celular.  
Ou pressione `a` no terminal para abrir no emulador Android, `i` para iOS.

---

## 🗂️ Estrutura do Projeto

```
visionepi-mobile/
├── App.tsx                          # Entry point — SafeAreaProvider + DeteccoesProvider
├── app.json                         # Configuração Expo
├── tsconfig.json
│
└── src/
    ├── types/
    │   └── index.ts                 # Tipos TypeScript (DeteccaoEPI, Alerta, ZonaRisco, etc.)
    │
    ├── data/
    │   └── mock.ts                  # Dados mockados (deteccoes, alertas, zonas)
    │
    ├── components/
    │   ├── theme.ts                 # Design system: cores, tipografia, espaçamentos
    │   ├── RegistroCard.tsx         # Card de detecção para a lista
    │   ├── StatusBadge.tsx          # Badge reutilizável de status (normal/alerta/critico)
    │   ├── EmptyState.tsx           # Estado vazio de listas
    │   └── AppHeader.tsx            # Cabeçalho padrão
    │
    ├── navigation/
    │   ├── AppNavigator.tsx         # Stack Navigator (React Navigation)
    │   └── DeteccoesContext.tsx     # Context API — estado global de detecções
    │
    └── screens/
        ├── HomeScreen.tsx           # Dashboard com KPIs, zonas e últimas detecções
        ├── ListaScreen.tsx          # Lista paginada com filtros e busca + FAB
        ├── DetalheScreen.tsx        # Detalhe completo de um registro + remoção
        ├── CadastroScreen.tsx       # Formulário de cadastro com validação
        └── AlertasScreen.tsx        # Lista de alertas com marcação de resolvido
```

---

## 🗃️ Como os dados estão mockados

Os dados são simulados em `src/data/mock.ts` como arrays TypeScript estáticos,
tipados com as interfaces definidas em `src/types/index.ts`.

```typescript
// src/data/mock.ts
export const deteccoesMock: DeteccaoEPI[] = [
  {
    id: 1001,
    nome: "OP-117",
    descricao: "Operador detectado sem capacete na área de soldagem.",
    status: "critico",
    data: "2026-05-21T14:32:00.000Z",
    camera: "CAM-03",
    zona: "Soldagem A",
    episPresentes: ["colete"],
    episAusentes: ["capacete", "luva"],
    confianca: 0.94,
  },
  // ...
];
```

O estado global é gerenciado pelo `DeteccoesContext` (Context API + `useState`),
inicializado com os dados mockados:

```typescript
const [registros, setRegistros] = useState<DeteccaoEPI[]>(deteccoesMock);
```

Novos registros são adicionados ao array em memória via `adicionarRegistro()`,
e removidos via `removerRegistro()`. **Não há persistência entre sessões** nesta sprint
(bônus: AsyncStorage seria adicionado no `DeteccoesContext` para persistência local).

---

## 🔌 Preparação para integração futura

Todo o código está estruturado para facilitar a troca dos mocks pela API real:

| Ação atual (mock)              | Integração futura (API REST)              |
|--------------------------------|-------------------------------------------|
| `useState(deteccoesMock)`      | `fetch('GET /api/deteccoes')`             |
| `adicionarRegistro(payload)`   | `fetch('POST /api/deteccoes', {body})`    |
| `removerRegistro(id)`          | `fetch('DELETE /api/deteccoes/:id')`      |
| `useState(alertasMock)`        | `fetch('GET /api/alertas')`               |
| `marcarResolvido(id)`          | `fetch('PATCH /api/alertas/:id/resolver')`|

Os comentários `// Futura integração:` marcam exatamente onde cada substituição
deve ocorrer.

---

## 🎨 Design System

O app usa um design system próprio definido em `src/components/theme.ts`:

- **Paleta**: azul marinho (#1F3864) como cor primária, com variações de status
  (verde para conforme, laranja para atenção, vermelho para crítico)
- **Tipografia**: escala definida (h1 → micro)
- **Espaçamento**: escala de 4px (xs=4, sm=8, md=16, lg=24, xl=32, xxl=48)
- **Sombras e bordas arredondadas** consistentes em todos os cards

---

## 📦 Dependências principais

| Pacote                          | Versão    | Uso                          |
|---------------------------------|-----------|------------------------------|
| `expo`                          | ~54.0.0   | Plataforma mobile            |
| `react-native`                  | 0.76.7    | Framework mobile             |
| `react`                         | 18.3.1    | UI library                   |
| `@react-navigation/native`      | ^7.0.14   | Navegação entre telas        |
| `@react-navigation/native-stack`| ^7.2.0    | Stack Navigator              |
| `react-native-safe-area-context`| 4.14.0    | Área segura (notch/home bar) |
| `react-native-screens`          | ~4.4.0    | Otimização de telas          |
| `expo-status-bar`               | ~2.2.0    | Barra de status              |
| `typescript`                    | ^5.3.0    | Tipagem estática             |
