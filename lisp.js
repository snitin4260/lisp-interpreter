let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const symbolParser = (input) => {
  result = input.match(/^(([a-zA-Z0-9]+)|(\+|-|>=|<=|>|<|=|\*|\\))/)
  if (!result) return null
  return [result[0], input.slice(result[0].length)]
}

let globalEnv = {
  '+': (args) => args.reduce((a, b) => a + b),
  '-': (args) => args.reduce((a, b) => a - b),
  '/': (args) => args.reduce((a, b) => a / b),
  '*': (args) => args.reduce((a, b) => a * b),
  '<': (arr) => arr[0] < arr[1],
  '>': (arr) => arr[0] > arr[1],
  '>=': (arr) => arr[0] >= arr[1],
  '<=': (arr) => arr[0] <= arr[1],
  '=': (arr) => arr[0] === arr[1],
  'pi': Math.PI
}

const ifParser = input => {
  let results = []
  let condition
  input = spaceParser(input.slice(2))
  result = sExpressionParser(input)
  if (!result) return null
  condition = result[0]
  input = spaceParser(result[1])
  result = sExpressionParser(input)
  if (!result) return null
  results.push(result[0])
  input = spaceParser(result[1])
  result = sExpressionParser(input)
  if (!result) return null
  results.push(result[0])
  input = spaceParser(result[1])
  if (input[0] !== ')') return null
  if (condition) return [results[0], input]
  return [results[1], input]
}

const defineParser = input => {
  input = spaceParser(input)
  result = symbolParser(input)
  if (!result) return null
  let identifier = result[0]
  let value = expressionParserEval(result[1], true)
  if (!value) return null
  input = spaceParser(value[1])
  if (input[0] !== ')') return null
  globalEnv[identifier] = value[0]
  return [identifier, spaceParser(value[1])]
}

const sExpressionParser = input => {
  if (input[0] !== '(') return null
  let args = []
  input = input.slice(1)
  input = spaceParser(input)
  while (input[0] !== ')') {
    if (input.startsWith('define')) {
      input = input.slice(6)
      result = defineParser(input)
      if (!result) return null
      return [result[0], result[1].slice(1)]
    } else if (input.startsWith('begin')) {
      input = input.slice(5)
      while (input[0] !== ')') {
        result = expressionParserEval(input)
        input = spaceParser(result[1])
      }

      return [result[0], result[1].slice(1)]
    } else if (input.startsWith('if')) {
      result = ifParser(input)
      return [result[0], result[1].slice(1)]
    } else {
      let firstEmptyspaceIndex = input.indexOf(' ')
      let textChar = input.slice(0, firstEmptyspaceIndex)
      if (!globalEnv[textChar]) return null
      let operation = textChar
      input = spaceParser(input.slice(firstEmptyspaceIndex))
      // parse the arguments
      while (input[0] !== ')') {
        result = expressionParserEval(input)
        if (!result) return null
        args.push(result[0])
        input = spaceParser(result[1])
      }
      return [globalEnv[operation](args), input.slice(1)]
    }
  }
}

const expressionParserEval = (input) => {
  input = spaceParser(input)
  if ((result = sExpressionParser(input))) return [result[0], result[1]]
  else if ((result = numberParser(input))) return [result[0], result[1]]
  else if ((result = symbolParser(input))) {
    return [globalEnv[result[0]], result[1]]
  }
}

// console.log(expressionParserEval('(* 40 90)'))

// console.log(expressionParserEval('(+ 45 67 (+ 1 1))'))
// console.log(expressionParserEval('(define pls *)'))
// console.log(expressionParserEval('define'))
// console.log(expressionParserEval('(pls 30 (pls 5 6))'))

console.log(expressionParserEval('(begin(if (> 5 10) (+ 1 2 (+ 89 4 5)) (* 7 8 67)) (+ 8 9) (* 56 78))'))
