import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getEmailCalendarTable } from "../storage/tableClient";

interface CalendarEvent {
  id: string;
  description: string;
  time: string;
  provider: string;
}

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

    const table = await getEmailCalendarTable();
    const partitionKey = `calendar-${tokenCtx.accountId}`;

    const events: CalendarEvent[] = [];
    const entities = table.listEntities<CalendarEvent & { date: string }>({
      queryOptions: {
        filter: `PartitionKey eq '${partitionKey}' and date eq '${date}'`,
      },
    });

    for await (const entity of entities) {
      events.push({
        id: entity.rowKey as string,
        description: entity.description,
        time: entity.time,
        provider: entity.provider,
      });
    }

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
