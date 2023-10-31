var redis = require('redis');
global.redisContext = redis.createClient(6379, '127.0.0.1');
global.redisContext.set('sensor', '[]', redis.print);
global.redisContext.set('jumps', '{"data": 0,"isJump": false}', redis.print);
global.redisContext.set(
  'history',
  JSON.stringify([
    {
      date: '2023-10-31 12:00:00',
      count: 100,
      duration: 123
    }
  ]),
  redis.print
);

class _emitter {
  events;
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  emit(event, arg) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].forEach((listener) => {
      listener(arg);
    });
  }
  only(event, listener) {
    this.events[event] = [listener];
  }
}
global.emitter = new _emitter();

module.exports = {};
