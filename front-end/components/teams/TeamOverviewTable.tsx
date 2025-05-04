import React, { useEffect, useState } from 'react';
import { Team, User } from '../../types';
import TeamPlayers from './TeamPlayers';
import { useRouter } from 'next/router';
import { ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import TeamService from '@services/TeamService';
import { useTranslation } from "next-i18next";
import Link from 'next/link';

type Props = {
    teams: Array<Team>;
};

const TeamOverviewTable: React.FC<Props> = ({ teams }) => {
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setLoggedInUser(parsedUser);
        }
    }, []);

    if (!loggedInUser) {
        return <p>{t('general.loading')}</p>;
    }
    const toggleTeamDropdown = (teamId: number) => {
        setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
    };

    const deleteTeam = async (teamId: number) => {
        try {
            await TeamService.deleteTeam(teamId);
            router.reload();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
                <thead className="bg-secondary text-white">
                    <tr>
                        <th className="px-6 py-4 text-left">{t('teamOverview.teamName')}</th>
                        <th className="px-6 py-4 text-left">{t('teamOverview.coach')}</th>
                        {(loggedInUser.role === 'coach' || loggedInUser.role === 'admin') && (
                            <>
                                <th className="px-6 py-4 text-center">{t('teamOverview.actions')}</th>
                                <th className="px-6 py-4 text-center">{t('teamOverview.delete')}</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => (
                        <React.Fragment key={team.id}>
                            <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
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
                                <td className="px-6 py-4 text-gray-900">
                                    <Link href={`/profile/${team.coach.user.id}`}>{team.coach.user.firstName} {team.coach.user.lastName}</Link>
                                </td>
                                {(loggedInUser.role == 'coach' || loggedInUser.role == 'admin') && (
                                    <>
                                        <td className="pl-6 py-4 text-center">
                                            <button
                                                onClick={() => router.push(`teams/edit/${team.id}`)}
                                                className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-accent transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Edit size={18} className="mr-2" />
                                                {t('teamOverview.edit')}
                                            </button>
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            <button
                                                onClick={() => deleteTeam(team.id)}
                                                className="ml-4 pl-6 inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-300 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Trash size={18} className="mr-2" />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                            {expandedTeamId === team.id && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 bg-gray-50">
                                        <TeamPlayers players={team.players} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamOverviewTable;
