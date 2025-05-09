/**
 * @Swagger
 *   components:
 *    securtyschemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Player:
 *          type: object
 *          properties:
 *              id:
 *                 type: number
 *                 format: int64
 *              firstName:
 *                type: string
 *                description: The first name of the user.
 *              lastName:
 *                type: string
 *                description: The last name of the user.
 *              email:
 *                type: string
 *                description: The email of the user.
 *              phoneNumber:
 *                type: string
 *                description: The phone number of the user.
 *              role:
 *                type: string
 *                description: The role of the user.
 */

import express, { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';
import { User } from '../model/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../util/winstonLogger';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A JSON array of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error fetching users: ${error.message}`);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by ID.
 *     description: Retrieve a user by their ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id));
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new user.
 *     description: Create a new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               role:
 *                 type: string
 *                 description: The role of the user.
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userData: UserInput = req.body;

        logger.info(`Creating user with data: ${JSON.stringify(userData)}`);

        const newUser = await userService.createUser(userData);

        logger.info(`User created successfully: ${JSON.stringify(newUser)}`);

        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error creating user: ${error.message}`);
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *       409:
 *         description: User already exists.
 */
userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;

        logger.info(`Registering user with data: ${JSON.stringify(userInput)}`);

        const user = await userService.createUser(userInput);
    
        logger.info(`User registered successfully: ${JSON.stringify(user)}`);

        res.status(201).json(user);
    } catch (error) {
        next(error);
        logger.error(`Error registering user: ${error}`);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Authentication response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User does not exist.
 *       500:
 *         description: Internal server error.
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: UserInput = req.body;

        logger.info(`Authenticating user with data: ${JSON.stringify(userInput)}`);

        const response = await userService.authenticate(userInput);

        logger.info(`User authenticated successfully: ${JSON.stringify(response)}`);

        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
        logger.error(`Error authenticating user: ${error}`);
    }
});

/**
 * @swagger
 * /users/edit/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a user.
 *     description: Update the details of an existing user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               role:
 *                 type: string
 *                 description: The role of the user.
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.put('/edit/:id', async (req: Request, res: Response) => {
    try {
        const userData: UserInput = req.body;

        const id = req.params.id;

        logger.info(`Updating user with ID ${id} and data: ${JSON.stringify(userData)}`);

        const updatedUser: User = await userService.updateUser(parseInt(id), userData);

        logger.info(`User updated successfully: ${JSON.stringify(updatedUser)}`);

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error updating user: ${error.message}`);
    }
});

userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', errorMessage: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token, secret) as JwtPayload;

        const loggedInUserId = decoded.id;

        if (userId !== loggedInUserId) {
            return res.status(403).json({ status: 'error', errorMessage: 'Unauthorized to delete this account.' });
        }

        logger.info(`Deleting user with ID: ${userId}`);

        await userService.deleteUser(userId);

        logger.info(`User with ID ${userId} deleted successfully.`);

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error: any) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
        logger.error(`Error deleting user: ${error.message}`);
    }
});

export { userRouter };
