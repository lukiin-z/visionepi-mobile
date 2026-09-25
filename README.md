# ⛑️ VisionEPI — Entrega final (Sprint 4)

**Sistema Inteligente de Segurança Industrial** — app mobile (React Native + Expo)
integrado a uma API REST Spring Boot com banco H2 em arquivo.

FIAP — Engenharia de Computação — 3ECR — 2026
**Advanced Programming & Mobile Dev** — Prof. Hete Caetano dos Santos

Este README é o guia completo da entrega: sobe o backend, sobe o app e mostra a
integração de ponta a ponta, inclusive o comportamento com o backend parado.

---

## 1. Projeto

### Problema

Em ambientes industriais, operar sem EPI (capacete, colete, luva, óculos, botina) é
causa frequente de acidentes, e a conferência manual não escala. O VisionEPI registra
as detecções feitas por câmeras com visão computacional: quem estava no frame, em que
setor e câmera, quais EPIs foram identificados e o nível de risco resultante. O app
permite acompanhar esses registros, cadastrar novos e consultar o detalhe de cada um.

### Entidade `DeteccaoEpi`

Cada registro corresponde a um frame analisado por uma câmera.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | Long | gerado pelo banco |
| `nomeOperador` | String (até 100) | obrigatório |
| `matricula` | String (até 20) | obrigatório |
| `setor` | String (até 100) | obrigatório |
| `descricaoCamera` | String (até 200) | obrigatório |
| `dataDeteccao` | LocalDateTime | preenchida pelo backend no cadastro quando não enviada |
| `capacete`, `colete`, `luva`, `oculos`, `botina` | `"S"` / `"N"` | `S` = EPI detectado, `N` = ausente |
| `confianca` | Double (0–100) | confiança do modelo |
| `nivelRisco` | Integer (1–5) | calculado pelo backend a partir dos EPIs ausentes |

**Nível de risco** (calculado no backend): capacete e colete ausentes valem 2 pontos
cada; luva, óculos e botina, 1 ponto cada. 0 ponto → 1 · 1–2 → 2 · 3 → 3 · 4 → 4 ·
5 ou mais → 5. No app: 1 = **Conforme**, 2–3 = **Atenção**, 4–5 = **Crítico**.

### Integrantes

| Nome | RM |
|---|---|
| Pedro Gonçalves | 557936 |
| Lucas Baraldi | 555407 |
| Lucas Zolla | 557952 |
| Vitor Pantarotto | 554961 |

---

## 2. Repositórios

| Parte | Repositório | Branch |
|---|---|---|
| App mobile (este README) | <https://github.com/lukiin-z/visionepi-mobile> | `main` |
| API Spring Boot | <https://github.com/lukiin-z/visionepi-api> | `master` |

---

## 3. Pré-requisitos

| Ferramenta | Versão | Observação |
|---|---|---|
| Java (JDK) | **17** (testado com Temurin 17.0.20) | Com JDK 25 o build **falha** (`cannot find symbol get...`: o Lombok da versão do Spring Boot 3.2.5 não roda nele). Use o 17. |
| Maven | testado com 3.9.16 | `mvn -version` precisa mostrar `Java version: 17...` |
| Node.js | testado com v24.19.0 (npm 11.17.0) | O React Native 0.86 exige Node `^20.19.4`, `^22.13.0`, `^24.3.0` ou `>= 25` |
| Expo | SDK 57 (`expo` 57.0.24, fixado no `package-lock.json`) | instalado pelo `npm install`; nada global |
| Onde rodar o app | **Expo Go** com suporte ao SDK 57 (celular), **emulador Android** (Android Studio) ou **simulador iOS** (Xcode, só macOS) | |

Se houver mais de um JDK na máquina, aponte o `JAVA_HOME` para o 17 **no mesmo
terminal** em que vai rodar o Maven:

```powershell
# Windows (PowerShell) — ajuste o caminho para o seu JDK 17
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
mvn -version
```

```bash
# Linux / macOS — ajuste o caminho para o seu JDK 17
export JAVA_HOME=/caminho/para/jdk-17
export PATH="$JAVA_HOME/bin:$PATH"
mvn -version
```

---

## 4. Subir o backend (API Spring Boot)

```bash
git clone https://github.com/lukiin-z/visionepi-api.git
cd visionepi-api
mvn spring-boot:run
```

- A API está pronta quando o log mostra `Started VisionepiApplication`. Endereço:
  **<http://localhost:8080>**.
- Teste no navegador: <http://localhost:8080/deteccoes> → devolve JSON (`[]` num
  banco novo).
- **Banco H2 em arquivo**: `visionepi-api/data/visionepi_db.mv.db`. A pasta `data/` é
  criada na primeira execução, dentro da pasta de onde a API foi iniciada, e está no
  `.gitignore`. Os dados continuam lá depois de reiniciar a API.
- **Console do H2**: <http://localhost:8080/h2-console>
  - JDBC URL: `jdbc:h2:file:./data/visionepi_db` (substitua o `jdbc:h2:~/test` que vem preenchido)
  - User Name: `sa` · Password: *(vazio)* → **Connect**
  - Tabela: `DETECCAO_EPI`
- CORS liberado para qualquer origem (`@CrossOrigin(origins = "*")` no controller).
- Para parar: `Ctrl+C` no terminal da API.

Problemas comuns: `Port 8080 was already in use` → há outro processo na porta 8080;
`release version 17 not supported` ou `cannot find symbol get...` → o Maven está
usando um JDK que não é o 17 (veja a seção 3).

Deixe esse terminal aberto e use outro para o app.

---

## 5. Subir o frontend (app Expo)

```bash
git clone https://github.com/lukiin-z/visionepi-mobile.git
cd visionepi-mobile
npm install
npx expo start
```

No terminal do Expo:

- `a` — abre no emulador Android (é preciso ter um emulador criado no Android Studio);
- `i` — abre no simulador iOS (só macOS);
- **celular físico** — escaneie o QR code com o Expo Go (Android) ou com a câmera
  (iPhone). Antes, configure o IP da máquina (seção 6): no celular o endereço padrão
  não funciona.

**`.env` (opcional)** — só é necessário quando o padrão automático da seção 6 não
serve, como no celular físico. Crie um arquivo chamado `.env` na raiz de
`visionepi-mobile` (ele está no `.gitignore`) com uma única linha, trocando pelo IP
da sua máquina:

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

Depois de criar ou alterar o `.env`, suba limpando o cache: `npx expo start --clear`.

Alternativa sem arquivo — definir a variável no próprio terminal:

```powershell
# Windows (PowerShell)
$env:EXPO_PUBLIC_API_URL = "http://192.168.0.10:8080"
npx expo start --clear
```

```bash
# Linux / macOS
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080 npx expo start --clear
```

> O projeto não tem suporte a web configurado (`react-dom` e `react-native-web` não
> estão nas dependências): rode no Expo Go, no emulador ou no simulador.

---

## 6. BASE_URL — para onde o app aponta

Definida em `src/services/api.ts`:

```ts
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");
```

Ou seja: se `EXPO_PUBLIC_API_URL` estiver definida, ela vence; senão o app escolhe
sozinho pela plataforma.

| Onde o app roda | BASE_URL | Precisa de `.env`? |
|---|---|---|
| Emulador Android | `http://10.0.2.2:8080` | Não — padrão no Android (`10.0.2.2` é o `localhost` do computador visto de dentro do emulador) |
| Simulador iOS | `http://localhost:8080` | Não — padrão fora do Android |
| Celular físico com Expo Go (Android ou iPhone) | `http://<IP-DA-MÁQUINA>:8080` | **Sim** — `EXPO_PUBLIC_API_URL=http://<IP-DA-MÁQUINA>:8080` |

**Como descobrir o IP da máquina** (celular e computador na mesma rede Wi-Fi):

- Windows: `ipconfig` → "Endereço IPv4" do adaptador Wi-Fi (ex.: `192.168.0.10`);
- macOS: `ipconfig getifaddr en0` (ou `ifconfig`, campo `inet` da `en0`);
- Linux: `ip addr` (ou `ifconfig`), campo `inet` da interface Wi-Fi.

Teste pelo próprio celular: abra `http://<IP-DA-MÁQUINA>:8080/deteccoes` no navegador
dele. Se não abrir, o app também não vai conseguir — em geral é o firewall do
computador bloqueando a porta 8080 ou os dois aparelhos em redes diferentes.

As mensagens de erro do app mostram a BASE_URL que ele tentou acessar.

---

## 7. Endpoints usados pelo app

Todas as chamadas saem de `src/services/deteccaoService.ts`, usando a instância Axios
de `src/services/api.ts` (`timeout` de 10 s, `Content-Type: application/json`).

| Método | Rota | Tela | Respostas |
|---|---|---|---|
| `GET` | `/deteccoes` | Home, Lista | `200` + lista |
| `GET` | `/deteccoes?nivelRiscoMinimo=4` | Home (KPI "Críticas") | `200` + lista filtrada |
| `GET` | `/deteccoes/{id}` | Detalhe | `200` + objeto · `404` se o id não existe |
| `POST` | `/deteccoes` | Cadastro | `201` + objeto criado · `400` + erro por campo |
| `DELETE` | `/deteccoes/{id}` | Detalhe (botão Remover) | `204` · `404` se o id não existe |

A API também expõe `PUT /deteccoes/{id}` e os filtros `?setor=` e `?matricula=`, que o
app não usa (detalhes no README da API).

**`POST /deteccoes`** — corpo no formato que o Cadastro envia (`dataDeteccao` e
`nivelRisco` ficam por conta do backend):

```json
{
  "nomeOperador": "Carlos Silva",
  "matricula": "OP-117",
  "setor": "Soldagem A",
  "descricaoCamera": "CAM-03 - Soldagem",
  "capacete": "N",
  "colete": "S",
  "luva": "N",
  "oculos": "S",
  "botina": "S",
  "confianca": 94.5
}
```

Resposta `201 Created` (capacete + luva ausentes = 3 pontos → risco 3):

```json
{"id":1,"nomeOperador":"Carlos Silva","matricula":"OP-117","setor":"Soldagem A","descricaoCamera":"CAM-03 - Soldagem","dataDeteccao":"<<PREENCHIDO_NO_GATE>>","capacete":"N","colete":"S","luva":"N","oculos":"S","botina":"S","confianca":94.5,"nivelRisco":3}
```

**`GET /deteccoes?nivelRiscoMinimo=4`** — só as detecções críticas (aqui, um segundo
registro sem capacete e sem colete):

```json
[{"id":2,"nomeOperador":"Marina Costa","matricula":"OP-204","setor":"Caldeiraria","descricaoCamera":"CAM-04 - Caldeiraria","dataDeteccao":"<<PREENCHIDO_NO_GATE>>","capacete":"N","colete":"N","luva":"S","oculos":"S","botina":"S","confianca":88.0,"nivelRisco":4}]
```

**`POST` inválido** — `400 Bad Request` com a mensagem de cada campo rejeitado:

```json
{"capacete":"Valor deve ser S ou N","confianca":"Confiança máxima é 100%","nomeOperador":"O nome do operador é obrigatório"}
```

---

## 8. Fluxo tela → service → endpoint

| Tela | Função do service | Método + rota |
|---|---|---|
| `HomeScreen` | `listar()` e `listarPorRiscoMinimo(4)` em paralelo (`Promise.all`) | `GET /deteccoes` + `GET /deteccoes?nivelRiscoMinimo=4` |
| `ListaScreen` | `listar()` | `GET /deteccoes` |
| `DetalheScreen` | `buscarPorId(id)` | `GET /deteccoes/{id}` |
| `DetalheScreen` (Remover) | `remover(id)` | `DELETE /deteccoes/{id}` |
| `CadastroScreen` | `criar(payload)` | `POST /deteccoes` |

Nenhuma tela importa o Axios nem monta URL, e não há dados mockados: tudo o que o app
mostra vem da API.

```
src/
├── services/api.ts              # Axios: BASE_URL, timeout de 10 s, Content-Type JSON
├── services/deteccaoService.ts  # listar, buscarPorId, criar, listarPorRiscoMinimo, remover
├── types/index.ts               # tipos que espelham o JSON da API + statusDoRisco
├── screens/                     # Home, Lista, Detalhe, Cadastro
├── components/                  # RegistroCard, StatusBadge, EmptyState, theme
└── navigation/AppNavigator.tsx  # stack: Home → Lista / Detalhe / Cadastro
```

---

## 9. Cadastrar no app e conferir na API

1. Com a API e o app no ar, na Home toque em **➕ Novo Registro** (ou no **＋** da Lista).
2. Preencha **Nome do Operador** e **Matrícula**, escolha **Setor** e **Câmera**,
   desmarque os EPIs **ausentes** e informe a **Confiança** (0 a 100).
3. Toque em **💾 Salvar Registro**. O alerta **✅ Sucesso** mostra o **ID** e o
   **nível de risco** devolvidos pela API.
4. Toque em **Ver Lista**: o registro está lá (a busca filtra por nome ou matrícula).
   Tocar no card abre o Detalhe, que busca o registro pelo id na API.
5. Confira direto na API, trocando `1` pelo ID mostrado no alerta:
   - navegador: <http://localhost:8080/deteccoes/1>
   - pela matrícula (o app grava em maiúsculas): <http://localhost:8080/deteccoes?matricula=OP-117>
   - terminal:

     ```bash
     curl http://localhost:8080/deteccoes/1
     ```

     No PowerShell do Windows use `curl.exe` (o `curl` do PowerShell 5.1 é outro comando).
6. Opcional: no console do H2 (seção 4), `SELECT * FROM DETECCAO_EPI` mostra a mesma linha.

Para criar um registro sem o app — por exemplo, para testar a API isolada:

```bash
curl -X POST http://localhost:8080/deteccoes -H "Content-Type: application/json" -d '{"nomeOperador":"Carlos Silva","matricula":"OP-117","setor":"Soldagem A","descricaoCamera":"CAM-03 - Soldagem","capacete":"N","colete":"S","luva":"N","oculos":"S","botina":"S","confianca":94.5}'
```

```powershell
# Windows (PowerShell)
Invoke-RestMethod -Method Post -Uri http://localhost:8080/deteccoes -ContentType "application/json" -Body '{"nomeOperador":"Carlos Silva","matricula":"OP-117","setor":"Soldagem A","descricaoCamera":"CAM-03 - Soldagem","capacete":"N","colete":"S","luva":"N","oculos":"S","botina":"S","confianca":94.5}'
```

---

## 10. Parar o backend e ver o app sem dados

1. No terminal da API, `Ctrl+C`.
2. No app, recarregue (tecla `r` no terminal do Expo) ou navegue: Home e Lista
   consultam a API toda vez que ganham foco, e o Detalhe ao abrir.

| Tela | Enquanto tenta | Depois da falha |
|---|---|---|
| Home | spinner "Consultando a API..." | 📡 **Backend indisponível** — "Não foi possível conectar ao backend em `<BASE_URL>`. Suba a API Spring Boot e toque em Tentar novamente." + botão **🔄 Tentar novamente**. Nenhum KPI aparece. |
| Lista | spinner "Buscando detecções na API..." | cabeçalho "Sem conexão com a API" e 📡 **Backend indisponível** com a BASE_URL + **🔄 Tentar novamente**. Sem cards e sem filtros. |
| Detalhe | spinner "Carregando detecção #id..." | 📡 **Não foi possível carregar** com a BASE_URL + **🔄 Tentar novamente** e **← Voltar**. |
| Cadastro | botão "Enviando para a API..." | alerta **Erro ao salvar** — "Não foi possível enviar o registro para `<BASE_URL>`. Verifique se a API Spring Boot está rodando." Nada é gravado. |

No emulador o erro aparece em instantes (conexão recusada). No celular físico pode
levar até 10 s, o `timeout` do Axios, dependendo do firewall do computador.

3. Suba a API de novo (`mvn spring-boot:run`) e toque em **Tentar novamente**: os
   dados voltam, inclusive os cadastrados antes de parar, porque o H2 grava em arquivo.

---

## 11. Vídeo

<<PREENCHER: link YouTube não listado>>

Roteiro da gravação: [`docs/roteiro-video.md`](docs/roteiro-video.md).
