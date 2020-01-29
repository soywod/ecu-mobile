import React, {FC, createContext, useContext, useState} from "react"
import noop from "lodash/fp/noop"

type AsyncState = boolean
type AsyncDispatch = React.Dispatch<React.SetStateAction<AsyncState>>

const emptyState: AsyncState = false

const AsyncContextState = createContext<AsyncState>(emptyState)
const AsyncContextDispatch = createContext<AsyncDispatch>(noop)

export const useAsyncState = () => useContext(AsyncContextState)
export const useAsyncDispatch = () => useContext(AsyncContextDispatch)
export const useAsync = () => {
  const isLoading = useAsyncState()
  const setLoading = useAsyncDispatch()
  return {isLoading, setLoading}
}

export const AsyncContextProvider: FC = ({children}) => {
  const [isLoading, setLoading] = useState<AsyncState>(emptyState)

  return (
    <AsyncContextDispatch.Provider value={setLoading}>
      <AsyncContextState.Provider value={isLoading}>{children}</AsyncContextState.Provider>
    </AsyncContextDispatch.Provider>
  )
}

export default useAsync
