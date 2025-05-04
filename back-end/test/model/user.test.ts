import { Role } from '../../types';
import { User } from '../../model/user';

const validId = 1;
const validFirstName = 'John';
const validLastName = 'Doe';
const validEmail = 'johndoe@ucll.be';
const validPhoneNumber = '0412345678';
const validPassword = 'password123';
const validRole = 'coach';
const invalidRole = '' as Role;

const validUser = new User({
    id: validId,
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    phoneNumber: validPhoneNumber,
    password: validPassword,
    role: validRole,
});

test('givenValidValues_whenCreatingUser_thenUserIsCreated', () => {
    // given

    // when
    const user = new User({
        id: validId,
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    });

    // then
    expect(user.getId()).toEqual(validId);
    expect(user.getFirstName()).toEqual(validFirstName);
    expect(user.getLastName()).toEqual(validLastName);
    expect(user.getEmail()).toEqual(validEmail);
    expect(user.getPhoneNumber()).toEqual(validPhoneNumber);
    expect(user.getPassword()).toEqual(validPassword);
    expect(user.getRole()).toEqual(validRole);
});

test('givenInvalidValues_whenCreatingUser_thenErrorIsThrown', () => {
    // when
    expect(() => new User({
        firstName: '',
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    })).toThrow('First name is required');

    expect(() => new User({
        firstName: validFirstName,
        lastName: '',
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    })).toThrow('Last name is required');

    expect(() => new User({
        firstName: validFirstName,
        lastName: validLastName,
        email: '',
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    })).toThrow('Email is required');

    expect(() => new User({
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: '',
        password: validPassword,
        role: validRole,
    })).toThrow('Phone number is required');

    expect(() => new User({
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: '',
        role: validRole,
    })).toThrow('Password is required');

    expect(() => new User({
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: invalidRole,
    })).toThrow('Role is required');
});

test('givenValidUser_whenCheckingEquality_thenUsersAreEqual', () => {
    // given
    const user1 = new User({
        id: validId,
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    });

    const user2 = new User({
        id: validId,
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    });

    // when
    const isEqual = user1.equals(user2);

    // then
    expect(isEqual).toBe(true);
});

test('givenDifferentUsers_whenCheckingEquality_thenUsersAreNotEqual', () => {
    // given
    const user1 = new User({
        id: validId,
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        phoneNumber: validPhoneNumber,
        password: validPassword,
        role: validRole,
    });

    const user2 = new User({
        id: validId,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@ucll.be',
        phoneNumber: '0498765445',
        password: 'differentpassword',
        role: 'coach',
    });

    // when
    const isEqual = user1.equals(user2);

    // then
    expect(isEqual).toBe(false);
});