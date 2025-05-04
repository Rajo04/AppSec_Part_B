import { set } from 'date-fns';
import { Coach } from '../../model/coach';
import { Game } from '../../model/game';
import { Player } from '../../model/player';
import { Team } from '../../model/team';
import gameService from '../../service/game.service';
import gameDb from '../../repository/game.db';
import { GameInput, TeamInput, PlayerInput, CoachInput } from '../../types';

const validId = 1;
const invalidId = -1;
const validDate = new Date();
const validResult = '2-1';
const validTeamName = 'UCLLTeam';

const validCoach: CoachInput = {
    id: validId,
    user: {
        id: validId,
        firstName: 'Mark',
        lastName: 'Theman',
        email: 'marktheman@ucll.be',
        phoneNumber: '0412345679',
        password: 'password',
        role: 'coach',
    },
};

const validPlayer: PlayerInput = {
    id: validId,
    user: {
        id: validId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@ucll.be',
        phoneNumber: '0412345678',
        password: 'password',
        role: 'player',
    },
};

const validPlayer2: PlayerInput = {
    id: validId + 1,
    user: {
        id: validId + 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@ucll.be',
        phoneNumber: '0498765445',
        password: 'password',
        role: 'player',
    },
};

const validTeam1: TeamInput = {
    id: validId,
    teamName: validTeamName,
    players: [validPlayer, validPlayer2],
    coach: validCoach,
};

const validTeam2: TeamInput = {
    id: validId + 1,
    teamName: validTeamName + '2',
    players: [validPlayer, validPlayer2],
    coach: validCoach,
};

const validGame: GameInput = {
    id: validId,
    date: validDate,
    result: validResult,
    teams: [validTeam1, validTeam2],
};

let mockGetAllGames: jest.Mock;
let mockGetGameById: jest.Mock;
let mockCreateGame: jest.Mock;
let mockUpdateGame: jest.Mock;
let mockDeleteGame: jest.Mock;
let mockGetGamesByTeamId: jest.Mock;
let mockGetGamesByUserId: jest.Mock;

beforeEach(() => {
    mockGetAllGames = jest.fn();
    mockGetGameById = jest.fn();
    mockCreateGame = jest.fn();
    mockUpdateGame = jest.fn();
    mockDeleteGame = jest.fn();
    mockGetGamesByTeamId = jest.fn();
    mockGetGamesByUserId = jest.fn();

    gameDb.getAllGames = mockGetAllGames;
    gameDb.getGameById = mockGetGameById;
    gameService.createGame = mockCreateGame;
    gameService.updateGame = mockUpdateGame;
    gameService.deleteGame = mockDeleteGame;
    gameService.getGamesByTeamId = mockGetGamesByTeamId;
    gameService.getGamesByUserId = mockGetGamesByUserId;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given no games in the database, when getAllGames is called, then it should return an empty array', async () => {
    mockGetAllGames.mockResolvedValue([]);
    const games = await gameService.getAllGames();
    expect(games).toEqual([]);
    expect(mockGetAllGames).toHaveBeenCalledTimes(1);
});

test('given games in the database, when getAllGames is called, then it should return all games', async () => {
    mockGetAllGames.mockResolvedValue([validGame]);
    const games = await gameService.getAllGames();
    expect(games).toEqual([validGame]);
    expect(mockGetAllGames).toHaveBeenCalledTimes(1);
});

test('given a valid game id, when getGameById is called, then it should return the game', async () => {
    mockGetGameById.mockResolvedValue(validGame);
    const game = await gameService.getGameById(validId);
    expect(game).toEqual(validGame);
    expect(mockGetGameById).toHaveBeenCalledWith(validId);
});

test('given an invalid game id, when getGameById is called, then it should throw an error', async () => {
    mockGetGameById.mockRejectedValue(new Error(`Game with id ${invalidId} does not exist.`));
    await expect(gameService.getGameById(invalidId)).rejects.toThrow(`Game with id ${invalidId} does not exist.`);
    expect(mockGetGameById).toHaveBeenCalledWith(invalidId);
});

test('given a new game, when createGame is called, then it should create and return the game', async () => {
    mockCreateGame.mockResolvedValue(validGame);
    const game = await gameService.createGame(validGame);
    expect(game).toMatchObject(validGame);
    expect(mockCreateGame).toHaveBeenCalledWith(validGame);
});

test('given a valid game id and input, when updateGame is called, then it should update and return the game', async () => {
    mockUpdateGame.mockResolvedValue(validGame);
    const game = await gameService.updateGame(validId, validGame);
    expect(game).toEqual(validGame);
    expect(mockUpdateGame).toHaveBeenCalledWith(validId, validGame);
});

test('given an invalid game id, when updateGame is called, then it should throw an error', async () => {
    mockUpdateGame.mockRejectedValue(new Error('No game with that id exists.'));
    await expect(gameService.updateGame(invalidId, validGame)).rejects.toThrow('No game with that id exists.');
    expect(mockUpdateGame).toHaveBeenCalledWith(invalidId, validGame);
});

test('given a valid game id, when deleteGame is called, then it should delete the game', async () => {
    mockDeleteGame.mockResolvedValue(true);
    const result = await gameService.deleteGame(validId);
    expect(result).toBe(true);
    expect(mockDeleteGame).toHaveBeenCalledWith(validId);
});

test('given an invalid game id, when deleteGame is called, then it should throw an error', async () => {
    mockDeleteGame.mockRejectedValue(new Error('No game with that id exists.'));
    await expect(gameService.deleteGame(invalidId)).rejects.toThrow('No game with that id exists.');
    expect(mockDeleteGame).toHaveBeenCalledWith(invalidId);
});

test('given a valid team id, when getGamesByTeamId is called, then it should return the games', async () => {
    mockGetGamesByTeamId.mockResolvedValue([validGame]);
    const games = await gameService.getGamesByTeamId(validId);
    expect(games).toEqual([validGame]);
    expect(mockGetGamesByTeamId).toHaveBeenCalledWith(validId);
});

test('given an invalid team id, when getGamesByTeamId is called, then it should throw an error', async () => {
    mockGetGamesByTeamId.mockRejectedValue(new Error('No games found for that team.'));
    await expect(gameService.getGamesByTeamId(invalidId)).rejects.toThrow('No games found for that team.');
    expect(mockGetGamesByTeamId).toHaveBeenCalledWith(invalidId);
});

test('given a valid user id, when getGamesByUserId is called, then it should return the games', async () => {
    mockGetGamesByUserId.mockResolvedValue([validGame]);
    const games = await gameService.getGamesByUserId(validId);
    expect(games).toEqual([validGame]);
    expect(mockGetGamesByUserId).toHaveBeenCalledWith(validId);
});

test('given an invalid user id, when getGamesByUserId is called, then it should throw an error', async () => {
    mockGetGamesByUserId.mockRejectedValue(new Error('No games found for that user.'));
    await expect(gameService.getGamesByUserId(invalidId)).rejects.toThrow('No games found for that user.');
    expect(mockGetGamesByUserId).toHaveBeenCalledWith(invalidId);
});
