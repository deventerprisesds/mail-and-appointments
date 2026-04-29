import { useNavigate } from "react-router-dom";

export default function ConnectPage() {
  const navigate = useNavigate();

  function handleMicrosoftConnect() {
    // TODO: Initiate MSAL OAuth flow
    alert("Microsoft 365 OAuth coming soon");
  }

  function handleGoogleConnect() {
    // TODO: Initiate Google OAuth flow
    alert("Google OAuth coming soon");
  }

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Mail & Appointments</h1>
      <p>Connect your accounts to get started.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
        <button onClick={handleMicrosoftConnect} style={btnStyle}>
          Connect Microsoft 365
        </button>
        <button onClick={handleGoogleConnect} style={btnStyle}>
          Connect Google Account
        </button>
        <button onClick={() => navigate("/dashboard")} style={{ ...btnStyle, background: "#555" }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: 16,
  background: "#0066cc",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
