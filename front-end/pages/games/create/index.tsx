import Head from 'next/head';
import GameCreator from '@components/games/GameCreator';
import { useRouter } from 'next/router';
import Layout from '@components/layout/Layout';
import { useEffect, useState } from 'react';
import { User } from 'types';
import TeamService from '@services/TeamService';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const GameCreatePage: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const { t } = useTranslation();

    const fetcher = async () => {
        const teamsResponse = await TeamService.getAllTeams();
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

    const handleGameCreated = async () => {
        router.push('/games');
    };

    return (
        <Layout>
            <Head>
                <title>{t('gamesCreateIndex.title')}</title>
            </Head>
            <main className="d-flex flex-column justify-content-center align-items-center">
                {data && <GameCreator onGameCreated={handleGameCreated} teams={data} />}
            </main>
        </Layout>
    );
};

export const getServerSideProps = async (context: any) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        }
    };
};

export default GameCreatePage;
