'use strict';

var module = angular.module('conway', []);

module
.controller('BoardCtrl', ['$scope', 'boardService', function ($scope, boardService) {
    var board = boardService.makeBoard([
        [ 0, 0, 0, 0, 0, 0, 0, ],
        [ 0, 0, 0, 0, 0, 0, 0, ],
        [ 0, 0, 0, 1, 1, 1, 0, ],
        [ 0, 0, 1, 1, 1, 0, 0, ],
        [ 0, 0, 0, 0, 0, 0, 0, ],
        [ 0, 0, 0, 0, 0, 0, 0, ],
        [ 0, 0, 0, 0, 0, 0, 0, ],
    ]);
    console.log(board.state);

    $scope.board = board;


    $scope.board = board;
    $scope.columns = board.width;
    $scope.rows = board.height;
    $scope.makeBoard = function (rows, columns) {
        $scope.stop();
        var proto = [];
        for (var y = 0; y < rows; y++) {
            proto.push([]);
            for (var x = 0; x < columns; x++) {
                proto[y].push(0);
            }
        }
        board = boardService.makeBoard(proto);
        console.log(board);
        $scope.board = board;
    }

    $scope.updateBoard = function (board) {
        console.log(board);
    };

    $scope.interval = 2;

    var timer;
    $scope.play = function () {
        if (timer) return false;
        var interval = $scope.interval * 1e3;
        timer = setInterval(function () {
            board.next();
            $scope.$apply();
        }, interval);
    };
    $scope.stop = function () {
        clearInterval(timer);
        timer = null;
    };
    $scope.next = function () {
        $scope.stop();
        board.next();
    };
    $scope.reset = function () {
        $scope.stop();
        board.reset();
    };
    $scope.isPlaying = function () {
        return !!timer;
    };
}])
.directive('board', function () {
    return {
        restrict: 'E',
        scope: {
            source: '=source',
        },
        templateUrl: './templates/board.html'
    };
})
.factory('boardService', function () {
    return {
        makeBoard: function (array) {
            return new Board(array);
        }
    };
})
.filter('ordinal', function() {
    // taken from: https://github.com/jdpedrie/angularjs-ordinal-filter
    var ordinal = function(input) {
        // Only process numeric values.
        if (isNaN(input) || input === null) return input;

        var s=["th","st","nd","rd"],
            v=input%100;

        return input+(s[(v-20)%10]||s[v]||s[0]);
    }

    return ordinal;
});
