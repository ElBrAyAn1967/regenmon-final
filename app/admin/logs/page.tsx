// ==============================================
// ADMIN LOGS PAGE (NES.css)
// ==============================================
// Visualización de logs de actividad con filtros

"use client";

import { useState, useEffect } from "react";
import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
import { AdminCard } from "@/app/components/admin/AdminCard";
import { Button } from "@/app/components/ui/Button";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

interface Log {
  id: string;
  type: "transaction" | "visit" | "sync";
  event: string;
  regenmonId: string;
  regenmonName: string;
  ownerName: string;
  details: any;
  timestamp: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [page, typeFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        type: typeFilter,
      });

      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();

      if (data.success) {
        setLogs(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || "Failed to load logs");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type: string, event: string) => {
    if (type === "transaction") {
      if (event === "admin_adjustment") return "🔧";
      if (event === "daily_reward") return "🎁";
      if (event === "task_completion") return "✅";
      return "💸";
    }
    if (type === "visit") return "👁️";
    if (type === "sync") return "🔄";
    return "📝";
  };

  const getEventColor = (type: string) => {
    if (type === "transaction") return "#f7d51d";
    if (type === "visit") return "#209cee";
    if (type === "sync") return "#92cc41";
    return "#aaa";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#92cc41" }}>
          📜 Activity Logs
        </h1>

        {/* Filters */}
        <AdminCard title="🔍 Filter">
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.7rem" }}>Type:</div>
            {["all", "transaction", "visit", "sync"].map((type) => (
              <label key={type} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  className="nes-radio is-dark"
                  name="type"
                  checked={typeFilter === type}
                  onChange={() => {
                    setTypeFilter(type);
                    setPage(1);
                  }}
                />
                <span style={{ fontSize: "0.7rem", textTransform: "capitalize" }}>{type}</span>
              </label>
            ))}
          </div>
        </AdminCard>

        {/* Logs List */}
        <AdminCard title={`📋 Activity Log (${logs.length})`}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="nes-text is-error" style={{ textAlign: "center", padding: "2rem" }}>
              ⚠️ {error}
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "0.8rem" }}>
              No logs found for this filter
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="nes-container is-dark"
                    style={{ padding: "1rem", borderColor: getEventColor(log.type) }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      {/* Left: Icon + Info */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
                        <div style={{ fontSize: "2rem" }}>{getEventIcon(log.type, log.event)}</div>
                        <div style={{ flex: 1 }}>
                          {/* Event Type */}
                          <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: getEventColor(log.type) }}>
                            {log.event.replace(/_/g, " ").toUpperCase()}
                          </div>

                          {/* Regenmon */}
                          <div style={{ fontSize: "0.7rem", marginBottom: "0.3rem" }}>
                            <span style={{ color: "#aaa" }}>Regenmon:</span>{" "}
                            <span style={{ color: "#fff" }}>{log.regenmonName}</span> by {log.ownerName}
                          </div>

                          {/* Details */}
                          <div style={{ fontSize: "0.6rem", color: "#aaa", marginTop: "0.5rem" }}>
                            {log.type === "transaction" && (
                              <>
                                <span>Amount: </span>
                                <span style={{ color: log.details.amount >= 0 ? "#92cc41" : "#ce372b" }}>
                                  {log.details.amount >= 0 ? "+" : ""}
                                  {log.details.amount} $FRUTA
                                </span>
                                <span> • Balance: </span>
                                <span>{log.details.balanceBefore} → {log.details.balanceAfter}</span>
                                {log.details.metadata?.reason && (
                                  <>
                                    <br />
                                    <span>Reason: {log.details.metadata.reason}</span>
                                  </>
                                )}
                              </>
                            )}
                            {log.type === "visit" && (
                              <>
                                <span>User Agent: {log.details.userAgent || "Unknown"}</span>
                                {log.details.referrer && (
                                  <>
                                    <br />
                                    <span>Referrer: {log.details.referrer}</span>
                                  </>
                                )}
                              </>
                            )}
                            {log.type === "sync" && (
                              <>
                                <span>Stage: {log.details.stage}</span>
                                <span> • Points: {log.details.totalPoints}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Timestamp */}
                      <div style={{ fontSize: "0.6rem", color: "#aaa", textAlign: "right", minWidth: "100px" }}>
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center", marginTop: "2rem", flexWrap: "wrap" }}>
                  <Button
                    variant="primary"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    ← Prev
                  </Button>
                  <span style={{ fontSize: "0.8rem" }}>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </AdminCard>
      </div>
    </>
  );
}
