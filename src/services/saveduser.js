import { db } from '../firebase/config.js'
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'

// Add user to favorites
export const addToUsers = async (userId, user) => {
    try {
        // Changed 'user' to 'users' and consistent lowercase
        const favRef = doc(db, 'users', userId, 'savedUsers', user.id.toString())
        await setDoc(favRef, user)
        return { ok: true }
    } catch (error) {
        console.error('Error adding user:', error)
        return { ok: false, error }
    }
}

// Get all saved users
export const getUsers = async (userId) => {
    try {
        const favsCollection = collection(db, 'users', userId, 'savedUsers')
        const snapshot = await getDocs(favsCollection)
        const favorites = snapshot.docs.map(doc => doc.data())
        return { ok: true, favorites }
    } catch (error) {
        console.error('Error getting users:', error)
        return { ok: false, favorites: [] }
    }
}
