<template>
<h1>a</h1>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useUsersStore } from '@/stores/UsersStore';
import { isAuthenticated, getUser } from '@/services/authentication';
import { addToUsers } from '@/services/saveduser';


const getUsers = useUsersStore()
const router = useRouter()
const toast = useToast()
const users = ref([])
const loading = ref(false)

onMounted(async () => {
    try {
        loading.value = true
        error.value = null

        await getUsers.getData()

        const user = getUser()

        
    }
})

</script>

<style>

</style>