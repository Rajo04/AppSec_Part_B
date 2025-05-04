import express, { Request, Response, NextFunction } from 'express';
import playerService from '../service/player.service';

const playerRouter = express.Router();

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Player:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           firstName:
 *             type: string
 *             description: The first name of the player.
 *           lastName:
 *             type: string
 *             description: The last name of the player.
 *           email:
 *             type: string
 *             description: The email of the player.
 *           phoneNumber:
 *             type: string
 *             description: The phone number of the player.
 */

/**
 * @swagger
 * /players:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all players.
 *     tags: [Player]
 *     responses:
 *       200:
 *         description: A JSON array of all players.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 *       401:
 *         description: Unauthorized
 */
playerRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const players = await playerService.getAllPlayers();
        res.status(200).json(players);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a player by ID.
 *     description: Retrieve a player by their ID.
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The player ID
 *     responses:
 *       200:
 *         description: A player object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
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
playerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const player = await playerService.getPlayerById(parseInt(req.params.id));
        res.status(200).json(player);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { playerRouter };