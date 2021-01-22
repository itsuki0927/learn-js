export const createStore = (reducer, heightener) => {
  if (heightener) {
    return heightener(createStore)(reducer)
  }
  let currentState = undefined
  const sub = []
  const getState = () => {
    return currentState
  }
  const dispatch = payload => {
    currentState = reducer(currentState, payload)
    sub.forEach(fn => fn())
  }
  const subscribe = fn => {
    sub.push(fn)
  }
  dispatch({ type: '@Init' })
  return { getState, dispatch, subscribe }
}

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

export const applyMiddlewares = (...middlewares) => createStore => reducer => {
  const store = createStore(reducer)
  let { getState, dispatch } = store
  const params = { getState, dispatch: action => dispatch(action) }

  const middlewareArr = middlewares.map(middleware => middleware(params))

  dispatch = compose(...middlewareArr)(dispatch)

  return { ...store, dispatch }
}

const logger = store => {
  const next = store.dispatch
  return action => {
    console.log('logger before:', store.getState())
    next(action)
    console.log('logger after:', store.getState())
  }
}

const thunk = store => {
  const next = store.dispatch
  return action => {
    return typeof action === 'function' ? action(store.dispatch) : next(action)
  }
}

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'incremented':
      return { count: state.count + 1 }
    case 'decremented':
      return { count: state.count - 1 }
    default:
      return state
  }
}

const store = createStore(counterReducer, applyMiddlewares(store, logger, thunk))

export default store
