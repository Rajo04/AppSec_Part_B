import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { StatusMessage } from 'types';
import UserService from '@services/UserService';
import { useTranslation } from 'next-i18next';

const Login = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const router = useRouter();

    const { t } = useTranslation();

    const clearErrors = () => {
        setEmailError(null);
        setPasswordError(null);
        setStatusMessages([]);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validate = (): boolean => {
        let result = true;

        if (!userEmail && userEmail.trim() === '') {
            setEmailError('Email is required');
            result = false;
        }

        if (!userPassword && userPassword.trim() === '') {
            setPasswordError('Password is required');
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const user = {
            email: userEmail,
            password: userPassword,
        };

        const response = await UserService.logInUser(user);

        if (response.status === 200) {
            setStatusMessages([{ type: 'success', message: t('login.loginSuccess') }]);

            const loggedInUser = await response.json();
            sessionStorage.setItem(
                'loggedInUser',
                JSON.stringify({
                    token: loggedInUser.token,
                    email: loggedInUser.email,
                    role: loggedInUser.role,
                    id: loggedInUser.id,
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    phoneNumber: loggedInUser.phoneNumber,
                }),
            );
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else if (response.status === 400) {
            const { errorMessage } = await response.json();
            setStatusMessages([{ type: 'error', message: errorMessage }]);
        } else {
            setStatusMessages([{ type: 'error', message: t('general.error') }]);
        }
    };

    return (
        <div className="pt-32 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {t('login.login')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {t('login.email')}
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
                                    placeholder="Enter your email..."
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                                {emailError && <div className="text-red-800 ">{emailError}</div>}
                            </div>
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    {t('login.password')}
                                </label>
                                <div className="relative pt-2">
                                    <div className="absolute pt-2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        className="rounded-lg  block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm pl-10"
                                        placeholder="Enter your password..."
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                    />
                                    <div
                                        className="pt-2 absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                        aria-label={
                                            isPasswordVisible
                                                ? t('login.hidePwd')
                                                : t('login.showPwd')
                                        }
                                        role="button"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeOff
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Eye
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {statusMessages.length != 0 && (
                        <div className="rounded-md bg-white p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">
                                        {statusMessages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`text-${msg.type === 'error' ? 'red' : 'green'}-800`}
                                            >
                                                {msg.message}
                                            </div>
                                        ))}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="pt-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-l font-bold rounded-md text-white bg-secondary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out hover:shadow-lg hover:shadow-neutral-400"
                            disabled={loading}
                        >
                            {loading ? t('login.loginButtonMessage') : t('login.loginButton')}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link
                        href="/register"
                        className="font-medium text-white hover:underline transition duration-150 ease-in-out"
                    >
                        {t('login.registerMessage')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
