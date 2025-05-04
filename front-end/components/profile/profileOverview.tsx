'use client';

import React, { useEffect, useState } from 'react';
import { User, Team } from '../../types';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import TeamService from '@services/TeamService';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';

type Props = {
    user: User;
};

const ProfileOverview: React.FC<Props> = ({ user }) => {
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const { t } = useTranslation();

    const fetcher = async () => {
        let teamsResponse;
        if (user.role === 'admin') {
            teamsResponse = await TeamService.getAllTeams();
        } else {
            if (loggedInUser?.id !== undefined) {
                teamsResponse = await TeamService.getTeamsByUserId(user.id);
            } else {
                throw new Error(t('general.fetchError'));
            }
        }

        if (teamsResponse.ok) {
            const teams = await teamsResponse.json();
            return teams;
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

    const { data, isLoading, error } = useSWR(loggedInUser ? `teams-${user.id}` : null, fetcher);

    if (!user || !loggedInUser || isLoading) {
        return <p>{t('general.loading')}</p>;
    }

    const toggleTeamDropdown = (teamId: number) => {
        setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
    };

    const editProfileRoute = () => {
        router.push(`/profile/edit/${user.id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 space-y-6">
                {(loggedInUser.role === 'admin' || loggedInUser.id === user.id) && (
                  <button
                  onClick={editProfileRoute}
                  className="px-6 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105 flex items-center"
              >
                  <Edit size={24} className="mr-2" />
                  {t('profileIndex.edit')}
              </button>
                )}
                <table className="w-full">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                {t('profileOverview.userInfo')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {t('profileOverview.role')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.role}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {t('profileOverview.firstName')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.firstName}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {t('profileOverview.lastName')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.lastName}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {t('profileOverview.email')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {t('profileOverview.phoneNumber')}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{user.phoneNumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-50 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {t('profileOverview.teams')}
                </h3>
                {data && data.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    {t('profileOverview.teamName')}
                                </th>
                                <th className="px-6 py-3 text-left">
                                    {t('profileOverview.coach')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((team: Team) => (
                                <React.Fragment key={team.id}>
                                    <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleTeamDropdown(team.id)}
                                                className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-accent transition-colors duration-200"
                                            >
                                                <span>{team.teamName}</span>
                                                {expandedTeamId === team.id ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {team.coach.user.firstName} {team.coach.user.lastName}
                                        </td>
                                    </tr>
                                    {expandedTeamId === team.id && (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-4 bg-gray-50">
                                                <h4 className="font-semibold mb-2">
                                                    {t('profileOverview.teamPlayers')}
                                                </h4>
                                                <ul className="list-disc list-inside pl-4">
                                                    {team.players.map((player) => (
                                                        <li
                                                            key={player.id}
                                                            className="text-gray-700"
                                                        >
                                                            {player.user.firstName}{' '}
                                                            {player.user.lastName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-700">{t('profileOverview.noTeams')}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileOverview;
