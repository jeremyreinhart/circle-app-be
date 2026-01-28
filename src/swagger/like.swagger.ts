/**
 * @swagger
 * /threads/{threadId}/like:
 *   post:
 *     summary: Like / Unlike thread
 *     description: Toggle like pada thread (jika sudah like maka akan unlike, dan sebaliknya)
 *     tags:
 *       - Like
 *
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Berhasil toggle like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 liked:
 *                   type: boolean
 *                   example: true
 *                 likeCount:
 *                   type: integer
 *                   example: 10
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
 *       500:
 *         description: Gagal toggle like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to toggle like
 */
