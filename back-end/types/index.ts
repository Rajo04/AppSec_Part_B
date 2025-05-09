
type Role = 'admin' | 'player' | 'coach';

type PlayerInput = {
    id?: number;
    user: UserInput;
};

type CoachInput = {
    id?: number;
    user: UserInput;
};

type TeamInput = {
    id?: number;
    teamName: string;
    players: PlayerInput[];
    coach: CoachInput;
    games?: GameInput[];
};

type GameInput = {
    id?: number;
    date: Date;
    result?: string;
    teams: TeamInput[];
};

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: Role;
};

type AuthenticationResponse = {
    token: string;
    email: string;
    role: Role;
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export { Role, PlayerInput, CoachInput, TeamInput, GameInput, UserInput, AuthenticationResponse };
