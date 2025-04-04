
import { mockSolaraResponse } from './mockSolara';

const BASE_URL = "https://cm911hp5c9pjms4hfxzz4rmmz.agent.a.smyth.ai";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache for API availability status to avoid multiple checks
let cachedApiAvailable: boolean | null = null;
let lastCheckTime = 0;
const CACHE_VALIDITY_PERIOD = 60000; // 1 minute

// New flag to allow manual override of API mode
export let forceOfflineMode = false;

/**
 * Toggle the API mode between online and offline
 * @param offline If true, forces offline mode; if false, tries to use online mode 
 */
export function setOfflineMode(offline: boolean): void {
  forceOfflineMode = offline;
  console.log(`API mode manually set to: ${offline ? 'offline' : 'online'}`);
  
  if (!offline) {
    // If switching to online mode, refresh status
    refreshApiStatus();
  } else {
    // If switching to offline, update cache
    updateApiAvailabilityCache(false);
  }
}

/**
 * Main function to communicate with the Solara API
 */
export async function talkToSolara(input: string, userId: string = 'Norms Of AGI') {
  console.log(`Attempting to talk to Solara. API status cache: ${cachedApiAvailable}, Force offline: ${forceOfflineMode}`);
  
  // If offline mode is forced, use mock responses
  if (forceOfflineMode) {
    console.log("Using forced offline mode");
    return await mockSolaraResponse(input, userId);
  }
  
  // Quick check of the cached API status before making a request
  if (cachedApiAvailable === false && Date.now() - lastCheckTime < CACHE_VALIDITY_PERIOD) {
    console.log("Using cached API status: API is down");
    return await mockSolaraResponse(input, userId);
  }
  
  let retries = 0;
  
  // Retry logic
  while (retries < MAX_RETRIES) {
    try {
      console.log(`API request attempt ${retries + 1}/${MAX_RETRIES}`);
      
      const res = await fetch(`${BASE_URL}/api/creative_process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, userId, context: 'chat' }),
        signal: AbortSignal.timeout(5000) // Add timeout to avoid long waits
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
        return await mockSolaraResponse(input, userId);
      }
      
      // Handle the case when API returns empty array but we've used all retries
      if (Array.isArray(data) && data.length === 0) {
        updateApiAvailabilityCache(false);
        return await mockSolaraResponse(input, userId);
      }
      
      // Success! Update cache and return the data
      updateApiAvailabilityCache(true);
      
      // Try to extract the response based on different possible API response formats
      if (data.output) {
        return data.output;
      } else if (typeof data === 'string') {
        return data;
      } else if (Array.isArray(data) && data.length > 0 && data[0].content) {
        return data[0].content;
      } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
        return data[0];
      } else if (data.response) {
        return data.response;
      } else {
        // If we can't figure out the format, use our mock response
        return await mockSolaraResponse(input, userId);
      }
      
    } catch (error) {
      console.error(`Error communicating with Solara (attempt ${retries+1}/${MAX_RETRIES}):`, error);
      
      if (retries < MAX_RETRIES - 1) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        // Out of retries, update cache and return a friendly error message
        updateApiAvailabilityCache(false);
        return await mockSolaraResponse(input, userId);
      }
    }
  }
  
  // Fallback response if we're out of retries
  updateApiAvailabilityCache(false);
  return await mockSolaraResponse(input, userId);
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
  // If offline mode is forced, return false
  if (forceOfflineMode) {
    return false;
  }
  
  try {
    console.log("Checking Solara API health...");
    
    // Try a simple echo request since health endpoint returns error
    const echoRes = await fetch(`${BASE_URL}/api/creative_process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        input: "health_check", 
        userId: "system", 
        context: 'system_health_check' 
      }),
      // Add a shorter timeout for availability check
      signal: AbortSignal.timeout(5000)
    });
    
    if (!echoRes.ok) {
      console.log(`API health check failed with status: ${echoRes.status}`);
      updateApiAvailabilityCache(false);
      return false;
    }
    
    const data = await echoRes.json();
    
    // If API returns empty array, that's an indication it's not working properly
    const isAvailable = !(!data || (Array.isArray(data) && data.length === 0));
    console.log(`API health check result: ${isAvailable ? 'available' : 'unavailable'}`);
    
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
