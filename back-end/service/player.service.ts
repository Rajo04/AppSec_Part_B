import { Player } from '../model/player';
import { User } from '../model/user';
import playerDb from '../repository/player.db';
import { PlayerInput } from '../types';

const getAllPlayers = async (): Promise<Player[]> => {
    return (await playerDb.getAllPlayers()) || [];
};

const getPlayerById = async (id: number): Promise<Player> => {
    const player = await playerDb.getPlayerById(id);

    if (!player) {
        throw new Error(`Player with id ${id} does not exist.`);
    }
    return player;
};

const createPlayer = async (playerInput: PlayerInput): Promise<Player> => {
    const existingPlayers = (await playerDb.getAllPlayers()) || [];

    if (existingPlayers.find((player) => player.getUser().getId() === playerInput.user.id)) {
        throw new Error(`User with id ${playerInput.user.id} already exists.`);
    }
    if (!playerInput.user.firstName) {
        throw new Error('First name is required.');
    }
    if (!playerInput.user.lastName) {
        throw new Error('Last name is required.');
    }
    if (!playerInput.user.email) {
        throw new Error('Email is required.');
    }
    if (!playerInput.user.phoneNumber) {
        throw new Error('Phone number is required.');
    }

    const newPlayer = new Player({ id: playerInput.id, user: new User(playerInput.user) });
    return await playerDb.createPlayer(newPlayer);
};

export default { getAllPlayers, getPlayerById, createPlayer };
