<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, Bookmark } from 'lucide-vue-next'
import { useDictionaryStore } from './stores/dictionary'

const store = useDictionaryStore()
const fontSize = ref(18)
const selectedWord = ref(null)
const sampleText = `
Ein junger Astronom saß spät in der kalten Nacht am Teleskop. Max Schmidt war müde, aber seine Augen blieben wach. Er suchte nach etwas Besonderem im dunklen Himmel.

Plötzlich sah er ein schwaches Licht. Das war anders als die normalen hellen Sterne. Er machte schnell Aufnahmen und rief seine alte Professorin an. Sie kam sofort zum Observatorium.

Die kluge Wissenschaftlerin wurde sehr aufgeregt. Sie hatten ein neues schwarzes Loch gefunden! Es war klein aber stark und zog nahegelegene Sterne an. Die Entdeckung war wichtig für die moderne Physik.

Das interessante Phänomen war einzigartig. Das schwarze Loch bewegte sich schneller als andere. Seine hohe Geschwindigkeit war erstaunlich und gefährlich für sein Sternsystem.

Internationale Forscher wurden aufmerksam. Sie schickten große Teleskope in den tiefen Weltraum. Die wertvollen Daten zeigten etwas Unmögliches - das schwarze Loch schien zu verschwinden und wieder zu erscheinen.

Diese seltsame Entdeckung veränderte unser Verständnis der Schwerkraft. Max wurde berühmt in der wissenschaftlichen Welt. Seine fleißige Arbeit öffnete neue Türen für die weitere Forschung des Universums.
`

const words = computed(() => 
  sampleText.split(' ').map(word => ({
    original: word,
    clean: word.replace(/[.,!?„"]/g, '')
  }))
)

const lastClickedIndex = ref(null)

const displayWord = async (word, index) => {
  selectedWord.value = word
  lastClickedIndex.value = index
}

const close = () => {
    selectedWord.value = null
    const element = document.getElementById(`word-${lastClickedIndex.value}`)
    if (element) {
        element.classList.add('blink-animation')
        setTimeout(() => element.classList.remove('blink-animation'), 2000)
    }
}

const isInDictionary = (word) => {
  return ['widmen', 'Adventskalender'].includes(word)
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
            :id="`word-${index}`"
            class="cursor-pointer inline-block mr-1 hover:bg-gray-100"
            :class="{'bg-blue-100': isInDictionary(word.clean)}" 
            @click="displayWord(word.clean, index)"
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
             @close="close"
            />
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<style>
@keyframes blink {
  0%, 100% { background-color: transparent; }
  25%, 75% { background-color: rgb(219 234 254); }
}
.blink-animation {
  animation: blink 1s ease-in-out 2;
}
</style>
