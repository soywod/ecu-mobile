import isEmpty from "lodash/fp/isEmpty"

import {User as FirebaseUser, auth, firestore} from "../app/firebase"
import {User as FirestoreUser, emptyUser} from "./model"

async function signInIfNull(maybeUser: FirebaseUser | null) {
  if (maybeUser) return maybeUser
  const user = await auth.signInAnonymously().then(res => res.user)
  if (!user) throw new Error("Anonymous authentication failed.")
  return user
}

async function createUserIfNull(id: string) {
  const ref = await firestore("users", id).get()
  const maybeUser = ref.data()
  if (!isEmpty(maybeUser)) return maybeUser as FirestoreUser
  const user: FirestoreUser = {...emptyUser, id}
  await firestore("users", user.id).set(user)
  return user
}

type AuthStateChangedHandler = (fbUser: FirebaseUser, fsUser: FirestoreUser) => void
export function onAuthStateChanged(handler: AuthStateChangedHandler) {
  return auth.onAuthStateChanged(async maybeFbUser => {
    const fbUser = await signInIfNull(maybeFbUser)
    const fsUser = await createUserIfNull(fbUser.uid)
    handler(fbUser, fsUser)
  })
}

type UserChangedHandler = (fsUser: FirestoreUser) => void
export function onUserChanged(id: string, handler: UserChangedHandler) {
  return firestore("users", id).onSnapshot(ref => handler({...emptyUser, ...ref.data(), id}))
}

export default {
  onAuthStateChanged,
  onUserChanged,
}
