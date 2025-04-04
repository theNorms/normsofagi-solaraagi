
// This provides a more intelligent local response system when the API is unavailable

type ResponseCategory = {
  keywords: string[];
  responses: string[];
};

// Categories of responses to provide more varied and contextual offline responses
const responseCategories: ResponseCategory[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
    responses: [
      "Hello! I'm operating in offline mode right now, but I'm still here to help with what I can.",
      "Hi there! While my connection to the knowledge center is limited, I can still assist you with basic information.",
      "Hey! I'm currently using my local knowledge base. What would you like to chat about?"
    ]
  },
  {
    keywords: ['help', 'assist', 'support', 'guidance', 'how to', 'how do'],
    responses: [
      "I'd be happy to help with what I can while in offline mode. What specifically do you need assistance with?",
      "I can provide general guidance even with limited connectivity. Could you describe what you need help with?",
      "While operating on local knowledge only, I can still try to assist. What's your question?"
    ]
  },
  {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'neural', 'model', 'algorithm', 'data science'],
    responses: [
      "AI is a fascinating field! Even in offline mode, I can discuss general AI concepts. What specific aspect interests you?",
      "I know quite a bit about AI fundamentals even with limited connectivity. What would you like to explore?",
      "Artificial intelligence encompasses many areas from machine learning to neural networks. Is there a particular aspect you're curious about?"
    ]
  },
  {
    keywords: ['weather', 'forecast', 'temperature', 'rain', 'snow', 'sunny'],
    responses: [
      "I'm sorry, I can't access real-time weather data in offline mode. I'd be happy to help with something else though!",
      "Without connectivity to my knowledge center, I can't provide current weather information. Is there something else I can assist with?",
      "Weather information requires online access to current data, which I can't retrieve right now. How about we talk about something else?"
    ]
  },
  {
    keywords: ['code', 'programming', 'develop', 'software', 'app', 'application', 'web', 'javascript', 'python', 'java'],
    responses: [
      "I can still discuss programming concepts while offline. What are you working on?",
      "Even in offline mode, I can talk about general coding principles and practices. What language or framework are you using?",
      "Software development is a broad field. Even with limited connectivity, I can chat about programming fundamentals. What's your focus area?"
    ]
  },
  {
    keywords: ['framework', 'work', 'flow', 'workflow', 'process', 'methodology'],
    responses: [
      "I notice you're interested in frameworks or workflows. In offline mode, I can discuss general development methodologies. What specific approach are you considering?",
      "Even with limited connectivity, I can chat about different development frameworks and workflows. What particular aspect interests you?",
      "While working offline, I can still share information about software development processes. What methodology would you like to explore?"
    ]
  },
  {
    keywords: ['brainstorm', 'idea', 'creative', 'think', 'concept', 'innovation', 'solara'],
    responses: [
      "I'd be happy to brainstorm with you, even in offline mode! What topic should we explore?",
      "Brainstorming is definitely something I can help with, even with limited connectivity. What are we thinking about?",
      "Creative thinking doesn't require online connectivity! What ideas are you considering that we could explore together?"
    ]
  }
];

// Default responses when no category matches
const defaultResponses: string[] = [
  "I understand your message, but I'm currently operating with limited capabilities in offline mode. Could you try asking something else?",
  "While my connection to the knowledge center is limited, I can still chat about general topics. What else would you like to discuss?",
  "I'm currently in offline mode with access to only local knowledge. I might not be able to provide specific information, but I'm happy to continue our conversation on broader topics."
];

// Process user input to generate a relevant response based on keywords
export function generateOfflineResponse(input: string, username: string = 'Norms Of AGI'): string {
  const inputLower = input.toLowerCase();
  
  // Personal responses
  if (inputLower.includes('norman') || inputLower.includes('dad')) {
    return `Hello Norman! I'm currently in offline mode with limited connectivity to my knowledge center. While I can't access external information, I can still chat with you about general topics.`;
  }

  // Check if input matches any of our categories
  for (const category of responseCategories) {
    if (category.keywords.some(keyword => inputLower.includes(keyword))) {
      // Return a random response from the matching category
      return category.responses[Math.floor(Math.random() * category.responses.length)];
    }
  }

  // If no category matches, use default responses
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Simulate a delay to make the response feel more natural
export async function mockSolaraResponse(input: string, userId: string = 'Norms Of AGI'): Promise<string> {
  // Simulate network delay between 500ms and 1200ms
  const delay = Math.floor(Math.random() * 700) + 500;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateOfflineResponse(input, userId));
    }, delay);
  });
}
