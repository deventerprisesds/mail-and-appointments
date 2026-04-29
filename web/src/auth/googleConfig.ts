export const googleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  scopes: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ].join(" "),
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

export function buildGoogleAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: googleConfig.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: googleConfig.scopes,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
