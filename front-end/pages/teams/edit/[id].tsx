import TeamEditor from '@components/teams/TeamEditor';
import TeamService from '@services/TeamService';
import { User } from '../../../types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@components/layout/Layout';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const editTeamPage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();

    const fetcher = async () => {
        const teamResponse = await TeamService.getTeamById(Number(id));
        if (teamResponse.ok) {
            const team = await teamResponse.json();
            return team;
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

    const { data, isLoading, error } = useSWR(loggedInUser && id ? 'Team' : null, fetcher);

    const handleTeamUpdated = () => {
        router.push('/teams');
        router.reload();
    };

    return (
        <Layout>
            <Head>
                <title>{t('teamEditIndex.title')}</title>
            </Head>
            <main>{data && <TeamEditor team={data} TeamUpdated={handleTeamUpdated} />}</main>
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

export default editTeamPage;
