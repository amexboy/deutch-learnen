import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useDictionaryStore = defineStore('dictionary', { 
  state: () => ({ 
    definitions: useLocalStorage('pons/dictionary/definitions', {}),
    conjugations: useLocalStorage('pons/dictionary/conjugations', {}),
    examples: useLocalStorage('pons/dictionary/examples', {}),
    loading: false
  }),

  actions: {
    async getWord( word) {
      if (this.definitions[word]) return this.definitions[word]
      
      try {
        const response = await fetch('https://api-ng.pons.com/pons-mf-resultpage/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language1: "de",
            language2: "",
            sourceLanguage: "de",
            query: word,
            dictionaryHint: "dede",
            locale: "en"
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        this.definitions[word] = data
        return data
      } catch (error) {
        console.error('Dictionary fetch failed:', error)
        return null
      }
    },

    async getConjugation( word) {
      if (this.conjugations[word]) return this.conjugations[word]
      
      try {
        const response = await fetch('https://api-ng.pons.com/pons-mf-resultpage/api/conjugation-table', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language: "de",
            headword: word,
            locale: "en"
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        this.conjugations[word] = data
        return data
      } catch (error) {
        console.error('Conjugation fetch failed:', error)
        return null
      }
    },

    async getExamples(word) {
      if (this.examples[word]) return this.examples[word]
      
      try {
        const response = await fetch('https://api-ng.pons.com/pons-mf-resultpage/api/example-sentences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language1: "de",
            language2: "",
            sourceLanguage: "de",
            query: word,
            dictionary: "dede",
            locale: "en"
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        this.examples[word] = data
        return data
      } catch (error) {
        console.error('Examples fetch failed:', error)
        return null
      }
    }
  }
})
