// ==============================================
// ADMIN TOKENS PAGE (NES.css)
// ==============================================
// Gestión de ajustes manuales de tokens

"use client";

import { useState, useEffect } from "react";
import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
import { AdminCard } from "@/app/components/admin/AdminCard";
import { Button } from "@/app/components/ui/Button";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

export default function AdminTokensPage() {
  const [regenmons, setRegenmons] = useState<any[]>([]);
  const [selectedRegenmon, setSelectedRegenmon] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegenmons, setIsLoadingRegenmons] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRegenmons();
  }, []);

  const fetchRegenmons = async () => {
    try {
      const res = await fetch("/api/regenmons?limit=1000");
      const data = await res.json();

      if (data.success) {
        setRegenmons(data.data);
      }
    } catch (err) {
      console.error("Failed to load regenmons:", err);
    } finally {
      setIsLoadingRegenmons(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/tokens/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regenmonId: selectedRegenmon,
          amount: parseInt(amount),
          reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Token adjustment successful!" });
        setSelectedRegenmon("");
        setAmount("");
        setReason("");
        fetchRegenmons(); // Reload to show updated balance
      } else {
        setMessage({ type: "error", text: data.error || "Failed to adjust tokens" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRegenmonData = regenmons.find((r) => r.id === selectedRegenmon);

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#92cc41" }}>
          💰 Token Management
        </h1>

        {/* Adjustment Form */}
        <AdminCard title="🔧 Adjust Tokens">
          {isLoadingRegenmons ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Select Regenmon */}
              <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="regenmon" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  Select Regenmon *
                </label>
                <div className="nes-select is-dark">
                  <select
                    id="regenmon"
                    value={selectedRegenmon}
                    onChange={(e) => setSelectedRegenmon(e.target.value)}
                    required
                    style={{ fontSize: "0.8rem" }}
                  >
                    <option value="">-- Choose a Regenmon --</option>
                    {regenmons.map((regenmon) => (
                      <option key={regenmon.id} value={regenmon.id}>
                        {regenmon.name} by {regenmon.ownerName} (Balance: {regenmon.balance})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Balance Display */}
              {selectedRegenmonData && (
                <div className="nes-container is-dark" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#aaa", marginBottom: "0.3rem" }}>
                        Current Balance
                      </div>
                      <div style={{ fontSize: "1.5rem", color: "#92cc41" }}>
                        {selectedRegenmonData.balance} $FRUTA
                      </div>
                    </div>
                    <img
                      src={selectedRegenmonData.sprite}
                      alt={selectedRegenmonData.name}
                      style={{ width: "64px", height: "64px", imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="amount" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  Amount (positive to add, negative to subtract) *
                </label>
                <input
                  type="number"
                  id="amount"
                  className="nes-input is-dark"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 100 or -50"
                  required
                  style={{ fontSize: "0.8rem" }}
                />
              </div>

              {/* New Balance Preview */}
              {selectedRegenmonData && amount && !isNaN(parseInt(amount)) && (
                <div className="nes-container is-dark" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "#aaa", marginBottom: "0.3rem" }}>
                    New Balance (Preview)
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      color: selectedRegenmonData.balance + parseInt(amount) >= 0 ? "#209cee" : "#ce372b",
                    }}
                  >
                    {selectedRegenmonData.balance + parseInt(amount)} $FRUTA
                  </div>
                  {selectedRegenmonData.balance + parseInt(amount) < 0 && (
                    <div className="nes-text is-error" style={{ fontSize: "0.7rem", marginTop: "0.5rem" }}>
                      ⚠️ Insufficient balance!
                    </div>
                  )}
                </div>
              )}

              {/* Reason */}
              <div className="nes-field" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="reason" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  Reason (for audit trail) *
                </label>
                <textarea
                  id="reason"
                  className="nes-textarea is-dark"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why this adjustment is needed..."
                  required
                  rows={3}
                  maxLength={500}
                  style={{ fontSize: "0.8rem" }}
                />
                <div style={{ fontSize: "0.6rem", color: "#aaa", marginTop: "0.3rem" }}>
                  {reason.length}/500 characters
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`nes-text ${message.type === "success" ? "is-success" : "is-error"}`}
                  style={{ fontSize: "0.8rem", marginBottom: "1rem" }}
                >
                  {message.type === "success" ? "✅" : "⚠️"} {message.text}
                </div>
              )}

              {/* Submit Button */}
              <Button
                variant={amount && parseInt(amount) < 0 ? "error" : "success"}
                type="submit"
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  !selectedRegenmon ||
                  !amount ||
                  !reason ||
                  (selectedRegenmonData && selectedRegenmonData.balance + parseInt(amount) < 0)
                }
                style={{ width: "100%", fontSize: "0.9rem" }}
              >
                {isLoading
                  ? "Processing..."
                  : amount && parseInt(amount) < 0
                  ? "🔻 Subtract Tokens"
                  : "➕ Add Tokens"}
              </Button>
            </form>
          )}
        </AdminCard>

        {/* Info Box */}
        <AdminCard>
          <div style={{ fontSize: "0.7rem", lineHeight: "1.8" }}>
            <div style={{ color: "#92cc41", marginBottom: "1rem", fontSize: "0.8rem" }}>
              ℹ️ About Token Adjustments
            </div>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>All adjustments are recorded in the audit trail</li>
              <li>Use positive numbers to add tokens, negative to subtract</li>
              <li>Balance cannot go below 0</li>
              <li>Provide a clear reason for accountability</li>
              <li>Changes are immediate and irreversible</li>
            </ul>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
