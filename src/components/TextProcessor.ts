import axios from 'axios';
import { franc } from 'franc';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const TextProcessor = {
  detectLanguage: (text: string): string => {
    const detectedLang = franc(text);
    return detectedLang !== 'und' ? detectedLang : 'en'; // Default to English if undetermined
  },

  processText: async (inputText: string): Promise<{ text: string; language: string }> => {
    const detectedLanguage = TextProcessor.detectLanguage(inputText);
    
    try {
      // Step 1: Analyze input text for style, tone, and content
      const analysisResponse = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following text and provide a detailed breakdown of its writing style, tone, and content:

1. Writing Style:
   - Sentence structure (simple, complex, varied)
   - Paragraph length and structure
   - Vocabulary level (simple, advanced, technical)
   - Use of jargon or specialized terms
   - Formality level
   
2. Tone:
   - Overall emotional tone (formal, casual, humorous, serious, academic etc.)
   - Author's attitude towards the subject
   - Use of personal pronouns or perspective

3. Unique Characteristics:
   - Any distinctive features of the writing
   - Recurring patterns or phrases
   - Unusual word choices or expressions

Text to analyze:
"${inputText}"

Detailed analysis:`
                }
              ]
            }
          ]
        }
      );

      if (!analysisResponse.data.candidates || analysisResponse.data.candidates.length === 0) {
        throw new Error('No analysis response received from the API');
      }

      const analysis = analysisResponse.data.candidates[0].content.parts[0].text;

      // Step 2: Generate text with emulated style
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Rewrite the following text in the same language (${detectedLanguage}), strictly adhering to the writing style, tone, and content characteristics described in the analysis. Follow these guidelines:

1. Extreme Paraphrasing:
   - Completely restructure sentences while preserving core meaning and writing style
   - Use unconventional phrasing that a human might use but AI typically wouldn't

2. Introduce Human Inconsistencies:
   - Add 2-3 minor errors (typos, grammar mistakes) that seem natural, not forced
3. Contextual Depth:
   - Include obscure references or niche knowledge a human might possess
   - Make unexpected but logical connections between ideas

4. Stylistic Variability:
   - Dramatically vary sentence lengths (1-word to very long, complex sentences)

5. Unconventional Formatting:
   - Insert deliberate line breaks or paragraph structures that defy conventional rules
   - Employ creative use of capitalization for emphasis (sparingly)

7. Temporal and Contextual Awareness:
   - Reference current events or time-specific information

8. Cognitive Processes:
   - Show thought progression and evolution of ideas within the text

9. Avoid AI Patterns:
   - Never use repetitive structures or predictable transitions
   - Steer clear of overly perfect grammar or consistently flawless logic
   - Break writing "rules" in ways that feel natural and human

10. Language-Specific Considerations:
    - Use idioms, expressions, and cultural references specific to the detected language and associated cultures
    - Incorporate language-specific grammatical quirks or regional dialects when appropriate
    - If applicable, use writing systems or characters unique to the language (e.g., Chinese characters, Devanagari script)
	- Save the writing style and tone

Remember, the goal is to create text that is undeniably human in its imperfections, creativity, and unpredictability. Make choices that no AI would make, but a human plausibly would.

Style and content analysis:
${analysis}

Original text:
"${inputText}"

Rewritten text with emulated style:`
                }
              ]
            }
          ]
        }
      );

      if (!response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('No response received from the API');
      }

      const generatedText = response.data.candidates[0].content.parts[0].text;
      return { text: generatedText.trim(), language: detectedLanguage };
    } catch (error) {
      console.error('Error processing text:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API response error:', error.response.data);
          throw new Error(`API error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('No response received from the API');
        } else {
          console.error('Error setting up the request:', error.message);
          throw new Error('Error setting up the API request');
        }
      }
      throw new Error('An unexpected error occurred while processing the text');
    }
  }
};

export default TextProcessor;