import { Player as PlayerPrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';

export class Player {
    private id?: number;
    private user: User;

    constructor(player: { id?: number; user: User; }) {
        this.validate(player);
        this.id = player.id;
        this.user = player.user;
    }

    validate(player: {
        id?: number;
        user: User;
    }) {
        if (!player.user) {
            throw new Error('Player must be a user');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    equals(player: Player): boolean {
        return (
            this.id === player.id &&
            this.user === player.user
        );
    }

    static from({ id, user }: PlayerPrisma & { user: UserPrisma}) {
        return new Player({
            id,
            user: User.from(user),
        });
    }
}
