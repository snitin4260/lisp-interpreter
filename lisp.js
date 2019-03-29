let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const stringParser = input => {
  result = input.match(/^[a-zA-Z0-9]+/)
  if (!result) return null
  if (globalEnv[result[0]]) return [globalEnv[result[0]], input.slice(result[0].length)]
  return [result[0], input.slice(result[0].length)]
}

let globalEnv = {
  '+': (args) => args.reduce((a, b) => a + b),
  '-': (args) => args.reduce((a, b) => a - b),
  '/': (args) => args.reduce((a, b) => a / b),
  '*': (args) => args.reduce((a, b) => a * b),
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '=': (x, y) => x === y,
  'pi': Math.PI
}

const mathParser = input => {
  if (!(result = input.match(/^(\+|-|\/|\*|>=|<=|>|<|=)/))) return null
  let operation = result[0]
  input = spaceParser(input.slice(1))
  let operands = []
  while (input[0] !== ')') {
    result = expressionParser(input)
    if (!result) return null
    operands.push(result[0])
    input = spaceParser(result[1])
  }
  return [globalEnv[operation](operands), input]
}


// const ifParser = input => {
//   if (!input.startsWith('if')) return null
//   input = spaceParser(input.slice(2))
//   result = expressionParser(input)
//   if(!result) return null
//   input= spaceParser(result[1])
//   //true
//   if(result[0]) {

//   }

// }

const defineParser = input => {
  if (!input.startsWith('define')) return null
  input = spaceParser(input.slice(6))
  result = stringParser(input)
  if (!result) return null
  let identifier = result[0]
  let value = expressionParser(result[1])
  if (!value) return null
  globalEnv[identifier] = value[0]
  return [true, spaceParser(value[1])]
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
  result = sExpressionParser(input) || numberParser(input) || mathParser(input) || defineParser(input) || stringParser(input)
  if (!result) return null
  return result
}

console.log(expressionParser('(* 45 6 78 56)'))

// console.log(defineParser("define (12333"))
