import React, { useEffect, useState } from 'react';
import PlayerService from '@services/PlayerService';
import TeamService from '@services/TeamService';
import { Player, Team } from '../../types';
import { ArrowLeft, Square, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useTranslation } from "next-i18next";

type Props = {
    team: Team;
    TeamUpdated: () => void;
};

const TeamEditor: React.FC<Props> = ({ team, TeamUpdated }) => {
    const [teamName, setTeamName] = useState<string>(team.teamName);
    const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>(team.players);
    const [assignedPlayers, setAssignedPlayers] = useState<Set<number>>(new Set());
    const [errors, setErrors] = useState<string[]>([]);
    const router = useRouter();

    const { t } = useTranslation();

    const fetcher = async () => {
        const [playersResponse, teamsResponse] = await Promise.all([
            PlayerService.getAllPlayers(),
            TeamService.getAllTeams(),
        ]);
        if (playersResponse.ok && teamsResponse.ok) {
            const [players, teams] = await Promise.all([
                playersResponse.json(),
                teamsResponse.json(),
            ]);
            return { players, teams };
        } else {
            throw new Error(t('general.fetchError'));
        }
    };

    useEffect(() => {
        if (data) {
            const assignedPlayers = new Set<number>();
            data.teams.forEach((team: Team) => {
                team.players.forEach((player: Player) => assignedPlayers.add(player.id));
            });

            setAssignedPlayers(assignedPlayers);
        }
    }, []);

    const { data, isLoading, error } = useSWR('Players', fetcher);

    const handleUpdateTeam = async () => {
        const validationErrors: string[] = [];

        if (!teamName) {
            validationErrors.push(t('teamEditor.teamNameError'));
        }

        if (selectedPlayers.length < 1) {
            validationErrors.push(t('teamEditor.playerError'));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!team.id) return;

        const updatedTeam: Team = {
            id: team.id,
            teamName,
            coach: team.coach,
            players: selectedPlayers,
        };

        await TeamService.updateTeam(updatedTeam);
        TeamUpdated();
    };

    const togglePlayerSelection = (player: Player) => {
        setSelectedPlayers((prevSelected) =>
            prevSelected.find((p) => p.id === player.id)
                ? prevSelected.filter((p) => p.id !== player.id)
                : [...prevSelected, player],
        );

        if (assignedPlayers.has(player.id)) {
            setAssignedPlayers((prev) => {
                const newSet = new Set(prev);
                if (selectedPlayers.find((p) => p.id === player.id)) {
                    newSet.delete(player.id);
                } else {
                    newSet.add(player.id);
                }
                return newSet;
            });
        }
    };

    const goBack = () => {
        router.push('/teams');
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
                        {t('teamEditor.edit')}
                    </h1>
                    <h2 className="text-2xl font-semibold text-secondary">{team.teamName}</h2>
                </div>
            </div>
            <form className="space-y-6">
                <div className="w-full">
                    <label htmlFor="teamName" className="block text-xl font-bold mb-2 text-white">
                        {t('teamEditor.teamName')}
                    </label>
                    <input
                        id="teamName"
                        type="text"
                        placeholder={t('teamEditor.teamNamePlaceholder')}
                        value={teamName}
                        onChange={(e) => {
                            setTeamName(e.target.value);
                            if (errors.length) setErrors([]);
                        }}
                        className="w-full px-4 py-3 bg-white text-background text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 shadow-md"
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
                    <h3 className="text-2xl font-bold mb-4 text-white">{t('teamEditor.player')}
                    <span><p className='text-sm font-semibold'>{t('teamCreator.selectOneToFour')}</p></span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                        {data && data.players.map((player: Player) => (
                            <div key={player.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        togglePlayerSelection(player);
                                        if (errors.length) setErrors([]);
                                    }}
                                    disabled={
                                        assignedPlayers.has(player.id) &&
                                        !selectedPlayers.find((p) => p.id === player.id)
                                    }
                                    className={`w-full py-2 px-3 rounded-md transition-all duration-300 flex items-center justify-between text-sm ${
                                        assignedPlayers.has(player.id) &&
                                        !selectedPlayers.find((p) => p.id === player.id)
                                            ? 'bg-grey-300 text-white shadow-md cursor-not-allowed'
                                            : selectedPlayers.find((p) => p.id === player.id)
                                              ? 'bg-secondary text-white shadow-md'
                                              : 'bg-white text-background hover:bg-accent hover:text-white'
                                    }`}
                                >
                                    <span className="font-medium truncate">
                                        {player.user.firstName} {player.user.lastName}
                                    </span>
                                    {selectedPlayers.find((p) => p.id === player.id) ? (
                                        <CheckSquare
                                            className="text-white flex-shrink-0"
                                            size={16}
                                        />
                                    ) : (
                                        <Square
                                            className={`${
                                                assignedPlayers.has(player.id) &&
                                                !selectedPlayers.find((p) => p.id === player.id)
                                                    ? 'text-grey-300'
                                                    : 'text-secondary'
                                            } flex-shrink-0`}
                                            size={16}
                                        />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        type="button"
                        onClick={handleUpdateTeam}
                        className="px-8 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105"
                    >
                        {t('teamEditor.updateTeamButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamEditor;
