import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

let firebaseApp
let db

export const createDoc = async (appconfig) => {
  // const smileStore = useSmileStore() // get access to the global store
  const firebaseApp = initializeApp(appconfig.firebaseConfig)
  const db = getFirestore(firebaseApp)

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    })
    console.log('Document written with ID: ', docRef.id)
    return docRef
  } catch (e) {
    console.error('Error adding document: ', e)
    return null
  }
}

// export default createDoc
export default db
