'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'types';
import { useTranslation } from "next-i18next";

export default function HomeOverview() {
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);

    const { t } = useTranslation();

    useEffect(() => {
            const user = sessionStorage.getItem('loggedInUser');
            if (user) {
                const parsedUser = JSON.parse(user);
                setLoggedInUser(parsedUser);
            }
        }, []);

    return (
        <div className="w-full max-w-2xl mx-auto bg-secondary rounded-lg shadow-md overflow-hidden">
            <div className="px-8 py-10">
                {!loggedInUser ? (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-black">
                            {t('homeOverview.getStarted')}
                        </h2>
                        <p className="text-xl text-gray-700">
                            {t('homeOverview.joinCommunity')}
                        </p>
                        <div className="flex space-x-4">
                        <table className="w-full">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">{t('homeOverview.loginEmail')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">{t('homeOverview.loginPwd')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">{t('homeOverview.loginRole')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="">
                                admin@teamtrack.be
                            </td>
                            <td>
                                Admin123!
                            </td>
                            <td>
                                admin
                            </td>
                        </tr>
                        <tr>
                            <td className="">
                                bobpeeters@teamtrack.be
                            </td>
                            <td>
                                Bob123!
                            </td>
                            <td>
                                coach
                            </td>
                        </tr>
                        <tr>
                            <td className="">
                                waynerooney@teamtrack.be
                            </td>
                            <td>
                                Wayne123!
                            </td>
                            <td>
                                player
                            </td>
                        </tr>
                    </tbody>
                </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">{t('homeOverview.welcomeBack')}</h2>
                        <p className="text-xl text-white-600">{t('homeOverview.manageTeam')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
