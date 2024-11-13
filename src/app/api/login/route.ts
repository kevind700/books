export async function POST(request: Request) {
  const { email, password } = await request.json();

  type User = {
    id: string;
    email: string;
    password: string;
  };

  try {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();

    const validUser = users.find(
      (user: User) => user.email === email && user.password === password,
    );

    if (validUser) {
      const token = validUser.id;
      const options = {
        headers: {
          "Set-Cookie": `token=${token}; path=/; max-age=604800;`,
        },
      };
      return Response.json({ token }, options);
    }

    return new Response("unauthorized", { status: 401 });
  } catch {
    return new Response("error validating credentials", { status: 500 });
  }
}
