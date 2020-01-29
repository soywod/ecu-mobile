import React, {FC, createContext, useMemo, useContext, useEffect, useState} from "react"
import isEqual from "lodash/fp/isEqual"
import noop from "lodash/fp/noop"

import {User as FirebaseUser} from "../app/firebase"
import {User as FirestoreUser} from "./model"
import $auth from "./service"

type NotInitialized = {
  initialized: false
}

type NotAuthenticated = {
  initialized: true
  authenticated: false
}

type Authenticated = {
  initialized: true
  authenticated: true
  fbUser: FirebaseUser
  fsUser: FirestoreUser
}

type AuthState = NotInitialized | NotAuthenticated | Authenticated
type AuthDispatch = {
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const emptyState: AuthState = {initialized: false}

const AuthContextState = createContext<AuthState>(emptyState)
const AuthContextDispatch = createContext<AuthDispatch>({
  setAuth: noop,
  signIn: Promise.resolve,
  signInWithGoogle: Promise.resolve,
  signOut: Promise.resolve,
})

export const useAuthState = () => useContext(AuthContextState)
export const useAuthDispatch = () => useContext(AuthContextDispatch)
export const useAuth = () => {
  const auth = useAuthState()
  const dispatch = useAuthDispatch()
  return {auth, ...dispatch}
}

export const AuthContextProvider: FC = ({children}) => {
  const [auth, setAuth] = useState<AuthState>(emptyState)

  useEffect(() => {
    const unsubscribe = $auth.onAuthStateChanged((fbUser, fsUser) => {
      setAuth({
        initialized: true,
        authenticated: true,
        fbUser,
        fsUser,
      })
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (auth.initialized && auth.authenticated) {
      const unsubscribe = $auth.onUserChanged(auth.fsUser.id, fsUser => {
        if (!isEqual(fsUser, auth.fsUser)) {
          setAuth({
            initialized: true,
            authenticated: true,
            fbUser: auth.fbUser,
            fsUser,
          })
        }
      })

      return () => unsubscribe()
    }
  }, [auth])

  const dispatch = useMemo(
    () => ({
      setAuth,
      signIn: $auth.signIn,
      signInWithGoogle: $auth.signInWithGoogle,
      signOut: $auth.signOut,
    }),
    [],
  )

  return (
    <AuthContextDispatch.Provider value={dispatch}>
      <AuthContextState.Provider value={auth}>{children}</AuthContextState.Provider>
    </AuthContextDispatch.Provider>
  )
}

export default useAuth
