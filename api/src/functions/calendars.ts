import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getMicrosoftCalendars } from "../providers/microsoft";
import { getGoogleCalendars } from "../providers/google";

async function getCalendars(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);
    const calendars =
      tokenCtx.provider === "microsoft"
        ? await getMicrosoftCalendars(tokenCtx.accessToken)
        : await getGoogleCalendars(tokenCtx.accessToken);

    context.log(`Fetched ${calendars.length} calendars for ${tokenCtx.accountId}`);
    return { status: 200, jsonBody: calendars };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http("getCalendars", {
  methods: ["GET"],
  route: "calendars",
  authLevel: "anonymous",
  handler: getCalendars,
});
