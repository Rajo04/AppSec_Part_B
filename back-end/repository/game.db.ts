import { Game } from '../model/game';
import database from './database';

const getAllGames = async (): Promise<Game[]> => {
    try {
        const gamePrisma = await database.game.findMany({
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return gamePrisma.map((game) => Game.from(game));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getGameById = async (id: number): Promise<Game> => {
    try {
        const gamePrisma = await database.game.findUnique({
            where: { id },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        if (!gamePrisma) {
            throw new Error('Game not found');
        }
        return Game.from(gamePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getGamesByTeamId = async (teamId: number): Promise<Game[]> => {
    try {
        const gamePrisma = await database.game.findMany({
            where: {
                teams: {
                    some: {
                        id: teamId,
                    },
                },
            },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return gamePrisma.map((game) => Game.from(game));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getGamesByUserId = async (userId: number): Promise<Game[]> => {
    try {
        const gamePrisma = await database.game.findMany({
            where: {
                OR: [
                    {
                        teams: {
                            some: {
                                coach: {
                                    userId: userId,
                                },
                            },
                        },
                    },
                    {
                        teams: {
                            some: {
                                players: {
                                    some: {
                                        userId: userId,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return gamePrisma.map((game) => Game.from(game));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const updateGame = async (game: Game): Promise<Game> => {
    try {
        const gamePrisma = await database.game.update({
            where: { id: game.getId() },
            data: {
                date: game.getDate(),
                teams: {
                    set: game.getTeams().map((team) => ({ id: team.getId() })),
                },
                result: game.getResult() ?? '',
            },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return Game.from({
            ...gamePrisma,
            date: gamePrisma.date,
            teams: gamePrisma.teams,
            result: gamePrisma.result,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const createGame = async (game: Game): Promise<Game> => {
    try {
        const gamePrisma = await database.game.create({
            data: {
                date: game.getDate(),
                teams: {
                    connect: game.getTeams().map((team) => ({ id: team.getId() })),
                },
                result: game.getResult() ?? '',
            },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return Game.from({
            ...gamePrisma,
            date: gamePrisma.date,
            teams: gamePrisma.teams,
            result: gamePrisma.result,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const deleteGame = async (id: number): Promise<Game> => {
    try {
        const gamePrisma = await database.game.delete({
            where: { id },
            include: {
                teams: {
                    include: {
                        coach: { include: { user: true } },
                        players: { include: { user: true } },
                    },
                },
            },
        });
        return Game.from({
            ...gamePrisma,
            date: gamePrisma.date,
            teams: gamePrisma.teams,
            result: gamePrisma.result,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    getGamesByTeamId,
    getGamesByUserId,
    deleteGame,
};
