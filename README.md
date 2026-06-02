# 📺 Simulador de TV de Tubos (CRT)

Projeto da disciplina **COMP0497 — Algoritmos e Estruturas de Dados I**  
UFS DCOMP — Semestre 2026.1

---

## Sobre

Simulador de televisor CRT que utiliza uma **multilista encadeada** implementada do zero como estrutura central para representar a grade de pixels da tela. O feixe de elétrons varrendo pixel a pixel é literalmente um traversal da lista — tornando a estrutura de dados visível e animada.

**Stack:**
- Backend: Java 17 + Javalin 6 + Maven
- Frontend: React + Vite + Tailwind CSS + Canvas API
- Comunicação: WebSocket (frames) + REST (comandos)
- Infraestrutura: Docker + Docker Compose

---

## Estrutura do Repositório

```
crt-simulator/
├── backend/          # Java — multilista, motor CRT, servidor HTTP
├── frontend/         # React/Vite — tela CRT, painel debug, controles
├── docs/             # Documentação de arquitetura
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento (hot reload)
└── README.md
```

---

## Rodando com Docker

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

> Funciona em Linux, macOS e Windows (via Docker Desktop ou WSL2).

### Desenvolvimento (hot reload)

```bash
docker compose -f docker-compose.dev.yml up
```

- Backend disponível em: `http://localhost:7070`
- Frontend disponível em: `http://localhost:5173`
- Alterações no código refletem automaticamente sem rebuild.

### Produção

```bash
docker compose up --build
```

- Aplicação disponível em: `http://localhost:80`

---

## Rodando sem Docker (desenvolvimento local)

### Backend

```bash
cd backend
./mvnw spring-boot:run   # ou: mvn compile exec:java
```

Requer Java 17+ e Maven instalados.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Requer Node.js 18+.

---

## Documentação

- [Arquitetura e Escopo do Projeto](docs/simulador_crt_arquitetura.docx)

---

## Equipe

| Membro | Módulos |
|--------|---------|
| — | `model.PixelNode` + `model.MultiList` |
| — | `engine.CRTEngine` + `engine.ScanlineEngine` |
| — | `engine.PhosphorDecay` + `engine.NoiseGenerator` + `engine.GhostingEffect` |
| — | Frontend: `CRTScreen` + `crtEffects.js` + `useWebSocket` |
| — | `api.ApiRouter` + `FrameSerializer` + `DebugPanel` + `Main` |

---

## Convenções de Branch

```
main          # estável, sempre funcional
dev           # integração contínua
feat/nome     # funcionalidades novas
fix/nome      # correções
```

Pull requests sempre para `dev`. Merge para `main` apenas quando estável.
