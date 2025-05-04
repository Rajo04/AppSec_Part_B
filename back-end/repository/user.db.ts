import { User } from '../model/user';
import database from './database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((usersPrisma) => User.from(usersPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id }
        });
        
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email }
        });
        
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const createUser = async (newUser: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                firstName: newUser.getFirstName(),
                lastName: newUser.getLastName(),
                email: newUser.getEmail(),
                phoneNumber: newUser.getPhoneNumber(),
                password: newUser.getPassword(),
                role: newUser.getRole()
            }
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

const updateUser = async (updatedUser: User): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            where: { id: updatedUser.getId()! },
            data: {
                firstName: updatedUser.getFirstName(),
                lastName: updatedUser.getLastName(),
                email: updatedUser.getEmail(),
                phoneNumber: updatedUser.getPhoneNumber(),
                password: updatedUser.getPassword(),
                role: updatedUser.getRole()
            }
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error, see server log for details.');
    }
};

export default { getAllUsers, getUserById, getUserByEmail, createUser, updateUser };