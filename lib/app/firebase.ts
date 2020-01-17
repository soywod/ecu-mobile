import firebase from "react-native-firebase"

/* import "firebase/auth" */

/* firebase.initializeApp({ */
/*   apiKey: FIREBASE_API_KEY, */
/*   authDomain: FIREBASE_AUTH_DOMAIN, */
/*   databaseURL: FIREBASE_DATABASE_URL, */
/*   projectId: FIREBASE_PROJECT_ID, */
/*   storageBucket: FIREBASE_STORAGE_BUCKET, */
/*   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID, */
/*   appId: FIREBASE_APP_ID, */
/* }) */

/* export const auth = firebase.auth() */

/* export function firestore(): firebase.firestore.Firestore */
/* export function firestore(coll: string): firebase.firestore.CollectionReference */
/* export function firestore(coll: string, doc: string): firebase.firestore.DocumentReference */
/* export function firestore(coll?: string, doc?: string) { */
/*   const firestore = firebase.firestore() */
/*   if (!coll) return firestore */
/*   const db = firestore.collection(coll) */
/*   return doc ? db.doc(doc) : db */
/* } */

export default firebase
