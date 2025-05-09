import { Coach } from '../model/coach';
import database from './database';

const getAllCoaches = async (): Promise<Coach[]> => {
    try {
        const coachPrisma = await database.coach.findMany({
            include: { team: true, user: true },
        });
        return coachPrisma.map((coach) => Coach.from(coach));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getCoachById = async (id: number): Promise<Coach> => {
    try {
        const coachPrisma = await database.coach.findUnique({
            where: { id },
            include: { team: true, user: true },
        });
        if (!coachPrisma) {
            throw new Error('Coach not found');
        }
        return Coach.from(coachPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const createCoach = async (newCoach: Coach): Promise<Coach> => {
    const user = newCoach.getUser();
    try {
        const coachPrisma = await database.coach.create({
            data: {
                user: {
                    create: {
                        firstName: user.getFirstName(),
                        lastName: user.getLastName(),
                        email: user.getEmail(),
                        phoneNumber: user.getPhoneNumber(),
                        password: user.getPassword(),
                        role: user.getRole(),
                    },
                },
            },
            include: { user: true },
        });
        return Coach.from(coachPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default { getAllCoaches, getCoachById, createCoach };
