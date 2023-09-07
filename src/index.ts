import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.get('/proxy', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    return res.status(400).send('Image URL is missing.');
  }

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    if (response.headers['content-type']) {
      res.set('Content-Type', response.headers['content-type']);
    }

    res.send(response.data);
  } catch (error: any) {
    console.error('Error proxying image:', error.message);
    res.status(500).send('Error proxying image.');
  }
});

app.listen(port, () => {
  console.log(`Image proxy server is running on port ${port}`);
});
