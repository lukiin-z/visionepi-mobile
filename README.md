# ⛑️ VisionEPI Mobile — Sprint 3 (Integração Frontend + Backend)

**Sistema Inteligente de Segurança Industrial**
Aplicativo mobile (React Native + Expo) integrado à API REST Spring Boot do grupo.

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

## 📱 Descrição

O **VisionEPI** monitora o uso de EPIs (Equipamentos de Proteção Individual) em
ambientes industriais. Nesta Sprint 3 o app **deixou de usar mock**: todos os dados
vêm da API Spring Boot (`visionepi-api`, Sprint 1), que persiste em banco H2 em arquivo.

O app permite:

- **Dashboard (Home)** — KPIs de conformidade calculados a partir de **duas chamadas
  simultâneas** à API (`Promise.all`)
- **Lista** — `GET /deteccoes` com busca e filtro por nível de risco
- **Cadastro** — `POST /deteccoes`, com o nível de risco calculado pelo backend
- **Detalhe** — `GET /deteccoes/{id}` com EPIs presentes/ausentes
- **Remoção** — `DELETE /deteccoes/{id}` (opcional na sprint)

---

## 🚀 Como subir as duas stacks

### 1. Backend (API Spring Boot)

Repositório: <https://github.com/lukiin-z/visionepi-api>

```bash
git clone https://github.com/lukiin-z/visionepi-api.git
cd visionepi-api
mvn spring-boot:run
```

A API sobe em **http://localhost:8080**. Confirme o JSON no navegador antes de
integrar: <http://localhost:8080/deteccoes> (retorna `[]` na primeira execução).
Console do banco: <http://localhost:8080/h2-console>.

Pré-requisitos: JDK 17+ e Maven.

### 2. Frontend (Expo)

```bash
git clone https://github.com/lukiin-z/visionepi-mobile.git
cd visionepi-mobile
npm install
npx expo start
```

Pressione `a` para o emulador Android, `i` para iOS, ou escaneie o QR code com o
**Expo Go**. O backend precisa estar rodando.

> O Axios foi instalado com `npx expo install axios` (não `npm install axios`).

---

## 🔌 Endpoints consumidos

| Método | Endpoint                            | Uso no app                        |
|--------|-------------------------------------|-----------------------------------|
| GET    | `/deteccoes`                        | Lista (ListaScreen) e Home        |
| GET    | `/deteccoes/{id}`                   | Detalhe (DetalheScreen)           |
| GET    | `/deteccoes?nivelRiscoMinimo=4`     | KPI de detecções críticas (Home)  |
| POST   | `/deteccoes`                        | Cadastro (CadastroScreen)         |
| DELETE | `/deteccoes/{id}`                   | Remoção no detalhe (opcional)     |

O controller do backend expõe `@CrossOrigin(origins = "*")`, liberando o CORS para
o app Expo.

### JSON da API (exemplo real)

```json
{
  "id": 1,
  "nomeOperador": "Carlos Silva",
  "matricula": "OP-117",
  "setor": "Soldagem A",
  "descricaoCamera": "CAM-03 - Entrada soldagem",
  "dataDeteccao": "2026-09-21T15:34:11.79",
  "capacete": "N",
  "colete": "S",
  "luva": "N",
  "oculos": "S",
  "botina": "S",
  "confianca": 94.5,
  "nivelRisco": 3
}
```

O TypeScript do app (`src/types/index.ts`) espelha exatamente esse JSON:
`dataDeteccao` e `nivelRisco` são gerados pelo backend, por isso o payload de
criação é `Omit<DeteccaoEpi, "id" | "dataDeteccao" | "nivelRisco">`.

---

## 🧩 Camada de serviços

**Nenhuma tela chama Axios nem monta URL.** Tudo passa por `src/services/`:

```
src/services/
├── api.ts               # instância Axios: baseURL, timeout e Content-Type
└── deteccaoService.ts   # listar, buscarPorId, criar, listarPorRiscoMinimo, remover
```

```typescript
// src/services/api.ts
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// src/services/deteccaoService.ts
export async function listar(): Promise<DeteccaoEpi[]> {
  const { data } = await api.get<DeteccaoEpi[]>("/deteccoes");
  return data;
}
```

### BASE_URL por plataforma

| Onde o app roda            | BASE_URL                      |
|----------------------------|-------------------------------|
| Web / simulador iOS        | `http://localhost:8080`       |
| Emulador Android           | `http://10.0.2.2:8080`        |
| Celular físico (Expo Go)   | `http://<IP-DA-MAQUINA>:8080` |

Em `src/services/api.ts` a escolha entre `localhost` e `10.0.2.2` é automática
(`Platform.OS`). **Para rodar no celular físico**, troque a constante pelo IP da
máquina, por exemplo:

```typescript
export const BASE_URL = "http://192.168.0.12:8080";
```

Celular e computador precisam estar na mesma rede Wi-Fi.

---

## 🗂️ Estrutura do projeto

```
visionepi-mobile/
├── App.tsx                          # Entry point (SafeAreaProvider + AppNavigator)
└── src/
    ├── types/index.ts               # Tipos alinhados ao JSON da API + helpers
    ├── services/
    │   ├── api.ts                   # Instância Axios (baseURL, timeout, headers)
    │   └── deteccaoService.ts       # Funções de acesso aos endpoints
    ├── components/                  # theme, RegistroCard, StatusBadge, EmptyState
    ├── navigation/AppNavigator.tsx  # Stack Navigator (Home, Lista, Detalhe, Cadastro)
    └── screens/
        ├── HomeScreen.tsx           # Dashboard — Promise.all com 2 chamadas
        ├── ListaScreen.tsx          # GET /deteccoes (useEffect/useFocusEffect)
        ├── DetalheScreen.tsx        # GET /deteccoes/{id}
        └── CadastroScreen.tsx       # POST /deteccoes
```

O mock (`src/data/mock.ts`) e o `DeteccoesContext` foram **removidos** — a fonte de
dados agora é exclusivamente a API.

---

## ✅ Como testar a integração

1. Suba o backend (`mvn spring-boot:run`) e confirme <http://localhost:8080/deteccoes>.
2. Suba o app (`npx expo start`).
3. Na Home, os KPIs aparecem após as duas chamadas (`Promise.all`).
4. Toque em **Novo Registro**, preencha e salve → o alerta mostra o **ID** e o
   **nível de risco** devolvidos pelo backend (`POST`).
5. Volte para a **Lista** → o registro recém-criado aparece (`GET`).
6. Toque no card → a tela de **Detalhe** busca o registro por ID (`GET /deteccoes/{id}`).
7. Reinicie o backend: os dados continuam lá (H2 em arquivo, `./data/visionepi_db`).

Teste direto pela linha de comando (opcional):

```bash
curl -X POST http://localhost:8080/deteccoes -H "Content-Type: application/json" -d "{\"nomeOperador\":\"Ana Souza\",\"matricula\":\"OP-203\",\"setor\":\"Montagem\",\"descricaoCamera\":\"CAM-02\",\"capacete\":\"S\",\"colete\":\"S\",\"luva\":\"S\",\"oculos\":\"S\",\"botina\":\"S\",\"confianca\":99.0}"
```

---

## 🛑 O que acontece se o backend estiver parado

Cada tela trata os três estados (`try / catch / finally`):

| Estado        | Home                        | Lista                        | Detalhe                      | Cadastro                     |
|---------------|-----------------------------|------------------------------|------------------------------|------------------------------|
| **Carregando**| Spinner "Consultando a API" | Spinner + texto              | Spinner "Carregando #id"     | Botão "Enviando para a API"  |
| **Erro**      | Mensagem 📡 + "Tentar novamente" | Mensagem 📡 + "Tentar novamente" | Mensagem 📡 + "Voltar"  | Alert "Erro ao salvar"       |
| **Sucesso**   | KPIs e últimas detecções    | Lista de cards               | Detalhe completo             | Alert com ID e nível de risco|

O app **não quebra**: mostra a `BASE_URL` que tentou acessar e orienta a subir a API.
O Axios corta a espera em 10 s (`timeout`).

---

## 📦 Dependências principais

| Pacote                             | Uso                          |
|------------------------------------|------------------------------|
| `expo` ~54                         | Plataforma mobile            |
| `react-native` 0.81                | Framework mobile             |
| `axios` ^1.20                      | Cliente HTTP da API          |
| `@react-navigation/native(-stack)` | Navegação entre telas        |
| `react-native-safe-area-context`   | Área segura (notch)          |
| `typescript` ^5.3                  | Tipagem estática             |

---

## 🔗 Links

- App (este repositório): <https://github.com/lukiin-z/visionepi-mobile>
- API Spring Boot (Sprint 1): <https://github.com/lukiin-z/visionepi-api>
