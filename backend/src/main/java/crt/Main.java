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
    }

    record PixelRequest(int row, int col, int value) {}
}
