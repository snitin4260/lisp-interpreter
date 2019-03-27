let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const stringParser = input => (result = input.match(/[a - zA - Z0 - 9] +/) && [result[0], input.slice(result[0].length)])

let globalEnv = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '/': (...args) => args.reduce((a, b) => a / b),
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '=': (x, y) => x === y,
  'pi': Math.PI
}

const listParser = input => {
  input = spaceParser(input)
  if (input[0] !== '(') return null
  input = input.slice(1)
  while (input[0] !== ')') {
    

  }
}
