<template>
   <div class="fixed inset-0 bg-black/50 flex items-end justify-center z-50" @click="handleOutsideClick">
     <div class="w-full max-w-3xl bg-white rounded-t-xl max-h-[80vh] overflow-y-auto" ref="modalContent">
       <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold font-sans">{{ word }}</h2>
          <button @click="$emit('close')" class="hover:bg-gray-100 p-2 rounded-full">
            <X :size="24" />
          </button>
        </div>

        <div v-if="loading" class="py-8 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>

        <div v-else-if="wordData" >
          <nav class="flex border-b mb-6">
            <button 
                v-for="tab in availableTabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-4 py-2 -mb-px font-medium transition-colors flex items-center gap-2"
                :class="[
                activeTab === tab.id 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
            >
                <component :is="tab.icon" class="w-4 h-4" />
                {{ tab.label }}
            </button>
        </nav>

          <div class="prose max-w-none">
            <div v-if="activeTab === 'definitions'" >
              <Translation :translation-data="wordData?.definitions" />
            </div>
            <div v-if="activeTab === 'conjugation'">
              <Conjugation :conjugation-data="wordData?.conjugation" />
            </div>
            <div v-if="activeTab === 'examples'" >
              <Examples :examples="wordData?.examples" />
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center text-gray-500">
          No data found for this word
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { X, Book, ListChecks, BookOpen } from 'lucide-vue-next'
import { useDictionaryStore } from '../stores/dictionary'

const props = defineProps(['word'])
const emit = defineEmits(['close'])

const store = useDictionaryStore()
const activeTab = ref('definitions')
const loading = ref(true)
const wordData = ref(null)

const tabs = [
  { id: 'definitions', label: 'Definition', icon: Book },
  { id: 'conjugation', label: 'Conjugation', icon: ListChecks },
  { id: 'examples', label: 'Examples', icon: BookOpen }
]

onMounted(async () => {
  try {
    const [definitions, conjugation, examples] = await Promise.all([
      store.getWord(props.word),
      store.getConjugation(props.word),
      store.getExamples(props.word)
    ])
    wordData.value = { definitions, conjugation, examples }
  } catch (error) {
    console.error('Failed to fetch word data:', error)
  } finally {
    loading.value = false
  }
})

const allTabs = [
 { id: 'definitions', label: 'Definition', icon: Book },
 { id: 'conjugation', label: 'Conjugation', icon: ListChecks, requiresConjugation: true },
 { id: 'examples', label: 'Examples', icon: BookOpen }
]

const availableTabs = computed(() => 
 allTabs.filter(tab => 
   !tab.requiresConjugation || wordData.value?.definitions?.dictionary?.content?.flections?.conjugation
 )
)


const modalContent = ref(null)

function handleOutsideClick(e) {
 if (!modalContent.value?.contains(e.target)) {
   emit('close')
 }
}
</script>