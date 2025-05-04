'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import Layout from '@components/layout/Layout';
import { User } from '../../types';
import TeamService from '@services/TeamService';
import { Edit } from 'lucide-react';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import UserService from '@services/UserService';
import { GetServerSideProps } from 'next';
import ProfileOverview from '@components/profile/profileOverview';

const ProfilePage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const { t } = useTranslation();
    

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
        const tempUser = sessionStorage.getItem('loggedInUser');
        if (tempUser) {
            const parsedUser = JSON.parse(tempUser);
            setLoggedInUser(parsedUser);
        }
    }, []);

    const { data, isLoading, error } = useSWR(loggedInUser ? `profile-${id}` : null, fetcher);

    if (!loggedInUser) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-2xl font-semibold text-gray-600">{t('general.loading')}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{t('profileIndex.title')}</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            {t('profileIndex.overview')}
                        </h1>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {data && <ProfileOverview user={data} />}
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
