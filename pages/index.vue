<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, Bookmark } from 'lucide-vue-next'
import { useDictionaryStore } from './stores/dictionary'

const store = useDictionaryStore()
const fontSize = ref(18)
const selectedWord = ref(null)
const sampleText = `Für nicht wenige Menschen beginnen jetzt wieder einige der schönsten Wochen im Jahr: der Advent und dann natürlich das Fest. Wir widmen dem Phänomen ein ganzes Heft.`

const words = computed(() => 
  sampleText.split(' ').map(word => ({
    original: word,
    clean: word.replace(/[.,!?„"]/g, '')
  }))
)

const displayWord = async (word) => {
  selectedWord.value = word
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen font-serif">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <header class="bg-black text-white p-4 flex justify-between items-center font-sans">
        <button class="text-white">
          <ArrowLeft :size="24" />
        </button>
        <div class="flex gap-4 items-center">
          <button class="p-2 bg-gray-700 rounded" @click="fontSize -= 2">Aa</button>
          <button class="p-2" @click="fontSize += 2">+Aa</button>
          <button><Bookmark :size="24" /></button>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6">
        <article :style="{ fontSize: fontSize + 'px' }" class="leading-relaxed">
          <span 
            v-for="(word, index) in words"
            :key="index"
            class="cursor-pointer inline-block mr-1 hover:bg-gray-100"
            @click="displayWord(word.clean)"
          >
            {{ word.original }}
          </span>
        </article>
      </main>

      <!-- Dictionary Modal -->
      <Teleport to="body">
        <div v-if="selectedWord" class="fixed inset-0 bg-black bg-opacity-50 flex items-end">
          <div class="w-full bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
            <WordDetails 
              :word="selectedWord" 
              @close="selectedWord = null"
            />
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>
