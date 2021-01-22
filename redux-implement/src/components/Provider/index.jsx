import React, { createContext } from 'react'

export const StoreProvider = createContext()

const Provider = ({ children, store }) => {
  return <StoreProvider.Provider value={{ store }}>{children}</StoreProvider.Provider>
}

export default Provider
