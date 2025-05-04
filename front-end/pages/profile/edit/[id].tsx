import Layout from '@components/layout/Layout';
import ProfileEditor from '@components/profile/ProfileEditor';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { User } from 'types';
import { useParams } from 'next/navigation';
import UserService from '@services/UserService';
import useSWR from 'swr';
import { GetServerSideProps } from 'next';

const ProfilePage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const { t } = useTranslation('common');

    const router = useRouter();

    const { id } = useParams();

    const fetcher = async () => {
        const userResponse = await UserService.getUserById(Number(id));

        if (userResponse.ok) {
            const user = await userResponse.json();
            return user;
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

    const { data, isLoading, error } = useSWR(loggedInUser ? `profile-${id}` : null, fetcher);

    if (!loggedInUser) {
        return <div>{t('general.loading')}</div>;
    }

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        router.push('/');
    };

    return (
        <Layout>
            <Head>
                <title>{t('profileEditIndex.title')}</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            {t('profileEditIndex.overview')}
                        </h1>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <ProfileEditor user={data} handleLogout={handleLogout} />
                    </div>
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

export default ProfilePage;
