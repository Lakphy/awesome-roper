var redis = require('redis');
global.redisContext = redis.createClient(6379, '127.0.0.1');
global.redisContext.set('color', 'red', redis.print);

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
}
global.emitter = new _emitter();

module.exports = {};
