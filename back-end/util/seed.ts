import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { lastDayOfDecade } from 'date-fns';
import { id } from 'date-fns/locale';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.game.deleteMany();
    await prisma.team.deleteMany();
    await prisma.coach.deleteMany();
    await prisma.player.deleteMany();
    await prisma.user.deleteMany();

    const admin = await prisma.user.create({
        data: {
            firstName: 'Adje',
            lastName: 'Min',
            password: await bcrypt.hash('Admin123!', 12),
            email: 'admin@teamtrack.be',
            phoneNumber: '0497000030',
            role: 'admin',
        },
    });

    const coach1 = await prisma.coach.create({
        data: {
            user: {
                create: {
                    firstName: 'Bob',
                    lastName: 'Peeters',
                    password: await bcrypt.hash('Bob123!', 12),
                    email: 'bobpeeters@teamtrack.be',
                    phoneNumber: '0497000000',
                    role: 'coach',
                },
            },
        },
    });

    const coach2 = await prisma.coach.create({
        data: {
            user: {
                create: {
                    firstName: 'Aad',
                    lastName: 'De Mos',
                    password: await bcrypt.hash('Aad123!', 12),
                    email: 'aaddemos@teamtrack.be',
                    phoneNumber: '0497000007',
                    role: 'coach',
                },
            },
        },
    });

    const player1 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Wayne',
                    lastName: 'Rooney',
                    password: await bcrypt.hash('Wayne123!', 12),
                    email: 'waynerooney@teamtrack.be',
                    phoneNumber: '0497000001',
                    role: 'player',
                },
            },
        },
    });

    const player2 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Cristiano',
                    lastName: 'Ronaldo',
                    password: await bcrypt.hash('Cristiano123!', 12),
                    email: 'cristianoronaldo@teamtrack.be',
                    phoneNumber: '0497000002',
                    role: 'player',
                },
            },
        },
    });

    const player3 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Lionel',
                    lastName: 'Messi',
                    password: await bcrypt.hash('Lionel132!', 12),
                    email: 'lionelmessi@teamtrack.be',
                    phoneNumber: '0497000003',
                    role: 'player',
                },
            },
        },
    });

    const player4 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Rajo',
                    lastName: 'Timmermans',
                    password: await bcrypt.hash('Rajo123!', 12),
                    email: 'rajotimmermans@teamtrack.be',
                    phoneNumber: '0497000004',
                    role: 'player',
                },
            },
        },
    });

    const player5 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Sander',
                    lastName: 'Coemans',
                    password: await bcrypt.hash('Sander123!', 12),
                    email: 'sandercoemans@teamtrack.be',
                    phoneNumber: '0497000005',
                    role: 'player',
                },
            },
        },
    });

    const player6 = await prisma.player.create({
        data: {
            user: {
                create: {
                    firstName: 'Eden',
                    lastName: 'Hazard',
                    password: await bcrypt.hash('Eden123!', 12),
                    email: 'edenhazard@teamtrack.be',
                    phoneNumber: '0497000006',
                    role: 'player',
                },
            },
        },
    });

    const team1 = await prisma.team.create({
        data: {
            teamName: 'Maaskantje United',
            coachId: coach1.id,
            players: {
                connect: [{ id: player1.id }, { id: player2.id }, { id: player3.id }],
            },
        },
    });

    const team2 = await prisma.team.create({
        data: {
            teamName: 'Real Woensel',
            coachId: coach2.id,
            players: {
                connect: [{ id: player4.id }, { id: player5.id }, { id: player6.id }],
            },
    }});

    const game1 = await prisma.game.create({
        data: {
            date: new Date(2024, 11, 17),
            result: '1-0',
            teams: {
                connect: [{ id: team1.id }, { id: team2.id }],
            },
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
