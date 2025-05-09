import { User } from '../model/user';
import { AuthenticationResponse, UserInput } from '../types';
import userDb from '../repository/user.db';
import bcrypt from 'bcrypt';
import { generateJWTToken } from '../util/jwt';
import coachService from './coach.service';
import playerService from './player.service';

const getAllUsers = async () => {
    return (await userDb.getAllUsers()) || [];
};

const getUserById = async (id: number) => {
    const user = await userDb.getUserById(id);

    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }
    return user;
};

const getUserByEmail = async (email: string) => {
    const user = await userDb.getUserByEmail(email);

    if (!user) {
        throw new Error(`User with email ${email} does not exist.`);
    }
    return user;
};

const createUser = async (userInput: UserInput) => {
    const existingUsers = (await userDb.getAllUsers()) || [];

    if (existingUsers.some((user) => user.getEmail() === userInput.email)) {
        throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const userWithHashedPassword = {
        ...userInput,
        password: hashedPassword,
    };

    if (userInput.role == 'coach') {
        return await coachService.createCoach({ user: userWithHashedPassword });
    } else if (userInput.role == 'player') {
        return await playerService.createPlayer({ user: userWithHashedPassword });
    } else {
        const newUser = new User({
            email: userInput.email,
            password: hashedPassword,
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            phoneNumber: userInput.phoneNumber,
            role: userInput.role,
        });
        return await userDb.createUser(newUser);
    }
};

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const existingUser = await userDb.getUserByEmail(email);
    if (!existingUser) {
        throw new Error('Invalid username or password.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.getPassword());

    if (!isPasswordCorrect) {
        throw new Error('Invalid username or password.');
    }

    return {
        token: generateJWTToken(
            existingUser.getEmail(),
            existingUser.getRole(),
            existingUser.getId()!,
            existingUser.getFirstName(),
            existingUser.getLastName(),
            existingUser.getPhoneNumber()
        ),
        email: existingUser.getEmail(),
        role: existingUser.getRole(),
        id: existingUser.getId()!,
        firstName: existingUser.getFirstName(),
        lastName: existingUser.getLastName(),
        phoneNumber: existingUser.getPhoneNumber()
    };
};

const updateUser = async (id: number, userInput: UserInput): Promise<User> => {
    if (id == undefined) {
        throw new Error('An id is required.');
    }

    const user = await userDb.getUserById(id);

    if (user == undefined) {
        throw new Error('No user with that id exists.');
    }

    userInput.password = user.getPassword();

    const createdUser = new User({
        id,
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        password: userInput.password,
        phoneNumber: userInput.phoneNumber,
        role: userInput.role,
    });

    return await userDb.updateUser(createdUser);
};

const deleteUser = async (id: number) => {
    const user = await userDb.getUserById(id);

    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }

    await userDb.deleteUser(id);
}

export default { getAllUsers, getUserById, createUser, authenticate, getUserByEmail, updateUser, deleteUser };
