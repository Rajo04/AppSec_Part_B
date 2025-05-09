import { Coach as CoachPrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';
import { Team } from './team';

export class Coach {
    private id?: number;
    private user: User;

    constructor(coach: { id?: number; user: User }) {
        this.validate(coach);

        this.id = coach.id;
        this.user = coach.user;
    }

    validate(coach: { id?: number; user: User; team?: Team[] }) {
        if (!coach.user) {
            throw new Error('Coach must be a user');
        }
    }
    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    equals(coach: Coach): boolean {
        return this.id === coach.id && this.user === coach.user;
    }

    static from({ id, user }: CoachPrisma & { user: UserPrisma }) {
        return new Coach({
            id,
            user: User.from(user),
        });
    }
}
