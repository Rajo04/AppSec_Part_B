import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@components/layout/Layout';
import TeamOverviewTable from '@components/teams/TeamOverviewTable';
import TeamService from '@services/TeamService';
import { User } from '../../types';
import { Plus } from 'lucide-react';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const Teams: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const { t } = useTranslation();

    const fetcher = async () => {
        let teamsResponse;  

        if (!loggedInUser) {
            return;
        }
        
        if (loggedInUser?.role === 'admin') {
            teamsResponse = await TeamService.getAllTeams();
        } else {
            teamsResponse = await TeamService.getTeamsByUserId(loggedInUser.id);
        }

        if (teamsResponse.ok) {
            const teams = await teamsResponse.json();
            return teams;
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

    const { data, isLoading, error } = useSWR(loggedInUser ? 'Teams' : null, fetcher);

    if (!loggedInUser) {
        return <p>{t('general.loading')}</p>;
    }

    const createTeamRoute = () => {
        router.push('/teams/create');
    };

    return (
        <Layout>
            <Head>
                <title>{t('teamIndex.title')}</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            {t('teamIndex.teamOverview')}
                        </h1>
                        {(loggedInUser.role == 'admin' || loggedInUser.role == 'coach') && (
                            <button
                                onClick={createTeamRoute}
                                className="px-6 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105 flex items-center"
                            >
                                <Plus size={24} className="mr-2" />
                                {t('teamIndex.createTeam')}
                            </button>
                        )}
                    </div>
                    {data && data.length > 0 ? (
                        <TeamOverviewTable teams={data} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-2xl font-semibold text-white mb-4">
                                {t('teamIndex.noTeams')}
                            </p>
                            <p className="text-lg text-white">{t('teamIndex.createText')}</p>
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

export default Teams;
