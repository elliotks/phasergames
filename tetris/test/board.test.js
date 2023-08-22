import Board from "../src/board";
import Tetronimo from "../src/tetronimo";

describe("Board class", () => {
    it("should exist", () => {
        expect(Board).toBeDefined();
    });

    it("constructor builds board", () => {
        const board = new Board();

        expect(board.board.length).toBe(board.height);
        expect(board.board[0].length).toBe(board.width);
    });

    it("add tetronimo to board", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);
        expect(board.board[0][0]).toBe(tetronimo);
    });

    it("return board tetronimos", () => {
        const board = new Board();
        const tetronimo1 = new Tetronimo(0, 0, "L");
        const tetronimo2 = new Tetronimo(4, 4, "L");
        const tetronimo3 = new Tetronimo(2, 2, "L");

        board.add(tetronimo1);
        expect(board.tetronimos).toEqual([tetronimo1]);

        board.add(tetronimo2);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo2]);

        board.add(tetronimo3);
        expect(board.tetronimos).toEqual([tetronimo1, tetronimo3, tetronimo2]);
    });

    it.only("moves down floating elements", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 0, "L");

        board.add(tetronimo);

        expect(board.board[0][0]).toBe(tetronimo);
        expect(board.board[0][0].y).toBe(0);
        expect(board.board[0][0].floating).toBe(true);

        Array(board.height-1).fill(0).forEach((_,i) => {
            expect(board.board[i][0]).toBe(tetronimo);
            expect(board.board[i][0].y).toBe(i);
            expect(board.board[i][0].floating).toBe(true);

            if (i>0) {
                expect(board.board[i-1][0]).toBe(false);
            }
            board.move();
        })

        expect(board.board[board.height - 1][0]).toBe(tetronimo);
        expect(board.board[board.height - 1][0].y).toBe(board.height - 1);
        expect(board.board[board.height - 1][0].floating).toBe(false);
    });

    it("changes state of tetronimo to touchdown when hitting bottom", () => {
        const board = new Board();
        const tetronimo = new Tetronimo(0, 18, "L");

        board.add(tetronimo);

        expect(board.board[18][0]).toBe(tetronimo);
        expect(board.board[18][0].y).toBe(18);
        expect(board.board[18][0].floating).toBe(true);

        board.move();

        expect(board.board[19][0]).toBe(tetronimo);
        expect(board.board[19][0].y).toBe(19);
        expect(board.board[19][0].floating).toBe(true);
    });
});
