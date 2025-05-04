import express, { Request, Response, NextFunction } from 'express';
import teamService from '../service/team.service';

const teamRouter = express.Router();

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Team:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           teamName:
 *             type: string
 *             description: The name of the team.
 *           coachId:
 *             type: number
 *             description: The ID of the coach.
 *           players:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Player'
 *       TeamInput:
 *         type: object
 *         properties:
 *           teamName:
 *             type: string
 *             description: The name of the team.
 *           coachId:
 *             type: number
 *             description: The ID of the coach.
 *           playerIds:
 *             type: array
 *             items:
 *               type: number
 *               format: int64
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all teams.
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: A JSON array of all teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       401:
 *         description: Unauthorized
 */
teamRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a team by ID.
 *     description: Retrieve a team by its ID.
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team ID
 *     responses:
 *       200:
 *         description: A team object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
teamRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await teamService.getTeamById(parseInt(req.params.id));
        res.status(200).json(team);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a team by ID.
 *     description: Retrieve a team by its ID.
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team ID
 *     responses:
 *       200:
 *         description: A team object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
teamRouter.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await teamService.getTeamsByUserId(parseInt(req.params.id));
        res.status(200).json(team);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new team.
 *     description: Create a new team.
 *     tags: [Team]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       201:
 *         description: The created team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
teamRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamData = req.body;
        const newTeam = await teamService.createTeam(teamData);
        res.status(201).json(newTeam);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a team.
 *     description: Update the details of an existing team.
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       200:
 *         description: The updated team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
teamRouter.put('/edit/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamData = req.body;
        const id = req.params.id;
        const updatedTeam = await teamService.updateTeam(parseInt(id), teamData);
        res.status(200).json(updatedTeam);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a team.
 *     description: Delete a team by its ID.
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team ID
 *     responses:
 *       200:
 *         description: The deleted team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
teamRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await teamService.deleteTeam(parseInt(req.params.id));
        res.status(200).json(team);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { teamRouter };