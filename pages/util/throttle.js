function throttle(fn,context) {
  let timer
  return function() {
    clearTimeout(timer)
    timer = setTimeout(()=>fn.call(context),800)
  }
}

module.exports = throttle