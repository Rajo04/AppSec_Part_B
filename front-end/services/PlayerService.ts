const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';

const getAllPlayers = () => {
    return fetch(apiUrl + '/players', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const PlayerService = {
    getAllPlayers,
};

export default PlayerService;
