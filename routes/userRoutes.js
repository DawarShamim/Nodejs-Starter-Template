const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validate = require('../middleware/validate');

const { loginJoi, signupJoi } = require('../validations/commonJoi');
// /api/user

/**
 * @swagger
 * paths:
 *  /api/user/login:
 *    post:
 *      summary: Login user
 *      description: Login user with provided username and password
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        '200':
 *          description: Successful login
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: true
 *                    type: boolean
 *                    description: Indicates if the login was successful
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the login attempt
 *                  Token:
 *                    type: string
 *                    description: Authentication token for the logged-in user
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: false
 *                    type: boolean
 *                    description: Indicates if the login was unsuccessful
 *                  message:
 *                    type: string
 *                    description: A message indicating the reason for the login failure
 *        '404':
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: false
 *                    type: boolean
 *                    description: Indicates if the user was not found
 *                  message:
 *                    type: string
 *                    description: A message indicating that the user was not found
 */

router.post('/login', validate(loginJoi), userController.login);

/**
 * @swagger
 * paths:
 *  /api/user/signup:
 *    post:
 *      summary: Register a new user
 *      description: Creates a new user account with the provided username and password.
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  description: The desired username for the new account.
 *                email:
 *                  type: string
 *                  description: User email for new account.
 *                password:
 *                  type: string
 *                  description: The desired password for the new account.
 *                confirmPassword:
 *                  type: string
 *                  description: Confirmation of the password for the new account.
 *      responses:
 *        '201':
 *          description: User created successfully
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: true
 *                    type: boolean
 *                    description: Indicates if the user was created successfully.
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the signup process.
 *        '400':
 *          description: Bad request - invalid input
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: false
 *                    type: boolean
 *                    description: Indicates if the signup was unsuccessful due to invalid input.
 *                  message:
 *                    type: string
 *                    description: A message indicating the reason for the failure.
 *        '409':
 *          description: Conflict - username already exists
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: false
 *                    type: boolean
 *                    description: Indicates if the signup was unsuccessful due to an existing username.
 *                  message:
 *                    type: string
 *                    description: A message indicating that the username is already taken.
 */

router.post('/signup', validate(signupJoi), userController.signup);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * paths:
 *  /api/user/getAll:
 *    get:
 *      summary: Retrieve a paginated list of users
 *      description: Fetches a list of users with pagination. The response includes the users and pagination details.
 *      tags:
 *        - User
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            default: 1
 *          description: The page number to retrieve.
 *        - in: query
 *          name: pageSize
 *          schema:
 *            type: integer
 *            default: 10
 *          description: The number of items per page.
 *      responses:
 *        '200':
 *          description: Successfully retrieved the list of users
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: true
 *                    type: boolean
 *                    description: Indicates if the request was successful.
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation.
 *                    example: Users retrieved successfully
 *                  data:
 *                    type: object
 *                    properties:
 *                      documents:
 *                        type: array
 *                        items:
 *                          type: object
 *                          description: User object containing user details.
 *                      paginated:
 *                        type: object
 *                        properties:
 *                          page:
 *                            type: integer
 *                            description: The current page number.
 *                          pageSize:
 *                            type: integer
 *                            description: The number of items per page.
 *                          totalItems:
 *                            type: integer
 *                            description: The total number of items available.
 *        '500':
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    example: false
 *                    type: boolean
 *                    description: Indicates if the request was unsuccessful due to a server error.
 *                  message:
 *                    type: string
 *                    description: A message indicating the reason for the server error.
 *                    example: An error occurred while retrieving users.
 */

router.get('/getAll', userController.getAllUsers);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset user password by generating and sending an OTP to the user's email
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password', userController.resetPassword);

module.exports = router; 