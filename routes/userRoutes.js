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

module.exports = router; 