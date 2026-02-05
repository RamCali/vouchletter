import { authServer } from "@/lib/auth/server";

// Helper to get the current user ID (throws if not authenticated)
export async function getAuthUserId(): Promise<string> {
  const { data: session } = await authServer.getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// Helper to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: session } = await authServer.getSession();
  return !!session?.user;
}

// Helper to get current user with full details
export async function getUser() {
  const { data: session } = await authServer.getSession();
  if (!session?.user) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    imageUrl: session.user.image ?? null,
  };
}
