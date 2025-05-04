import express, { Request, Response, NextFunction } from 'express';
import gameService from '../service/game.service';
import { GameInput } from '../types';
import { Game } from '../model/game';

const gameRouter = express.Router();

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Game:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           date:
 *             type: string
 *             format: date-time
 *             description: The date of the game.
 *           result:
 *             type: string
 *             description: The result of the game.
 *           teams:
 *             type: array
 *             description: The teams playing the game.
 *             items:
 *               $ref: '#/components/schemas/Team'
 *       GameInput:
 *         type: object
 *         properties:
 *           date:
 *             type: string
 *             format: date-time
 *             description: The date of the game.
 *           result:
 *             type: string
 *             description: The result of the game.
 *           teamIds:
 *             type: array
 *             items:
 *               type: number
 *               format: int64
 */

/**
 * @swagger
 * /games:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all games.
 *     tags: [Game]
 *     responses:
 *       200:
 *         description: A JSON array of all games.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       401:
 *         description: Unauthorized
 */
gameRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await gameService.getAllGames();
        res.status(200).json(games);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a game by ID.
 *     description: Retrieve a game by its ID.
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: A game object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.getGameById(parseInt(req.params.id));
        res.status(200).json(game);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games/team/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get games by team ID.
 *     description: Retrieve games by team ID.
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team ID
 *     responses:
 *       200:
 *         description: A list of games for the team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.get('/team/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.getGamesByTeamId(parseInt(req.params.id));
        res.status(200).json(game);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get games by user ID.
 *     description: Retrieve games by user ID.
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of games for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.getGamesByUserId(parseInt(req.params.id));
        res.status(200).json(game);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new game.
 *     description: Create a new game.
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: The created game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameData = req.body;
        const newGame = await gameService.createGame(gameData);
        res.status(201).json(newGame);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games/edit/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a game by ID.
 *     description: Update the details of an existing game.
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: The updated game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.put('/edit/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameData: GameInput = req.body;
        const id = req.params.id;
        const updatedGame: Game = await gameService.updateGame(parseInt(id), gameData);
        res.status(200).json(updatedGame);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a game by ID.
 *     description: Delete a game by its ID.
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game to delete.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: The deleted game.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
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
gameRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.deleteGame(parseInt(req.params.id));
        res.status(200).json(game);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { gameRouter };