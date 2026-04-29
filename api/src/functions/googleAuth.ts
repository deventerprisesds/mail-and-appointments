import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { google } from "googleapis";

interface TokenRequestBody {
  code: string;
  redirectUri: string;
}

async function exchangeGoogleToken(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = (await req.json()) as Partial<TokenRequestBody>;
    if (!body.code || !body.redirectUri) {
      return { status: 400, jsonBody: { error: "code and redirectUri are required" } };
    }

    const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, body.redirectUri);
    const { tokens } = await oAuth2Client.getToken(body.code);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await google.oauth2({ version: "v2", auth: oAuth2Client }).userinfo.get();
    const email = userInfo.data.email ?? "";
    const accountId = email;

    context.log(`Google token exchanged for ${email}`);
    return {
      status: 200,
      jsonBody: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accountId,
        email,
        displayName: userInfo.data.name ?? email,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Token exchange failed";
    context.log(`Google token exchange error: ${message}`);
    return { status: 400, jsonBody: { error: message } };
  }
}

app.http("exchangeGoogleToken", {
  methods: ["POST"],
  route: "auth/google/token",
  authLevel: "anonymous",
  handler: exchangeGoogleToken,
});
