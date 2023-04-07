import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  setDoc,
  getDoc,
  Timestamp,
  runTransaction
} from 'firebase/firestore'
import appconfig from '@/config'

// initialize firebase connection
// since this is a module these will run once at the start
const firebaseApp = initializeApp(appconfig.firebaseConfig)
const db = getFirestore(firebaseApp)
let mode = 'real'
if (appconfig.mode === 'development') {
  mode = 'testing'
}

export const fsnow = () => Timestamp.now()

// create a collection
export const updateSubjectDataRecord = (data, docid) => {
  // is it weird to have a aync method that doesn't return anything?
  try {
    const docRef = doc(db, `${mode}/${appconfig.project_ref}/data/`, docid)
    setDoc(docRef, data, {
      merge: true,
    })
  } catch (e) {
    console.error('Error updating document', e)
  }
}

export const loadDoc = async (docid) => {
  const docRef = doc(db, `${mode}/${appconfig.project_ref}/data/`, docid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    // console.log('Document data:', data)
    return data
  }
  // doc.data() will be undefined in this case
  console.log('No such document!')
  return undefined
}

export const createDoc = async (data, seedid, partnum) => {
  try {
    const expRef = doc(db, mode, appconfig.project_ref)
    await setDoc(
      expRef,
      {
        project_name: appconfig.project_name,
        project_ref: appconfig.project_ref,
        code_name: appconfig.code_name,
        code_name_url: appconfig.code_name_url,
      },
      { merge: true }
    )
    console.log(
      'Document written with ID: ',
      `${mode}/${appconfig.project_ref}`
    )

    // Add a new document with a generated id.
    // const docRef = await addDoc(
    //   collection(db, `${mode}/${appconfig.project_ref}/data`),
    //   data
    // )

    // Append the participnt number to the end of the docID -- this should ALWAYS make a unique record
    const fulldocid = `${seedid}-p${partnum}`
    const docRef = doc(db, `${mode}/${appconfig.project_ref}/data`, fulldocid)
    const docSnap = await getDoc(docRef);

    // however, we'll still check to make sure the record doesn't already exist. If it does, we append override, but any additional overrides with same id and participant will overwrite the data
    if (docSnap.exists()) {
      await setDoc(doc(db, `${mode}/${appconfig.project_ref}/data`, `${fulldocid  }-override`), data);
      console.log('Document written with ID: ', `${fulldocid  }-override`)
      return `${fulldocid  }-override`
    }
    // otherwise, we create a document with the specified docID 
      await setDoc(doc(db, `${mode}/${appconfig.project_ref}/data`, fulldocid), data);
      console.log('Document written with ID: ', fulldocid)
      return fulldocid
    
  } catch (e) {
    console.error('Error adding document: ', e)
    return null
  }
}

export const updateExperimentCounter = async (counter) => {
  const docRef = doc(db, `${mode}/${appconfig.project_ref}/counters/`, counter)

  let newCounter = null;
    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          newCounter = 0
        } else{
          newCounter = docSnap.data().n + 1;
        }
        transaction.set(docRef, { n: newCounter }, {merge: true});
      });
      console.log("New participant number is: ", newCounter);
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
    return newCounter
}

export const balancedAssignConditions = async (conditionDict) => {
  // get keys from conditionDict
  const keys = Object.keys(conditionDict)
  
  // make a list of docRefs for each key in keys
  const docRefs = keys.map((keyCond) => doc(db, `${mode}/${appconfig.project_ref}/counters/`, keyCond))

  try {
    const selectedConditions = await runTransaction(db, async (transaction) => {

      // for each docRef, get the data
      const docSnaps = await Promise.all(docRefs.map((docRef) => transaction.get(docRef)))

      // for each docSnap, see if it exists. 
      // If it doesn't, choose a random condition from the list of conditions for that key
      const output = docSnaps.map((docSnap) => {
        const newCondCounter = {}
        if (!docSnap.exists()) {
          const conditions = conditionDict[docSnap.id]
          const randomIndex = Math.floor(Math.random() * conditions.length)
          const minCondition = conditions[randomIndex]
          // make incremented counter
          conditions.forEach((condition) => {
            newCondCounter[condition] = 0
          })
          newCondCounter[minCondition] += 1
          // return selected condition and new incremented counter
          return {condName: docSnap.id, selectedCond: minCondition, newCounter: newCondCounter}
        } 
        //  otherwise, choose the condition with the lowest count
          const conditions = conditionDict[docSnap.id]
          const oldCondCounter = docSnap.data()
          const counts = conditions.map((cond) => oldCondCounter[cond])
          const min = Math.min(...Object.values(counts))
          const matchMinConds = Object.keys(oldCondCounter).filter((key) => oldCondCounter[key] === min)
          // (if there are more than one, pick one at random)
          const minCondition = matchMinConds[Math.floor(Math.random() * matchMinConds.length)]
          oldCondCounter[minCondition] += 1
          return {condName: docSnap.id, selectedCond: minCondition, newCounter: oldCondCounter}
      })
      // for each entry in output, update firestore with the newCounter and add selected cond to output dict
      const transactionOut = {}
      output.forEach((entry) => {
        transaction.set(doc(db, `${mode}/${appconfig.project_ref}/counters/`, entry.condName), entry.newCounter, {merge: true});
        transactionOut[entry.condName] = entry.selectedCond
      })
      // transaction.update(sfDocRef, { population: newPop });
      return transactionOut;
    });
    console.log("Conditions set to ", selectedConditions);
    return selectedConditions
  } catch (e) {
    console.error(e);
  }
  return null;
}

// export default createDoc
export default db

// const db_type = collection(db, mode) // or should this be collection?

// first get mode (development or live)
// next try to see if a document exists in that collection or not
// if not create one with the name of the experiment
// add code name to the document as well

// setDoc - write if document doesn’t exist, or replace if there is one at that name
// updateDoc - only overwrite fields you specify but error if doesn’t exist
// setDoc(,,{merge: true}) - create document if doesn’t exist, or update if it does
// each as async away or .then()
// addDoc gives you a random reference
// getDoc to read in with document snamshop
//   async function readASingleDocument() {
//     const mySnapshot = await getDoc(specialofthedata)
//     if (mydoc.exists()) {  // if it exists
//         const mydata = mydown.data() // method
//     }
// }
