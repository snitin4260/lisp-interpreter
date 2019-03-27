let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const stringParser = input => (result = input.match(/[a - zA - Z0 - 9] +/) && [result[0], input.slice(result[0].length)])

let globalEnv = {
  '+': (args) => args.reduce((a, b) => a + b),
  '-': (args) => args.reduce((a, b) => a - b),
  '/': (args) => args.reduce((a, b) => a / b),
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '=': (x, y) => x === y
}

const sExpressionParser = input => {
  input = spaceParser(input)
  let noOfoperands = 0
  if (input[0] !== '(') return null
  let operation
  let operands = []
  input = input.slice(1)
  input = spaceParser(input)
  result = globalEnv[input[0]]
  if (!result) return null
  operation = input[0]
  input = input.slice(1)
  input = spaceParser(input)
  while (input[0] !== ')') {
    result = expressionParser(input)
    if (!result) return null
    operands.push(result[0])
    noOfoperands++
    input = result[1]
    input = spaceParser(input)
  }
  if (noOfoperands <= 1) return null
  return [globalEnv[operation](operands), input.slice(1)]
}

const expressionParser = input => sExpressionParser(input) || numberParser(input)

console.log(expressionParser('(+ 1 5 8 (+ 34 67) (+ 6 5) (- 123 ))'))
