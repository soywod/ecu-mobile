import * as firebase from "react-native-firebase"

export type User = firebase.RNFirebase.User
export type Firestore = firebase.RNFirebase.firestore.Firestore
export type CollectionReference = firebase.RNFirebase.firestore.CollectionReference
export type DocumentReference = firebase.RNFirebase.firestore.DocumentReference

export const auth = firebase.auth()

export function firestore(): Firestore
export function firestore(col: string): CollectionReference
export function firestore(col: string, doc: string): DocumentReference
export function firestore(col?: string, doc?: string) {
  const firestore = firebase.firestore()
  if (!col) return firestore
  const db = firestore.collection(col)
  return doc ? db.doc(doc) : db
}

export default firebase
