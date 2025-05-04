import userService from '../../service/user.service';
import bcrypt from 'bcrypt';
import * as jwtUtil from '../../util/jwt';
import { Role } from '../../types';

const validId = 1;
const invalidId = -1;
const validFirstName = 'Test';
const invalidFirstName = '';
const validLastName = 'Tester';
const invalidLastName = '';
const validEmail = 'testtester@ucll.be';
const invalidEmail = '';
const validPhoneNumber = '0423456789';
const invalidPhoneNumber = '';
const validRole = 'coach' as Role;
const invalidRole = 'invalid' as Role;
const validPassword = 'password';
const invalidPassword = '';
const hashedPassword = 'hashedpassword';

const validUser = {
    id: validId,
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    phoneNumber: validPhoneNumber,
    role: validRole,
    password: validPassword
};

let mockGetAllUsers: jest.Mock;
let mockGetUserById: jest.Mock;
let mockCreateUser: jest.Mock;
let mockGetUserByEmail: jest.Mock;
let mockUpdateUser: jest.Mock;
let mockHash: jest.Mock;
let mockCompare: jest.Mock;
let mockGenerateJWTToken: jest.Mock;

beforeEach(() => {
    mockGetAllUsers = jest.fn();
    mockGetUserById = jest.fn();
    mockCreateUser = jest.fn();
    mockGetUserByEmail = jest.fn();
    mockUpdateUser = jest.fn();
    mockHash = jest.fn();
    mockCompare = jest.fn();
    mockGenerateJWTToken = jest.fn();

    userService.getAllUsers = mockGetAllUsers;
    userService.getUserById = mockGetUserById;
    userService.createUser = mockCreateUser;
    userService.getUserByEmail = mockGetUserByEmail;
    userService.updateUser = mockUpdateUser;
    bcrypt.hash = mockHash;
    bcrypt.compare = mockCompare;
    jest.spyOn(jwtUtil, 'generateJWTToken').mockImplementation(mockGenerateJWTToken);
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given no users in the database, when getAllUsers is called, then it should return an empty array', async () => {
    mockGetAllUsers.mockResolvedValue([]);
    const users = await userService.getAllUsers();
    expect(users).toEqual([]);
    expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
});

test('given users in the database, when getAllUsers is called, then it should return all users', async () => {
    mockGetAllUsers.mockResolvedValue([validUser]);
    const users = await userService.getAllUsers();
    expect(users).toEqual([validUser]);
    expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
});

test('given a valid user id, when getUserById is called, then it should return the user', async () => {
    mockGetUserById.mockResolvedValue(validUser);
    const user = await userService.getUserById(validId);
    expect(user).toEqual(validUser);
    expect(mockGetUserById).toHaveBeenCalledWith(validId);
});

test('given an invalid user id, when getUserById is called, then it should throw an error', async () => {
    // Given
    mockGetUserById.mockRejectedValue(new Error(`User with id ${invalidId} does not exist.`));

    // When & Then
    await expect(userService.getUserById(invalidId)).rejects.toThrow(`User with id ${invalidId} does not exist.`);
    expect(mockGetUserById).toHaveBeenCalledWith(invalidId);
});

test('given a valid email, when getUserByEmail is called, then it should return the user', async () => {
    mockGetUserByEmail.mockResolvedValue(validUser);
    const user = await userService.getUserByEmail(validEmail);
    expect(user).toEqual(validUser);
    expect(mockGetUserByEmail).toHaveBeenCalledWith(validEmail);
});

test('given an invalid email, when getUserByEmail is called, then it should throw an error', async () => {
    mockGetUserByEmail.mockRejectedValue(new Error(`User with email ${invalidEmail} does not exist.`));
    await expect(userService.getUserByEmail(invalidEmail)).rejects.toThrow(`User with email ${invalidEmail} does not exist.`);
    expect(mockGetUserByEmail).toHaveBeenCalledWith(invalidEmail);
});

test('given a new user, when createUser is called, then it should create and return the user', async () => {
    // Given
    mockGetUserById.mockResolvedValue(validUser);
    mockHash.mockResolvedValue(hashedPassword);
    mockCreateUser.mockResolvedValue(validUser);

    const userInput = {
        email: validEmail,
        password: validPassword,
        firstName: validFirstName,
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        role: validRole
    };

    // When
    const user = await userService.createUser(userInput);

    // Then
    expect(user).toMatchObject({
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        phoneNumber: userInput.phoneNumber,
        role: userInput.role
    });
    expect(mockCreateUser).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
        firstName: validFirstName,
        lastName: validLastName,
        phoneNumber: validPhoneNumber,
        role: validRole
    });
});