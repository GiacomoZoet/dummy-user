<template>
  <section class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p class="text-gray-600">Your saved users collection</p>
          </div>
          <div class="flex gap-4">
            <router-link
              to="/"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <i class="fas fa-arrow-left mr-2"></i>Back to Users
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

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Total Users</p>
              <p class="text-3xl font-bold text-gray-800">{{ getUsers.Users.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Saved Users</p>
              <p class="text-3xl font-bold text-green-600">{{ savedUsersCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-heart text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium mb-1">Unsaved Users</p>
              <p class="text-3xl font-bold text-purple-600">{{ unsavedUsersCount }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user-plus text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-5xl text-purple-600 mb-4"></i>
        <p class="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-3"></i>
        <p class="text-red-700 font-semibold">{{ error }}</p>
      </div>

      <!-- Saved Users List -->
      <div v-else-if="savedUsers.length > 0" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h2 class="text-2xl font-bold text-white">
            <i class="fas fa-star mr-2"></i>Your Saved Users
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="user in savedUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                      {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4 text-gray-600">{{ user.phone }}</td>
                <td class="px-6 py-4 text-gray-600">{{ user.company?.name || 'N/A' }}</td>
                <td class="px-6 py-4 text-gray-600">{{ user.address?.city || 'N/A' }}</td>
                <td class="px-6 py-4">
                  <button
                    @click="removeUser(user)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <i class="fas fa-trash mr-1"></i>Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
        <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">No Saved Users Yet</h3>
        <p class="text-gray-500 mb-6">Start saving your favorite users from the home page</p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <i class="fas fa-arrow-left mr-2"></i>Browse Users
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUsersStore } from '@/stores/UsersStore'
import { removeFromUsers } from '@/services/saveduser'
import { getAuth } from 'firebase/auth'

const getUsers = useUsersStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const error = ref(null)
const auth = getAuth()

const savedUsers = computed(() => {
  return getUsers.Users.filter(user => user.isInDB)
})

const savedUsersCount = computed(() => savedUsers.value.length)
const unsavedUsersCount = computed(() => getUsers.Users.length - savedUsersCount.value)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    await getUsers.getData()

    loading.value = false
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'Failed to load dashboard data. Please try again.'
    loading.value = false
    toast.error('Failed to load dashboard')
  }
})

const removeUser = async (user) => {
  try {
    await removeFromUsers(user.id)
    toast.success(`${user.firstName} removed from saved users`)
    await getUsers.getData()
  } catch (err) {
    console.error('Error removing user:', err)
    toast.error('Failed to remove user')
  }
}

const handleLogout = async () => {
  try {
    await auth.signOut()
    toast.success('Logged out successfully')
    router.push('/auth')
  } catch (err) {
    console.error('Error logging out:', err)
    toast.error('Failed to logout')
  }
}
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>