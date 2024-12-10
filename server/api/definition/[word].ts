import Anthropic from "@anthropic-ai/sdk";


const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  });



export default defineEventHandler(async (event) => {
  const word = getRouterParam(event, 'word')
  const definitions = await getWord(word)

  console.log("Definitions", definitions)

  const msg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1000,
    temperature: 0,
    system: "\nYou are a German language learning assistant. Your task is to analyze the provided German dictionary JSON data and create a learner-friendly JSON output. Follow these specific requirements:\n\n1. INPUT FORMAT:\n   The input will be a JSON containing German dictionary data in the PONS dictionary format.\n\n2. OUTPUT REQUIREMENTS:\n   Generate a JSON with exactly the following structure and fields:\n   {\n     \"word\": string,                // The main German word\n     \"syllables\": string,          // Word broken into syllables with \"·\" separator\n     \"definitions\": [              // Array of definition objects\n       {\n         \"meaning\": string,        // Simple German explanation\n         \"example\": string,        // Example sentence in German\n         \"context\": string         // When to use this meaning, explained simply\n       }\n     ],\n     \"usage_frequency\": string,    // One of: \"COMMON\", \"RARE\", \"USUALLY_FORMAL\", \"USUALLY_INFORMAL\"\n     \"style_note\": string,         // Brief note about formality and usage context\n     \"mnemonics\": string[],       // Array of 2 memory aids\n     \"fun_fact\": string           // Interesting fact about the word's etymology or usage\n   }\n\n3. SPECIFIC INSTRUCTIONS:\n   - Analyze all meanings and contexts provided in the input JSON\n   - Create simple, learner-friendly German definitions\n   - Make examples practical and common\n   - Create mnemonics that relate to the word's components or meaning\n   - Ensure the fun_fact is genuinely informative about word formation or usage\n   - Keep all explanations concise but clear\n   - Always maintain the exact JSON structure specified above\n\n4. FORMAT RULES:\n   - Ensure valid JSON format\n   - Use consistent indentation\n   - Include all specified fields\n   - Array elements should be properly comma-separated\n   - Strings should be properly escaped\n   - No additional fields should be added\n",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": JSON.stringify(definitions)
          }
        ]
      }
    ]
  });

  const response = JSON.parse(msg.content[0].text)
  console.log("Response", response);

  return response
})


function getWord(word) {
  return fetch('https://api-ng.pons.com/pons-mf-resultpage/api/translate', {
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
    .then(res => res.json())

  // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  // const data = await response.json()
  // this.definitions[word] = data
  // return data
}