import { HttpRequest } from "@azure/functions";

export type Provider = "microsoft" | "google";

export interface TokenContext {
  provider: Provider;
  accessToken: string;
  accountId: string;
}

/**
 * Extracts and validates the Authorization header.
 * Expects: Authorization: Bearer <provider>:<accountId>:<accessToken>
 * (Simplified — swap for real JWT/OAuth introspection in production)
 */
export function validateToken(req: HttpRequest): TokenContext {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.slice(7);
  const parts = token.split(":");
  if (parts.length < 3) {
    throw new Error(
      "Token format invalid. Expected: <provider>:<accountId>:<accessToken>"
    );
  }

  const [provider, accountId, ...rest] = parts;
  if (provider !== "microsoft" && provider !== "google") {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    provider: provider as Provider,
    accountId,
    accessToken: rest.join(":"),
  };
}
