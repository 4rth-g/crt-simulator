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

/** Nó da lista encadeada — representa um pixel da tela. */
public class Pixel {
    int value;
    Pixel next;

    Pixel(int value) {
        this.value = value;
    }
}
