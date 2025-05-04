import { Coach } from '../model/coach';
import { User } from '../model/user';
import coachDb from '../repository/coach.db';
import { CoachInput } from '../types';

const getAllCoaches = async (): Promise<Coach[]> => {
    return await coachDb.getAllCoaches();
};

const getCoachById = async (id: number): Promise<Coach> => {
    const coach = await coachDb.getCoachById(id);
    if (!coach) {
        throw new Error(`Coach with id ${id} does not exist.`);
    }
    return coach;
};

const createCoach = async (coachInput: CoachInput): Promise<Coach> => {
    const existingCoaches = (await coachDb.getAllCoaches()) || [];

    if (existingCoaches.find((coach) => coach.getUser().getId() === coachInput.user.id)) {
        throw new Error(`User with id ${coachInput.id} already exists.`);
    }
    if (!coachInput.user.firstName) {
        throw new Error('First name is required.');
    }
    if (!coachInput.user.lastName) {
        throw new Error('Last name is required.');
    }
    if (!coachInput.user.email) {
        throw new Error('Email is required.');
    }
    if (!coachInput.user.phoneNumber) {
        throw new Error('Phone number is required.');
    }

    const newCoach = new Coach({ id: coachInput.id, user: new User(coachInput.user) });
    return await coachDb.createCoach(newCoach);
};

export default { getAllCoaches, getCoachById, createCoach };
