import { User } from '../../../types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@components/layout/Layout';
import GameService from '@services/GameService';
import GameEditor from '@components/games/GameEditor';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const editGamePage: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const { id } = router.query;
    const { t } = useTranslation();

    const fetcher = async () => {
        const gameResponse = await GameService.getGameById(Number(id));
        if (gameResponse.ok) {
            const game = await gameResponse.json();
            return game;
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

    const { data, isLoading, error } = useSWR(loggedInUser && id ? 'Game' : null, fetcher);

    if (!loggedInUser) {
        return <p>{t('general.loading')}</p>;
    }

    const handleGameUpdated = () => {
        router.push('/games');
    };

    return (
        <Layout>
            <Head>
                <title>t('gamesEditIndex.title')</title>
            </Head>
            <main>{data && <GameEditor game={data} gameUpdated={handleGameUpdated} />}</main>
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

export default editGamePage;
