import {DateTime} from "luxon"

import firebase, {User as FirebaseUser, auth, firestore} from "../firebase"
import {User as FirestoreUser, emptyUser} from "./model"

async function createFirestoreUser(fbUser: FirebaseUser) {
  const fsUser: FirestoreUser = {
    id: fbUser.uid,
    type: "authenticated",
    email: fbUser.email || "",
    createdAt: DateTime.utc(),
  }

  await firestore("users", fbUser.uid).set({
    ...fsUser,
    email: fbUser.email,
    createdAt: DateTime.utc().toJSDate(),
  })

  return fsUser
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
  if (ref.exists) return maybeUser as FirestoreUser
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
  if (!auth.currentUser) throw new Error("User not found")
  const creds = firebase.auth.EmailAuthProvider.credential(email, password)

  try {
    const {user: fbUser} = await auth.signInWithCredential(creds)
    const fbUserRef = await firestore("users", fbUser.uid).get()
    const fsUser = fbUserRef.exists
      ? (fbUserRef.data() as FirestoreUser)
      : await createFirestoreUser(fbUser)
    return {fbUser, fsUser}
  } catch (err) {
    switch (err.code) {
      case "auth/user-not-found": {
        const {user: fbUser} = await auth.currentUser.linkWithCredential(creds)
        const fsUser = await createFirestoreUser(fbUser)
        return {fbUser, fsUser}
      }

      default: {
        throw err
      }
    }
  }
}

export async function signInWithGoogle() {
  const provider = firebase.auth.GoogleAuthProvider
  const {user} = await auth.signInWithPopup(provider)
  if (!user) throw new Error("auth/user-not-found")
  const fsUser = await firestore("users", user.uid).get()
  if (!fsUser.exists) await createFirestoreUser(user)
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
