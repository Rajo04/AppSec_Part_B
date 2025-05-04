import Head from 'next/head';
import Register from '../../components/auth/Register';
import Layout from '../../components/layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';

const RegisterPage = () => {
    const { t } = useTranslation('common');
    return (
        <Layout>
            <Head>
                <title>{t('registerIndex.title')}</title>
            </Head>
            <Register />
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

export default RegisterPage;
