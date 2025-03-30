const socket = io("http://localhost:3000");

window.addEventListener("load", () => {
  socket.emit("resetMatches");
});

socket.on("connected", (message) => {
  console.log(message);
});

document.getElementById("match-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const homeTeam = document.getElementById("home-team").value.trim();
  const awayTeam = document.getElementById("away-team").value.trim();

  if (homeTeam && awayTeam) {
    socket.emit("startMatch", { homeTeam, awayTeam });
  } else {
    alert("Please enter valid team names.");
  }
});

socket.on("matchesUpdate", (data) => {
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
  const finishedMatches = matches
    .filter((match) => match.status === "finished")
    .sort((a, b) => b.homeScore + b.awayScore - (a.homeScore + a.awayScore));

  ongoingMatchesCounter.innerHTML = `(${ongoingMatches.length})`;
  finishedMatchesCounter.innerHTML = `(${finishedMatches.length})`;

  ongoingMatches.forEach((match) => {
    updateMatchElement(match, ongoingMatchesContainer, true);
  });

  finishedMatches.forEach((match) => {
    updateMatchElement(match, finishedMatchesContainer, false);
  });
}

function updateMatchElement(match, container, isOngoing) {
  let matchDiv = document.getElementById(`match-${match.id}`);

  if (!matchDiv) {
    matchDiv = document.createElement("div");
    matchDiv.className = "match";
    matchDiv.id = `match-${match.id}`;

    const matchHTML = isOngoing
      ? `
          <h3>${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</h3>
          <div class="match__input">
            <input type="number" id="home-input-${match.id}" value="${match.homeScore}" min="0" class="input">
            <input type="number" id="away-input-${match.id}" value="${match.awayScore}" min="0" class="input">
          </div>
          <div class="match__cta">
            <button class="button button--primary update-score-btn" data-match-id="${match.id}">Update Score</button>
            <button class="button button--danger finish-match-btn" data-match-id="${match.id}">Finish Match</button>
          </div>
        `
      : `
          <h3>${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</h3>
        `;

    matchDiv.innerHTML = matchHTML;
    container.appendChild(matchDiv);
  }

  const updateScoreButton = matchDiv.querySelector(".update-score-btn");
  const finishMatchButton = matchDiv.querySelector(".finish-match-btn");

  if (updateScoreButton) {
    updateScoreButton.addEventListener("click", () => updateScore(match.id));
  }
  if (finishMatchButton) {
    finishMatchButton.addEventListener("click", () => finishMatch(match.id));
  }
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

function finishMatch(matchId) {
  socket.emit("finishMatch", { matchId });
}
