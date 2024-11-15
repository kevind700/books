import { Book } from "@/types/book";

const API_URL = process.env.SERVER_JSON_HOST || "http://localhost:3001";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/books`);
    const book = (await response.json()) as Book[];

    return Response.json(book);
  } catch {
    return new Response("error retrieving user data", { status: 500 });
  }
}
