
const BASE_URL = "https://cm911hp5c9pjms4hfxzz4rmmz.agent.a.smyth.ai";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache for API availability status to avoid multiple checks
let cachedApiAvailable: boolean | null = null;
let lastCheckTime = 0;
const CACHE_VALIDITY_PERIOD = 60000; // 1 minute

/**
 * Main function to communicate with the Solara API
 */
export async function talkToSolara(input: string, userId: string = 'Norms Of AGI') {
  console.log(`Attempting to talk to Solara. API status cache: ${cachedApiAvailable}`);
  
  // Quick check of the cached API status before making a request
  if (cachedApiAvailable === false && Date.now() - lastCheckTime < CACHE_VALIDITY_PERIOD) {
    console.log("Using cached API status: API is down");
    return getLocalFallbackResponse(input);
  }
  
  let retries = 0;
  
  // Retry logic
  while (retries < MAX_RETRIES) {
    try {
      console.log(`API request attempt ${retries + 1}/${MAX_RETRIES}`);
      
      const res = await fetch(`${BASE_URL}/api/creative_process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, userId, context: 'chat' })
      });

      if (!res.ok) {
        console.error(`API responded with error status: ${res.status}`);
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);
      
      // If we got an empty array or undefined data, that's an API issue
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn("Received empty response from API");
        
        if (retries < MAX_RETRIES - 1) {
          // Still have retries left, wait and try again
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        
        updateApiAvailabilityCache(false);
        return getLocalFallbackResponse(input);
      }
      
      // Success! Update cache and return the data
      updateApiAvailabilityCache(true);
      
      return data.output || 
             (typeof data === 'string' ? data : 
             "I understand your message but I'm having trouble formulating a response right now.");
      
    } catch (error) {
      console.error(`Error communicating with Solara (attempt ${retries+1}/${MAX_RETRIES}):`, error);
      
      if (retries < MAX_RETRIES - 1) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        // Out of retries, update cache and return a friendly error message
        updateApiAvailabilityCache(false);
        return getLocalFallbackResponse(input);
      }
    }
  }
  
  // Fallback response if we're out of retries
  updateApiAvailabilityCache(false);
  return getLocalFallbackResponse(input);
}

/**
 * Get a fallback response based on the input when API is unavailable
 */
function getLocalFallbackResponse(input: string): string {
  // Simple keyword-based fallback responses
  const inputLower = input.toLowerCase();
  
  if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower === 'oi solara') {
    return "Hello! I'm currently operating with limited connectivity to my knowledge center. How can I assist you with my local capabilities?";
  }
  
  if (inputLower.includes('help') || inputLower.includes('can you')) {
    return "I'm here to help, though I'm currently operating with limited connectivity. I can still assist with general questions and tasks within my local knowledge.";
  }
  
  if (inputLower.includes('thank')) {
    return "You're welcome! Let me know if there's anything else I can help with using my local capabilities.";
  }

  // Default response for other inputs
  return "I'm currently using my local knowledge to help you as my connection to the Solara knowledge center is limited. Could you try asking in a different way or perhaps ask something else?";
}

/**
 * Update the cached API availability status
 */
function updateApiAvailabilityCache(isAvailable: boolean): void {
  cachedApiAvailable = isAvailable;
  lastCheckTime = Date.now();
  console.log(`Updated API availability cache: ${isAvailable ? 'available' : 'unavailable'}`);
}

/**
 * Check if the Solara API is available
 * @returns {Promise<boolean>} True if the API is available
 */
export async function checkSolaraAvailability(): Promise<boolean> {
  try {
    console.log("Checking Solara API health...");
    
    // Try the health endpoint first
    try {
      const healthRes = await fetch(`${BASE_URL}/api/health`, {
        method: "GET"
      });
      
      if (healthRes.ok) {
        console.log("Health endpoint check: API is available");
        updateApiAvailabilityCache(true);
        return true;
      }
    } catch (e) {
      console.log("Health endpoint unavailable, trying fallback check");
    }
    
    // Fallback: try a simple echo request
    const echoRes = await fetch(`${BASE_URL}/api/creative_process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        input: "system_check", 
        userId: "system", 
        context: 'system_health_check' 
      })
    });
    
    const isAvailable = echoRes.ok;
    console.log(`Fallback API check result: ${isAvailable ? 'available' : 'unavailable'}`);
    
    updateApiAvailabilityCache(isAvailable);
    return isAvailable;
  } catch (error) {
    console.error("Error checking Solara API health:", error);
    updateApiAvailabilityCache(false);
    return false;
  }
}

/**
 * Force refresh the API availability status
 */
export async function refreshApiStatus(): Promise<boolean> {
  // Clear cache and check availability
  cachedApiAvailable = null;
  return await checkSolaraAvailability();
}
