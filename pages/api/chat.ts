import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    
    console.log("Raw Response from OpenAI:", JSON.stringify(data, null, 2)); // 

    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
