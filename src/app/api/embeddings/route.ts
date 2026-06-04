import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // RAG Embeddings generation disabled because all AI APIs except Perplexity were removed per user request.
  return new Response(JSON.stringify({ 
    success: true, 
    embeddedCount: 0, 
    message: "Embeddings disabled. System is running in Perplexity-only mode." 
  }), { status: 200 });
}
