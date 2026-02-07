// ==============================================
// ADMIN DASHBOARD PAGE (NES.css + Recharts)
// ==============================================
// Panel principal del administrador con estadísticas y gráficas

"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "../components/admin/AdminNavbar";
import { AdminCard } from "../components/admin/AdminCard";
import { StatCard } from "../components/admin/StatCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminStats {
  overview: {
    totalRegenmons: number;
    activeRegenmons: number;
    inactiveRegenmons: number;
    totalTokensCirculating: number;
    totalTransactions: number;
    totalVisits: number;
  };
  topRegenmons: any[];
  stageDistribution: { stage: number; count: number }[];
  transactionsByType: { type: string; count: number; total: number }[];
  chartData: { date: string; visits: number; transactions: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Failed to load stats");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <>
        <AdminNavbar />
        <div className="container" style={{ padding: "2rem" }}>
          <div className="nes-text is-error" style={{ textAlign: "center" }}>
            ⚠️ {error || "Failed to load dashboard"}
          </div>
        </div>
      </>
    );
  }

  const COLORS = ["#92cc41", "#209cee", "#f7d51d", "#e76e55", "#ce372b"];

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#92cc41" }}>
          🎮 Admin Dashboard
        </h1>

        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <StatCard
            icon="👾"
            label="Total Regenmons"
            value={stats.overview.totalRegenmons}
            color="#209cee"
          />
          <StatCard
            icon="✅"
            label="Active Regenmons"
            value={stats.overview.activeRegenmons}
            color="#92cc41"
          />
          <StatCard
            icon="🍎"
            label="Tokens Circulating"
            value={stats.overview.totalTokensCirculating.toLocaleString()}
            color="#f7d51d"
          />
          <StatCard
            icon="💸"
            label="Total Transactions"
            value={stats.overview.totalTransactions}
            color="#e76e55"
          />
        </div>

        {/* Activity Chart */}
        <AdminCard title="📊 Daily Activity (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" style={{ fontSize: "0.7rem" }} />
              <YAxis stroke="#aaa" style={{ fontSize: "0.7rem" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#212529", border: "2px solid #92cc41", fontSize: "0.7rem" }}
              />
              <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
              <Line type="monotone" dataKey="visits" stroke="#209cee" strokeWidth={2} name="Visits" />
              <Line type="monotone" dataKey="transactions" stroke="#f7d51d" strokeWidth={2} name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </AdminCard>

        {/* Stage Distribution */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
          <AdminCard title="📈 Stage Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.stageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="stage" stroke="#aaa" style={{ fontSize: "0.7rem" }} />
                <YAxis stroke="#aaa" style={{ fontSize: "0.7rem" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#212529", border: "2px solid #92cc41", fontSize: "0.7rem" }}
                />
                <Bar dataKey="count" fill="#92cc41" name="Regenmons" />
              </BarChart>
            </ResponsiveContainer>
          </AdminCard>

          <AdminCard title="💰 Transactions by Type">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.transactionsByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.type}
                  labelStyle={{ fontSize: "0.6rem" }}
                >
                  {stats.transactionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#212529", border: "2px solid #92cc41", fontSize: "0.7rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </AdminCard>
        </div>

        {/* Top Regenmons */}
        <AdminCard title="🏆 Top 10 Regenmons">
          <div style={{ overflowX: "auto" }}>
            <table className="nes-table is-bordered is-dark" style={{ width: "100%", fontSize: "0.7rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "1rem" }}>Rank</th>
                  <th style={{ padding: "1rem" }}>Sprite</th>
                  <th style={{ padding: "1rem" }}>Name</th>
                  <th style={{ padding: "1rem" }}>Owner</th>
                  <th style={{ padding: "1rem" }}>Points</th>
                  <th style={{ padding: "1rem" }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {stats.topRegenmons.map((regenmon, idx) => (
                  <tr key={regenmon.id}>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {idx + 1 <= 3 ? (
                        idx + 1 === 1 ? "🥇" : idx + 1 === 2 ? "🥈" : "🥉"
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <img
                        src={regenmon.sprite}
                        alt={regenmon.name}
                        style={{ width: "32px", height: "32px", imageRendering: "pixelated" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>{regenmon.name}</td>
                    <td style={{ padding: "1rem" }}>{regenmon.ownerName}</td>
                    <td style={{ padding: "1rem", color: "#f7d51d" }}>
                      {regenmon.totalPoints.toLocaleString()}
                    </td>
                    <td style={{ padding: "1rem", color: "#92cc41" }}>
                      {regenmon.balance} $FRUTA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
