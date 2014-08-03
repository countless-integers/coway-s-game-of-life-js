/**
 * For rules see:
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 */
//(function () {

    function Cell (state, x, y, board) {
        this.state = state;

        // naive check
        if (!board instanceof Board) {
            throw new Error('Board is supposed to be a Board object instance');
        }
        this.board = board;

        if (!x instanceof Number || !y instanceof Number) {
            throw new Error('x and y are supposed to be numbers representing cell position on the board');
        }
        this.x = x;
        this.y = y;
    }
    
    Cell.prototype = {
        isAlive: function () {
            return this.state;
        },

        willBeAlive: function () {
            var neighbouringLiveCells = 0
                + this.isLifeAbove()
                + this.isLifeRightAbove()
                + this.isLifeRight()
                + this.isLifeRightBellow()
                + this.isLifeBellow()
                + this.isLifeLeftBellow()
                + this.isLifeLeft()
                + this.isLifeLeftAbove()
            ;
            
            // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
            if (this.state === 1 && neighbouringLiveCells < 2) {
                return 0;
            }
            // Any live cell with two or three live neighbours lives on to the next generation.
            if (this.state === 1 && (neighbouringLiveCells >= 2 && neighbouringLiveCells <= 3)) {
                return 1;
            }
            // Any live cell with more than three live neighbours dies, as if by overcrowding.
            if (this.state === 1 && neighbouringLiveCells > 3) {
                return 0;
            }
            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            if (this.state === 0 && neighbouringLiveCells === 3) {
                return 1;
            }

            // so only dead cells with no living neighbours should make it up to here
            return 0;
        },

        isLifeAbove: function () {
            if (this.y <= 0) {
                return 0;
            }
            return this.board.state[this.y - 1][this.x];
        }, 

        isLifeRightAbove: function () {
            if (
                this.x >= (this.board.state[0].length - 1)
                || this.y <= 0
            ) {
                return 0;
            }
            return this.board.state[this.y - 1][this.x + 1];
        }, 

        isLifeRight: function () {
            if (this.x >= (this.board.state[0].length - 1)) {
                return 0;
            }
            return this.board.state[this.y][this.x + 1];
        }, 

        isLifeRightBellow: function () {
            if (
                this.x >= (this.board.state[0].length - 1)
                || this.y >= (this.board.state.length - 1)
            ) {
                return 0;
            }
            return this.board.state[this.y + 1][this.x + 1];
        }, 

        isLifeBellow: function () {
            if (this.y >= (this.board.state.length - 1)) {
                return 0;
            }
            return this.board.state[this.y + 1][this.x];
        }, 

        isLifeLeftBellow: function () {
            if (
                this.x <= 0
                || this.y >= (this.board.state.length - 1)
            ) {
                return 0;
            }
            return this.board.state[this.y + 1][this.x - 1];
        }, 

        isLifeLeft: function () {
            if (this.x <= 0) {
                return 0;
            }
            return this.board.state[this.y][this.x - 1];
        }, 

        isLifeLeftAbove: function () {
            if (
                this.x <= 0
                || this.y <= 0
            ) {
                return 0;
            }
            return this.board.state[this.y - 1][this.x - 1];
        }, 

        setState: function (value) {
            if (value !== 1 && value !== 0) {
                throw new Error('Cell state can only be a number of 0 or 1. You passed ' + value);
            }
            this.state = value;
            return this;
        },

        toggleState: function () {
            this.setState(!!this.isAlive() ? 0 : 1);
            return this;
        },

        toString: function () {
            return this.isAlive();
        }
    };

    /**
     * Exemplary initial state. Ones denote living, zeros dead cells.
     * [
     *  [ 0, 0, 0, 0, 0 ],
     *  [ 0, 0, 0, 0, 0 ],
     *  [ 0, 1, 1, 1, 0 ],
     *  [ 0, 0, 0, 0, 0 ],
     *  [ 0, 0, 0, 0, 0 ],
     *  [ 0, 0, 0, 0, 0 ],
     * ]
     */
    function Board (initialState) {
        // this is an implementation detail and should not be exposed
        // it also makes the whole thing fault prone
        // the actual meat of this object, that is the board property,
        // uses this array as a reference for calculating the next generation
        // state. this.board cannot refere to itself for performing that calculation
        // as it mutating itself
        this.state = initialState.clone();

        this.height = this.state.length;
        this.width = this.state[0].length;

        this.generationNo = 0;

        this.board = this.state.clone();
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                // last state is passed as a context, because state will be modified
                // by the model
                this.board[y][x] = new Cell(this.state[y][x], x, y, this);
            }
        }
    };

    Board.prototype = {
        getArrayCopy: function() {
            var state = [];
            for (var y = 0; y < this.board.length; y++) {
                state.push([]);
                for (var x = 0; x < this.board[y].length; x++) {
                    state[y][x] = this.board[y][x].isAlive();
                }
            }
            return state;
        },

        // spawn next generation
        next: function () {
            this.state = this.getArrayCopy();

            var newState = this.state.clone(),
                cellState;
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    cellState = this.board[y][x].willBeAlive();

                    newState[y][x] = cellState;
                    this.board[y][x].setState(cellState);
                }
            }

            this.state = newState;

            this.generationNo++;

            return this;
        },

        resetGenerationNo: function () {
            this.generationNo = 0;
            return this;
        },

        reset: function () {
            var newState = this.state.clone(),
                cellState;
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    cellState = this.board[y][x].willBeAlive();

                    newState[y][x] = 0;
                    this.board[y][x].setState(0);
                }
            }

            this.state = newState;

            this.resetGenerationNo();

            return this;
        },

        // print string representation of the board state
        toString: function () {
            return this.board.map(function (row) {
                return row.join(' ');
            }).join('\n');
        }
    };

    Array.prototype.clone = function() {
        var arr = this.slice(0);
        for( var i = 0; i < this.length; i++ ) {
            if( this[i].clone ) {
                //recursion
                arr[i] = this[i].clone();
            }
        }
        return arr;
    }

    // for testing purposes only
    function display(board) {
        var element = document.createElement('pre');
        document.body.appendChild(element);

        setInterval(function ()  {
            element.innerText = board + '';
            board.next();
        }, 1000);
    }

//})();
