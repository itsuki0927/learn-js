// 第一版
function debounce_v1(func, wait) {
  var timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

// 第二版
// 绑定this
const debounce_v2 = (func, wait) => {
  var timeout
  return function () {
    var context = this
    clearTimeout(timeout)
    timeout = setTimeout(func.bind(context), wait)
  }
}

// 第三版
// 传参问题
const debounce_v3 = (func, wait) => {
  var timeout
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(func.bind(context, ...args), wait)
  }
}

// 第四版
//  immediate 判断是否立刻执行
const debounce_v4 = (func, wait, immediate) => {
  var timeout
  return function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(func.bind(context, ...args), wait)
    }
  }
}

// 第五版
// 返回值
const debounce_v5 = (func, wait, immediate) => {
  var timeout
  var result
  return function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => (time = null), wait)
      if (callNow) result = func.apply(context, args)
    } else {
      // 因为setTimeout是异步的, 所以 result 是undefined
      time = setTimeout(func.bind(context, ...args), wait)
    }

    return result
  }
}

// 第六版
// 取消
const debounce = (func, wait, immediate) => {
  var timeout
  var result

  const debounced = function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => (timeout = null), wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(func.bind(context, ...args), wait)
    }
    return result
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
