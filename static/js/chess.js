// static/js/chess.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Event Listener")
    const chessboardElement = document.getElementById('chessboard');
    let selectedPiece = null;
    let isReceivingMove = false;  // Flag to prevent loopback

    const roomName = "{room_name}".replace(/[^a-zA-Z0-9_-]/g, '');
    console.log("room_name", roomName)
    
    const chessSocket = new WebSocket(
        `ws://${window.location.host}/ws/chess/${roomName}/`
    );

    chessSocket.onmessage = function(event) {
        console.log("onMessage received event", {event})
        // selectedPiece = null;
        const data = JSON.parse(event.data)["event"];
        console.log("onmessage data:", {data})
        if (data.type === 'chess_move') {
            handleReceivedMove(data.move, data.drag);
        }
    };

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

    const placePiece = (piece) => {
        console.log("JS Place piece")
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
        pieceElement.addEventListener('dragstart', onDragStart);
        pieceElement.addEventListener('dragend', onDragEnd);
        chessboardElement.children[index].appendChild(pieceElement);
    };

    const renderBoard = () => {
        console.log("JS Render Board")
        chessboardElement.innerHTML = '';

        for (let row = 8; row >= 1; row--) {
            for (let column = 1; column <= 8; column++) {
                const square = document.createElement('div');
                const isWhiteSquare = (row + column) % 2 === 0;
                square.className = `square ${isWhiteSquare ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.column = column;
                square.addEventListener('click', onSquareClick);
                chessboardElement.appendChild(square);
            }
        }

        // Place the initial pieces on the board
        initialPieces.white.forEach(piece => placePiece(piece));
        initialPieces.black.forEach(piece => placePiece(piece));
    };

    const onDragStart = (event) => {
        console.log("JS drag start")
        selectedPiece = event.target;
        console.log("selected piece", selectedPiece)
        selectedPiece.classList.add('dragging');
    };
    
    const onDragEnd = () => {
        console.log("JS drag end")
        if (selectedPiece) {
            selectedPiece.classList.remove('dragging');
            selectedPiece.style.zIndex = 100;
    
            // Get the final square where the piece was dropped
            const finalSquare = selectedPiece.parentElement;
    
            // Calculate the new position (row and column) based on the final square
            const row = parseInt(finalSquare.dataset.row);
            const column = parseInt(finalSquare.dataset.column);

            // Move the piece to the final square with a smooth transition
            movePieceToSquare(selectedPiece, finalSquare, row, column, drag=true);
            
            selectedPiece = null;
        }
    };

    const onSquareClick = (event) => {
        console.log("JS square click")
        const square = event.currentTarget;

        if (selectedPiece) {
            movePieceToSquare(selectedPiece, square, parseInt(square.dataset.row), parseInt(square.dataset.column));
            selectedPiece = null;
        } else if (square.firstChild) {
            selectedPiece = square.firstChild;
            selectedPiece.classList.add('highlight');
        }
    };

    const movePieceToSquare = (piece, square, row, column, drag = false) => {
        console.log("JS move piece to square")

        const startRow = parseInt(piece.dataset.row);
        const startColumn = parseInt(piece.dataset.column);

        piece.style.transform = `translate(${square.offsetLeft - piece.parentElement.offsetLeft}px, ${square.offsetTop - piece.parentElement.offsetTop}px)`;

        setTimeout(() => {
            piece.style.transform = '';
            piece.dataset.row = row;
            piece.dataset.column = column;
            square.appendChild(piece);
            piece.classList.remove('highlight');

            if (!isReceivingMove) {
                sendMoveToServer(piece.dataset.name, piece.dataset.colour, startRow, startColumn, row, column, drag);
            }
        }, 300);
    };

    const sendMoveToServer = (name, colour, startRow, startColumn, endRow, endColumn, drag) => {
        console.log("send move to server js")
        const moveData = {
            name: name,
            colour: colour,
            startRow: startRow,
            startColumn: startColumn,
            endRow: endRow,
            endColumn: endColumn,
            drag: drag,
        };
        data = JSON.stringify({ 'type': 'move', 'move': moveData, 'drag': drag })

        chessSocket.send(data);
        console.log('Move sent to server:', data);
    };

    const handleReceivedMove = (move, drag=false) => {
        console.log("handle received move js", move)
        isReceivingMove = true;

        // Find the piece on the board
        const piece = Array.from(chessboardElement.getElementsByClassName('piece')).find(p => {
            return p.dataset.name === move.name &&
                   p.dataset.colour === move.colour &&
                   parseInt(p.dataset.row) === move.startRow &&
                   parseInt(p.dataset.column) === move.startColumn;
        });

        console.log("handle received move state 2, found piece", piece)

        if (piece) {
            const square = Array.from(chessboardElement.children).find(square => {
                return parseInt(square.dataset.row) === move.endRow &&
                       parseInt(square.dataset.column) === move.endColumn;
            });

            if (square) {
                console.log("handle received move state 3, found square", square)
                movePieceToSquare(piece, square, move.endRow, move.endColumn);
            }
        }
        console.log("handle received move state 4")

        isReceivingMove = false;
    };

    console.log("JS begin rendering board")
    renderBoard();
});
