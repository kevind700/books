const API_URL = process.env.SERVER_JSON_HOST || "http://localhost:3001";

export async function GET(request: Request) {
  const token = request.headers.get("token");

  if (!token) {
    return new Response("unauthorized", { status: 401 });
  }

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  try {
    const response = await fetch(`${API_URL}/users/${token}`);
    const user: User = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword);
  } catch {
    return new Response("error retrieving user data", { status: 500 });
  }
}
