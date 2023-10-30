import express, { Request, Response } from 'express';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';

const app = express();
const port = 3000;

app.get('/image', async (req: Request, res: Response) => {
    const imageUrl = req.query.url as string;

    if (!imageUrl) {
        return res.status(400).send('Image URL is missing.');
    }

    try {
        const config: AxiosRequestConfig = {
            method: 'get',
            maxRedirects: 5,
            url: imageUrl,
            responseType: 'stream' as ResponseType,  // Set responseType as enum value
            headers: {
                'User-Agent': req.get('User-Agent') || '',  // Ensure it's not undefined
            },
        };

        const response = await axios.request(config);

        if (response.status === 200) {
            if (response.headers['content-type']) {
                res.set('Content-Type', response.headers['content-type']);
            }

            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                res.set('Content-Disposition', contentDisposition);
            }

            response.data.pipe(res);
        } else {
            // Send a debug response with error details
            const debugResponse = {
                error: 'Error proxying image',
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
            res.status(response.status).json(debugResponse);
        }
    } catch (error: any) {
        // Send a debug response with error details
        const debugResponse = {
            error: 'Error proxying image',
            message: error.message,
            stack: error.stack,
        };
        console.error('Error proxying image:', error.message);
        res.status(500).json(debugResponse);
    }
});

app.listen(port, () => {
    console.log(`Image proxy server is running on port ${port}`);
});
