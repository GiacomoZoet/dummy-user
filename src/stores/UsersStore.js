import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'

export const useUsersStore = defineStore('Users', () => {
    let Users = ref([])

    let getData = async () => {
        try {
            const response = await axios.get('https://dummyjson.com/Users')
            const apiUsers = response.data.Users

            const UsersCollection = collection(db, 'Users')
            const snapshot = await getDocs(UsersCollection)
            const dbUsers = snapshot.docs.map(doc => doc.data())

            Users.value = apiUsers.map(apiUser => {
                const dbUser = dbUsers.find(db => db.id === apiUser.id)
                return {
                    ...apiUser,
                    completed: dbUser ? dbUser.completed : apiUser.completed,
                    isInDB: !!dbUser
                }
            })

            console.log('Users with DB status:', Users.value)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return { count, doubleCount, increment, getData, Users }
})
