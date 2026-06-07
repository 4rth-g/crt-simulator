# Simulador de TV de Tubos (CRT)

Projeto da disciplina **COMP0497 — Algoritmos e Estruturas de Dados I**
UFS DCOMP — Semestre 2026.1

---

## Sobre

Simulador de televisor CRT onde a tela é representada por uma **multilista encadeada** implementada do zero. Cada linha da grade é uma `Lista` encadeada de `Pixel`s — o traversal da estrutura é a varredura da tela.

**Stack:**
- Backend: Java 17 + Javalin 6 + Maven
- Frontend: React 18 + Vite + Tailwind CSS + Canvas API
- Comunicação: REST
- Infra: Docker + Docker Compose

---

## Estrutura

```
crt-simulator/
├── backend/src/main/java/crt/
│   ├── Pixel.java       # nó da lista (value + next)
│   ├── Lista.java       # lista encadeada de pixels (uma scanline)
│   ├── Multilista.java  # grade completa: array de Lista[]
│   └── Main.java        # servidor Javalin + endpoints REST
├── frontend/src/
│   ├── App.jsx          # estado global + fetch
│   └── components/
│       ├── PixelGrid.jsx  # canvas — renderiza a grade
│       └── Controls.jsx   # botões de ação
├── docker-compose.yml          # produção
└── docker-compose.dev.yml      # desenvolvimento (hot reload)
```

---

## Rodando

### Com Docker (recomendado)

```bash
# Desenvolvimento — backend:7070, frontend:5173
docker compose -f docker-compose.dev.yml up

# Produção — porta 80
docker compose up --build
```

### Sem Docker

```bash
# Backend
cd backend && mvn compile exec:java

# Frontend
cd frontend && npm install && npm run dev
```

---

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/state` | Retorna a grade completa como `int[][]` |
| `POST` | `/api/pixel` | `{ row, col, value }` — seta um pixel |
| `POST` | `/api/clear` | Zera toda a grade |
