/*
 * TV Tubo Simulator — COMP0497 Algoritmos e Estruturas de Dados I (UFS, 2026.1)
 * Equipe G12:
 *   Arthur de Azevedo Grazzia
 *   João Herman Souza de Araújo
 *   João Vitor Vital Leão
 *   Renato Veloso Pires Filho
 *   Wilson Fernandes Carneiro Júnior
 */
package crt;

/**
 * Grade de pixels da tela CRT.
 * Cada linha é uma {@link Lista} encadeada de {@link Pixel}s.
 */
public class Multilista {
    private final Lista[] rows;
    private final int numRows;
    private final int numCols;

    /** Cria a grade e inicializa todos os pixels com valor 0. */
    public Multilista(int rows, int cols) {
        this.numRows = rows;
        this.numCols = cols;
        this.rows = new Lista[rows];
        for (int i = 0; i < rows; i++) {
            this.rows[i] = new Lista();
            for (int j = 0; j < cols; j++) {
                this.rows[i].addPixel(0);
            }
        }
    }

    /** Retorna a scanline da linha {@code row}. */
    public Lista getRow(int row) {
        if (row < 0 || row >= numRows) throw new IndexOutOfBoundsException(row);
        return rows[row];
    }

    /** Retorna o valor do pixel em (row, col). */
    public int getPixel(int row, int col) {
        return getRow(row).getPixel(col);
    }

    /** Define o valor do pixel em (row, col). */
    public void setPixel(int row, int col, int value) {
        getRow(row).setPixel(col, value);
    }

    /** Zera todos os pixels da grade. */
    public void clear() {
        for (Lista row : rows) row.clear();
        for (int i = 0; i < numRows; i++)
            for (int j = 0; j < numCols; j++)
                rows[i].addPixel(0);
    }

    public int getNumRows() { return numRows; }
    public int getNumCols() { return numCols; }
}
