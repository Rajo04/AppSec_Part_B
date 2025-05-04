import { Coach } from "../../model/coach";
import { Game } from "../../model/game";
import { Player } from "../../model/player";
import { Team } from "../../model/team";
import { User } from "../../model/user";
import set from "date-fns/set";
import { Role } from "../../types";


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

const validUser3 = new User({
    id: 3,
    firstName: "Mark",
    lastName: "Doe",
    email: "markdoe@ucll.be",
    phoneNumber: "0412345678",
    password: "password123",
    role: "player" as Role,
});

const validUser4 = new User({
    id: 4,
    firstName: "Tom",
    lastName: "Doe",
    email: "Tomdoe@ucll.be",
    phoneNumber: "0412345676",
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

const validUser6 = new User({
    id: 6,
    firstName: "Sarah",
    lastName: "Doe",
    email: "sarahdoe@ucll.be",
    phoneNumber: "0412345678",
    password: "password123",
    role: "coach" as Role,
});


const validDate = set(new Date(), { hours: 15, minutes: 30 });
const validResult = '0 - 1'
const validId = 7;

const validPlayer = new Player({id: 1, user: validUser1});
const validPlayer2 = new Player({id: 2, user: validUser2});
const validPlayer3 = new Player({id: 3, user: validUser3});
const validPlayer4 = new Player({id: 4, user: validUser4});
const validCoach = new Coach({id: 5, user: validUser5});
const validCoach2 = new Coach({id: 6, user: validUser6});
const validTeamName = "UCLLTeam";
const validTeamName2 = "UCLLTeam2";
const validTeam =  new Team({teamName: validTeamName, players: [validPlayer, validPlayer2], coach: validCoach});
const validTeam2 = new Team({teamName: validTeamName2, players: [validPlayer3, validPlayer4], coach: validCoach2});

test('givenGameWithoutDate_whenCreatingGame_thenErrorIsThrown', () => {
    //when
    expect(() => new Game({date: undefined as any, teams: [validTeam, validTeam2], result: validResult})).toThrow('Game date is required.');
});

test('givenGameWithoutTeams_whenCreatingGame_thenErrorIsThrown', () => {
    //when
    expect(() => new Game({date: validDate, teams: undefined as any, result: validResult})).toThrow('Teams are required.');
});

test('givenGameWithMoreThanTwoTeams_whenCreatingGame_thenErrorIsThrown', () => {
    //when
    expect(() => new Game({date: validDate, teams: [validTeam, validTeam2, validTeam], result: validResult})).toThrow('Exactly two teams are required.');
});

test('givenGameWithValidTeams_whenGettingTeams_thenTeamsAreReturned', () => {
    //given
    const game = new Game({id: validId, date: validDate, teams: [validTeam, validTeam2], result: validResult});

    //when
    const teams = game.getTeams();

    //then
    expect(teams).toContain(validTeam);
    expect(teams).toContain(validTeam2);
});

test('givenGameWithValidDate_whenGettingDate_thenDateIsReturned', () => {
    //given
    const game = new Game({id: validId, date: validDate, teams: [validTeam, validTeam2], result: validResult});

    //when
    const date = game.getDate();

    //then
    expect(date).toEqual(validDate);
});

test('givenGameWithValidId_whenGettingId_thenIdIsReturned', () => {
    //given
    const game = new Game({id: validId, date: validDate, teams: [validTeam, validTeam2], result: validResult});

    //when
    const id = game.getId();

    //then
    expect(id).toEqual(validId);
});
