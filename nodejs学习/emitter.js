const EventEmitter = require('events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {
    console.log('触发事件');
});
myEmitter.emit('event');