
import { Coach } from '../../model/coach';
import { Player } from '../../model/player';
import { Team } from '../../model/team';
import { User } from '../../model/user';
import teamDb from '../../repository/team.db';
import teamService from '../../service/team.service';
import { TeamInput, PlayerInput, CoachInput } from '../../types';

const validTeamName = 'UCLLTeam';
const validId = 1;
const invalidId = -1;

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

const validTeam: TeamInput = {
    id: validId,
    teamName: validTeamName,
    players: [validPlayer, validPlayer2],
    coach: validCoach,
};

const validUserCoach = new User({
    id: validId,
    firstName: 'Mark',
    lastName: 'Theman',
    email: 'marktheman@ucll.be',
    phoneNumber: '0412345679',
    password: 'password',
    role: 'coach',
});

const validUserPlayer = new User({
    id: validId + 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@ucll.be',
    phoneNumber: '0412345678',
    password: 'password',
    role: 'player',
});

const validUserPlayer2 = new User({
    id: validId + 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@ucll.be',
    phoneNumber: '0498765445',
    password: 'password',
    role: 'player',
});

const validCreatedCoach = new Coach({
    id: validId,
    user: validUserCoach,
});

const validCreatedPlayer = new Player({
    id: validId + 1,
    user: validUserPlayer,
});

const validCreatedPlayer2 = new Player({
    id: validId + 2,
    user: validUserPlayer2,
});

const validCreatedTeam = new Team({
    id: validId,
    teamName: validTeamName,
    players: [validCreatedPlayer, validCreatedPlayer2],
    coach: validCreatedCoach,
});

let mockCreateTeam: jest.Mock;
let mockGetAllTeams: jest.Mock;
let mockGetTeamsByCoach: jest.Mock;
let mockGetTeamById: jest.Mock;
let mockUpdateTeam: jest.Mock;
let mockDeleteTeam: jest.Mock;

beforeEach(() => {
    mockCreateTeam = jest.fn();
    mockGetAllTeams = jest.fn();
    mockGetTeamsByCoach = jest.fn();
    mockGetTeamById = jest.fn();
    mockUpdateTeam = jest.fn();
    mockDeleteTeam = jest.fn();

    teamDb.createTeam = mockCreateTeam;
    teamDb.getAllTeams = mockGetAllTeams;
    teamDb.getTeamById = mockGetTeamById;
    teamService.updateTeam = mockUpdateTeam;
    teamService.deleteTeam = mockDeleteTeam;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given no teams in the database, when getAllTeams is called, then it should return an empty array', async () => {
    mockGetAllTeams.mockResolvedValue([]);
    const teams = await teamService.getAllTeams();
    expect(teams).toEqual([]);
    expect(mockGetAllTeams).toHaveBeenCalledTimes(1);
});

test('given teams in the database, when getAllTeams is called, then it should return all teams', async () => {
    mockGetAllTeams.mockResolvedValue([validTeam]);
    const teams = await teamService.getAllTeams();
    expect(teams).toEqual([validTeam]);
    expect(mockGetAllTeams).toHaveBeenCalledTimes(1);
});

test('given a valid team id, when getTeamById is called, then it should return the team', async () => {
    mockGetTeamById.mockResolvedValue(validTeam);
    const team = await teamService.getTeamById(validId);
    expect(team).toEqual(validTeam);
    expect(mockGetTeamById).toHaveBeenCalledWith(validId);
});

test('given an invalid team id, when getTeamById is called, then it should throw an error', async () => {
    mockGetTeamById.mockRejectedValue(new Error(`Team with id ${invalidId} does not exist.`));
    await expect(teamService.getTeamById(invalidId)).rejects.toThrow(`Team with id ${invalidId} does not exist.`);
    expect(mockGetTeamById).toHaveBeenCalledWith(invalidId);
});

test('given a valid team id and input, when updateTeam is called, then it should update and return the team', async () => {
    mockUpdateTeam.mockResolvedValue(validTeam);
    const team = await teamService.updateTeam(validId, validTeam);
    expect(team).toEqual(validTeam);
    expect(mockUpdateTeam).toHaveBeenCalledWith(validId, validTeam);
});

test('given an invalid team id, when updateTeam is called, then it should throw an error', async () => {
    mockUpdateTeam.mockRejectedValue(new Error('No team with that id exists.'));
    await expect(teamService.updateTeam(invalidId, validTeam)).rejects.toThrow('No team with that id exists.');
    expect(mockUpdateTeam).toHaveBeenCalledWith(invalidId, validTeam);
});

test('given a valid team id, when deleteTeam is called, then it should delete the team', async () => {
    mockDeleteTeam.mockResolvedValue(true);
    const result = await teamService.deleteTeam(validId);
    expect(result).toBe(true);
    expect(mockDeleteTeam).toHaveBeenCalledWith(validId);
});

test('given an invalid team id, when deleteTeam is called, then it should throw an error', async () => {
    mockDeleteTeam.mockRejectedValue(new Error('No team with that id exists.'));
    await expect(teamService.deleteTeam(invalidId)).rejects.toThrow('No team with that id exists.');
    expect(mockDeleteTeam).toHaveBeenCalledWith(invalidId);
});

test('givenValidTeamId_whenUpdatingTeam_thenTeamIsUpdatedSuccessfully', async () => {
    // given
    const teamInput: TeamInput = {
        id: validId,
        teamName: validTeamName,
        players: [validPlayer, validPlayer2],
        coach: validCoach,
    };

    // when
    mockGetTeamById.mockResolvedValue(teamInput);
    mockUpdateTeam.mockResolvedValue(teamInput);
    const result = await teamService.updateTeam(validId, teamInput);

    // then
    expect(result).toEqual(teamInput);
});

test('givenValidTeamId_whenGettingTeamById_thenTeamIsReturnedSuccessfully', async () => {
    // given
    mockGetTeamById.mockReturnValue(validTeam);

    // when
    const result = await teamService.getTeamById(validId);

    // then
    expect(result).toEqual(validTeam);
});

test('givenInvalidTeamId_whenGettingTeamById_thenErrorIsThrown', async () => {
    // given
    mockGetTeamById.mockReturnValue(undefined);

    // when & then
    await expect(teamService.getTeamById(invalidId)).rejects.toThrow(`Team with id ${invalidId} does not exist.`);
});
