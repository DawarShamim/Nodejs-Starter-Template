const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const validate = require("../middleware/validate");

const { loginJoi } = require('../validations/commonJoi');
// /api/user

/**
 * @swagger
 * paths:
 *  /user/login:
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
 *                Username:
 *                  type: string
 *                Password:
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

router.post("/login", validate(loginJoi), userController.login);

router.post("/signup", userController.signup);

router.get('/testingLogger/:key', userController.loggign);

module.exports = router; 