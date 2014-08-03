describe("known oscillators behaviour", function() {

    it('oscillates like a blinker', function () {
        var blinker = [
                [ 0, 0, 0, ],
                [ 1, 1, 1, ],
                [ 0, 0, 0, ],
            ],
            board = new Board(blinker);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual([
            [ 0, 1, 0, ],
            [ 0, 1, 0, ],
            [ 0, 1, 0, ],
        ]);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual(blinker);
    });

    it('oscillates like a toad', function () {
        var toad = [
                [ 0, 0, 0, 0, ],
                [ 0, 1, 1, 1, ],
                [ 1, 1, 1, 0, ],
                [ 0, 0, 0, 0, ],
            ],
            board = new Board(toad);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual([
            [ 0, 0, 1, 0, ],
            [ 1, 0, 0, 1, ],
            [ 1, 0, 0, 1, ],
            [ 0, 1, 0, 0, ],
        ]);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual(toad);
    });

    it('oscillates like a beacon', function () {
        var beacon = [
                [ 1, 1, 0, 0, ],
                [ 1, 0, 0, 0, ],
                [ 0, 0, 0, 1, ],
                [ 0, 0, 1, 1, ],
            ],
            board = new Board(beacon);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual([
            [ 1, 1, 0, 0, ],
            [ 1, 1, 0, 0, ],
            [ 0, 0, 1, 1, ],
            [ 0, 0, 1, 1, ],
        ]);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual(beacon);
    });

});

describe('still-lifes', function () {

    it('is still as a block', function () {
        var block = [
                [ 0, 0, 0, 0, ],
                [ 0, 1, 1, 0, ],
                [ 0, 1, 1, 0, ],
                [ 0, 0, 0, 0, ],
            ],
            board = new Board(block);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual([
            [ 0, 0, 0, 0, ],
            [ 0, 1, 1, 0, ],
            [ 0, 1, 1, 0, ],
            [ 0, 0, 0, 0, ],
        ]);

        board.next();

        console.log(board.toString());

        expect(board.state).toEqual(block);
    })

});
