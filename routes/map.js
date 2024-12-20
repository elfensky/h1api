import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /map:
 *   get:
 *     tags:
 *       - HTML
 *     summary: Retrieve the Galactic map as a png
 *     description: generates, renders and serves the Galactic Map used in h1stats as a png.
 *     responses:
 *       200:
 *         description: Successfully retrieved the map
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *             example: "Example image can be found at: https://api.lavrenov.io/helldivers/map"
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
router.get('/map', async (req, res) => {
    try {
        data = { test: 'test' };
        res.json(data);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
