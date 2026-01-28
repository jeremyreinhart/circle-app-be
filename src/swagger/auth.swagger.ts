/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register user baru
 *     description: Endpoint untuk mendaftarkan user baru
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: jeremy
 *               full_name:
 *                 type: string
 *                 example: Jeremy Reinhart
 *               email:
 *                 type: string
 *                 example: jeremy@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *
 *     responses:
 *       201:
 *         description: Registration Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: succes
 *                 message:
 *                   type: string
 *                   example: Registration Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: jeremy
 *                         full_name:
 *                           type: string
 *                           example: Jeremy Reinhart
 *                         email:
 *                           type: string
 *                           example: jeremy@mail.com
 *
 *       500:
 *         description: Invalid Register
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Register
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     description: Endpoint untuk autentikasi user dan mengembalikan token
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jeremy@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *
 *     responses:
 *       200:
 *         description: Login Successful (token disimpan di httpOnly cookie)
 *         headers:
 *           Set-Cookie:
 *             description: JWT token disimpan sebagai httpOnly cookie
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: jeremy
 *                         full_name:
 *                           type: string
 *                           example: Jeremy Reinhart
 *                         email:
 *                           type: string
 *                           example: jeremy@mail.com
 *
 *       500:
 *         description: Invalid Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Login
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Ambil data user yang sedang login
 *     description: Mengambil data user berdasarkan token yang disimpan di httpOnly cookie
 *     tags:
 *       - Auth
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: jeremy
 *                     full_name:
 *                       type: string
 *                       example: Jeremy Reinhart
 *                     email:
 *                       type: string
 *                       example: jeremy@mail.com
 *                     bio:
 *                       type: string
 *                       example: Fullstack Developer
 *                     photo_profile:
 *                       type: string
 *                       example: https://example.com/photo.jpg
 *
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     description: Menghapus token JWT yang tersimpan di httpOnly cookie
 *     tags:
 *       - Auth
 *
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         headers:
 *           Set-Cookie:
 *             description: Cookie token dihapus
 *             schema:
 *               type: string
 *               example: token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout Berhasil
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update profile user
 *     description: Mengupdate data profile user yang sedang login (dengan upload foto opsional)
 *     tags:
 *       - User
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Jeremy Reinhart
 *               username:
 *                 type: string
 *                 example: jeremy
 *               bio:
 *                 type: string
 *                 example: Fullstack Developer
 *               profile:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Profile berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated Successfuly
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: Jeremy Reinhart
 *                     username:
 *                       type: string
 *                       example: jeremy
 *                     email:
 *                       type: string
 *                       example: jeremy@mail.com
 *                     bio:
 *                       type: string
 *                       example: Fullstack Developer
 *                     photo_profile:
 *                       type: string
 *                       example: /uploads/profile/avatar.png
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       500:
 *         description: Failed to update profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update profile
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Ambil semua user
 *     description: Mengambil daftar seluruh user yang terdaftar
 *     tags:
 *       - User
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: jeremy
 *                       full_name:
 *                         type: string
 *                         example: Jeremy Reinhart
 *                       bio:
 *                         type: string
 *                         example: Fullstack Developer
 *                       photo_profile:
 *                         type: string
 *                         example: /uploads/profile/avatar.png
 *
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
