// 时间戳
function throttle_timestamp(func, wait) {
  var context, args
  var previous = 0

  return function () {
    var now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

// 定时器
function throttle_timer(func, wait) {
  var timeout, args

  return function () {
    args = arguments
    context = this
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
