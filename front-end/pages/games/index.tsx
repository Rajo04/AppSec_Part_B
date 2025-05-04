import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@components/layout/Layout';
import TeamService from '@services/TeamService';
import { User } from '../../types';
import { Plus } from 'lucide-react';
import GameService from '@services/GameService';
import GamesOverview from '@components/games/GamesOverview';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const GamesPage: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const { t } = useTranslation();

    const fetcher = async () => {
        let teamsResponse, gamesResponse;

        if (!loggedInUser) {
            return;
        }

        if (loggedInUser?.role === 'admin') {
            [teamsResponse, gamesResponse] = await Promise.all([
                TeamService.getAllTeams(),
                GameService.getAllGames(),
            ]);
        } else {
            [teamsResponse, gamesResponse] = await Promise.all([
                TeamService.getTeamsByUserId(loggedInUser.id),
                GameService.getGamesByUserId(loggedInUser.id),
            ]);
        }

        if (teamsResponse.ok && gamesResponse.ok) {
            const [teams, games] = await Promise.all([teamsResponse.json(), gamesResponse.json()]);
            return { teams, games };
        } else {
            throw new Error(t('general.fetchError'));
        }
    };

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setLoggedInUser(parsedUser);
        }
    }, []);

    const { data, isLoading, error } = useSWR(loggedInUser ? 'TeamsGames' : null, fetcher);

    if (!loggedInUser) {
    return <p>{t('general.loading')}</p>;
    }

    const createGameRoute = () => {
        router.push('/games/create');
    };

    return (
        <Layout>
            <Head>
                <title>{t('gamesIndex.title')}</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            {t('gamesIndex.gamesOverview')}
                        </h1>
                        {(loggedInUser.role == 'admin' || loggedInUser.role == 'coach') && (
                            <button
                                onClick={createGameRoute}
                                className="px-6 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105 flex items-center"
                            >
                                <Plus size={24} className="mr-2" />
                                {t('gamesIndex.createGame')}
                            </button>
                        )}
                    </div>
                    {data && data.teams.length > 0 ? (
                        <GamesOverview teams={data.teams} games={data.games} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-2xl font-semibold text-white mb-4">
                                {t('gamesIndex.noGames')}
                            </p>
                            <p className="text-lg text-white">{t('gamesIndex.createText')}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        }
    };
};

export default GamesPage;
