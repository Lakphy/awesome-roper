export class _emitter {
  private events: any;
  constructor() {
    this.events = {};
  }
  on(event: string, listener: any) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  emit(event: string, arg: any) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].forEach((listener: any) => {
      listener(arg);
    });
  }
}
