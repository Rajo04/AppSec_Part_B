import { Player } from '../model/player';
import database from './database';

const getAllPlayers = async (): Promise<Player[]> => {
    try {
        const playerPrisma = await database.player.findMany({
            include: { team: true, user: true }
        });
        return playerPrisma.map((player) => Player.from(player));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const getPlayerById = async (id: number): Promise<Player> => {
    try {
        const playerPrisma = await database.player.findUnique({
            where: { id },
            include: { team: true, user: true }
        });
        if (!playerPrisma) {
            throw new Error('Player not found');
        }
        return Player.from(playerPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const createPlayer = async (newPlayer: Player): Promise<Player> => {
    const user = newPlayer.getUser();
    const id = newPlayer.getId();
    try {
        const playerPrisma = await database.player.create({
            data: {
                user: {
                    create: {
                        firstName: user.getFirstName(),
                        lastName: user.getLastName(),
                        email: user.getEmail(),
                        phoneNumber: user.getPhoneNumber(),
                        password: user.getPassword(),
                        role: user.getRole(),
                    },
                },
            },
            include: { user: true }
        });
        return Player.from(playerPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default { getAllPlayers, getPlayerById, createPlayer };
