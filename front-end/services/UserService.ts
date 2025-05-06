import { get } from 'http';
import { Team, User } from '../types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';
const logInUser = (user: {email: string, password: string}) => {
    return fetch(apiUrl + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const registerUser = (user: User) => {
    return fetch(apiUrl + '/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

const updateUser = (user: User) => {
    return fetch(apiUrl + `/users/edit/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });
}

const getUserById = (id: number) => {
    return fetch(apiUrl + `/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteUser = (id: number) => {
    const token = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("loggedInUser") || '{}')?.token : '';
    return fetch(apiUrl + `/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const UserService = { logInUser, registerUser, updateUser, getUserById, deleteUser };

export default UserService;
