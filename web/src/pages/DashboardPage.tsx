import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: 24, cursor: "pointer" }}>
        &larr; Back
      </button>

      <section>
        <h2>Calendar</h2>
        <label>
          Date:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        {/* TODO: Fetch GET /api/calendar?date={date} and render events */}
        <p style={{ color: "#888" }}>Calendar events will appear here.</p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Inbox</h2>
        {/* TODO: Display stored emails from selected inboxes */}
        <p style={{ color: "#888" }}>Emails will appear here.</p>
      </section>
    </div>
  );
}
