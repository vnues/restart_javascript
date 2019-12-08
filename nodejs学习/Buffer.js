const str = "深入浅出nodejs"

const buf = Buffer.from(str, 'utf-8')


console.log(buf) // <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 6a 73>


console.log(buf.toString('utf-8'))