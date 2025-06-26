let players = [1,1,1,1];

function increaseScore(playerNum) {
    if (players[playerNum - 1] < 10) players[playerNum - 1]++;
    moveIcon(playerNum);
    outputScores();
}
function decreaseScore(playerNum) {
    if (players[playerNum - 1] > 1) players[playerNum - 1]--;
    moveIcon(playerNum);
    outputScores();
}

function outputScores() {
    console.log(players[0] + ", " + players[1] + ", " + players[2] + ", " + players[3])
}

function moveIcon(playerNum) {
    const playerId = "player" + playerNum + "Icon";
    const playerIcon = document.getElementById(playerId);
    let position = ((players[playerNum - 1] - 1) * 10).toString() + "%";
    playerIcon.style.bottom = position;
}

window.increaseScore = increaseScore;
window.decreaseScore = decreaseScore;