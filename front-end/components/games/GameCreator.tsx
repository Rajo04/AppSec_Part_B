import React, { useState, useEffect } from 'react';
import { Team, User, Game } from '../../types';
import { ArrowLeft, Square, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import GameService from '@services/GameService';
import { useTranslation } from "next-i18next";

type Props = {
    onGameCreated: () => void;
    teams: Team[];
};

const GameCreator: React.FC<Props> = ({ onGameCreated, teams }) => {
    const [date, setDate] = useState<string>('');
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const router = useRouter();

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

    const handleCreateGame = async () => {
        const validationErrors: string[] = [];

        if (selectedTeams.length != 2) {
            validationErrors.push(t('gameCreator.teamsError'));
        }

        if (!date) {
            validationErrors.push(t('gameCreator.dateError'));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formattedDate = new Date(date).toISOString();

        const newGame: Game = {
            id: 0,
            date: formattedDate,
            teams: selectedTeams,
            result: '',
        };

        await GameService.createGame(newGame);
        onGameCreated();
    };

    const toggleTeamSelection = (team: Team) => {
        setSelectedTeams((prevSelected) => {
            if (prevSelected.find((t) => t.id === team.id)) {
                return prevSelected.filter((t) => t.id !== team.id);
            } else if (prevSelected.length < 2) {
                return [...prevSelected, team];
            } else {
                return prevSelected;
            }
        });
    };

    const goBack = () => {
        router.push('/games');
    };

    return (
        <div className="bg-gradient-to-br from-primary to-accent text-text p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
                <button
                    onClick={goBack}
                    className="p-2 bg-secondary hover:bg-red-500 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-grow text-center">
                    <h1 className="text-4xl font-extrabold mb-2 text-white tracking-tight">
                        {t('gameCreator.createGame')}
                    </h1>
                </div>
            </div>
            <form className="space-y-6">
                <div className="w-full">
                    <label htmlFor="date" className="block text-xl font-bold mb-2 text-white">
                        {t('gameCreator.date')}
                        <span><p className='text-sm font-semibold'>{t('gameCreator.required')}</p></span>
                    </label>
                    <input
                        id="date"
                        type="date"
                        placeholder={t('gameCreator.teamName')}
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            if (errors.length) setErrors([]);
                        }}
                        className="bg-white text-background hover:bg-accent hover:text-white w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 shadow-md"
                    />
                </div>

                {errors.length > 0 && (
                    <div className="bg-red-500 text-white p-4 rounded-md text-center w-full animate-pulse">
                        {errors.map((error, index) => (
                            <p key={index} className="font-semibold">
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <div className="w-full">
                    <h3 className="text-2xl font-bold mb-4 text-white">{t('gameCreator.teamSelect')}
                    <span><p className='text-sm font-semibold'>{t('gameCreator.selectTwo')}</p></span>

                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                        {teams.map((team) => (
                            <div key={team.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        toggleTeamSelection(team);
                                        if (errors.length) setErrors([]);
                                    }}
                                    disabled={
                                        selectedTeams.length === 2 &&
                                        !selectedTeams.find((t) => t.id === team.id)
                                    }
                                    className={`w-full py-2 px-3 rounded-md transition-all duration-300 flex items-center justify-between text-sm ${
                                        selectedTeams.find((t) => t.id === team.id)
                                            ? 'bg-secondary text-white shadow-md'
                                            : 'bg-white text-background hover:bg-accent hover:text-white'
                                    } ${
                                        selectedTeams.length === 2 &&
                                        !selectedTeams.find((t) => t.id === team.id) &&
                                        'opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="font-medium truncate">{team.teamName}</span>
                                    {selectedTeams.find((t) => t.id === team.id) ? (
                                        <CheckSquare
                                            className="text-white flex-shrink-0"
                                            size={16}
                                        />
                                    ) : (
                                        <Square className="text-secondary" size={16} />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        type="button"
                        onClick={handleCreateGame}
                        className="px-8 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105"
                    >
                        {t('gameCreator.createGameButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GameCreator;
