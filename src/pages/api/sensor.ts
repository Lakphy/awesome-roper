import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const client = (global as any).redisContext;
  const emitter = (global as any).emitter;

  // console.log('Sensor: Received a request from client');
  // console.log(req.body);
  const { x, z } = req.body;

  client.get('sensor', function (err: any, value: any) {
    const totalData = JSON.parse(value);
    totalData.push(Math.abs(x) - 10 > 2);
    if (totalData.length > 40) {
      totalData.shift();
    }
    let upCase = 0;
    for (let i = totalData.length - 1; i > 0; i--) {
      if (totalData[i] && !totalData[i - 1]) {
        upCase++;
      }
    }
    if (upCase > 1) {
      client.set('sensor', JSON.stringify([false]));
      emitter.emit('onJump', Date.now());
      console.log('Jump!');
    } else client.set('sensor', JSON.stringify(totalData));
    // console.log('Got: ' + totalData);
  });

  const val: any = await new Promise((resolve) => {
    client.get('jumps', function (err: any, value: any) {
      if (err) throw err;
      resolve(JSON.parse(value));
    });
  });
  if (val.isJump) {
    res.status(200).send(`Current: ${val.data}`);
  } else {
    res.status(200).send(`STOPED`);
  }
  res.end();
}
