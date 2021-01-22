import React, { useContext, useEffect, useState } from 'react'
import { StoreProvider } from '../Provider'

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  const Connect = props => {
    const { store } = useContext(StoreProvider)
    const [, forceUpdate] = useState({})
    const handleStoreHandle = () => forceUpdate({})

    console.log('hook store:', store)
    useEffect(() => {
      store.subscribe(handleStoreHandle)
    }, [])

    return (
      <Component
        {...props}
        {...mapDispatchToProps(store?.dispatch)}
        {...mapStateToProps(store?.getState())}
      />
    )
  }

  return Connect
}

export default connect
