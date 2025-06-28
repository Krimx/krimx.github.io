let players = [1,1,1,1];

function increaseScore(playerNum) {
    // if (players[playerNum - 1] < 10) players[playerNum - 1]++;
    players[playerNum - 1]++
    moveIcon(playerNum);
    updateCounter(playerNum);
    outputScores();
}
function decreaseScore(playerNum) {
    if (players[playerNum - 1] > 1) players[playerNum - 1]--;
    moveIcon(playerNum);
    updateCounter(playerNum);
    outputScores();
}

function outputScores() {
    console.log(players[0] + ", " + players[1] + ", " + players[2] + ", " + players[3])
}

function moveIcon(playerNum) {
    let displayNum = Math.min(players[playerNum - 1], 10);
    const playerId = "player" + playerNum + "Icon";
    const playerIcon = document.getElementById(playerId);
    let position = ((displayNum - 1) * 9.8).toString() + "%";
    playerIcon.style.bottom = position;
}

function updateCounter(playerNum) {
    const toUpdate = document.getElementById("player" + playerNum + "Score");
    let score = players[playerNum - 1];
    console.log(score);
    toUpdate.innerText = players[playerNum - 1];
}


class TabElement extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const span = document.createElement('span');
      span.textContent = '\u00A0\u00A0\u00A0\u00A0'; // four non-breaking spaces
      span.style.whiteSpace = 'pre'; // ensures the spaces render properly

      shadow.appendChild(span);
    }
  }
}

window.increaseScore = increaseScore;
window.decreaseScore = decreaseScore;
customElements.define("tab-in", TabElement);