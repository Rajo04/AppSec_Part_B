
import { User } from '../../model/user';
import { Role } from '../../types';
import { Coach } from '../../model/coach';

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


test('givenValidUser_whenCreatingcoach_thencoachIsCreated', () => {
    // given
    const expectedId = validId;
    const expectedUser = validUser;

    // when
    const coach = new Coach({ id: expectedId, user: expectedUser });
    const actualId = coach.getId();
    const actualUser = coach.getUser();

    // then
    expect(actualId).toBe(expectedId);
    expect(actualUser).toBe(expectedUser);
});

test('givenInvalidUser_whenCreatingcoach_thenErrorIsThrown', () => {
    // given
    const invalidUser = null as any;

    // when & then
    expect(() => {
        new Coach({ id: validId, user: invalidUser });
    }).toThrow('Coach must be a user');
});

test('givenTwoEqualcoachs_whenCheckingEquality_thencoachsAreEqual', () => {
    // given
    const coach1 = new Coach({ id: validId, user: validUser });
    const coach2 = new Coach({ id: validId, user: validUser });

    // when
    const areEqual = coach1.equals(coach2);

    // then
    expect(areEqual).toBe(true);
});

test('givenTwoDifferentcoachs_whenCheckingEquality_thencoachsAreNotEqual', () => {
    // given
    const coach1 = new Coach({ id: validId, user: validUser });
    const differentUser = new User({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@ucll.be',
        phoneNumber: '0498765445',
        password: 'differentpassword',
        role: 'coach' as Role,
    });
    const coach2 = new Coach({ id: 2, user: differentUser });

    // when
    const areEqual = coach1.equals(coach2);

    // then
    expect(areEqual).toBe(false);
});
