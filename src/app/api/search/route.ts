import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Generate embedding for the search query
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // 2. Call Supabase RPC to find similar verses
    // Match threshold is lowered for testing (e.g., 0.2)
    const { data: verses, error } = await supabase.rpc("match_quran_verses", {
      query_embedding: embedding,
      match_threshold: 0.2,
      match_count: 5,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json({ error: "Database search failed" }, { status: 500 });
    }

    return NextResponse.json({ results: verses });

  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
