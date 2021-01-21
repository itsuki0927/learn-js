let uid = 0
function Dep() {
  this.id = uid++
  this.subs = []
}
Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}
Dep.prototype.notify = function () {
  console.log(this.subs)
  this.subs.forEach(sub => sub.update())
}
Dep.prototype.depend = function () {
  Dep.target.addDep(this)
}
Dep.prototype.removeSub = function (sub) {
  const index = this.subs.indexOf(sub)
  if (index !== -1) {
    this.subs.splice(index, 1)
  }
}

function observe(data) {
  if (!data || typeof data === 'object') {
    return
  }
  return new Observer(data)
}

function Observer(data) {
  this.data = data
  this.walk(data)
}

Observer.prototype.walk = function (data) {
  Object.keys(data).forEach(key => {
    this.convert(key, data[key])
  })
}
Observer.prototype.convert = function (key, val) {
  this.defineReactive(this.data, key, val)
}
Observer.prototype.defineReactive = function (data, key, val) {
  const deps = new Dep()
  let childObj = observe(val)

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    set(newVal) {
      console.log(val, newVal)
      if (val === newVal) return
      val = newVal
      childObj = observe(newVal)
      deps.notify()
    },
    get() {
      if (Dep.target) {
        deps.depend()
      }
      return val
    },
  })
}
