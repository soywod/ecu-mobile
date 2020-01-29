import {DateTime} from "luxon"
import isEmpty from "lodash/fp/isEmpty"

import firebase, {User as FirebaseUser, auth, firestore} from "../app/firebase"
import {User as FirestoreUser, emptyUser} from "./model"

function _register(user: FirebaseUser) {
  return firestore("users", user.uid).set({
    id: user.uid,
    type: "authenticated",
    email: user.email,
    createdAt: DateTime.utc().toJSDate(),
  })
}

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

export async function signIn(email: string, password: string) {
  const {user} = await auth.signInWithEmailAndPassword(email, password)
  if (!user) throw new Error("auth/user-not-found")
  const fsUser = await firestore("users", user.uid).get()
  if (!fsUser.exists) await _register(user)
}

export async function signInWithGoogle() {
  const provider = firebase.auth.GoogleAuthProvider
  const {user} = await auth.signInWithPopup(provider)
  if (!user) throw new Error("auth/user-not-found")
  const fsUser = await firestore("users", user.uid).get()
  if (!fsUser.exists) await _register(user)
}

export async function signOut() {
  await auth.signOut()
}

export default {
  onAuthStateChanged,
  onUserChanged,
  signIn,
  signInWithGoogle,
  signOut,
}
