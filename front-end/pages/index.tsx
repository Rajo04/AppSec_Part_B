import Head from 'next/head';
import Layout from '../components/layout/Layout';
import HomeOverview from '@components/Home/HomeOverview';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const Home: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Layout>
            <Head>
                <title>{t('mainIndex.title')}</title>
                <meta
                    name="description"
                    content="TeamTrack app for tracking your team's performance, games, and players"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col items-center justify-center space-y-8 py-12">
                <h1 className="text-8xl text-center font-bold text-text border-b border-primary pb-5">
                    {t('mainIndex.welcome')}
                </h1>
                <p className="text-l text-center text-secondary max-w-2xl">
                    {t('mainIndex.description')}
                </p>
                <HomeOverview />
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

export default Home;
