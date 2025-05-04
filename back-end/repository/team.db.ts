import { Coach } from '../model/coach';
import { Team } from '../model/team';
import { TeamInput } from '../types';
import database from './database';

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamPrisma = await database.team.findMany({
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        return teamPrisma.map((team: any) => Team.from(team));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getTeamsByUserId = async (userId: number): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            where: { OR: [{ coach: { userId } }, { players: { some: { userId } } }] },
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        return teamsPrisma.map((team: any) => Team.from(team));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getTeamById = async (id: number): Promise<Team> => {
    try {
        const teamPrisma = await database.team.findUnique({
            where: { id },
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        if (!teamPrisma) {
            throw new Error('Team not found');
        }
        return Team.from({ ...teamPrisma, coach: teamPrisma.coach, players: teamPrisma.players });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const createTeam = async (team: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.create({
            data: {
                teamName: team.getTeamName(),
                coach: { connect: { id: team.getCoach().getId() } },
                players: {
                    connect: team.getPlayers().map((player) => ({ id: player.getId() })),
                },
            },
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        return Team.from({
            ...teamPrisma,
            players: teamPrisma.players,
            coach: teamPrisma.coach,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const updateTeam = async (team: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id: team.getId() },
            data: {
                teamName: team.getTeamName(),
                coach: { connect: { id: team.getCoach().getId() } },
                players: {
                    set: team.getPlayers().map((player) => ({ id: player.getId() })),
                },
            },
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        return Team.from({
            ...teamPrisma,
            players: teamPrisma.players,
            coach: teamPrisma.coach,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const deleteTeam = async (id: number): Promise<Team> => {
    try {
        const teamPrisma = await database.team.delete({
            where: { id },
            include: { coach: { include: { user: true } }, players: { include: { user: true } } },
        });
        return Team.from({
            ...teamPrisma,
            players: teamPrisma.players,
            coach: teamPrisma.coach,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default { getAllTeams, getTeamsByUserId, getTeamById, createTeam, updateTeam, deleteTeam };

