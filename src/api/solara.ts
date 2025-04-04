
const BASE_URL = "https://cm911hp5c9pjms4hfxzz4rmmz.agent.a.smyth.ai";

export async function talkToSolara(input: string, userId: string = 'Norms Of AGI') {
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
    
    // Handle different response formats
    if (Array.isArray(data) && data.length === 0) {
      return "The Solara API is currently unavailable. Please try again later.";
    }
    
    return data.output || 
           (typeof data === 'string' ? data : 
           "Solara is experiencing temporary issues. Please wait a moment and try again.");
  } catch (error) {
    console.error("Error communicating with Solara:", error);
    return "Connection to Solara failed. Please check your network connection and try again.";
  }
}
