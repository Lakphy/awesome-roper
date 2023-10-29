import { NextApiRequest, NextApiResponse } from 'next';

export default function (req: NextApiRequest, res: NextApiResponse) {
  const { jumps, isJump } = req.body;
  const client = (global as any).redisContext;
  // client.get('jumps', function (err: any, value: any) {
  //   const totalData = JSON.parse(value);
  //   totalData.data = jumps;
  //   client.set('jumps', JSON.stringify(totalData));
  // });
  client.set('jumps', JSON.stringify({ data: jumps, isJump }));
  res.end();
}
