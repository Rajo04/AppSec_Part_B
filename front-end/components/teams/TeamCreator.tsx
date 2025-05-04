import React, { useState, useEffect } from 'react';
import TeamService from '@services/TeamService';
import { Team, Coach, Player, User } from '../../types';
import CoachService from '@services/CoachService';
import PlayerService from '@services/PlayerService';
import { ArrowLeft, Square, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useTranslation } from "next-i18next";

type Props = {
    onTeamCreated: () => void;
};

const TeamCreator: React.FC<Props> = ({ onTeamCreated }) => {
    const [teamName, setTeamName] = useState<string>('');
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);
    const [assignedPlayers, setAssignedPlayers] = useState<Set<number>>(new Set());
    const [errors, setErrors] = useState<string[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);

    const router = useRouter();
    
    const { t } = useTranslation();

    const fetcher = async () => {
        const [coachesResponse, playersResponse, teamsResponse] = await Promise.all([
            CoachService.getAllCoaches(),
            PlayerService.getAllPlayers(),
            TeamService.getAllTeams(),
        ]);

        if (coachesResponse.ok && playersResponse.ok && teamsResponse.ok) {
            const [coaches, players, teams] = await Promise.all([
                coachesResponse.json(),
                playersResponse.json(),
                teamsResponse.json(),
            ]);

            return { coaches, players, teams };
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

    const { data, isLoading, error } = useSWR(loggedInUser ? 'TeamsCoachesPlayers' : null, fetcher);

    useEffect(() => {
        if (data && loggedInUser) {
            const assignedPlayers = new Set<number>();
            if (data.teams.length > 0) {
                data.teams.forEach((team: Team) => {
                    team.players.forEach((player: Player) => assignedPlayers.add(player.id));
                });
            }

            setAssignedPlayers(assignedPlayers);
        }
    }, [data]);

    if (!loggedInUser) {
        return <p>{t('general.loading')}</p>;
    }

    const handleCreateTeam = async () => {
        const validationErrors: string[] = [];

        if (!teamName) {
            validationErrors.push(t('teamCreator.teamNameError'));
        }

        if (!selectedCoach) {
            validationErrors.push(t('teamCreator.coachError'));
        }

        if (selectedPlayers.length < 1) {
            validationErrors.push(t('teamCreator.playersError'));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newTeam: Team = { 
            id: 0,
            teamName,
            coach: selectedCoach as Coach,
            players: selectedPlayers,
        };

        await TeamService.createTeam(newTeam);
        onTeamCreated();
    };

    const togglePlayerSelection = (player: Player) => {
        if (assignedPlayers.has(player.id)) {
            return;
        }
        setSelectedPlayers((prevSelected) =>
            prevSelected.find((p) => p.id === player.id)
                ? prevSelected.filter((p) => p.id !== player.id)
                : [...prevSelected, player],
        );
    };

    const toggleCoachSelection = (coach: Coach) => {
        setSelectedCoach((prevSelectedCoach) =>
            prevSelectedCoach?.id === coach.id ? null : coach,
        );
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
                        {t('teamCreator.createTeam')}
                    </h1>
                </div>
            </div>
            <form className="space-y-6">
                <div className="w-full">
                    <label htmlFor="teamName" className="block text-xl font-bold mb-2 text-white">
                        {t('teamCreator.teamName')}
                        <span><p className='text-sm'>{t('teamCreator.required')}</p></span>
                    </label>
                    <input
                        id="teamName"
                        type="text"
                        placeholder={t('teamCreator.teamNamePlaceholder')}
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
                    <h3 className="text-2xl font-bold mb-4 text-white">{t('teamCreator.coach')}
                    <span><p className='text-sm'>{t('teamCreator.selectOne')}</p></span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {data &&
                            data.coaches.map((coach: Coach) => (
                                <div key={coach.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggleCoachSelection(coach);
                                            if (errors.length) setErrors([]);
                                        }}
                                        className={`w-full py-2 px-3 rounded-md transition-all duration-300 flex items-center justify-between text-sm ${
                                            selectedCoach?.id === coach.id
                                                ? 'bg-secondary text-white shadow-md'
                                                : 'bg-white text-background hover:bg-accent hover:text-white'
                                        }`}
                                    >
                                        <span className="font-medium truncate">
                                            {coach.user.firstName} {coach.user.lastName}
                                        </span>
                                        {selectedCoach?.id === coach.id ? (
                                            <CheckSquare
                                                className="text-white flex-shrink-0"
                                                size={16}
                                            />
                                        ) : (
                                            <Square
                                                className="text-secondary flex-shrink-0"
                                                size={16}
                                            />
                                        )}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="text-2xl font-bold mb-4 text-white">{t('teamCreator.player')}
                    <span><p className='text-sm font-semibold'>{t('teamCreator.selectOneToFour')}</p></span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                        {data &&
                            data.players.map((player: Player) => (
                                <div key={player.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            togglePlayerSelection(player);
                                            if (errors.length) setErrors([]);
                                        }}
                                        disabled={assignedPlayers.has(player.id)}
                                        className={`w-full py-2 px-3 rounded-md transition-all duration-300 flex items-center justify-between text-sm ${
                                            assignedPlayers.has(player.id)
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
                                                    assignedPlayers.has(player.id)
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
                        onClick={handleCreateTeam}
                        className="px-8 py-3 bg-secondary text-white text-lg font-semibold rounded-md transition-all duration-300 hover:bg-accent hover:shadow-lg transform hover:scale-105"
                    >
                        {t('teamCreator.createTeam')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamCreator;
