import { Client } from "@microsoft/microsoft-graph-client";

function graphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

export interface Inbox {
  id: string;
  name: string;
  provider: string;
  accountId: string;
}

export interface CalendarItem {
  id: string;
  name: string;
  provider: string;
  accountId: string;
}

export interface CalendarEvent {
  id: string;
  description: string;
  time: string;
  provider: string;
}

export async function getMicrosoftInboxes(accessToken: string): Promise<Inbox[]> {
  const client = graphClient(accessToken);
  const me = await client.api("/me").get() as { id: string };
  const res = await client.api("/me/mailFolders").select("id,displayName").get() as {
    value: Array<{ id: string; displayName: string }>;
  };
  return res.value.map((folder) => ({
    id: folder.id,
    name: folder.displayName,
    provider: "microsoft",
    accountId: me.id,
  }));
}

export async function getMicrosoftCalendars(accessToken: string): Promise<CalendarItem[]> {
  const client = graphClient(accessToken);
  const me = await client.api("/me").get() as { id: string };
  const res = await client.api("/me/calendars").select("id,name").get() as {
    value: Array<{ id: string; name: string }>;
  };
  return res.value.map((cal) => ({
    id: cal.id,
    name: cal.name,
    provider: "microsoft",
    accountId: me.id,
  }));
}

export async function getMicrosoftCalendarEvents(
  accessToken: string,
  date: string
): Promise<CalendarEvent[]> {
  const client = graphClient(accessToken);
  const startDateTime = `${date}T00:00:00Z`;
  const endDateTime = `${date}T23:59:59Z`;

  const res = await client
    .api("/me/calendarView")
    .query({ startDateTime, endDateTime })
    .select("id,subject,start,end")
    .get() as {
    value: Array<{ id: string; subject: string; start: { dateTime: string } }>;
  };

  return res.value.map((event) => ({
    id: event.id,
    description: event.subject,
    time: event.start.dateTime,
    provider: "microsoft",
  }));
}
