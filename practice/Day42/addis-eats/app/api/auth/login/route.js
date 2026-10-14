import {
  authenticateUser,
  createSession,
  SESSION_COOKIE,
  SESSION_DURATION,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const user = authenticateUser(email, password);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const token = createSession(user.id);

    const response = Response.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION / 1000}${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );

    return response;
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid request.",
      },
      { status: 400 },
    );
  }
}
