<template>
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
        <!-- users Title -->
        <h1
            class="text-xl font-semibold mb-3"
        >
        {{ users.users }}
        </h1>

        <!-- Buttons -->
        <div class="flex gap-2">
        <!-- Add to users Button (Home page only) -->
        <button
            v-if="showAddButton && !users.completed"
            @click="handleAddusers"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
            Add to My users
        </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    users:{
        type: Object,
        required: true
    },
    showAddButton:{
        type: Boolean,
        default: true
    }
}) 

const emit = defineEmits(["add-to-users",])

const handleAddToUser = () => {
    console.log('Emitting', props.users)
    emit('add-to-users', props.users)
}




</script>

<style>

</style>