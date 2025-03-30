const { Match } = require("../models");

describe("Match Class", () => {
  let match;
  const homeTeam = "Team A";
  const awayTeam = "Team B";

  beforeEach(() => {
    match = new Match(homeTeam, awayTeam);
  });

  test("should initialize with correct properties", () => {
    expect(match.homeTeam).toBe(homeTeam);
    expect(match.awayTeam).toBe(awayTeam);
    expect(match.homeScore).toBe(0);
    expect(match.awayScore).toBe(0);
    expect(match.status).toBe("ongoing");

    expect(match.id).toMatch(
      new RegExp(`^${homeTeam.toLowerCase()}-${awayTeam.toLowerCase()}-\\d+$`)
    );
  });

  test("should update score correctly", () => {
    const newHomeScore = 2;
    const newAwayScore = 3;
    match.updateScore(newHomeScore, newAwayScore);

    expect(match.homeScore).toBe(newHomeScore);
    expect(match.awayScore).toBe(newAwayScore);
  });

  test("should finish the match", () => {
    match.finish();

    expect(match.status).toBe("finished");
  });
});
