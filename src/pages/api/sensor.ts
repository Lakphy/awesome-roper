import { NextApiRequest, NextApiResponse } from 'next';

export default function (req: NextApiRequest, res: NextApiResponse) {
  const client = (global as any).redisContext;
  const emitter = (global as any).emitter;

  // console.log('Sensor: Received a request from client');
  // console.log(req.body);
  const { x, z } = req.body;

  client.get('sensor', function (err: any, value: any) {
    const totalData = JSON.parse(value);
    totalData.push(Math.abs(x) - 10 > 4);
    if (totalData.length > 20) {
      totalData.shift();
    }
    let upCase = 0;
    for (let i = totalData.length - 1; i > 0; i--) {
      if (totalData[i] && !totalData[i - 1]) {
        upCase++;
      }
    }
    if (upCase > 1) {
      client.set('sensor', JSON.stringify([]));
      emitter.emit('onJump', Date.now());
      console.log('Jump!');
    } else client.set('sensor', JSON.stringify(totalData));
    // console.log('Got: ' + totalData);
  });

  //   client.get('color', function (err: any, value: any) {
  //     if (err) throw err;
  //     console.log('Got: ' + value);
  //     res.json({ value });
  //   });
  // emitter.emit('onJump', Date.now());
  res.end();
}
