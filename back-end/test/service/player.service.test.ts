import playerService from '../../service/player.service';
import { Role } from '../../types';

const validId = 1;
const invalidId = -1;
const validFirstName = 'Test';
const validLastName = 'Tester';
const validPassword = 'password';
const validEmail = 'testtester@ucll.be';
const validPhoneNumber = '0423456789';
const validRole = 'player' as Role;

const validUser = {
    id: validId,
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    phoneNumber: validPhoneNumber,
    role: validRole,
    password: validPassword
};

const validPlayer = {
    id: validId,
    user: validUser
};

let mockGetAllPlayers: jest.Mock;
let mockGetPlayerById: jest.Mock;
let mockCreatePlayer: jest.Mock;

beforeEach(() => {
    mockGetAllPlayers = jest.fn();
    mockGetPlayerById = jest.fn();
    mockCreatePlayer = jest.fn();

    playerService.getAllPlayers = mockGetAllPlayers;
    playerService.getPlayerById = mockGetPlayerById;
    playerService.createPlayer = mockCreatePlayer;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given no players in the database, when getAllPlayers is called, then it should return an empty array', async () => {
    mockGetAllPlayers.mockResolvedValue([]);
    const players = await playerService.getAllPlayers();
    expect(players).toEqual([]);
    expect(mockGetAllPlayers).toHaveBeenCalledTimes(1);
});

test('given players in the database, when getAllPlayers is called, then it should return all players', async () => {
    mockGetAllPlayers.mockResolvedValue([validPlayer]);
    const players = await playerService.getAllPlayers();
    expect(players).toEqual([validPlayer]);
    expect(mockGetAllPlayers).toHaveBeenCalledTimes(1);
});

test('given a valid player id, when getPlayerById is called, then it should return the player', async () => {
    mockGetPlayerById.mockResolvedValue(validPlayer);
    const player = await playerService.getPlayerById(validId);
    expect(player).toEqual(validPlayer);
    expect(mockGetPlayerById).toHaveBeenCalledWith(validId);
});

test('given an invalid player id, when getPlayerById is called, then it should throw an error', async () => {
    mockGetPlayerById.mockRejectedValue(new Error(`Player with id ${invalidId} does not exist.`));
    await expect(playerService.getPlayerById(invalidId)).rejects.toThrow(`Player with id ${invalidId} does not exist.`);
    expect(mockGetPlayerById).toHaveBeenCalledWith(invalidId);
});


test('given a new player, when createPlayer is called, then it should create and return the player', async () => {
    mockCreatePlayer.mockResolvedValue(validPlayer);
    const playerInput = {
        user: validUser
    };
    const player = await playerService.createPlayer(playerInput);
    expect(player).toMatchObject(playerInput);
    expect(mockCreatePlayer).toHaveBeenCalledWith(playerInput);
});
