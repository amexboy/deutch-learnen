<template>
 <div v-if="conjugationData" class="space-y-4">
   <!-- Filter buttons -->
   <div class="flex gap-2 flex-wrap">
     <button 
       v-for="mood in moods"
       :key="mood"
       @click="selectedMood = mood"
       class="px-3 py-1 rounded text-sm"
       :class="selectedMood === mood ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
     >
       {{ mood }}
     </button>
   </div>

   <!-- Conjugation tables -->
   <div v-for="section in filteredSections" :key="section.header">
     <div v-for="group in section.groups" :key="group.id">
       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div v-for="table in group.tables" :key="table.header" class="border rounded">
           <div class="bg-gray-50 px-3 py-1.5 text-sm font-medium border-b">
             {{ table.header || section.header }}
           </div>
           
           <table class="w-full text-sm">
             <tbody>
               <tr v-for="(row, i) in table.rows" 
                   :key="i"
                   class="border-b last:border-0"
               >
                 <td v-for="(cell, j) in row.cells" 
                     :key="j"
                     class="py-1 px-2"
                     :class="{'font-medium': j === 0}"
                     v-html="cell.content"
                 ></td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
 conjugationData: Object
})

const selectedMood = ref('Indikativ')
const moods = computed(() => 
 props.conjugationData?.sections.map(s => s.header) || []
)

const filteredSections = computed(() => 
 props.conjugationData?.sections.filter(s => s.header === selectedMood.value) || []
)
</script>

