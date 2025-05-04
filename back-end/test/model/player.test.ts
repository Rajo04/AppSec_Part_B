import { Player } from '../../model/player';
import { User } from '../../model/user';
import { Role } from '../../types';

const validId = 1;
const validFirstName = 'John';
const validLastName = 'Doe';
const validEmail = 'johndoe@ucll.be';
const validPhoneNumber = '0412345678';
const validPassword = 'password123';
const validRole = 'coach' as Role;

const validUser = new User({
    id: validId,
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    phoneNumber: validPhoneNumber,
    password: validPassword,
    role: validRole,
});

test('givenValidUser_whenCreatingPlayer_thenPlayerIsCreated', () => {
    // given
    const expectedId = validId;
    const expectedUser = validUser;

    // when
    const player = new Player({ id: expectedId, user: expectedUser });
    const actualId = player.getId();
    const actualUser = player.getUser();

    // then
    expect(actualId).toBe(expectedId);
    expect(actualUser).toBe(expectedUser);
});

test('givenInvalidUser_whenCreatingPlayer_thenErrorIsThrown', () => {
    // given
    const invalidUser = null as any;

    // when & then
    expect(() => {
        new Player({ id: validId, user: invalidUser });
    }).toThrow('Player must be a user');
});

test('givenTwoEqualPlayers_whenCheckingEquality_thenPlayersAreEqual', () => {
    // given
    const player1 = new Player({ id: validId, user: validUser });
    const player2 = new Player({ id: validId, user: validUser });

    // when
    const areEqual = player1.equals(player2);

    // then
    expect(areEqual).toBe(true);
});

test('givenTwoDifferentPlayers_whenCheckingEquality_thenPlayersAreNotEqual', () => {
    // given
    const player1 = new Player({ id: validId, user: validUser });
    const differentUser = new User({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@ucll.be',
        phoneNumber: '0498765445',
        password: 'differentpassword',
        role: 'player' as Role,
    });
    const player2 = new Player({ id: 2, user: differentUser });

    // when
    const areEqual = player1.equals(player2);

    // then
    expect(areEqual).toBe(false);
});