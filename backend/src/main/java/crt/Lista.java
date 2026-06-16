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

/** Lista encadeada de pixels — representa uma scanline da tela CRT. */
public class Lista {
    Pixel head;
    Pixel tail;
    private int size;

    /** Adiciona um pixel ao final da lista. */
    public void addPixel(int value) {
        Pixel novo = new Pixel(value);
        if (head == null) {
            head = tail = novo;
        } else {
            tail.next = novo;
            tail = novo;
        }
        size++;
    }

    /** Retorna o valor do pixel na posição {@code index} (0-based). */
    public int getPixel(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException(index);
        Pixel current = head;
        for (int i = 0; i < index; i++) current = current.next;
        return current.value;
    }

    /** Define o valor do pixel na posição {@code index} (0-based). */
    public void setPixel(int index, int value) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException(index);
        Pixel current = head;
        for (int i = 0; i < index; i++) current = current.next;
        current.value = value;
    }

    /** Remove todos os pixels da lista. */
    public void clear() {
        head = tail = null;
        size = 0;
    }

    public int size() {
        return size;
    }
}
