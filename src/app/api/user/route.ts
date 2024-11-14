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
    const response = await fetch(`http://localhost:3001/users/${token}`);
    const user: User = await response.json();

    const { password, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword);
  } catch {
    return new Response("error retrieving user data", { status: 500 });
  }
}
