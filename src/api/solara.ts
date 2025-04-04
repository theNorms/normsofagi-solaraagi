
const BASE_URL = "https://cm911hp5c9pjms4hfxzz4rmmz.agent.a.smyth.ai";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function talkToSolara(input: string, userId: string = 'Norms Of AGI') {
  let retries = 0;
  
  // Retry logic
  while (retries < MAX_RETRIES) {
    try {
      const res = await fetch(`${BASE_URL}/api/creative_process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, userId, context: 'chat' })
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();
      
      // If we got an empty array, that's an API issue
      if (Array.isArray(data) && data.length === 0) {
        if (retries < MAX_RETRIES - 1) {
          // Still have retries left, wait and try again
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        return "The Solara API is unavailable. I'll use my local knowledge to help instead.";
      }
      
      // Success! Return the data
      return data.output || 
             (typeof data === 'string' ? data : 
             "I understand your message but I'm having trouble formulating a response right now.");
      
    } catch (error) {
      console.error(`Error communicating with Solara (attempt ${retries+1}/${MAX_RETRIES}):`, error);
      
      if (retries < MAX_RETRIES - 1) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        // Out of retries, return a friendly error message
        return "I couldn't connect to my knowledge center just now. Let me help with what I know locally.";
      }
    }
  }
  
  // Fallback response if we're out of retries
  return "I'm here to help, but I'm having connection issues right now. Is there something else I can assist with?";
}

/**
 * Check if the Solara API is available
 * @returns {Promise<boolean>} True if the API is available
 */
export async function checkSolaraAvailability(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, {
      method: "GET"
    });
    return res.ok;
  } catch (error) {
    console.error("Error checking Solara API health:", error);
    return false;
  }
}
