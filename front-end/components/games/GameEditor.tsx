import React, { useEffect, useState } from 'react';
import { Game, Team } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import GameService from '@services/GameService';
import { useTranslation } from "next-i18next";

type Props = {
    game: Game;
    gameUpdated: () => void;
};

const GameEditor: React.FC<Props> = ({ game, gameUpdated }) => {
    const [date, setDate] = useState<string>('');
    const [score, setScore] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isPastDate, setIsPastDate] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>('');

    const { t } = useTranslation();

    useEffect(() => {
        const gameDate = new Date(game.date);
        const today = new Date();
        setIsPastDate(gameDate < today);
        setDate(game.date);
        setScore(game.result || '');
        setTeams(game.teams);
        setCurrentDate(today.toISOString().split('T')[0]);
    }, [game]);

    const router = useRouter();

    const handleUpdateGame = async () => {
        const validationErrors: string[] = [];

        if (!date) {
            validationErrors.push(t('gameEditor.dateError'));
        }

        if (teams.length != 2) {
            validationErrors.push(t('gameEditor.teamsError'));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!game.id) return;

        const formattedDate = new Date(date).toISOString();

        const updatedGame: Game = {
            id: game.id,
            date: formattedDate,
            result: score,
            teams,
        };

        await GameService.updateGame(updatedGame);
        gameUpdated();
    };

    const goBack = () => {
        router.push('/games');
    };

    const minDate = new Date().toISOString().split('T')[0];

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
                        {t('gameEditor.edit')}
                    </h1>
                </div>
            </div>
            <form className="space-y-6">
                <div className="w-full">
                    <label
                        htmlFor="CurrentDate"
                        className="block text-xl font-bold mb-2 text-white"
                    >
                        {t('gameEditor.currentDate')}
                    </label>
                    <input
                        id="CurrentDate"
                        type="text"
                        value={currentDate}
                        readOnly
                        disabled
                        style={{ pointerEvents: 'none' }}
                        className="w-full px-4 py-3 bg-gray-200 text-background text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 shadow-md"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="Date" className="block text-xl font-bold mb-2 text-white">
                        {t('gameEditor.newDate')}
                    </label>
                    <input
                        id="Date"
                        type="Date"
                        placeholder={t('gameEditor.newDatetext')}
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            if (errors.length) setErrors([]);
                        }}
                        min={minDate}
                        disabled={isPastDate}
                        className={`w-full px-4 py-3 bg-white text-background text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 shadow-md ${isPastDate ? 'opacity-50' : ''}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                        <label htmlFor="Score" className="block text-xl font-bold mb-2 text-white">
                            {t('gameEditor.score')}
                        </label>
                        <input
                            id="Score"
                            type="text"
                            placeholder={t('gameEditor.scoreText')}
                            value={score}
                            onChange={(e) => {
                                setScore(e.target.value);
                                if (errors.length) setErrors([]);
                            }}
                            disabled={!isPastDate}
                            className={`w-full px-4 py-3 bg-white text-background text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 shadow-md ${!isPastDate ? 'opacity-50' : ''}`}
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        type="button"
                        onClick={handleUpdateGame}
                        className="px-8 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105"
                    >
                        {t('gameEditor.updateGameButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GameEditor;
