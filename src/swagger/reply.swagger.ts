/**
 * @swagger
 * /reply:
 *   post:
 *     summary: Buat reply pada thread
 *     description: Membuat reply baru pada thread tertentu (dengan gambar opsional)
 *     tags:
 *       - Reply
 *
 *     parameters:
 *       - in: query
 *         name: thread_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
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
 *                 example: Ini adalah reply pertama saya
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Reply berhasil dibuat
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
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: Ini adalah reply pertama saya
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: /uploads/replies/image.png
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
 *         description: Request tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: thread_id is required
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *
 *       404:
 *         description: Thread tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Thread not found
 *
 *       500:
 *         description: Gagal membuat reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create reply
 */

/**
 * @swagger
 * /reply:
 *   get:
 *     summary: Ambil reply berdasarkan thread
 *     description: Mengambil semua reply dari thread tertentu berdasarkan thread_id
 *     tags:
 *       - Reply
 *
 *     parameters:
 *       - in: query
 *         name: thread_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Berhasil mengambil data reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                         example: Ini adalah reply
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: /uploads/replies/image.png
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           full_name:
 *                             type: string
 *                             example: Jeremy Reinhart
 *                           username:
 *                             type: string
 *                             example: jeremy
 *                           photo_profile:
 *                             type: string
 *                             example: /uploads/profile/avatar.png
 *
 *       400:
 *         description: thread_id tidak dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: thread_id is required
 *
 *       500:
 *         description: Gagal mengambil reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch
 */
