'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ChevronDown, Phone } from 'lucide-react';
import { Role, StatusMessage } from '../../types';
import UserService from '@services/UserService';
import { useTranslation } from "next-i18next";

const Register = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userRole, setUserRole] = useState<Role>(undefined);
    const [loading, setLoading] = useState(false);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [firstNameError, setFirstNameError] = useState<string | null>(null);
    const [lastNameError, setLastNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const router = useRouter();

    const { t } = useTranslation();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validate = (): boolean => {
        let result = true;

        if (!userFirstName && userFirstName.trim() === '') {
            setFirstNameError(t('register.firstNameError'));
            result = false;
        }

        if (!userLastName && userLastName.trim() === '') {
            setLastNameError(t('register.lastNameError'));
            result = false;
        }

        if (!userEmail && userEmail.trim() === '') {
            setEmailError(t('register.emailError'));
            result = false;
        }

        if (!userPhoneNumber && userPhoneNumber.trim() === '') {
            setUserPhoneNumber(t('register.phoneNrError'))
        }

        if (!userPassword && userPassword.trim() === '') {
            setPasswordError(t('register.pwdError'));
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (!validate()) {
            return;
        }

        const user = {
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            password: userPassword,
            phoneNumber: userPhoneNumber,
            role: userRole,
        };
        

        const response = await UserService.registerUser({id: 0, ...user});

        if (response.status === 201) {
            setStatusMessages([{ type: 'success', message: t('register.successMessage') }]);
            setLoading(false);

            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else if (response.status === 400) {
            const { errorMessage } = await response.json();
            setStatusMessages([{ type: 'error', message: errorMessage }]);
        } else if (response.status === 204) {
        } else {
            setStatusMessages([{ type: 'error', message: t('general.error') }]);
        }
    };

    return (
        <div className="pt-32 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {t('register.createAccount')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="sr-only">
                                    {t('register.firstName')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className="rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                        placeholder="First Name"
                                        value={userFirstName}
                                        onChange={(e) => setUserFirstName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="sr-only">
                                    {t('register.lastName')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className="rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                        placeholder="Last Name"
                                        value={userLastName}
                                        onChange={(e) => setUserLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {t('register.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                    placeholder="Email address"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <label htmlFor="password" className="sr-only">
                                {t('register.pwd')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className="rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                    placeholder="Password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                />
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                    aria-label={
                                        isPasswordVisible ? t('login.hidePwd') : t('login.showPwd')
                                    }
                                    role="button"
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <label htmlFor="phoneNumber" className="sr-only">
                                {t('register.phoneNr')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    autoComplete="new-password"
                                    required
                                    className="rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                    placeholder="Phone Number"
                                    value={userPhoneNumber}
                                    onChange={(e) => setUserPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <label htmlFor="role" className="sr-only">
                                {t('register.role')}
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="hover:shadow-lg hover:shadow-neutral-400 rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm appearance-none"
                                    value={""+userRole}
                                    onChange={(e) => setUserRole(e.target.value as Role)}
                                >
                                    <option value="" disabled selected>
                                        {t('register.role')}
                                    </option>
                                    <option value="coach">{t('register.coach')}</option>
                                    <option value="player">{t('register.player')}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {statusMessages.length > 0 && (
                        <div className="rounded bg-yellow-50 p-4">
                            {statusMessages.map((message, index) => (
                                <div key={index} className="flex">
                                    <div className="ml-3">
                                        <h3
                                            className={`text-sm font-medium text-${message.type === 'error' ? 'red' : 'green'}-800`}
                                        >
                                            {message.message}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-l font-bold rounded-md text-white bg-secondary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out hover:shadow-lg hover:shadow-neutral-400"
                            disabled={loading}
                        >
                            {loading ? t('register.registerMessage') : t('register.registerButton')}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link
                        href="/login"
                        className="font-medium text-white hover:underline transition duration-150 ease-in-out"
                    >
                        {t('register.loginMessage')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
