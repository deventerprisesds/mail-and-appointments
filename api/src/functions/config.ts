import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getAccountConfigTable } from "../storage/tableClient";

interface ConfigBody {
  selectedInboxes: string[];
  selectedCalendars: string[];
}

async function postConfig(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);
    const body = (await req.json()) as Partial<ConfigBody>;

    if (!Array.isArray(body.selectedInboxes) || !Array.isArray(body.selectedCalendars)) {
      return {
        status: 400,
        jsonBody: { error: "selectedInboxes and selectedCalendars must be arrays" },
      };
    }

    const table = await getAccountConfigTable();
    await table.upsertEntity({
      partitionKey: tokenCtx.provider,
      rowKey: tokenCtx.accountId,
      provider: tokenCtx.provider,
      selectedInboxes: JSON.stringify(body.selectedInboxes),
      selectedCalendars: JSON.stringify(body.selectedCalendars),
      updatedAt: new Date().toISOString(),
    });

    context.log(`Saved config for account ${tokenCtx.accountId}`);
    return { status: 200, jsonBody: { success: true } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

async function getConfig(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);
    const table = await getAccountConfigTable();

    try {
      const entity = await table.getEntity<{
        selectedInboxes: string;
        selectedCalendars: string;
      }>(tokenCtx.provider, tokenCtx.accountId);

      return {
        status: 200,
        jsonBody: {
          selectedInboxes: JSON.parse(entity.selectedInboxes ?? "[]"),
          selectedCalendars: JSON.parse(entity.selectedCalendars ?? "[]"),
        },
      };
    } catch {
      return { status: 200, jsonBody: { selectedInboxes: [], selectedCalendars: [] } };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http("postConfig", {
  methods: ["POST"],
  route: "config",
  authLevel: "anonymous",
  handler: postConfig,
});

app.http("getConfig", {
  methods: ["GET"],
  route: "config",
  authLevel: "anonymous",
  handler: getConfig,
});
