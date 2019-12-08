var colors = require('colors');


colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

//bold
//italic
//underline
//inverse
//yellow
//cyan
//white
//magenta
//green
//red
//grey
//blue
//rainbow
//zebra
//random


console.log('hello'.green); // outputs green text
console.log('i like cake and pies'.underline.red) // outputs red underlined text
console.log('inverse the color'.inverse); // inverses the color
console.log('OMG Rainbows!'.rainbow); // rainbow (ignores spaces)

console.log('this is an error'.error);
console.log('this is a warning'.warn);
console.log('this is a debug'.debug);
console.log('this is a help'.help);
console.log('this is a silly'.silly);
console.log('this is a input'.input);
console.log('this is a prompt'.prompt);
console.log('this is a data'.data);
