const socket = io("http://localhost:3000");

window.addEventListener("load", () => {
  socket.emit("resetMatches");
});

socket.on("connected", (message) => {
  console.log(message);
});

document.getElementById("start-match").addEventListener("click", () => {
  const homeTeam = document.getElementById("home-team").value.trim();
  const awayTeam = document.getElementById("away-team").value.trim();

  if (homeTeam && awayTeam) {
    console.log("emit start match");
    socket.emit("startMatch", { homeTeam, awayTeam });
  } else {
    alert("Please enter valid team names.");
  }
});

socket.on("matchUpdate", (data) => {
  updateScoreboard(data.matches);
});

function updateScoreboard(matches) {
  const ongoingMatchesContainer = document.getElementById("ongoing-matches");
  const finishedMatchesContainer = document.getElementById("finished-matches");
  const ongoingMatchesCounter = document.getElementById(
    "ongoing-matches-counter"
  );
  const finishedMatchesCounter = document.getElementById(
    "finished-matches-counter"
  );

  ongoingMatchesContainer.innerHTML = "";
  finishedMatchesContainer.innerHTML = "";

  const ongoingMatches = matches.filter((match) => match.status === "ongoing");
  const ongoingMatchesLength = ongoingMatches.length;
  ongoingMatchesCounter.innerHTML = `(${ongoingMatchesLength})`;

  const finishedMatches = matches
    .filter((match) => match.status === "finished")
    .sort((a, b) => b.homeScore + b.awayScore - (a.homeScore + a.awayScore));
  const finishedMatchesLength = finishedMatches.length;
  finishedMatchesCounter.innerHTML = `(${finishedMatchesLength})`;

  ongoingMatches.forEach((match) => {
    let matchDiv = document.getElementById(`match-${match.id}`);

    if (!matchDiv) {
      matchDiv = document.createElement("div");
      matchDiv.className = "match";
      matchDiv.id = `match-${match.id}`;
      matchDiv.innerHTML = `
        <h3>${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</h3>
        <div class="match__input">
          <input type="number" id="home-input-${match.id}" value="${match.homeScore}" min="0" class="input">
          <input type="number" id="away-input-${match.id}" value="${match.awayScore}" min="0" class="input">
        </div>
        <div class="match__cta">
          <button onclick="updateScore('${match.id}')" class="button button--primary">Update Score</button>
          <button onclick="finishMatch('${match.id}')" class="button button--danger">Finish Match</button>
        </div>
      `;
    }

    ongoingMatchesContainer.appendChild(matchDiv);
  });

  finishedMatches.forEach((match) => {
    let matchDiv = document.getElementById(`match-${match.id}`);
    if (!matchDiv) {
      matchDiv = document.createElement("div");
      matchDiv.className = "match";
      matchDiv.id = `match-${match.id}`;
      matchDiv.innerHTML = `
        <h3>${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</h3>
        <span>Finished</span>
      `;
    }
    finishedMatchesContainer.appendChild(matchDiv);
  });
}

function updateScore(matchId) {
  const homeScore = parseInt(
    document.getElementById(`home-input-${matchId}`).value,
    10
  );
  const awayScore = parseInt(
    document.getElementById(`away-input-${matchId}`).value,
    10
  );

  if (!isNaN(homeScore) && !isNaN(awayScore)) {
    socket.emit("updateScore", { matchId, homeScore, awayScore });
  }
}

// MATCH FINISH
function finishMatch(matchId) {
  socket.emit("finishMatch", { matchId });
}
