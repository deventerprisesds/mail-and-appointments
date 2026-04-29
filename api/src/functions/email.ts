import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateToken } from "../middleware/validateToken";
import { getEmailCalendarTable } from "../storage/tableClient";

interface EmailBody {
  id: string;
  subject: string;
  body: string;
  provider: string;
}

async function postEmail(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const tokenCtx = validateToken(req);

    const payload = (await req.json()) as Partial<EmailBody>;
    const { id, subject, body, provider } = payload;

    if (!id || !subject || !body || !provider) {
      return {
        status: 400,
        jsonBody: { error: "Missing required fields: id, subject, body, provider" },
      };
    }

    const table = await getEmailCalendarTable();
    await table.upsertEntity({
      partitionKey: `email-${tokenCtx.accountId}`,
      rowKey: id,
      type: "email",
      subject,
      body,
      provider,
      accountId: tokenCtx.accountId,
      storedAt: new Date().toISOString(),
    });

    context.log(`Stored email ${id} for account ${tokenCtx.accountId}`);
    return { status: 201, jsonBody: { success: true, id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: 401, jsonBody: { error: message } };
  }
}

app.http("postEmail", {
  methods: ["POST"],
  route: "email",
  authLevel: "anonymous",
  handler: postEmail,
});
