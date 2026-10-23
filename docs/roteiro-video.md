# Roteiro do vídeo — VisionEPI, entrega final (Sprint 4)

> **Publicação no YouTube: visibilidade NÃO LISTADO.**
> Não use **Privado** (o professor não consegue abrir) e não publique como **Shorts**:
> grave na **horizontal** (16:9, ex.: 1920×1080). Depois de publicar, copie o link e
> substitua `LINK_DO_VIDEO_AQUI` na seção 11 do `README.md`.

Duração alvo: **até 5 minutos**. Os tempos abaixo somam 4:50.

---

## Antes de gravar (não entra no tempo)

1. **Banco com dados.** Suba a API uma vez (em `visionepi-api`: `.\mvnw.cmd spring-boot:run` no Windows, `./mvnw spring-boot:run` no Linux/macOS),
   crie dois registros com os comandos abaixo (Git Bash) e pare a API com `Ctrl+C`.
   Como o H2 grava em arquivo, eles vão aparecer quando a API subir no vídeo.

   ```bash
   curl -X POST http://localhost:8080/deteccoes -H "Content-Type: application/json" -d '{"nomeOperador":"Carlos Silva","matricula":"OP-117","setor":"Soldagem A","descricaoCamera":"CAM-03 - Soldagem","capacete":"N","colete":"S","luva":"N","oculos":"S","botina":"S","confianca":94.5}'
   curl -X POST http://localhost:8080/deteccoes -H "Content-Type: application/json" -d '{"nomeOperador":"Marina Costa","matricula":"OP-204","setor":"Caldeiraria","descricaoCamera":"CAM-04 - Caldeiraria","capacete":"N","colete":"N","luva":"S","oculos":"S","botina":"S","confianca":88.0}'
   ```

   Essa primeira execução também compila o projeto, então no vídeo a API sobe mais rápido.
2. **App aberto.** Em outro terminal, em `visionepi-mobile`: `npx expo start` e abra no
   dispositivo escolhido:
   - **Emulador Android (recomendado para gravar):** tecla `a`. Não precisa de `.env`
     (a BASE_URL padrão no Android é `http://10.0.2.2:8080`), e tudo cabe numa tela só.
   - **Celular físico:** crie o `.env` com `EXPO_PUBLIC_API_URL=http://<IP-DA-MÁQUINA>:8080`,
     rode `npx expo start --clear` e espelhe a tela do celular no computador para a
     gravação ficar horizontal.
3. **Navegador** com três abas: README do `visionepi-mobile` no GitHub, repositório
   `visionepi-api` no GitHub e `http://localhost:8080/deteccoes`.
4. **Layout da tela:** navegador de um lado, emulador (ou espelho do celular) do outro e
   o terminal da API visível embaixo. Silencie notificações.

---

## 1. README e os dois repositórios — 0:00–0:40

**Tela:** GitHub do `visionepi-mobile`, rolando o README pelas seções (pré-requisitos,
subir backend, subir app, BASE_URL, endpoints). Clique no link do `visionepi-api`.

**Fala sugerida:**
> "Somos o grupo do VisionEPI: Pedro Gonçalves, Lucas Baraldi, Lucas Zolla e Vitor
> Pantarotto. O VisionEPI registra as detecções de EPI feitas por câmeras na indústria —
> quem estava no frame, quais EPIs foram identificados e o nível de risco. A entrega tem
> dois repositórios: o app em Expo, com este README completo — pré-requisitos, como subir,
> BASE_URL e endpoints —, e a API em Spring Boot com banco H2 em arquivo."

## 2. Backend no ar e JSON no navegador — 0:40–1:30

**Terminal da API:**

```bash
cd visionepi-api
./mvnw spring-boot:run   # Windows: .\mvnw.cmd spring-boot:run
```

Espere aparecer `Started VisionepiApplication`. **Navegador:** recarregue
`http://localhost:8080/deteccoes` e mostre o JSON com os dois registros.

**Fala sugerida:**
> "Subimos a API com o Maven Wrapper (`mvnw spring-boot:run`), em Java 17, na porta 8080. No navegador, o
> GET em `/deteccoes` devolve o JSON. Esses dois registros foram criados antes da gravação
> e continuam aqui depois de reiniciar a API, porque o H2 grava em arquivo, na pasta `data`."

## 3. App listando da API — 1:30–2:15

**Emulador:** mostre a Home (KPIs: Detecções 2, Críticas 1), toque em **Ver Registros**
(mesmos dois registros do navegador) e abra um card para mostrar o Detalhe.

**Fala sugerida:**
> "No app, a Home faz duas chamadas em paralelo com `Promise.all` — `GET /deteccoes` e
> `GET /deteccoes?nivelRiscoMinimo=4` — e monta os indicadores. A Lista mostra os mesmos
> registros do navegador. Nenhuma tela chama o Axios direto: tudo passa pelo
> `deteccaoService`, e não existe dado mockado. No emulador Android a BASE_URL padrão é
> `10.0.2.2`, que aponta para o computador."

## 4. Cadastro no app → mesmo registro no navegador — 2:15–3:15

**Emulador:** na Lista toque em **＋**. Preencha:

| Campo | Valor |
|---|---|
| Nome do Operador | Ana Souza |
| Matrícula | OP-310 |
| Setor | Montagem |
| Câmera | CAM-02 - Montagem |
| EPIs | desmarque **Capacete** e **Luva** |
| Confiança | 91 |

Toque em **💾 Salvar Registro**. O alerta mostra "Detecção #*ID* registrada na API
(nível de risco 3/5)" — anote o ID. Toque em **Ver Lista** e mostre o registro novo.

**Navegador:** abra `http://localhost:8080/deteccoes/<ID>` (ou recarregue
`/deteccoes`) e mostre o mesmo registro com `"nivelRisco":3`.

**Fala sugerida:**
> "Agora um cadastro pelo app: é um `POST /deteccoes`. O app envia os EPIs como S ou N e
> quem calcula o risco é o backend — sem capacete e sem luva dá 3. O alerta mostra o ID
> que a API devolveu, e no navegador o mesmo registro aparece no GET."

## 5. Derrubar o backend — 3:15–3:40

**Terminal da API (visível):** `Ctrl+C` e espere o prompt voltar. No Windows o terminal
pode perguntar se deseja finalizar o arquivo em lotes (S/N) — responda `S`.

**Fala sugerida:**
> "Agora paramos o backend com Ctrl+C. O terminal mostra que a API não está mais rodando."

## 6. App sem backend: carregando → erro, sem dados — 3:40–4:30

**Emulador (ainda na Lista, onde o bloco 4 terminou):** puxe a lista para baixo para
atualizar. Os cards somem: cabeçalho "Sem conexão com a API", **📡 Backend
indisponível** com a BASE_URL e o botão **🔄 Tentar novamente**.

**Terminal do Expo:** tecla `r` para recarregar o app inteiro.
**Emulador:** a Home mostra "Consultando a API..." e em seguida **📡 Backend
indisponível**, com a BASE_URL e **🔄 Tentar novamente**. Toque em **Tentar novamente**:
carrega e falha de novo. Nenhum KPI aparece.

> Na Home em estado de erro não há botões de navegação — por isso a Lista vem antes do
> reload.

**Fala sugerida:**
> "Com o backend fora, ao atualizar a Lista os registros somem e aparece o erro. Recarregando
> o app, a Home mostra o carregamento e depois o erro, com o endereço que ela tentou acessar
> e o botão Tentar novamente. Nenhum indicador nem registro aparece: como não há mock, sem
> backend o app fica sem dados — e avisa o usuário em vez de quebrar."

## Encerramento — 4:30–4:50

**Tela:** volte ao README no GitHub.

**Fala sugerida:**
> "Os dois repositórios e o passo a passo para reproduzir estão no README. Obrigado!"
