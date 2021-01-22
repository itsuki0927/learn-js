//App.js
import React from 'react'
import connect from './components/connect'

const addCountAction = {
  type: 'incremented',
}

const mapStateToProps = state => {
  return {
    count: state.count,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addCount: () => {
      dispatch(addCountAction)
    },
    asyncAddCount: () => {
      setTimeout(() => {
        dispatch(addCountAction)
      }, 2000)
    },
  }
}

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        {this.props.count}
        <button onClick={() => this.props.addCount()}>增加</button>
        <button onClick={() => this.props.asyncAddCount()}>异步增加</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
