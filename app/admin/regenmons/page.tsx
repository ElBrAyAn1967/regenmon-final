// ==============================================
// ADMIN REGENMONS PAGE (NES.css)
// ==============================================
// Lista completa de Regenmons con filtros y búsqueda

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
import { AdminCard } from "@/app/components/admin/AdminCard";
import { DataTable } from "@/app/components/admin/DataTable";
import { Button } from "@/app/components/ui/Button";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

export default function AdminRegenmonsPage() {
  const [regenmons, setRegenmons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    fetchRegenmons();
  }, [page, searchTerm, statusFilter, stageFilter]);

  const fetchRegenmons = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search: searchTerm,
        status: statusFilter,
        stage: stageFilter,
      });

      const res = await fetch(`/api/regenmons?${params}`);
      const data = await res.json();

      if (data.success) {
        setRegenmons(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || "Failed to load regenmons");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      header: "Sprite",
      accessor: "sprite",
      render: (value: string, row: any) => (
        <img
          src={value}
          alt={row.name}
          style={{ width: "48px", height: "48px", imageRendering: "pixelated" }}
        />
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Owner",
      accessor: "ownerName",
    },
    {
      header: "Stage",
      accessor: "stage",
      render: (value: number) => `Stage ${value}`,
    },
    {
      header: "Points",
      accessor: "totalPoints",
      render: (value: number) => (
        <span style={{ color: "#f7d51d" }}>{value.toLocaleString()}</span>
      ),
    },
    {
      header: "Balance",
      accessor: "balance",
      render: (value: number) => (
        <span style={{ color: "#92cc41" }}>{value} $FRUTA</span>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (value: boolean) => (
        <span className={`nes-badge ${value ? "is-success" : "is-error"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (value: string) => (
        <Link href={`/regenmon/${value}`} target="_blank">
          <Button variant="primary" style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}>
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#92cc41" }}>
          👾 All Regenmons
        </h1>

        {/* Filters */}
        <AdminCard title="🔍 Filters">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {/* Search */}
            <div className="nes-field">
              <label htmlFor="search" style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                Search
              </label>
              <input
                type="text"
                id="search"
                className="nes-input is-dark"
                placeholder="Name or owner..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                style={{ fontSize: "0.8rem" }}
              />
            </div>

            {/* Status Filter */}
            <div className="nes-field">
              <label htmlFor="status" style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                Status
              </label>
              <div className="nes-select is-dark">
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Stage Filter */}
            <div className="nes-field">
              <label htmlFor="stage" style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                Stage
              </label>
              <div className="nes-select is-dark">
                <select
                  id="stage"
                  value={stageFilter}
                  onChange={(e) => {
                    setStageFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="all">All Stages</option>
                  <option value="1">Stage 1</option>
                  <option value="2">Stage 2</option>
                  <option value="3">Stage 3</option>
                  <option value="4">Stage 4</option>
                  <option value="5">Stage 5</option>
                </select>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Table */}
        <AdminCard title={`📋 Regenmons List (${regenmons.length})`}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="nes-text is-error" style={{ textAlign: "center", padding: "2rem" }}>
              ⚠️ {error}
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={regenmons} />

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
