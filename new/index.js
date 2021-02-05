// 学习new实现
function myNew(foo, ...args) {
  // 创建对象、继承该构造函数的原型
  const obj = Object.create(foo.prototype)
  // 绑定this
  const result = foo.apply(obj, args)
  // 如果构造函数有返回值则优先使用返回值
  return result && typeof result === 'object' ? result : obj
}
