// If you would like to see some examples of similar code to make an interface interact with an API,
// check out the coin-server example from a previous COMP 426 semester.
// https://github.com/jdmar3/coinserver

var opponentCheckbox = document.getElementById("opponent_checkbox");
var shotOptionsContainer = document.getElementById("shot_options_container");
var playOpponent = false;

opponentCheckbox.addEventListener("change", () => {
  if (opponentCheckbox.checked) {
    shotOptionsContainer.style.display = "block";
    playOpponent = true;
  } else {
    shotOptionsContainer.style.display = "none";
    playOpponent = false;
  }
});

var gameModes = document.getElementsByClassName("game_mode");
var RPSLSOptions = document.getElementById("RPSLS_options");
var selectedGameMode = "RPS";

Array.from(gameModes).forEach((gameMode) => {
  gameMode.addEventListener("change", () => {
    selectedGameMode = gameMode.value;
    if (gameMode.value === "RPS") {
      RPSLSOptions.style.display = "none";
    }
    if (gameMode.value === "RPSLS") {
      RPSLSOptions.style.display = "block";
    }
  });
});

var shotOptions = document.getElementsByClassName("shot_options");
var selectedShot = "Rock";
Array.from(shotOptions).forEach((shotOption) => {
  shotOption.addEventListener("change", () => {
    selectedShot = shotOption.value;
  });
});

var playButton = document.getElementById("play_button");
var startOverButton = document.getElementById("start_over_button");
var gameOptions = document.getElementById("game_options");
var title = document.getElementById("title");
var gameForm = document.getElementById("game_form");
var result;

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let endpoint = "";

  result = document.createElement("h2");
  title.after(result);

  if (selectedGameMode === "RPS") {
    endpoint = "http://localhost:5000/app/rps/play";
  } else if (selectedGameMode === "RPSLS") {
    endpoint = "http://localhost:5000/app/rpsls/play";
  }

  if (playOpponent) {
    sendPlayOpponentPost(endpoint);
  } else {
    getPlayAlone(endpoint);
  }

  playButton.style.display = "none";
  gameOptions.style.display = "none";
});

async function sendPlayOpponentPost(endpoint) {
  let resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shot: selectedShot }),
  });

  let jsonData = await resp.json();

  result.innerHTML = `You: ${jsonData.player} <br>
  Your opponent: ${jsonData.opponent} <br>
  Result: you ${jsonData.result}`;
}

async function getPlayAlone(endpoint) {
  let resp = await fetch(endpoint);

  let jsonData = await resp.json();

  result.innerHTML = jsonData.player;
}

startOverButton.addEventListener("click", () => {
  gameOptions.style.display = "block";
  result.remove();
  playButton.style.display = "inline-block";

  document.gameForm.game_mode.value = "RPS";
  opponentCheckbox.checked = false;
  document.gameForm.shot.value = "rock";
  triggerEvent(opponentCheckbox, "change");
});

function triggerEvent(element, eventName) {
  var event = new Event(eventName);
  element.dispatchEvent(event);
}

var rules_container = document.getElementById("rules_container");
var rules_button = document.getElementById("rules_button");
var rules_text;
var rulesDisplayed = false;

rules_button.addEventListener("click", () => {
  console.log(rulesDisplayed);
  if (rulesDisplayed) {
    rules_button.innerHTML = "Display Rules";
    rules_text.remove();
    rulesDisplayed = false;
  } else {
    rules_button.innerHTML = "Hide Rules";
    rules_text = document.createElement("h3");
    rules_container.appendChild(rules_text);
    rules_text.innerHTML = `Rules for Rock Paper Scissors:<br>

    - Scissors CUTS Paper<br>
    - Paper COVERS Rock<br>
    - Rock CRUSHES Scissors<br><br>
    
    Rules for the Lizard-Spock Espansion of Rock Paper Scissors:<br>
  
    - Scissors CUTS Paper<br>
    - Paper COVERS Rock<br>
    - Rock SMOOSHES Lizard<br>
    - Lizard POISONS Spock<br>
    - Spock SMASHES Scissors<br>
    - Scissors DECAPITATES Lizard<br>
    - Lizard EATS Paper<br>
    - Paper DISPROVES Spock<br>
    - Spock VAPORIZES Rock<br>
    - Rock CRUSHES Scissors`;
    rulesDisplayed = true;
  }
});
