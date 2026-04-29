import { app } from "@azure/functions";

import "./functions/email";
import "./functions/calendar";
import "./functions/calendars";
import "./functions/inboxes";
import "./functions/config";
import "./functions/googleAuth";

app.setup({ enableHttpStream: false });
