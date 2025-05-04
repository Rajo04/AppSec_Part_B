import { Team } from '../types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';

const getAllTeams = () => {
    return fetch(apiUrl + '/teams', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getTeamById = (id: number) => {
    return fetch(apiUrl + `/teams/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateTeam = (team: Team) => {
    return fetch(apiUrl + `/teams/edit/${team.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(team),
    });
};

const createTeam = (team: Team) => {
    return fetch(apiUrl + '/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(team),
    });
};

const getTeamsByUserId = (userId: number) => {
    return fetch(apiUrl + `/teams/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteTeam = (id: number) => {
    return fetch(apiUrl + `/teams/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const TeamService = {
    getAllTeams,
    createTeam,
    getTeamById,
    updateTeam,
    getTeamsByUserId,
    deleteTeam,
};

export default TeamService;
