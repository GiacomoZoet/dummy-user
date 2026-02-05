<script setup>
import { logout, getUser } from "@/services/authentication.js"
import { useToast } from "vue-toastification"
import { useRouter } from "vue-router"
import { ref } from "vue"

const router = useRouter()
const toast = useToast()
const user = getUser()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const signOut = async () => {
    toast.success("User logged out successfully.")
    isMobileMenuOpen.value = false
    setTimeout(async () => {
    await logout()
    router.push("/auth")
    }, 1000)
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}
</script>

<template>
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

            <div class="flex-shrink-0 flex items-center">
            <router-link
                to="/"
                class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300"
            >
                UserApp
            </router-link>
            </div>

            <div class="hidden md:flex items-center space-x-8">
            <router-link
                to="/"
                class="text-gray-900 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-indigo-50"
            >
                Home
            </router-link>
            <router-link
                to="/dashboard"
                class="text-gray-900 hover:text-indigo-600 font-medium px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-indigo-50"
            >
                Dashboard
            </router-link>
            </div>

            <div v-if="user" class="hidden md:flex items-center space-x-4">
            <div class="text-sm text-gray-700 font-medium hidden sm:block">
                Hi, {{ user.displayName || user.email?.split('@')[0] }}
            </div>
            <button
                @click="signOut"
                class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
            </button>
            </div>

            <div class="md:hidden flex items-center">
            <button
                @click="toggleMobileMenu"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
            >
                <svg class="h-6 w-6" :class="{ 'hidden': isMobileMenuOpen, 'block': !isMobileMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg class="h-6 w-6" :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
        </div>
        </div>

        <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link
                to="/"
                @click="closeMobileMenu"
                class="block text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-3 py-2 rounded-md text-base transition-colors duration-200"
            >
            Home
            </router-link>
            <router-link
                to="/workspace"
                @click="closeMobileMenu"
                class="block text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-3 py-2 rounded-md text-base transition-colors duration-200"
            >
            Workspace
            </router-link>
        </div>

        <div v-if="user" class="pt-4 pb-3 border-t border-gray-200">
            <div class="px-5 mb-3">
            <div class="text-sm text-gray-700 font-medium">
                Hi, {{ user.displayName || user.email?.split('@')[0] }}
            </div>
            </div>
            <div class="px-2">
            <button
                @click="signOut"
                class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
            </button>
            </div>
        </div>
        </div>
    </nav>
</template>
