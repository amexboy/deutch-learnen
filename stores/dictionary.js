import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useDictionaryStore = defineStore('dictionary', {
    state: () => ({
        definitions: useLocalStorage('pons/dictionary/definitions', {}),
        conjugations: useLocalStorage('pons/dictionary/conjugations', {}),
        loading: false
    }),

    actions: {
        async getWord(word) {
            if (this.definitions[word]) return this.definitions[word]

            try {
                const response = await useFetch(`/api/definition/${word}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                // const data = await response.json()
                this.definitions[word] = response.data
                return data
            } catch (error) {
                console.error('Dictionary fetch failed:', error)
                return null
            }
        },

        async getConjugation(word) {
            try {
                const translationData = await this.getWord(word)

                // Check if conjugation is available
                if (!translationData?.dictionary?.content?.flections?.conjugation) {
                    return null;
                }

                const headword = this.getHeadword(translationData)
                if (!headword || this.conjugations[headword]) {
                    return this.conjugations[headword];
                }

                const response = await fetch('https://api-ng.pons.com/pons-mf-resultpage/api/conjugation-table', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: "de",
                        headword: headword,
                        locale: "en"
                    })
                })

                const data = await response.json()
                this.conjugations[headword] = data
                return data
            } catch (error) {
                console.error('Conjugation fetch failed:', error)
                return null
            }
        }
    }
})
