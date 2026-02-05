import { db } from '../firebase/config.js'
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'

// Add character to favorites
export const addToUsers = async (userId, users) => {
    try {
        const favRef = doc(db, 'user', userId, 'users', users.id.toString())
        await setDoc(favRef, users)
        return { ok: true }
    } catch (error) {
        return { ok: false, error }
    }
}

    // Get all user favorites
export const getUsers = async (userId) => {
    try {
        const favsCollection = collection(db, 'users', userId, 'users')
        const snapshot = await getDocs(favsCollection)
        const favorites = snapshot.docs.map(doc => doc.data())
        return { ok: true, favorites }
    } catch (error) {
        return { ok: false, favorites: [] }
    }
}
