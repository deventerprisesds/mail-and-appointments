import { TableClient, TableServiceClient } from "@azure/data-tables";

const connectionString =
  process.env.AZURE_STORAGE_CONNECTION_STRING ?? "UseDevelopmentStorage=true";

const EMAIL_CALENDAR_TABLE = "EmailCalendarData";
const ACCOUNT_CONFIG_TABLE = "AccountConfig";

async function ensureTable(tableName: string): Promise<TableClient> {
  const serviceClient = TableServiceClient.fromConnectionString(connectionString);
  try {
    await serviceClient.createTable(tableName);
  } catch {
    // Table already exists — ignore
  }
  return TableClient.fromConnectionString(connectionString, tableName);
}

export async function getEmailCalendarTable(): Promise<TableClient> {
  return ensureTable(EMAIL_CALENDAR_TABLE);
}

export async function getAccountConfigTable(): Promise<TableClient> {
  return ensureTable(ACCOUNT_CONFIG_TABLE);
}
