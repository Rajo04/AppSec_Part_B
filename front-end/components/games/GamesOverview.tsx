import React, { useEffect, useState } from 'react';
import { Game, Team, User } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GameDetails from './GameDetails';
import { useTranslation } from "next-i18next";

type GamesOverviewProps = {
    teams: Team[];
    games: Game[];
};

const GamesOverview: React.FC<GamesOverviewProps> = ({ teams, games }) => {
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
                <thead className="bg-secondary text-white">
                    <tr>
                        <th className="px-6 py-4 text-left">{t('gameOverview.teamName')}</th>
                        <th className="px-6 py-4 text-left">{t('gameOverview.games')}</th>
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
                                <td className="px-6 py-4 text-gray-900">{team.games?.length}</td>
                            </tr>
                            {expandedTeamId === team.id && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 bg-gray-50">
                                        <GameDetails games={games} team={team} />
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

export default GamesOverview;
