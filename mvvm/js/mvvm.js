// 数据劫持
// 数据代理
// 数据编译
// 发布订阅
// 数据更新视图
// 双向数据绑定
function Mvvm(options = {}) {
  this.$options = options
  const data = (this._data = this.$options.data)

  Object.keys(data).forEach(key => this._proxyData(key))

  observe(data, this)

  this.$compile = new Compile(options.el || document.body, this)
}

Mvvm.prototype._proxyData = function (key, setter, getter) {
  setter =
    setter ||
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key] = newVal
      },
    })
}
