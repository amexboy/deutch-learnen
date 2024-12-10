<template>
   <div class="fixed inset-0 bg-black/50 flex items-end justify-center z-50" @click="handleOutsideClick">
     <div class="w-full max-w-3xl bg-white rounded-t-xl max-h-[80vh] overflow-y-auto" ref="modalContent">
       <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div class="mb-6">
          <h2 class="text-2xl font-bold font-sans">{{ word }}</h2>
                <div class="text-lg text-gray-600 mb-4">{{ wordData?.definitions?.syllables }}</div>
                
                <!-- Usage frequency -->
                <div class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {{ wordData?.definitions?.usage_frequency.toLowerCase() }}
                </div>
              </div>
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
              <div class="space-y-6">
                <div v-for="(def, index) in wordData?.definitions?.definitions" :key="index" class="pb-4">
                  <!-- Main meaning -->
                  <div class="text-gray-800 font-medium mb-2">{{ def.meaning }}</div>
                  
                  <!-- Example -->
                  <div class="pl-4 border-l-2 border-gray-200 mb-2 text-gray-600 italic">
                    {{ def.example }}
                  </div>
                  
                  <!-- Context -->
                  <div class="text-sm text-gray-500">
                    {{ def.context }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'conjugation'">
              <Conjugation :conjugation-data="wordData?.conjugation" />
            </div>
            <div v-if="activeTab === 'mnemonics'" >
               <div v-if="wordData?.definitions?.mnemonics?.length" class="mt-8">
                <h3 class="font-medium mb-3">Memory Aids</h3>
                <ul class="list-disc pl-5 space-y-2">
                  <li v-for="(mnemonic, index) in wordData?.definitions?.mnemonics" 
                      :key="index" 
                      class="text-gray-600">
                    {{ mnemonic }}
                  </li>
                </ul>
              </div>
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
  { id: 'mnemonics', label: 'Mnemonics', icon: BookOpen }
]

onMounted(async () => {
  try {
    const [definitions, conjugation] = await Promise.all([
      store.getWord(props.word),
      store.getConjugation(props.word)
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
 { id: 'mnemonics', label: 'Mnemonics', icon: BookOpen }
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