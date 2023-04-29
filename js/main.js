/*----- constants -----*/
const COLORS = {
    '0': 'var(--main-bg)',
    '1': 'var(--plr2-bg)',
    '-1': 'var(--plr1-bg)',
  };

const PLAYERS = {
    '1': 'CROSSES',
    '-1': 'NOUGHTS',
}

const MOVES = {
    '-1': '0',
    '1': 'X',
    '0': null,
}



/*----- state variables -----*/
let spaces; //single array of column spaces
let turn; //-1 for noughts, 1 for crosses
let winner; //null (no winner yet), 1 if crosses win, -1 if noughts win, 'T' for tie
let turnCount; //for modifying the game message

/*----- cached elements  -----*/
const spaceEls = [...document.querySelectorAll('#spaces > div')]; //turns from NodeList into real array
const gameInfoMsg = document.getElementById('gameInfoMessage');
const turnIndicatorMsg = document.getElementById('turnIndicator');
const btn = document.querySelector('button');

/*----- event listeners -----*/
document.getElementById('spaces').addEventListener('click', updateSpaces);
btn.addEventListener('click', init);

/*----- functions -----*/
init ();

//initialise all states, then call render()
function init() {
    //To visualise the spaces's mapping to the DOM, rotate the board array 90 degrees anticlockwise
    spaces = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 1;
    winner = null;
    turnCount = 0;
    document.getElementById('spaces').addEventListener('click', updateSpaces);
    render();
  }

//updating the data that data model in response to user interaction then call render()
function updateSpaces(evt) {
    const cellIdx = spaceEls.indexOf(evt.target);
    //guards - when number is already populated you get a -1
    if (cellIdx === -1) return;
    //logic to get the colIdx because I didn't understand how to get it any other way
    spaces[cellIdx] = turn;
    turn *= -1;
    turnCount++;
    winner = getWinner(cellIdx);   ///MIGHT NEED SOME ARGUMENTS
    render();
}

////check for a winner in board state
//return null if no winner, 1/-1 if a player has won, 'T' if tie
function getWinner(cellIdx) {
    return checkVerticalWin(cellIdx) ||
        checkHorWin(cellIdx) ||
        checkNESWWin(cellIdx) ||
        checkNWSEWin(cellIdx);
}

 //check for DiagNWSE winner
function checkNWSEWin(cellIdx) {
    return countAdjacent(cellIdx, -4, 4) === 2 ? spaces[cellIdx] : null;
}
//check for DiagNESW winner
function checkNESWWin(cellIdx) {
    return countAdjacent(cellIdx, -2, 2) === 2 ? spaces[cellIdx] : null;
}
//check for horizontal winner
function checkHorWin(cellIdx) {
    return countAdjacent(cellIdx, -1, 1) === 2 ? spaces[cellIdx] : null;
}

//check for vertical winner
function checkVerticalWin(cellIdx) {
    return countAdjacent(cellIdx, -3, 3) === 2 ? spaces[cellIdx] : null;
}

function countAdjacent(cellIdx, cellOffsetA, cellOffsetB) {
    // shortcut variable to player value
    const player = spaces[cellIdx];
    //track count of adjacent cells with the same player value
    let countA = 0;
    let countB = 0;
    let travelACount = 0;
    let travelBCount = 0;
    let travelA = cellIdx + cellOffsetA;
    let travelB = cellIdx + cellOffsetB;
    //initialise new coordinates
    while(spaces[travelA] !== undefined && 
        // spaces[travelA] !== 0 && 
        // spaces[travelA] !== 8 &&
        spaces[travelA] === player &&
        travelACount <2) {
            countA++;
            travelACount++;
            travelA += cellOffsetA;
            console.log('countA: ' +countA);
            console.log('travelACount: ' +travelACount);
        }
        while(spaces[travelB] !== undefined &&
            spaces[travelB] === player && 
            travelBCount <2) {
                countB++;
                travelBCount++;
                travelB += cellOffsetB;
                console.log('countB: ' +countB);
                console.log('travelBCount: ' +travelBCount);
        }
    return countA + countB;
}

// Main render function - to visualise all states in the DOM
  function render() {
    renderSpaces(spaces); //puts in the noughts and crosses
    renderMessage(); //updates the game message (game start, game in progress, x wins)
    renderControls(); //hide/show UI elements(controls)
  }

  function renderSpaces(arr) {
    //iterate through the spaces array, access the value at each position in the array
    //update the board as a result of each value in the array
    for (let i=0; i<arr.length; i++) {
        const cellId = `cell${i}`;
        const cellEl = document.getElementById(cellId);
        if (MOVES[arr[i]] !== null) {
            cellEl.innerHTML = `<span style="
            font-size: 8vmin;
            background-color: transparent;
            margin-left: 4vmin;
            padding: 0;
            color:${COLORS[arr[i]]}
            ">${MOVES[arr[i]]}</span>`
        } else if (MOVES[arr[i]] === null) {
            cellEl.innerHTML = `<span style="
                font-size: 0.5vmin;
                background-color: transparent;
                margin-left: 4vmin;
                padding: 0;
                color:${COLORS[arr[i]]}
                ">${MOVES[arr[i]]}</span>`
        }
    }
    if (winner) {
        document.getElementById('spaces').removeEventListener('click', updateSpaces);
    }
}

  function renderMessage() {
    // turncount = 0, gamestart
    // turncount = >1 && <10, game in progress
    // winner = 'T', its a tie
    // game is in play, display player turn
    // winner is truthy, display winner where turn was
    if (turnCount === 0) {
        gameInfoMsg.innerText = 'Time to start playing!';
    } else if (winner) {
        gameInfoMsg.innerText = 'Game over, click "PLAY AGAIN" to restart';
    } else if (turnCount >0 && turnCount <10) {
        gameInfoMsg.innerText = 'Game in progress...';
    }

    if (winner === 'T') {
        turnIndicatorMsg.innerText = "It's a tie!";
    } else if (winner) {
        turnIndicatorMsg.innerHTML = `<span style="color:${COLORS[winner]}">${PLAYERS[winner]}</span> wins!`;
    } else {
        turnIndicatorMsg.innerHTML = `<span style="color:${COLORS[turn]}">${[PLAYERS][0][turn].toUpperCase()}</span> turn.`;
    }
  }

  function renderControls() {
    //turn 0, button hidden
    //turn 1-9, restart
    //winner is truthy, 'play again'
    if (winner) {
        btn.innerText = 'PLAY AGAIN'
    } else if (turnCount > 0) {
        btn.innerText = 'RESTART'
        btn.style.visibility = 'visible';
    } else {
        btn.style.visibility = 'hidden';
    }
   }


   //THINGS TO IMPROVE
   //1) Stop being able to play when a winner is declared