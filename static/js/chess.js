document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Event Listener")
    const chessboardElement = document.getElementById('chessboard');
    let selectedPiece = null;
    let isReceivingMove = false;  // Flag to prevent loopback

    // TODO: fix room_name
    const roomName =  window.roomName.replace(/[^a-zA-Z0-9_-]/g, '');

    const socket_url = `ws://${window.location.host}/ws/chess/${roomName}/`
    console.log("socket URL", socket_url)
    
    const chessSocket = new WebSocket(
        socket_url
    );

    chessSocket.onmessage = function(event) {
        console.log("onMessage received event", {event})
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
        pieceElement.dataset.index = index;
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
                square.dataset.index =  (8 - row) * 8 + (column - 1);
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
        console.log("selected piece location", selectedPiece.dataset.row, selectedPiece.dataset.column)
        selectedPiece.classList.add('dragging');
    };
    
    const onDragEnd = (event) => {
        console.log("JS drag end")
        if (selectedPiece) {
            selectedPiece.classList.remove('dragging');
    
            // Get the final square where the piece was dropped
            // const finalSquare = selectedPiece.parentElement;
            const finalSquare = document.elementFromPoint(event.clientX, event.clientY).closest('.square');
            if (finalSquare === null){
                console.log("invalid final position, move denied")
            } else {
                console.log("final piece location", finalSquare.dataset.row, finalSquare.dataset.column)
                // Calculate the new position (row and column) based on the final square
                const row = parseInt(finalSquare.dataset.row);
                const column = parseInt(finalSquare.dataset.column);

                // Move the piece to the final square with a smooth transition
                movePieceToSquare(selectedPiece, finalSquare, row, column, drag=true);
            }
            selectedPiece = null;
        }
    };  

    const onSquareClick = (event) => {
        console.log("JS square click")
        const square = event.currentTarget;

        if (selectedPiece) {
            if (parseInt(square.dataset.row) !== parseInt(selectedPiece.dataset.row) || parseInt(square.dataset.column) !== parseInt(selectedPiece.dataset.column)){
                movePieceToSquare(selectedPiece, square, parseInt(square.dataset.row), parseInt(square.dataset.column));
            } else {
                console.log("de-selected piece")
            }
            selectedPiece.classList.remove('highlight');
            selectedPiece = null;
        } else if (square.firstChild) {
            selectedPiece = square.firstChild;
            selectedPiece.classList.add('highlight');
        }
    };

    function isValidMove(piece, newSquare){
        index = 8*(8-piece.dataset.row) + (piece.dataset.column - 1);
        oldSquare = chessboardElement.children[index]

        newSquarePiece = newSquare.firstChild
        if (newSquarePiece !== null && newSquarePiece.dataset.colour === piece.dataset.colour){
            return false;
        }

        // if no previous condition satisfies, it's a valid move
        return true;
    }

    const movePieceToSquare = (piece, square, row, column, drag = false) => {
        console.log("JS move piece to square")

        const startRow = parseInt(piece.dataset.row);
        const startColumn = parseInt(piece.dataset.column);

        if (row === startRow && column === startColumn){
            console.log("start and end positions are same")
            return
        }

        if (isValidMove(piece, square) === false){
            console.log("Denied invalied move")
            return
        }

        if (drag === true){
            // move is instrumented using mouse click+drag => DO NOT apply animation
            piece.style.transform = ``
            piece.dataset.row = row;
            piece.dataset.column = column;
            piece.dataset.index = (8-row)*8 + (column - 1);
            square.replaceChildren();
            square.appendChild(piece);
            console.log("final square children", square.children)
            piece.classList.remove('highlight');

            if (!isReceivingMove) {
                sendMoveToServer(piece.dataset.name, piece.dataset.colour, startRow, startColumn, row, column, drag);
            }

        } else {
            // move is instrumented using mouse click => apply animation

            piece.style.zIndex = '1000';

            piece.style.transform = `translate(${square.offsetLeft - piece.parentElement.offsetLeft}px, ${square.offsetTop - piece.parentElement.offsetTop}px)`;
            piece.style.transition = 'transform 0.3s ease';

            setTimeout(() => {
                piece.style.transform = ``
                piece.style.zIndex = 0;
                piece.dataset.row = row;
                piece.dataset.column = column;
                piece.dataset.index = (8-row)*8 + (column - 1);
                square.replaceChildren();
                square.appendChild(piece);
                piece.classList.remove('highlight');

                if (!isReceivingMove) {
                    sendMoveToServer(piece.dataset.name, piece.dataset.colour, startRow, startColumn, row, column, drag);
                }
            }, 300);

        }
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
