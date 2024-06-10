// static/js/chess.js
document.addEventListener("DOMContentLoaded", () => {
    const chessboardElement = document.getElementById('chessboard');
    
    // Pieces data, replace this with a fetch or dynamic source if needed
    const initialPieces = {
        "white": [
            { "name": "pawn", "colour": "white", "row": 2, "column": 1 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 2 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 3 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 4 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 5 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 6 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 7 },
            { "name": "pawn", "colour": "white", "row": 2, "column": 8 },
            { "name": "rook", "colour": "white", "row": 1, "column": 1 },
            { "name": "knight", "colour": "white", "row": 1, "column": 2 },
            { "name": "bishop", "colour": "white", "row": 1, "column": 3 },
            { "name": "queen", "colour": "white", "row": 1, "column": 4 },
            { "name": "king", "colour": "white", "row": 1, "column": 5 },
            { "name": "bishop", "colour": "white", "row": 1, "column": 6 },
            { "name": "knight", "colour": "white", "row": 1, "column": 7 },
            { "name": "rook", "colour": "white", "row": 1, "column": 8 }
        ],
        "black": [
            { "name": "pawn", "colour": "black", "row": 7, "column": 1 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 2 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 3 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 4 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 5 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 6 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 7 },
            { "name": "pawn", "colour": "black", "row": 7, "column": 8 },
            { "name": "rook", "colour": "black", "row": 8, "column": 1 },
            { "name": "knight", "colour": "black", "row": 8, "column": 2 },
            { "name": "bishop", "colour": "black", "row": 8, "column": 3 },
            { "name": "queen", "colour": "black", "row": 8, "column": 4 },
            { "name": "king", "colour": "black", "row": 8, "column": 5 },
            { "name": "bishop", "colour": "black", "row": 8, "column": 6 },
            { "name": "knight", "colour": "black", "row": 8, "column": 7 },
            { "name": "rook", "colour": "black", "row": 8, "column": 8 }
        ]
    };

    const graphicVectorStore = {
        "white": {
            "pawn": "/static/pieces_svg/wP.svg",
            "rook": "/static/pieces_svg/wR.svg",
            "knight": "/static/pieces_svg/wN.svg",
            "bishop": "/static/pieces_svg/wB.svg",
            "queen": "/static/pieces_svg/wQ.svg",
            "king": "/static/pieces_svg/wK.svg"
        },
        "black": {
            "pawn": "/static/pieces_svg/bP.svg",
            "rook": "/static/pieces_svg/bR.svg",
            "knight": "/static/pieces_svg/bN.svg",
            "bishop": "/static/pieces_svg/bB.svg",
            "queen": "/static/pieces_svg/bQ.svg",
            "king": "/static/pieces_svg/bK.svg"
        }
    };

    const renderBoard = () => {
        chessboardElement.innerHTML = '';

        for (let row = 8; row >= 1; row--) {
            for (let column = 1; column <= 8; column++) {
                const square = document.createElement('div');
                const isWhiteSquare = (row + column) % 2 === 0;
                square.className = `square ${isWhiteSquare ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.column = column;
                chessboardElement.appendChild(square);
            }
        }

        // Place the initial pieces on the board
        initialPieces.white.forEach(piece => placePiece(piece));
        initialPieces.black.forEach(piece => placePiece(piece));
    };

    const placePiece = (piece) => {
        const { name, colour, row, column } = piece;
        const index = (8 - row) * 8 + (column - 1);
        const pieceElement = document.createElement('img');
        pieceElement.src = graphicVectorStore[colour][name];
        pieceElement.className = 'piece';
        pieceElement.draggable = true;
        pieceElement.dataset.row = row;
        pieceElement.dataset.column = column;
        pieceElement.dataset.colour = colour;
        pieceElement.dataset.name = name;
        chessboardElement.children[index].appendChild(pieceElement);
    };

    renderBoard();
});
