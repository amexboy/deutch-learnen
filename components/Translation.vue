<template>
  <div v-if="translationData">
    <!-- Word header with grammatical info -->
    <div v-for="entry in getEntries()" :key="entry.id" class="mb-6">
      <div class="text-lg font-medium" v-html="entry.headword_full"></div>
      
      <div v-for="(arab, index) in entry.arabs" :key="index" class="mt-4">
        <div v-for="(trans, tIndex) in arab.translations" :key="tIndex" class="mb-3">
          <!-- Grammar pattern -->
          <div v-if="trans.source.includes('idiom_proverb')" 
               class="text-blue-800 mb-1" 
               v-html="trans.source">
          </div>
          
          <!-- Definition -->
          <div v-if="trans.source.includes('definition') || trans.source.includes('sense')" 
               class="text-gray-600 mb-1" 
               v-html="trans.source">
          </div>
          
          <!-- Examples -->
          <div v-if="trans.source.includes('example')" 
               class="pl-4 border-l-2 border-gray-200" 
               v-html="trans.source">
          </div>
        </div>
      </div>
    </div>

    <!-- Related words -->
    <div v-if="getRelatedWords().length" class="mt-6 pt-4 border-t border-gray-200">
      <h4 class="text-sm text-gray-600 mb-2">Related Words:</h4>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="word in getRelatedWords()" 
          :key="word"
          class="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          @click="$emit('word-click', word)"
        >
          {{ word }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  translationData: Object
})

const emit = defineEmits(['word-click'])

const getEntries = () => {
  return props.translationData?.dictionary?.result[0]?.content[0]?.hits
    ?.filter(hit => hit.type_hint === 'entry')
    ?.flatMap(entry => entry.roms) || []
}

const getRelatedWords = () => {
  const contexts = props.translationData?.dictionary?.result[0]?.content[0]?.hits
    ?.filter(hit => hit.type_hint === 'alphabetical_context')
  
  return [...new Set(contexts?.flatMap(context => context.headwords || []))] || []
}
</script>

<style scoped>
:deep(.genus) { color: #4A5568; }
:deep(.wordclass) { color: #2C5282; }
:deep(.example) { color: #2D3748; }
:deep(.idiom_proverb) { color: #2B6CB0; }
:deep(.definition), :deep(.sense) { color: #4A5568; font-style: italic; }
:deep(acronym) { text-decoration: none; border-bottom: 1px dotted #CBD5E0; }
</style>