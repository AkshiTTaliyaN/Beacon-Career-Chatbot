import { useState, useEffect, useRef } from "react";
import BilingualText from "./BilingualText";

export default function ProfileDropdown({ name, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const resolvedName = name || localStorage.getItem("userName") || "Student";
  const resolvedEmail = localStorage.getItem("beacon_email") || "";
  const initial = resolvedName.trim().slice(0, 1).toUpperCase() || "S";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("beacon_token");
    localStorage.removeItem("beacon_email");
    localStorage.removeItem("userName");
    localStorage.removeItem("beaconReturning");
    window.location.href = "/";
  }

  return (
    <div ref={dropdownRef} className="profile-dropdown-container" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="manzil-header-avatar"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "#eaf1fb",
          border: "1px solid #dce4f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2c5492",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
        }}
        title={resolvedName}
      >
        {initial}
      </button>

      {isOpen && (
        <div
          className="profile-dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: align === "right" ? 0 : "auto",
            left: align === "left" ? 0 : "auto",
            marginTop: "10px",
            background: "#ffffff",
            border: "1px solid #e8edf5",
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(16,40,73,0.18)",
            padding: "16px",
            zIndex: 1000,
            minWidth: "220px",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: "12px", borderBottom: "1px solid #e8edf5", paddingBottom: "12px" }}>
            <div style={{ fontWeight: 800, color: "#102849", fontSize: "0.95rem" }}>{resolvedName}</div>
            {resolvedEmail && resolvedEmail !== "guest" && (
              <div style={{ color: "#5f6b8d", fontSize: "0.8rem", marginTop: "3px", wordBreak: "break-all" }}>
                {resolvedEmail}
              </div>
            )}
            {resolvedEmail === "guest" && (
              <div style={{ color: "#8b5cf6", fontSize: "0.78rem", fontWeight: 700, marginTop: "3px" }}>
                <BilingualText text="Guest Mode" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              color: "#ff006e",
              fontWeight: 700,
              fontSize: "0.88rem",
              textAlign: "left",
              padding: "6px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🚪 <BilingualText text="Logout" />
          </button>
        </div>
      )}
    </div>
  );
}
