let result
const numberParser = input => (result = input.match(/^-?(0|([1-9][0-9]*))(\.[0-9]+)?([E][+-]?[0-9]+)?/i)) && [result[0] * 1, input.slice(result[0].length)]
const spaceParser = input => input.replace(/^\s+/, '')
const symbolParser = (input) => {
  result = input.match(/^(([a-zA-Z]+)|(\+|-|>=|<=|>|<|=|\*|\\))/)
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
  let condition; let result
  input = spaceParser(input.slice(2))
  result = sExpressionParser(input)
  if (!result) return null
  condition = result[0]
  input = spaceParser(result[1])
  if (condition) {
    result = expressionParserEval(input)
    if (!result) return null
    input = parseCodewithoutEval(result[1])[1]
    if (!input) return null
    input = spaceParser(input)
    if (input[0] !== ')') return null
    return [result[0], input.slice(1)]
  }
  input = parseCodewithoutEval(result[1])[1]
  result = expressionParserEval(input)
  if (!result) return null
  input = spaceParser(result[1])
  if (spaceParser(input) !== ')') return null
  return [result[0], input.slice(1)]
}

const quoteParser = input => {
  let result
  input = spaceParser(input)
  if (input[0] !== ')') {
    result = ''
    while (input[0] !== ')') {
      result = result + input[0]
      input = input.slice(1)
    }
    return [result, input.slice(1)]
  }
  result = ''
  let count = 0
  while (count >= 0) {
    if (input[0] === '(') count++
    if (input[0] === ')') count--
    if (count === 0) {
      result = result + ')'
      input = input.slice(1)
      input = spaceParser(input)
      if (input[0] !== ')') return null
      return [result, input.slice(1)]
    }
    result = result + input[0]
    input = input.slice(1)
  }
  return null
}

const lambdaParser = input => {

}

const defineParser = input => {
  let result
  input = spaceParser(input)
  result = symbolParser(input)
  if (!result) return null
  let identifier = result[0]
  let value = expressionParserEval(result[1])
  if (!value) return null
  input = spaceParser(value[1])
  if (input[0] !== ')') return null
  globalEnv[identifier] = value[0]
  return [identifier, spaceParser(value[1])]
}

const sExpressionParser = input => {
  let result
  if (input[0] !== '(') return null
  let args = []
  input = input.slice(1)
  input = spaceParser(input)
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
    return [result[0], result[1]]
  } else if (input.startsWith('quote')) {
    input = input.slice(5)
    result = quoteParser(input)
    if (!result) return null
    return [result[0], result[1]]
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

const parseCodewithoutEval = input => {
  let result
  input = spaceParser(input)
  if ((result = numberParser(input))) return [result[0], result[1]]
  else if ((result = symbolParser(input))) return [result[0], result[1]]
  if (input[0] === '(') {
    result = '('
    let count = 1
    input = input.slice(1)
    while (count >= 0) {
      if (input[0] === '(') count++
      if (input[0] === ')') count--
      if (count === 0) {
        result = result + ')'
        input = input.slice(1)
        input = spaceParser(input)
        return [result, input]
      }
      result = result + input[0]
      input = input.slice(1)
    }
  }

  return null
}

const expressionParserEval = (input) => {
  input = spaceParser(input)
  if ((result = sExpressionParser(input))) return [result[0], result[1]]
  else if ((result = numberParser(input))) return [result[0], result[1]]
  else if ((result = symbolParser(input))) {
    return [globalEnv[result[0]], result[1]]
  }
}

// console.log(expressionParserEval('( quote 7687da_hsadbnsda)'))
// console.log(expressionParserEval('(* 40 90)'))

// console.log(expressionParserEval('(+ 45 67 (+ 1 1))'))
// console.log(expressionParserEval('(define define 90)'))
// console.log(expressionParserEval('(define define 90)'))
// console.log(expressionParserEval('(+ define 40)'))
// console.log(expressionParserEval('(define r 40)'))
// console.log(expressionParserEval('(* (+ r define) 78  67)'))

// console.log(expressionParserEval('(define plus +)'))
// console.log(expressionParserEval('(plus 30 (plus 5 6))'))

// console.log(expressionParserEval('( if (< 5 25) (+ 67 89 65 (- 40 38)) (+ 1 2 (+ 89 4 5)))'))
console.log(expressionParserEval('(if (= 12 12) (+ 78 2) 9)'))
// console.log(globalEnv)
