import { NextApiRequest, NextApiResponse } from 'next';

export default function (req: NextApiRequest, res: NextApiResponse) {
  const client = (global as any).redisContext;
  const emitter = (global as any).emitter;
  //   client.get('color', function (err: any, value: any) {
  //     if (err) throw err;
  //     console.log('Got: ' + value);
  //     res.json({ value });
  //   });
  emitter.emit('onJump', Date.now());
  res.end();
}
