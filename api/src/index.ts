import { app } from "@azure/functions";

// Register functions
import "./functions/email";
import "./functions/calendar";

app.setup({ enableHttpStream: false });
