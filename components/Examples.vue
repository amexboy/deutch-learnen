<template>
 <div v-if="examples?.length" class="space-y-4">
   <div class="grid gap-3">
     <div v-for="ex in examples" 
          :key="ex.example.id"
          class="bg-white p-3 rounded border hover:shadow-sm transition-shadow"
     >
       <div v-html="ex.example.source" class="text-sm leading-relaxed"></div>
     </div>
   </div>
 </div>
</template>

<script setup>
defineProps({
 examples: {
   type: Array,
   default: () => []
 }
})
</script>

<style scoped>
:deep(.example) {
 @apply text-gray-700;
}
:deep(.definition) {
 @apply text-gray-600 italic;
}
</style>