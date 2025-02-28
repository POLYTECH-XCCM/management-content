import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyC9KVl6TSxnehG7mmibF6Q_1072Be6jg8k"); // Remplace par ta clé API réelle
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  const textRequest = await req.text();
  const result = await model.generateContent(textRequest);

  return NextResponse.json({ text: result.response.text(), result: result });
}