function Watcher(vm, exp, fn) {
  this.fn = fn
  this.vm = vm
  this.exp = exp
  this.depIds = {}

  if (typeof exp === 'function') {
    this.getter = exp
  } else {
    this.getter = this.parseGetter(exp)
  }

  console.log(this)
  this.value = this.get()
  console.log(this.value)
}

Watcher.prototype.update = function () {
  this.run()
}

Watcher.prototype.run = function () {
  const value = this.get()
  const oldVal = this.value
  if (value !== oldVal) {
    this.value = value
    this.fn.call(this.vm, value, oldVal)
  }
}

Watcher.prototype.get = function () {
  Dep.target = this
  console.log(this)
  const value = this.getter.call(this.vm, this.vm)
  Dep.target = null
  return value
}

Watcher.prototype.addDep = function (dep) {
  if (!this.depIds.hasOwnProperty(dep.id)) {
    dep.addSub(this)
    this.depIds[dep.id] = dep
  }
}

Watcher.prototype.parseGetter = function (exp) {
  console.log(exp)
  console.log(/[^\w.$]/.test(exp))
  if (/[^\w.$]/.test(exp)) return

  const exps = exp.split('.')

  return function (obj) {
    for (let i = 0; i < exps.length; i++) {
      if (!obj) return
      obj = obj[exps[i]]
    }
    return obj
  }
}
