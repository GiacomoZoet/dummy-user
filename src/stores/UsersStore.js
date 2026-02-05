import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'
import { getUser } from '@/services/authentication'

export const useUsersStore = defineStore('Users', () => {
    let Users = ref([])

    let getData = async () => {
        try {
            // Fetch users from DummyJSON API
            const response = await axios.get('https://dummyjson.com/users')
            const apiUsers = response.data.users

            // Get current user to check their saved users
            const currentUserRef = getUser()
            const currentUser = currentUserRef.value

            let dbUsers = []
            
            // Only fetch saved users if user is authenticated
            if (currentUser && currentUser.uid) {
                try {
                    // Fetch saved users from the user's subcollection
                    const savedUsersCollection = collection(db, 'users', currentUser.uid, 'savedUsers')
                    const snapshot = await getDocs(savedUsersCollection)
                    dbUsers = snapshot.docs.map(doc => doc.data())
                } catch (firestoreError) {
                    console.log('Could not fetch saved users (may not exist yet):', firestoreError.message)
                    // Continue without saved users data
                }
            }

            // Map API users and check if they're saved in DB
            Users.value = apiUsers.map(apiUser => {
                const dbUser = dbUsers.find(db => db.id === apiUser.id)
                return {
                    ...apiUser,
                    isInDB: !!dbUser
                }
            })

            console.log('Users loaded:', Users.value.length)
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    }

    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return { count, doubleCount, increment, getData, Users }
})
