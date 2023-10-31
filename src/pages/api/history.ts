import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const client = (global as any).redisContext;
  if (req.method === 'GET') {
    const val = await new Promise((resolve) => {
      client.get('history', function (err: any, value: any) {
        if (err) throw err;
        resolve(JSON.parse(value));
      });
    });
    res.status(200).json(val);
    return;
  } else if (req.method === 'POST') {
    const { date, count, duration } = req.body;
    const val = await new Promise((resolve) => {
      client.get('history', function (err: any, value: any) {
        const data = JSON.parse(value);
        client.set(
          'history',
          JSON.stringify([{ date, count, duration }, ...data]),
          function (err: any, value: any) {
            if (err) throw err;
            resolve(value);
          }
        );
      });
    });
    res.status(200).json(val);
    return;
  }
}
