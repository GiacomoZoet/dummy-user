import { db } from '@/firebase/config.js'
import { collection, doc, setDoc, deleteDoc, getDocs, getDoc , updateDoc} from 'firebase/firestore'

// Add task to todo list
export const addTodo = async (userId, todo) => {
    try {
        const taskRef = doc(db, 'todo', todo.id.toString())
        await setDoc(taskRef, todo)
        return { ok: true }
    } catch (error) {
        return { ok: false, error }
    }
}

// Get user todos
export const getTodos = async (userId) => {
    try {
        const todoCollection = collection(db, 'todo')
        const snapshot = await getDocs(todoCollection)

        const todos = snapshot.docs
            .map(doc => doc.data())
            .filter(todo => todo.assignedTo === userId)

        return { ok: true, todos }
    } catch (error) {
        console.error("getTodos error:", error);
        return { ok: false, todos: [], error }
    }
}


export const checkTodoExists = async (todoId) => {
    try {
        const taskRef = doc(db, 'todo', todoId.toString())
        const docSnap = await getDoc(taskRef)
        return docSnap.exists()
    } catch (error) {
        console.error("checkTodoExists error:", error)
        return false
    }
}


export const completeTodo = async (todoId) => {
    try {
        const taskRef = doc(db, 'todo', todoId.toString())
        await updateDoc(taskRef, {
            completed: true
        })
        return { ok: true }
    } catch (error) {
        console.error("completeTodo error:", error)
        return { ok: false, error }
    }
}