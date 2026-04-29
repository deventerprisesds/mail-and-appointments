import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getMicrosoftInboxes } from "../providers/microsoft";
import { getGoogleInboxes } from "../providers/google";

async function getInboxes(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);
    const inboxes =
      tokenCtx.provider === "microsoft"
        ? await getMicrosoftInboxes(tokenCtx.accessToken)
        : await getGoogleInboxes(tokenCtx.accessToken);

    context.log(`Fetched ${inboxes.length} inboxes for ${tokenCtx.accountId}`);
    return { status: 200, jsonBody: inboxes };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http("getInboxes", {
  methods: ["GET"],
  route: "inboxes",
  authLevel: "anonymous",
  handler: getInboxes,
});
