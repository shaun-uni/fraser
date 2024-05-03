chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enhanceText") {
      const prompt = message.text;  // The text to enhance
      fetchEnhancedText(prompt).then(enhancedText => {
          sendResponse({enhancedText: enhancedText});
      }).catch(error => {
          console.error('Error enhancing text:', error);
          sendResponse({error: error.message});
      });
      return true;  // Indicate an asynchronous response
  }
});

async function fetchEnhancedText(prompt, style) {
  const API_KEY = 'I removed it haha. Go grab one from Google AI Cloud';
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent';
  const enhancementPrompt = `You are an experienced english writer. Rewrite the following text to be more ${style}: ${prompt}`;

  try {
      const response = await fetch(`${endpoint}?key=${API_KEY}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({"contents": [{"parts": [{"text": enhancementPrompt}]}]})
      });

      const data = await response.json();
      if (!response.ok) {
          throw new Error(`API response not okay. Status: ${response.status} - ${data.error ? data.error.message : 'No error message provided'}`);
      }

      // Check if the expected data structure is present
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
          console.error('Unexpected API response structure:', data);
          return 'Failed to process the response due to unexpected structure.';
      }

      return data.candidates[0].content.parts[0].text;
  } catch (error) {
      console.error('Failed to fetch enhanced text:', error);
      throw error;
  }
}
