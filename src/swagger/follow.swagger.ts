/**
 * @swagger
 * /follows:
 *   get:
 *     summary: Get followers or following
 *     description: Mengambil daftar followers atau following berdasarkan query type
 *     tags:
 *       - Follow
 *
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [followers, following]
 *         example: followers
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil data follow
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   oneOf:
 *                     - properties:
 *                         followers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               username:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                               bio:
 *                                 type: string
 *                               is_following:
 *                                 type: boolean
 *                     - properties:
 *                         following:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               username:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                               bio:
 *                                 type: string
 *
 *       400:
 *         description: Invalid type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid type,use followers or following
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch follows
 */

/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Follow a user
 *     description: Follow user lain berdasarkan user_id
 *     tags:
 *       - Follow
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *
 *     responses:
 *       201:
 *         description: Follow berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: You have successfully followed the user.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     is_following:
 *                       type: boolean
 *                       example: true
 *
 *       400:
 *         description: Invalid user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid user_id
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to follow the user. Please try again later.
 */

/**
 * @swagger
 * /follows:
 *   delete:
 *     summary: Unfollow a user
 *     description: Berhenti mengikuti user berdasarkan user_id
 *     tags:
 *       - Follow
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *
 *     responses:
 *       200:
 *         description: Unfollow berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: You have successfully unfollowed the user.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     is_following:
 *                       type: boolean
 *                       example: false
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to unfollow user
 */

/**
 * @swagger
 * /follows/count/{userId}:
 *   get:
 *     summary: Get followers & following count
 *     description: Mengambil jumlah followers dan following dari user berdasarkan userId
 *     tags:
 *       - Follow
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil jumlah followers dan following
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     followers:
 *                       type: integer
 *                       example: 10
 *                     following:
 *                       type: integer
 *                       example: 5
 *
 *       400:
 *         description: Invalid user id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid user id
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /follows/suggested:
 *   get:
 *     summary: Get suggested users to follow
 *     description: Mengambil daftar user yang direkomendasikan untuk di-follow (belum di-follow dan bukan diri sendiri)
 *     tags:
 *       - Follow
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil suggested users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       username:
 *                         type: string
 *                         example: dio
 *                       full_name:
 *                         type: string
 *                         example: Dio Ramadhani
 *                       photo_profile:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/profile/avatar.png
 *                       bio:
 *                         type: string
 *                         example: Fullstack Developer
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch suggested users
 */
