const { MatchManager } = require("../models");

const mockIo = {
  emit: jest.fn(),
};

let matchManager;

beforeEach(() => {
  matchManager = new MatchManager(mockIo);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("MatchManager", () => {
  test("should create a new match", () => {
    const match = matchManager.createMatch("Team A", "Team B");

    expect(match.homeTeam).toBe("Team A");
    expect(match.awayTeam).toBe("Team B");
    expect(match.status).toBe("ongoing");
    expect(match.homeScore).toBe(0);
    expect(match.awayScore).toBe(0);
  });

  test("should update match score", () => {
    const match = matchManager.createMatch("Team A", "Team B");
    matchManager.updateMatchScore(match.id, 2, 3);

    expect(match.homeScore).toBe(2);
    expect(match.awayScore).toBe(3);
  });

  test("should finish a match", () => {
    const match = matchManager.createMatch("Team A", "Team B");
    matchManager.finishMatch(match.id);

    expect(match.status).toBe("finished");
  });

  test("should return all match data", () => {
    matchManager.createMatch("Team A", "Team B");
    matchManager.createMatch("Team C", "Team D");

    const allMatches = matchManager.getAllMatchesData();

    expect(allMatches.length).toBe(2);
    expect(allMatches[0].homeTeam).toBe("Team A");
    expect(allMatches[1].homeTeam).toBe("Team C");
  });

  test("should clear all matches", () => {
    matchManager.createMatch("Team A", "Team B");
    matchManager.createMatch("Team C", "Team D");

    matchManager.clearMatches();

    const allMatches = matchManager.getAllMatchesData();
    expect(allMatches.length).toBe(0);
  });

  test("should call socket.io emit when broadcasting match updates", () => {
    matchManager.createMatch("Team A", "Team B");

    matchManager.broadcastMatchUpdate();

    expect(mockIo.emit).toHaveBeenCalledTimes(1);
    expect(mockIo.emit).toHaveBeenCalledWith("matchesUpdate", {
      matches: expect.any(Array),
    });
  });
});
