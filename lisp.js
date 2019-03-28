let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const stringParser = input => (result = input.match(/[a - zA - Z0 - 9] +/) && [result[0], input.slice(result[0].length)])

let globalEnv = {
  '+': (args) => args.reduce((a, b) => a + b),
  '-': (args) => args.reduce((a, b) => a - b),
  '/': (args) => args.reduce((a, b) => a / b),
  '*': (args) => args.reduce((a, b) => a * b),
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '=': (x, y) => x === y
}

const mathParser = input => {
  if (!(result = input.match(/^(\+|-|\/|\*)/))) return null
  let operation = result[0]
  input = spaceParser(input.slice(1))
  let operands = []
  while (input[0] !== ')') {
    result = expressionParser(input)
    if (!result) return null
    operands.push(result[0])
    input = result[1]
    input = spaceParser(input)
  }

  return [globalEnv[operation](operands), input]
}

const sExpressionParser = input => {
  if (input[0] !== '(') return null
  let output
  input = input.slice(1)
  input = spaceParser(input)
  while (input[0] !== ')') {
    result = expressionParser(input)
    if (!result) return null
    output = result[0]
    input = result[1]
  }
  return [output, input.slice(1)]
}

const expressionParser = input => {
  input = spaceParser(input)
  return sExpressionParser(input) || numberParser(input) || mathParser(input)
}

console.log(expressionParser('(+ 1 5 8 (+ 345 67) (+ 6 5) (* 4 5) (- 123 67 ))'))

//console.log(mathParser('+ )'))
