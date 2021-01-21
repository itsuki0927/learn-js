const updater = {
  textUpdater(node, value) {
    console.log('-----------------')
    console.log(node)
    console.log('value:', value)
    console.log('-----------------')
    node.textContent = value === undefined ? '' : value
  },
  htmlUpdater(node, value) {
    node.innerHTML = value === undefined ? '' : value
  },
  classUpdater(node, value, oldValue) {
    let className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    const space = className && String(value) ? ' ' : ''

    node.className = className + space + value
  },
  modalUpdater(node, value, oldValue) {
    node.value = value === undefined ? '' : value
  },
}

const compileUtil = {
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },
  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },
  class(node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },
  modal(node, vm, exp) {
    this.bind(node, vm, exp, 'modal')
    const val = this.__getVMVal(vm, exp)
    node.addEventListener('input', e => {
      const newVal = e.target.value
      if (val === newVal) return

      this.__setVMVal(vm, exp, newVal)
      val = newVal
    })
  },
  bind(node, vm, exp, dir) {
    const updaterFn = updater[`${dir}Updater`]
    updaterFn && updaterFn(node, this.__getVMVal(vm, exp))

    new Watcher(vm, exp, (value, oldValue) => {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },
  eventHandler(node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },
  __getVMVal(vm, exp) {
    return exp.split('.').reduce((acc, k) => acc[k.trim()], vm)
  },
  __setVMVal(vm, exp, val) {
    val = vm
    exp.split('.').forEach((k, i) => {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k]
      } else {
        val[k] = value
      }
    })
  },
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment()
    let child
    while ((child = el.firstChild)) {
      fragment.appendChild(child)
    }
    return fragment
  }
  init() {
    this.compileElement(this.$fragment)
  }
  compileElement(el) {
    const childNodes = [...el.childNodes]
    childNodes.forEach(node => {
      const text = node.textContent
      const reg = /\{\{(.*)\}\}/g

      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1.trim())
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }
  compile(node) {
    const nodeAttrs = [...node.attributes]
    nodeAttrs.forEach(attr => {
      const { name, value: exp } = attr
      if (this.isDirective(name)) {
        const dir = name.substring(2)
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }
        node.removeAttribute(name)
      }
    })
  }
  compileText(node, exp) {
    console.log(this)
    compileUtil.text(node, this.$vm, exp)
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }
  isEventDirective(dir) {
    return dir.indexOf('on') === 0
  }
}
