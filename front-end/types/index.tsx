export type Role = undefined |'admin' | 'player' | 'coach';

export type Player = {
    id: number;
    user: User;
};

export type Coach = {
    id: number;
    user: User;
};

export type Team = {
    id: number;
    teamName: string;
    players: Player[];
    coach: Coach;
    games?: Game[];
};

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: Role;
};

export type Game = {
    id: number;
    date: string;
    teams: Team[];
    result: string;
};

export type StatusMessage = {
    message: string;
    type: 'error' | 'success';
};


