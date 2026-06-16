package crt;

import io.javalin.Javalin;

public class Main {

    private static final int ROWS = 40;
    private static final int COLS = 80;

    public static void main(String[] args) {
        Multilista tela = new Multilista(ROWS, COLS);

        Javalin app = Javalin.create(config ->
            config.bundledPlugins.enableCors(cors ->
                cors.addRule(rule -> rule.anyHost())
            )
        ).start(7070);

        app.get("/api/state", ctx -> {
            int[][] grid = new int[ROWS][COLS];
            for (int r = 0; r < ROWS; r++)
                for (int c = 0; c < COLS; c++)
                    grid[r][c] = tela.getPixel(r, c);
            ctx.json(grid);
        });

        app.post("/api/pixel", ctx -> {
            var body = ctx.bodyAsClass(PixelRequest.class);
            tela.setPixel(body.row(), body.col(), body.value());
            ctx.status(204);
        });

        app.post("/api/clear", ctx -> {
            tela.clear();
            ctx.status(204);
        });

        app.post("/api/pattern", ctx -> {
            String name = ctx.queryParam("name");
            tela.clear();
            switch (name != null ? name : "") {
                case "xadrez"     -> xadrez(tela);
                case "borda"      -> borda(tela);
                case "onda"       -> onda(tela);
                case "solido"     -> solido(tela);
                case "vertical"   -> vertical(tela);
                case "horizontal" -> horizontal(tela);
                case "grade"      -> grade(tela);
                case "circulo"    -> circulo(tela);
                case "gradiente"  -> gradiente(tela);
                case "diagonal"   -> diagonal(tela);
                case "coracao"    -> coracao(tela);
                case "arvore"     -> arvore(tela);
                case "estrela"    -> estrela(tela);
            }
            ctx.status(204);
        });
    }

    // ── Padrões ──────────────────────────────────────────────────────────────

    /** Tela inteiramente acesa — demonstra todos os nós da multilista ativos. */
    private static void solido(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                t.setPixel(r, c, 255);
    }

    /** Faixas verticais alternadas — acende colunas pares. */
    private static void vertical(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (c % 2 == 0) t.setPixel(r, c, 255);
    }

    /** Faixas horizontais alternadas — acende linhas pares (scanlines). */
    private static void horizontal(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (r % 2 == 0) t.setPixel(r, c, 255);
    }

    /** Malha com espaçamento de 4 — linhas e colunas a cada 4 posições. */
    private static void grade(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (r % 4 == 0 || c % 4 == 0) t.setPixel(r, c, 255);
    }

    /** Disco sólido centralizado — demonstra acesso aleatório na multilista. */
    private static void circulo(Multilista t) {
        double cr = ROWS / 2.0, cc = COLS / 2.0;
        double raio = Math.min(ROWS, COLS) / 3.0;
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (Math.hypot(r - cr, c - cc) <= raio) t.setPixel(r, c, 255);
    }

    /** Gradiente horizontal de 0 a 255 — mostra intensidade variável do feixe. */
    private static void gradiente(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                t.setPixel(r, c, c * 255 / (COLS - 1));
    }

    /** Diagonais a cada 8 posições — percurso linear através da multilista. */
    private static void diagonal(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if ((r + c) % 8 == 0) t.setPixel(r, c, 255);
    }

    /** Tabuleiro de xadrez — pixels alternados. */
    private static void xadrez(Multilista t) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if ((r + c) % 2 == 0) t.setPixel(r, c, 255);
    }

    /** Borda retangular — perímetro da tela. */
    private static void borda(Multilista t) {
        for (int c = 0; c < COLS; c++) { t.setPixel(0, c, 255); t.setPixel(ROWS - 1, c, 255); }
        for (int r = 0; r < ROWS; r++) { t.setPixel(r, 0, 255); t.setPixel(r, COLS - 1, 255); }
    }

    /** Onda senoidal — varre colunas calculando a linha via seno. */
    private static void onda(Multilista t) {
        for (int c = 0; c < COLS; c++) {
            int r = (int) ((Math.sin(c * Math.PI / 10) + 1) / 2 * (ROWS - 1));
            t.setPixel(r, c, 255);
            if (r + 1 < ROWS) t.setPixel(r + 1, c, 180);
        }
    }

    // ── Padrões artísticos ───────────────────────────────────────────────────

    /**
     * Coração usando a equação implícita: (x²+y²-1)³ - x²y³ ≤ 0.
     * Cada pixel (r,c) é mapeado para coordenadas matemáticas normalizadas.
     */
    private static void coracao(Multilista t) {
        double cr = ROWS * 0.50, cc = COLS / 2.0;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                double x = (c - cc) / 13.0;
                double y = -(r - cr) / 10.0;
                double v = Math.pow(x*x + y*y - 1, 3) - x*x * y*y*y;
                if (v <= 0) t.setPixel(r, c, 255);
            }
        }
    }

    /**
     * Árvore de natal com 3 camadas triangulares sobrepostas e tronco.
     * Cada camada é um triângulo isósceles com vértice no topo e base na linha final.
     */
    private static void arvore(Multilista t) {
        int cc = COLS / 2;

        // Estrela no topo
        t.setPixel(0, cc, 255);
        for (int c = cc - 1; c <= cc + 1; c++) t.setPixel(1, c, 255);
        t.setPixel(2, cc, 255);

        // Camada 1 — topo (linhas 1-13)
        for (int r = 1; r <= 13; r++) {
            int h = (r - 1) * 9 / 12;
            for (int c = cc - h; c <= cc + h; c++) t.setPixel(r, c, 255);
        }

        // Camada 2 — meio (linhas 8-23)
        for (int r = 8; r <= 23; r++) {
            int h = (r - 8) * 13 / 15;
            for (int c = cc - h; c <= cc + h; c++) t.setPixel(r, c, 255);
        }

        // Camada 3 — base (linhas 16-32)
        for (int r = 16; r <= 32; r++) {
            int h = (r - 16) * 18 / 16;
            for (int c = Math.max(0, cc - h); c <= Math.min(COLS - 1, cc + h); c++)
                t.setPixel(r, c, 255);
        }

        // Tronco
        for (int r = 33; r <= 38; r++)
            for (int c = cc - 3; c <= cc + 3; c++) t.setPixel(r, c, 255);
    }

    /**
     * Estrela de 5 pontas preenchida usando ray-casting num polígono de 10 vértices
     * — 5 pontas externas (raio 14) alternadas com 5 côncavos internos (raio 5.5).
     */
    private static void estrela(Multilista t) {
        double cr = ROWS / 2.0, cc = COLS / 2.0;
        double ro = 14.0, ri = 5.5;
        double[] xv = new double[10], yv = new double[10];
        for (int i = 0; i < 10; i++) {
            double angle = Math.PI * i / 5 - Math.PI / 2;
            double radius = (i % 2 == 0) ? ro : ri;
            xv[i] = cc + radius * Math.cos(angle);
            yv[i] = cr + radius * Math.sin(angle);
        }
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (pontoNoPoligono(c, r, xv, yv)) t.setPixel(r, c, 255);
    }

    /** Ray-casting para testar se (px, py) está dentro de um polígono. */
    private static boolean pontoNoPoligono(double px, double py, double[] xv, double[] yv) {
        boolean inside = false;
        for (int i = 0, j = xv.length - 1; i < xv.length; j = i++) {
            if ((yv[i] > py) != (yv[j] > py) &&
                px < (xv[j] - xv[i]) * (py - yv[i]) / (yv[j] - yv[i]) + xv[i])
                inside = !inside;
        }
        return inside;
    }

    record PixelRequest(int row, int col, int value) {}
}
