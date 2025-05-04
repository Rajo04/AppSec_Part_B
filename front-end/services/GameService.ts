import { Game } from 'types';

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';

const getAllGames = () => {
    return fetch(apiURL + '/games', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getGameById = (id: number) => {
    return fetch(apiURL + `/games/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateGame = (game: Game) => {
    return fetch(`${apiURL}/games/edit/${game.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(game),
    });
};

const createGame = (game: Game) => {
    return fetch(apiURL + '/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(game),
    });
};

const getGamesByTeamId = (teamId: number) => {
    return fetch(apiURL + `/games/team/${teamId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getGamesByUserId = (userId: number) => {
    return fetch(apiURL + `/games/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteGame = (id: number) => {
    return fetch(apiURL + `/games/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const GameService = {
    getAllGames,
    getGameById,
    updateGame,
    createGame,
    getGamesByTeamId,
    deleteGame,
    getGamesByUserId,
};
export default GameService;
