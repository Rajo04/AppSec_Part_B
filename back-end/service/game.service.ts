import { Game } from '../model/game';
import gameDb from '../repository/game.db';
import { GameInput } from '../types';
import { Player } from '../model/player';
import { Coach } from '../model/coach';
import { Team } from '../model/team';
import { User } from '../model/user';

const getAllGames = async (): Promise<Game[]> => {
    return await gameDb.getAllGames();
};

const getGameById = async (id: number): Promise<Game> => {
    const game = await gameDb.getGameById(id);
    if (!game) {
        throw new Error(`Game with id ${id} does not exist.`);
    }
    return game;
};

const getGamesByTeamId = async (teamId: number): Promise<Game[]> => {
    const games = (await gameDb.getGamesByTeamId(teamId)) || [];

    if (games.length === 0) {
        throw new Error('No games found for that team.');
    }

    if (teamId == undefined) {
        throw new Error('An id is required.');
    }

    return games;
};

const getGamesByUserId = async (userId: number): Promise<Game[]> => {
    if (userId == undefined) {
        throw new Error('An id is required.');
    }

    const games = (await gameDb.getGamesByUserId(userId)) || [];

    if (games.length === 0) {
        throw new Error('No games found for that user.');
    }

    return games;
};

const updateGame = async (id: number, updatedGame: GameInput): Promise<Game> => {
    if (id == undefined) {
        throw new Error('An id is required.');
    }

    const game = await gameDb.getGameById(id);

    if (game == undefined) {
        throw new Error('Game not found.');
    }

    const teams = updatedGame.teams.map(
        (teamInput) =>
            new Team({
                id: teamInput.id,
                teamName: teamInput.teamName,
                players: teamInput.players.map(
                    (playerInput) =>
                        new Player({ id: playerInput.id, user: new User(playerInput.user) })
                ),
                coach: new Coach({ id: teamInput.coach.id, user: new User(teamInput.coach.user) }),
            })
    );

    const date = updatedGame.date || game.getDate();
    const result = updatedGame.result || game.getResult();

    const updatedGameInstance = new Game({
        id,
        date,
        result,
        teams,
    });

    const updatedGameInDb = await gameDb.updateGame(updatedGameInstance);

    if (!updatedGame) {
        throw new Error('Game could not be updated.');
    }

    return updatedGameInDb;
};

const createGame = async (gameInput: GameInput): Promise<Game> => {
    const existingGames = (await gameDb.getAllGames()) || [];

    if (existingGames.find((game) => game.getId() === gameInput.id)) {
        throw new Error(`Game with id ${gameInput.id} already exists.`);
    }

    if (!gameInput.teams || gameInput.teams.length !== 2) {
        throw new Error('Exactly two teams are required.');
    }

    const teams = gameInput.teams.map((teamInput) => {
        const players = teamInput.players.map(
            (playerInput) => new Player({ id: playerInput.id, user: new User(playerInput.user) })
        );
        const coach = new Coach({ id: teamInput.coach.id, user: new User(teamInput.coach.user) });

        return new Team({
            id: teamInput.id,
            teamName: teamInput.teamName,
            players,
            coach,
        });
    });

    const newGame = new Game({
        id: gameInput.id,
        date: gameInput.date,
        result: gameInput.result,
        teams,
    });

    return await gameDb.createGame(newGame);
};

const deleteGame = async (id: number): Promise<Game> => {
    if (id == undefined) {
        throw new Error('An id is required.');
    }

    const game = await gameDb.getGameById(id);

    if (game == undefined) {
        throw new Error('No game with that id exists.');
    }

    const deletedGame = await gameDb.deleteGame(id);

    if (!deletedGame) {
        throw new Error('Game could not be deleted.');
    }

    return deletedGame;
};

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getGamesByTeamId,
    getGamesByUserId,
};
