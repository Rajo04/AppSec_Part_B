import { Coach } from './coach';
import { Game } from './game';
import { Player } from './player';
import {
    Coach as CoachPrisma,
    Player as PlayerPrisma,
    Team as TeamPrisma,
    User as UserPrisma,
    Game as GamePrisma,
} from '@prisma/client';

export class Team {
    private id?: number;
    private teamName: string;
    private players: Player[];
    private coach: Coach;

    constructor(team: { id?: number; teamName: string; players: Player[]; coach: Coach; }) {
        this.validate(team);
        this.id = team.id;
        this.teamName = team.teamName;
        this.players = team.players;
        this.coach = team.coach;
    }

    validate(team: { id?: number; teamName: string; players: Player[]; coach: Coach, games?: Game[] }) {
        if (!team.teamName) {
            throw new Error('Team name is required.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getTeamName(): string {
        return this.teamName;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getCoach(): Coach {
        return this.coach;
    }

    equals(team: Team): boolean {
        return (
            this.teamName === team.teamName &&
            this.players.length === team.players.length &&
            this.players.every((player, index) => player.equals(team.players[index])) &&
            this.coach === team.coach
        );
    }

    addPlayer(player: Player) {
        if (!this.getPlayers().includes(player)) {
            this.players.push(player);
        }
    }

    removePlayer(player: Player) {
        if (this.getPlayers().includes(player)) {
            const index = this.players.indexOf(player);
            this.players.splice(index, 1);
        }
    }

    updateCoach(coach: Coach) {
        if (this.getCoach() != coach) {
            this.coach = coach;
        }
    }

    updateTeamName(newTeamName: string) {
        if (this.getTeamName() != newTeamName) {
            this.teamName = newTeamName;
        }
    }

    static from({ id, teamName, players, coach }: TeamPrisma & {players: ({id: number, user: UserPrisma} 
        & PlayerPrisma
        & {user: UserPrisma})[]}
        & { coach: CoachPrisma & { user: UserPrisma } }) {
        return new Team({
            id,
            teamName,
            players: players.map((player: any) => new Player(player)),
            coach: Coach.from(coach)
        });
    }
};