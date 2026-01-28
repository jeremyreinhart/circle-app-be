/**
 * @swagger
 * /thread:
 *   post:
 *     summary: Buat thread baru
 *     description: Membuat thread baru dengan konten teks dan gambar (opsional)
 *     tags:
 *       - Thread
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Ini adalah thread pertama saya
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Thread berhasil diposting
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
 *                   example: Thread berhasil diposting.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: Ini adalah thread pertama saya
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/threads/image.png
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         full_name:
 *                           type: string
 *                           example: Jeremy Reinhart
 *                         username:
 *                           type: string
 *                           example: jeremy
 *                         photo_profile:
 *                           type: string
 *                           example: /uploads/profile/avatar.png
 *
 *       400:
 *         description: Content tidak boleh kosong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content cannot be empty
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
 *         description: Internal server error
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
 *                   example: Internal server error
 */

/**
 * @swagger
 * /threads:
 *   get:
 *     summary: Ambil semua thread
 *     description: Mengambil seluruh thread dengan jumlah like, reply, dan status like user
 *     tags:
 *       - Thread
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil data thread
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get All allThread
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: Ini adalah thread terbaru
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/threads/image.png
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       likes:
 *                         type: integer
 *                         example: 10
 *                       replies:
 *                         type: integer
 *                         example: 3
 *                       liked:
 *                         type: boolean
 *                         example: true
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: jeremy
 *                           full_name:
 *                             type: string
 *                             example: Jeremy Reinhart
 *                           photo_profile:
 *                             type: string
 *                             example: /uploads/profile/avatar.png
 *                           created_at:
 *                             type: string
 *                             format: date-time
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
 * /thread/{id}:
 *   get:
 *     summary: Ambil detail thread
 *     description: Mengambil detail thread berdasarkan ID
 *     tags:
 *       - Thread
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail thread
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
 *                   example: Get Data Thread Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: Ini adalah isi thread
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/threads/image.png
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         full_name:
 *                           type: string
 *                           example: Jeremy Reinhart
 *                         username:
 *                           type: string
 *                           example: jeremy
 *                         photo_profile:
 *                           type: string
 *                           example: /uploads/profile/avatar.png
 *                     likes_count:
 *                       type: integer
 *                       example: 10
 *                     replies_count:
 *                       type: integer
 *                       example: 5
 *
 *       400:
 *         description: Invalid thread id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid thread id
 *
 *       404:
 *         description: Thread not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Thread not found
 *
 *       500:
 *         description: Failed to get data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to Get Data
 */

/**
 * @swagger
 * /threads/me/{userId}:
 *   get:
 *     summary: Ambil thread berdasarkan user
 *     description: Mengambil semua thread yang dibuat oleh user tertentu
 *     tags:
 *       - Thread
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
 *         description: Berhasil mengambil thread user
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
 *                   example: Get my threads successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: Ini isi thread
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/threads/image.png
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: jeremy
 *                           full_name:
 *                             type: string
 *                             example: Jeremy Reinhart
 *                           photo_profile:
 *                             type: string
 *                             example: /uploads/profile/avatar.png
 *                       _count:
 *                         type: object
 *                         properties:
 *                           likes:
 *                             type: integer
 *                             example: 5
 *                           replies:
 *                             type: integer
 *                             example: 2
 *
 *       400:
 *         description: Invalid user id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
