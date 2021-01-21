function Mvvm(options) {
  this.$options = options
  let data = (this._data = this.$options.data)

  console.log(data)
  observe(data)

  for (const key in data) {
    Object.defineProperty(this, key, {
      configurable: true,
      get() {
        return this._data[key]
      },
      set(val) {
        this._data[key] = val
      },
    })
  }

  new Complie(this.$options.el, this)
}

function Observe(data) {
  const dep = new Dep()
  for (const key in data) {
    let val = data[key]
    observe(val)
    Object.defineProperty(data, key, {
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newVal) {
        if (val === newVal) return
        val = newVal
        observe(newVal)
        dep.notify()
      },
    })
  }
}

function observe(data) {
  if (!data || typeof data !== 'object') return
  return new Observe(data)
}

function Complie(el, vm) {
  vm.$el = document.querySelector(el)

  const fragment = document.createDocumentFragment()

  let child = null
  while ((child = vm.$el.firstChild)) {
    fragment.appendChild(child)
  }

  function replace(el) {
    ;[...el.childNodes].forEach(node => {
      const txt = node.textContent
      const reg = /\{\{(.*?)\}\}/g

      if (node.nodeType === 1) {
        console.log(node)
        const nodeAttr = node.attributes
        Array.from(nodeAttr).forEach(attr => {
          const { name, value } = attr
          if (name.includes('v-')) {
            node.value = vm[value]
          }
          new Watcher(vm, value, val => node.value && (node.value = val))

          node.addEventListener('input', e => {
            vm[value] = e.target.value
          })
        })
      }

      if (node.nodeType === 3 && reg.test(txt)) {
        !(function replaceTxt() {
          node.textContent = txt.replace(reg, (matched, placeholder) => {
            //console.log(placeholder);   // 匹配到的分组 如：song, album.name, singer...

            new Watcher(vm, placeholder, replaceTxt) // 监听变化，重新进行匹配替换内容

            return placeholder.split('.').reduce((val, key) => val[key.trim()], vm)
          })
        })()
      }

      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }

  replace(fragment)

  vm.$el.appendChild(fragment)
}

// 发布订阅模式  订阅和发布 如[fn1, fn2, fn3]
function Dep() {
  // 一个数组(存放函数的事件池)
  this.subs = []
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub)
  },
  notify() {
    // 绑定的方法，都有一个update方法
    this.subs.forEach(sub => sub.update())
  },
}

function Watcher(vm, exp, fn) {
  this.vm = vm
  this.exp = exp
  this.fn = fn

  Dep.target = this
  const val = exp.split('.').reduce((val, key) => val[key.trim()], vm)
  Dep.target = null
}

Watcher.prototype.update = function () {
  const val = this.exp.split('.').reduce((val, key) => val[key.trim()], this.vm)
  this.fn(val)
}
