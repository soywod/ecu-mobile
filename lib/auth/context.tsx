import React, {FC, Reducer, Dispatch, createContext, useContext, useEffect, useReducer} from "react"
import isEqual from "lodash/fp/isEqual"
import noop from "lodash/fp/noop"

import {User as FirebaseUser} from "../app/firebase"
import {User as FirestoreUser} from "./model"
import $auth from "./service"

type AuthAction =
  | {
      type: "authenticate"
      fbUser: FirebaseUser
      fsUser: FirestoreUser
    }
  | {
      type: "logout"
    }

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
type AuthDispatch = Dispatch<AuthAction>

const emptyState: AuthState = {initialized: false}

const AuthContextState = createContext<AuthState>(emptyState)
const AuthContextDispatch = createContext<AuthDispatch>(noop)

const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "authenticate":
      return {
        initialized: true,
        authenticated: true,
        fbUser: action.fbUser,
        fsUser: action.fsUser,
      }

    case "logout":
      return {
        initialized: true,
        authenticated: false,
      }

    default:
      return state
  }
}

export const useAuthState = () => useContext(AuthContextState)
export const useAuthDispatch = () => useContext(AuthContextDispatch)
export const useAuth = () => {
  const state = useAuthState()
  const dispatch = useAuthDispatch()
  return {state, dispatch}
}

export const AuthContextProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, emptyState)

  useEffect(() => {
    const unsubscribe = $auth.onAuthStateChanged((fbUser, fsUser) => {
      dispatch({type: "authenticate", fbUser, fsUser})
    })

    return () => unsubscribe()
  }, [dispatch, state.initialized])

  useEffect(() => {
    if (state.initialized && state.authenticated) {
      const unsubscribe = $auth.onUserChanged(state.fsUser.id, fsUser => {
        if (!isEqual(fsUser, state.fsUser)) {
          dispatch({type: "authenticate", fbUser: state.fbUser, fsUser})
        }
      })

      return () => unsubscribe()
    }
  }, [state])

  return (
    <AuthContextDispatch.Provider value={dispatch}>
      <AuthContextState.Provider value={state}>{children}</AuthContextState.Provider>
    </AuthContextDispatch.Provider>
  )
}

export default useAuth
