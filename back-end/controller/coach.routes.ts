import express, { Request, Response, NextFunction } from 'express';
import coachService from '../service/coach.service';
import logger from '../util/winstonLogger';

const coachRouter = express.Router();

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Coach:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           firstName:
 *             type: string
 *             description: The first name of the coach.
 *           lastName:
 *             type: string
 *             description: The last name of the coach.
 *           email:
 *             type: string
 *             description: The email of the coach.
 *           phoneNumber:
 *             type: string
 *             description: The phone number of the coach.
 */

/**
 * @swagger
 * /coaches:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all coaches.
 *     tags: [Coach]
 *     responses:
 *       200:
 *         description: A JSON array of all coaches.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coach'
 *       401:
 *         description: Unauthorized
 */
coachRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coaches = await coachService.getAllCoaches();
        res.status(200).json(coaches);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error fetching coaches: ${error.message}`);
    }
});

/**
 * @swagger
 * /coaches/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a coach by ID.
 *     description: Retrieve a coach by their ID.
 *     tags: [Coach]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The coach ID
 *     responses:
 *       200:
 *         description: A coach object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
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
coachRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coach = await coachService.getCoachById(parseInt(req.params.id));
        res.status(200).json(coach);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error fetching coach with ID ${req.params.id}: ${error.message}`);
    }
});

export { coachRouter };