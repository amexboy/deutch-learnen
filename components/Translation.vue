<template>
  <div v-if="wordData" class="max-w-2xl mx-auto p-4">
    <!-- Word header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">{{ wordData.word }}</h1>
      <div class="text-lg text-gray-600 mb-4">{{ wordData.syllables }}</div>
      
      <!-- Usage frequency -->
      <div class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        {{ wordData.usage_frequency.toLowerCase() }}
      </div>
    </div>

    <!-- Definitions -->
    

    <!-- Style note -->
    <div v-if="wordData.style_note" class="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-medium mb-2">Style Note</h3>
      <p class="text-gray-600">{{ wordData.style_note }}</p>
    </div>

    <!-- Mnemonics -->
    <div v-if="wordData.mnemonics?.length" class="mt-8">
      <h3 class="font-medium mb-3">Memory Aids</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="(mnemonic, index) in wordData.mnemonics" 
            :key="index" 
            class="text-gray-600">
          {{ mnemonic }}
        </li>
      </ul>
    </div>

    <!-- Fun fact -->
    <div v-if="wordData.fun_fact" class="mt-8 p-4 bg-yellow-50 rounded-lg">
      <h3 class="font-medium mb-2">Fun Fact</h3>
      <p class="text-gray-600">{{ wordData.fun_fact }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  wordData: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.max-w-2xl {
  max-width: 42rem;
}
</style>