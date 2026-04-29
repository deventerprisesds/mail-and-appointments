import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getMicrosoftCalendarEvents } from "../providers/microsoft";
import { getGoogleCalendarEvents } from "../providers/google";

async function getCalendar(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);

    const date = req.query.get("date");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        status: 400,
        jsonBody: { error: "Missing or invalid 'date' query param. Use YYYY-MM-DD." },
      };
    }

    const events =
      tokenCtx.provider === "microsoft"
        ? await getMicrosoftCalendarEvents(tokenCtx.accessToken, date)
        : await getGoogleCalendarEvents(tokenCtx.accessToken, date);

    context.log(`Fetched ${events.length} events for ${tokenCtx.accountId} on ${date}`);
    return { status: 200, jsonBody: events };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http("getCalendar", {
  methods: ["GET"],
  route: "calendar",
  authLevel: "anonymous",
  handler: getCalendar,
});
