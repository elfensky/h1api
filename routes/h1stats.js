import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /h1stats:
 *   get:
 *     tags:
 *       - HTML
 *     summary: Retrieve Helldiver I statistics
 *     description: Fetches Helldiver I statistics and displays them as pretty HTML using a pug template.
 *     responses:
 *       200:
 *         description: Successfully retrieved H1 statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test:
 *                   type: string
 *                   description: A test property
 *                   example: "test"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/h1stats', async (req, res) => {
    try {
        data = { test: 'test' };
        res.json(data);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
