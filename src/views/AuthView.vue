<template>
<section id="auth" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
    <div v-if="isRegistered===false" class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p class="text-gray-500">Join us and start saving your favourite users</p>
        </div>

        <form @submit.prevent="registerUser" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope mr-2 text-blue-500"></i>Email
            </label>
            <input
                type="email"
                placeholder="Enter your email"
                v-model="email"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-2 text-blue-500"></i>Password
            </label>
            <input
                type="password"
                placeholder="Create a password"
                v-model="password"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
            <p class="text-xs text-gray-500 mt-1.5">Must be at least 6 characters in length</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-2 text-blue-500"></i>Confirm Password
            </label>
            <input
                type="password"
                placeholder="Confirm your password"
                v-model="confirmPassword"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-user-plus mr-2"></i>
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>

          <div class="pt-4 border-t border-gray-200">
            <div class="text-center">
              <p class="text-gray-600 inline">Already have an account? </p>
              <button
                  type="button"
                  @click="isRegistered=true"
                  class="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Login Form -->
    <div v-if="isRegistered===true" class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p class="text-gray-500">Sign in to view your favourite users</p>
        </div>

        <form @submit.prevent="activateSession" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope mr-2 text-blue-500"></i>Email
            </label>
            <input
                type="email"
                placeholder="Enter your email"
                v-model="email"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-2 text-blue-500"></i>Password
            </label>
            <input
                type="password"
                placeholder="Enter your password"
                v-model="password"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="pt-4 border-t border-gray-200">
            <div class="text-center">
              <p class="text-gray-600 inline">Don't have an account? </p>
              <button
                  type="button"
                  @click="isRegistered=false"
                  class="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { login, register, sendEmailVerificationDB } from '@/services/authentication';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = useRouter()
const toast = useToast()
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const error = ref("")
const success = ref("")
const isRegistered = ref(true)

const auth = getAuth()

onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user && !user.emailVerified) {
            await auth.signOut()
            toast.warning("Please verify email before logging in")
            router.push("/auth")
        }
    })
})


const registerUser = async () => {
    error.value = ''
    success.value = ''

    if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match"
        toast.error("Passwords do not match")
        return
    }

    if (password.value.length < 6) {
        error.value = "Password must be at least 6 characters long"
        toast.error = "Password must be at least 6 characters long"
        return
    }

    loading.value = true

    const result = await register(email.value, password.value)

    if (result.ok) {
        success.value = "User registered successfully"
        toast.success("User registered successfully")

        const verificationResult = await sendEmailVerificationDB(result.user.user)

        if (verificationResult.ok) {
            toast.success("Email verification sent please check your inbox")
        } else {
            toast.error("Error in sending email verification. please contact system administrator")
        }

        await auth.signOut()

        setTimeout(() => {
            isRegistered.value = true
            email.value = ''
            password.value = ''
            confirmPassword.value = ''
        }, 200)
    } else{
        error.value = result.error 
        toast.error("Registration failed")
    }

    loading.value = false

}

const activateSession = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

    const result = await login(email.value, password.value)

    if(!result.ok) {
        error.value = result.error
        toast.error("Please check your credentials and try again.")
        password.value = ''
        loading.value = false
        return
    }

    try{ 
        if (!result.user.emailVerified){
            await auth.signOut
            error.value = "Please verify your email and try again"
            toast.error("Please verify your email and try again")
            email.value = ''
            password.value = ''
            loading.value = false
            return
        }

        success.value = result.message
        toast.success("User login successful")
        setTimeout(() => {
            router.push("/")
        }, 200)
    } catch(error){
        console.error("login error", error)
        toast.error("An error has occurred while trying to login")
        await auth.signOut()
    }

    loading.value = false
}




</script>

<style>

</style>