// ES6的flat
const arr = [1, [1, 2], [1, 2, 4]]
arr.flat()

// 展开一层
// 使用reduce + concat
const flatten1 = arr => arr.reduce((acc, val) => acc.concat(val), [])
// 使用concat + 展开运算符
const flatten2 = arr => [].concat(...arr)

// 展开多层
// 使用reduce + concat + isArray + 递归
const flattenDeep = (arr, depth = 1) =>
  depth > 0
    ? arr.reduce(
        (acc, val) => acc.concat(Array.isArray(val) ? flattenDeep(val, depth - 1) : val),
        [],
      )
    : arr.slice(0)

// 使用forEach + isArray + push + 递归
const eachFlat = (arr = [], depth = 1) => {
  const result = []
  ;(function flat(arr, depth) {
    arr.forEach(item => {
      if (Array.isArray(item) && depth) {
        flat(item, depth - 1)
      } else {
        result.push(item)
      }
    })
  })(arr, depth)
  return result
}

// 使用堆栈
const stackFlat = input => {
  const stack = [...input]
  const res = []
  while (stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      res.push(next)
    }
  }
  return res.reverse()
}

// 生成器函数
function* genFlat(input) {
  for (const item of input) {
    if (Array.isArray(item)) {
      yield* genFlat(item)
    } else {
      yield item
    }
  }
}
