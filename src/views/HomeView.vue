<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Users</h1>
            <p class="text-gray-600">Browse and save your favorite users</p>
          </div>
          <div class="flex gap-4">
            <router-link
              to="/dashboard"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <i class="fas fa-th-large mr-2"></i>Dashboard
            </router-link>
            <button
              @click="handleLogout"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
        <p class="text-gray-600 text-lg">Loading users...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-3"></i>
        <p class="text-red-700 font-semibold">{{ error }}</p>
      </div>

      <!-- Users Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="user in getUsers.Users"
          :key="user.id"
          class="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-105"
        >
          <div class="p-6">
            <!-- User Avatar -->
            <div class="flex justify-center mb-4">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {{ getUserInitials(user) }}
              </div>
            </div>

            <!-- User Info -->
            <div class="text-center mb-4">
              <h3 class="text-xl font-bold text-gray-800 mb-1">
                {{ user.firstName }} {{ user.lastName }}
              </h3>
              <p class="text-gray-500 text-sm mb-2">
                <i class="fas fa-envelope mr-1"></i>{{ user.email }}
              </p>
              <p class="text-gray-500 text-sm" v-if="user.phone">
                <i class="fas fa-phone mr-1"></i>{{ user.phone }}
              </p>
            </div>

            <!-- User Details -->
            <div class="space-y-2 mb-4 text-sm">
              <div class="flex items-center text-gray-600" v-if="user.company">
                <i class="fas fa-briefcase w-5 mr-2 text-blue-500"></i>
                <span>{{ user.company.name || 'N/A' }}</span>
              </div>
              <div class="flex items-center text-gray-600" v-if="user.address">
                <i class="fas fa-map-marker-alt w-5 mr-2 text-red-500"></i>
                <span>{{ user.address.city || 'N/A' }}</span>
              </div>
            </div>

            <!-- Save Button -->
            <button
              @click="toggleSaveUser(user)"
              :class="[
                'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105',
                user.isInDB
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              ]"
            >
              <i :class="['fas mr-2', user.isInDB ? 'fa-check' : 'fa-heart']"></i>
              {{ user.isInDB ? 'Saved' : 'Save User' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && getUsers.Users.length === 0" class="text-center py-20">
        <i class="fas fa-users text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-xl">No users found</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUsersStore } from '@/stores/UsersStore'
import { getUser, logout } from '@/services/authentication'
import { addToUsers } from '@/services/saveduser'

const getUsers = useUsersStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const error = ref(null)
const currentUser = ref(null)

const getUserInitials = (user) => {
  const first = user.firstName ? user.firstName.charAt(0) : ''
  const last = user.lastName ? user.lastName.charAt(0) : ''
  return first + last || '??'
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    const userRef = getUser()
    currentUser.value = userRef.value

    if (!currentUser.value) {
      router.push('/auth')
      return
    }

    await getUsers.getData()

    toast.success(`Welcome, ${currentUser.value.email}!`)
    loading.value = false
  } catch (err) {
    console.error('Error loading users:', err)
    error.value = 'Failed to load users. Please try again.'
    loading.value = false
    toast.error('Failed to load users')
  }
})

const toggleSaveUser = async (user) => {
  try {
    if (!currentUser.value) {
      toast.error('You must be logged in')
      return
    }

    if (!user.isInDB) {
      const result = await addToUsers(currentUser.value.uid, user)
      if (result.ok) {
        toast.success(`${user.firstName} saved to your collection!`)
        await getUsers.getData()
      } else {
        toast.error('Failed to save user')
      }
    } else {
      toast.info('User already saved')
    }
  } catch (err) {
    console.error('Error toggling user save status:', err)
    toast.error('Failed to update user status')
  }
}

const handleLogout = async () => {
  try {
    const result = await logout()
    if (result.ok) {
      toast.success('Logged out successfully')
      router.push('/auth')
    } else {
      toast.error('Failed to logout')
    }
  } catch (err) {
    console.error('Error logging out:', err)
    toast.error('Failed to logout')
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
