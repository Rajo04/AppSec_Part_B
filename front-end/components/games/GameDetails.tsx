import React, { useEffect, useState } from 'react';
import { Game, Team, User } from '../../types';
import { useRouter } from 'next/router';
import { Edit, Trash } from 'lucide-react';
import GameService from '@services/GameService';
import { useTranslation } from "next-i18next";

type Props = {
    games: Game[];
    team: Team;
};

const GameDetailsTable: React.FC<Props> = ({ games, team }) => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    
    const router = useRouter();

    const { t } = useTranslation();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setLoggedInUser(parsedUser);
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(games)) {
            const filteredGames = games.filter((game) => game.teams.some((t) => t.id === team.id));
            setFilteredGames(filteredGames);
        }
    }, [games, team]);

    if (!loggedInUser) {
        return <p className="text-center py-4">{t('general.loading')}</p>;
    }

    const deleteGame = async (gameId: number) => {
        try {
            await GameService.deleteGame(gameId);
            router.reload();
        } catch (error) {
            console.error(t('gameDetails.deleteError'), error);
        }
    };

    const formatDate = (toFormat: string) => {
        const date = new Date(toFormat);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 px-6 pt-4">{t('nav.games')}</h3>
            {games && games.length > 0 ? (
                <table className="w-full">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                {t('gameCreator.date')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                {t('gameDetails.teams')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                {t('gameDetails.result')}
                            </th>
                            {(loggedInUser.role === 'coach' || loggedInUser.role === 'admin') && (
                                <>
                                    <th className="px-6 py-3 text-center text-sm font-semibold">
                                        {t('gameDetails.edit')}
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold">
                                        {t('gameDetails.delete')}
                                    </th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.map((game, index) => (
                            <tr
                                key={game.id}
                                className={`${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-100 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(game.date)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {game.teams.map((team) => team.teamName).join(' vs ')}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{game.result}</td>
                                {(loggedInUser.role === 'coach' ||
                                    loggedInUser.role === 'admin') && (
                                    <>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    router.push(`/games/edit/${game.id}`)
                                                }
                                                className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-accent transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Edit size={18} className="mr-2" />
                                                {t('gameDetails.edit')}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => deleteGame(game.id)}
                                                className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-300 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Trash size={18} className="mr-2" />
                                                {t('gameDetails.delete')}
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600 text-center py-4">{t('gameDetails.noGames')}</p>
            )}
        </div>
    );
};

export default GameDetailsTable;
