import { auth } from "auth"

export const GET = auth((req) => {
  if (req.auth) {
    return Response.json({ data: "workspaces", auth: req.auth })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any // TODO: Fix `auth()` return type
