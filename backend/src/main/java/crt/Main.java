package crt;

import io.javalin.Javalin;

public class Main {

    private static final int ROWS = 30;
    private static final int COLS = 60;

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
            if ("xadrez".equals(name)) {
                for (int r = 0; r < ROWS; r++)
                    for (int c = 0; c < COLS; c++)
                        if ((r + c) % 2 == 0) tela.setPixel(r, c, 255);
            } else if ("borda".equals(name)) {
                for (int c = 0; c < COLS; c++) { tela.setPixel(0, c, 255); tela.setPixel(ROWS - 1, c, 255); }
                for (int r = 0; r < ROWS; r++) { tela.setPixel(r, 0, 255); tela.setPixel(r, COLS - 1, 255); }
            } else if ("onda".equals(name)) {
                for (int c = 0; c < COLS; c++) {
                    int r = (int) ((Math.sin(c * Math.PI / 10) + 1) / 2 * (ROWS - 1));
                    tela.setPixel(r, c, 255);
                    if (r + 1 < ROWS) tela.setPixel(r + 1, c, 180);
                }
            }
            ctx.status(204);
        });
    }

    record PixelRequest(int row, int col, int value) {}
}
