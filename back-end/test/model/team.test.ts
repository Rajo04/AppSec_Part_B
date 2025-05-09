import { Coach } from '../../model/coach';
import { Player } from '../../model/player';
import { Team } from '../../model/team';
import { User } from '../../model/user';
import { Role } from '../../types';


const validUser1 = new User({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@ucll.be",
    phoneNumber: "0412345678",
    password: "password123",
    role: "player" as Role,
});

const validUser2 = new User({
    id: 2,
    firstName: "jane",
    lastName: "Doe",
    email: "janedoe@ucll.be",
    phoneNumber: "0412345677",
    password: "password123",
    role: "player" as Role,
});

const validUser5 = new User({
    id: 5,
    firstName: "Helena",
    lastName: "Doe",
    email: "helenadoe@ucll.be",
    phoneNumber: "0412345678",
    password: "password123",
    role: "coach" as Role,
});


const validCoach = new Coach({id: 5, user: validUser5});
const validPlayer = new Player({id: 1, user: validUser1});
const validPlayer2 = new Player({id: 2, user: validUser2});

const validTeamName = 'UCLLTeam';
const validId = 3;





test('givenValidValues_whenCreatingTeam_thenTeamIsCreated', () => {
    //given

    //when
    const team = new Team({id: validId, teamName: validTeamName, players: [validPlayer], coach: validCoach });

    //then
    expect(team.getId()).toEqual(validId);
    expect(team.getTeamName()).toEqual(validTeamName);
    expect(team.getPlayers()).toContain(validPlayer);
    expect(team.getCoach()).toEqual(validCoach);
});

test('givenInvalidValues_whenCreatingTeam_thenErrorIsThrown', () => {
    //when
    expect(() => new Team({ teamName: '', players: [validPlayer], coach: validCoach })).toThrow('Team name is required.');
});

test('givenValidPlayerAndTeam_whenAddingPlayerToTeam_thenPlayerIsAddedSuccessfully', () => {
    //given
    const team = new Team({ teamName: validTeamName, players: [validPlayer], coach: validCoach });
    //when
    team.addPlayer(validPlayer2);
    //then
    expect(team.getPlayers()).toContain(validPlayer2);
});

test('givenValidPlayerAndTeam_whenRemovingPlayerFromTeam_thenPlayerIsRemovedSuccessfully', () => {
    //given
    const team = new Team({
        teamName: validTeamName,
        players: [validPlayer, validPlayer2],
        coach: validCoach,
    });
    //when
    team.removePlayer(validPlayer);
    //then
    expect(team.getPlayers()).not.toContain(validPlayer);
});

test('givenValidTeamAndCoach_whenUpdatingCoach_thenCoachIsUpdatedSuccessfully', () => {
    //given
    const team = new Team({ teamName: validTeamName, players: [validPlayer], coach: validCoach });
    const newCoach = validCoach;
    //when
    team.updateCoach(newCoach);
    //then
    expect(team.getCoach()).toEqual(newCoach);
});

test('givenValidTeamAndName_whenUpdatingTeamName_thenTeamNameIsUpdatedSuccessfully', () => {
    //given
    const team = new Team({ teamName: validTeamName, players: [validPlayer], coach: validCoach });
    const newTeamName = 'NewTeamName';
    //when
    team.updateTeamName(newTeamName);
    //then
    expect(team.getTeamName()).toEqual(newTeamName);
});

test('givenValidTeam_whenAddingExistingPlayer_thenPlayerIsNotAddedAgain', () => {
    //given
    const team = new Team({ teamName: validTeamName, players: [validPlayer], coach: validCoach });
    //when
    team.addPlayer(validPlayer);
    //then
    expect(team.getPlayers().length).toBe(1);
});

test('givenValidTeam_whenRemovingNonExistingPlayer_thenPlayersRemainUnchanged', () => {
    //given
    const team = new Team({ teamName: validTeamName, players: [validPlayer], coach: validCoach });
    //when
    team.removePlayer(validPlayer2);
    //then
    expect(team.getPlayers().length).toBe(1);
    expect(team.getPlayers()).toContain(validPlayer);
});

test('givenValidTeam_whenGettingPlayers_thenPlayersAreReturnedSuccessfully', () => {
    //given
    const team = new Team({
        teamName: validTeamName,
        players: [validPlayer, validPlayer2],
        coach: validCoach,
    });
    //when
    const players = team.getPlayers();
    //then
    expect(players).toContain(validPlayer);
    expect(players).toContain(validPlayer2);
});

test('givenValidTeam_whenGettingCoach_thenCoachIsReturnedSuccessfully', () => {
    //given
    const team = new Team({
        teamName: validTeamName,
        players: [validPlayer, validPlayer2],
        coach: validCoach,
    });
    //when
    const coach = team.getCoach();
    //then
    expect(coach).toEqual(validCoach);
});

test('givenValidTeam_whenGettingTeamName_thenTeamNameIsReturnedSuccessfully', () => {
    //given
    const team = new Team({
        teamName: validTeamName,
        players: [validPlayer, validPlayer2],
        coach: validCoach,
    });
    //when
    const teamName = team.getTeamName();
    //then
    expect(teamName).toEqual(validTeamName);
});
