import Head from 'next/head';
import TeamCreator from '@components/teams/TeamCreator';
import { useRouter } from 'next/router';
import Layout from '@components/layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const TeamCreatePage: React.FC = () => {
    const router = useRouter();

    const handleTeamCreated = async () => {
        router.push('/teams');
    };

    const { t } = useTranslation('common');

    return (
        <Layout>
            <Head>
                <title>{t('teamCreateIndex.title')}</title>
            </Head>
            <main className="d-flex flex-column justify-content-center align-items-center">
                <TeamCreator onTeamCreated={handleTeamCreated} />
            </main>
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

export default TeamCreatePage;
