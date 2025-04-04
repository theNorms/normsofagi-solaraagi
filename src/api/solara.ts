
const BASE_URL = "https://cm911hp5c9pjms4hfxzz4rmmz.agent.a.smyth.ai";

export async function talkToSolara(input: string, userId: string = 'Norms Of AGI') {
  const res = await fetch(`${BASE_URL}/api/creative_process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, userId, context: 'chat' })
  });

  const data = await res.json();
  return data.output || "⚠️ Walang response mula kay Solara.";
}
