import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { User } from 'types';
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import Language from '@components/languages/Language';

const Nav: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const router = useRouter();

    const { t } = useTranslation();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setLoggedInUser(parsedUser);
        }
    }, []);

    const handleClick = () => {
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        router.push('/');
    };

    return (
        <header className="shadow-lg bg-secondary">
            <div className=" container mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center hover:shadow-md hover:shadow-neutral-400 duration-200"
                >
                    <Image
                        src="/images/TeamTrackLogo.png"
                        alt="TeamTrack logo"
                        width={200}
                        height={50}
                        className="w-auto h-10"
                    />
                </Link>
                <nav className="text-primary">
                    <ul className="text-text flex items-center space-x-1">
                        <li>
                            <Link
                                href="/"
                                className="text-sm font-semibold hover:text-white hover:shadow-md hover:shadow-neutral-400 transition-shadow duration-200 rounded px-3 py-2 hover:bg-accent"
                            >
                                {t('nav.home')}
                            </Link>
                        </li>
                        {loggedInUser && (
                            <ul className="text-text flex items-center space-x-1">
                                <li>
                                    <Link
                                        href="/teams"
                                        className="text-sm font-semibold hover:text-white transition-colors  hover:shadow-md hover:shadow-neutral-400 duration-200 rounded px-3 py-2 hover:bg-accent"
                                    >
                                        {(loggedInUser.role == 'coach' || loggedInUser.role == 'admin') ? t("nav.teams") : t('nav.team')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={'/profile/' + loggedInUser.id}
                                        className="text-sm font-semibold hover:text-white transition-colors  hover:shadow-md hover:shadow-neutral-400 duration-200 rounded px-3 py-2 hover:bg-accent"
                                    >
                                        {t('nav.profile')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/games"
                                        className="text-sm font-semibold hover:text-white transition-colors  hover:shadow-md hover:shadow-neutral-400 duration-200 rounded px-3 py-2 hover:bg-accent"
                                    >
                                        {t('nav.games')}
                                    </Link>
                                </li>
                            </ul>
                        )}

                        <li>
                            {loggedInUser ? (
                                <button
                                    onClick={handleClick}
                                    className="text-sm font-semibold hover:text-white hover:shadow-md hover:shadow-neutral-400 transition-shadow duration-200 rounded px-3 py-2 hover:bg-accent"
                                >
                                    {t('nav.logout')}
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold hover:text-white hover:shadow-md hover:shadow-neutral-400 transition-shadow duration-200 rounded px-3 py-2 hover:bg-accent"
                                >
                                    {t('nav.login')}
                                </Link>
                            )}
                        </li>
                        <li>
                            <Language/>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Nav;
