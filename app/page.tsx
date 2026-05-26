"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function MapPage() {
  const [viewMode, setViewMode] = useState<"satellite" | "schema">("schema");
  const [tables, setTables] = useState<any[]>([]);

  // Charger les tables depuis localStorage
  useEffect(() => {
    const savedTables = localStorage.getItem("oysterTables");
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    }
  }, []);

  // Configuration du parc : 4 rangées de 5 tables
  const rows = [
    { id: "A", label: "Rangée A", positions: [0, 1, 2, 3, 4] },
    { id: "B", label: "Rangée B", positions: [5, 6, 7, 8, 9] },
    { id: "C", label: "Rangée C", positions: [10, 11, 12, 13, 14] },
    { id: "D", label: "Rangée D", positions: [15, 16, 17, 18, 19] },
  ];

  function getTableAt(position: number) {
    return tables.find((t) => t.position === position);
  }

  function getStatusColor(status: string) {
    if (status === "green") return "bg-green-500";
    if (status === "blue") return "bg-blue-500";
    if (status === "yellow") return "bg-yellow-500";
    if (status === "red") return "bg-red-500";
    return "bg-slate-600";
  }

  function getStatusEmoji(status: string) {
    if (status === "green") return "🟢";
    if (status === "blue") return "🔵";
    if (status === "yellow") return "🟡";
    if (status === "red") return "🔴";
    return "⬜";
  }

  // Stats globales
  const stats = {
    total: tables.length,
    green: tables.filter((t) => t.status === "green").length,
    blue: tables.filter((t) => t.status === "blue").length,
    yellow: tables.filter((t) => t.status === "yellow").length,
    red: tables.filter((t) => t.status === "red").length,
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-bold">Carte du Parc</h1>
          <p className="text-slate-400 mt-2">
            {viewMode === "satellite" ? "Vue aérienne" : "Vue schématique"}
          </p>
        </div>

        <div className="flex gap-4">
          {/* Toggle de vue */}
          <button
            onClick={() =>
              setViewMode(viewMode === "satellite" ? "schema" : "satellite")
            }
            className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            {viewMode === "satellite" ? "📊 Vue schéma" : "🛰️ Vue satellite"}
          </button>

          <Link
            href="/"
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-2xl font-bold"
          >
            ← Retour
          </Link>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="p-6 flex gap-6 justify-center border-b border-slate-800">
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-slate-400 text-sm">Tables</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{stats.green}</p>
          <p className="text-slate-400 text-sm">Retournées</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.blue}</p>
          <p className="text-slate-400 text-sm">Vendables</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.yellow}</p>
          <p className="text-slate-400 text-sm">Naissain</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400">{stats.red}</p>
          <p className="text-slate-400 text-sm">Alertes</p>
        </div>
      </div>

      {/* Vue principale */}
      <div className="p-6">
        {viewMode === "satellite" ? (
          <SatelliteView
            rows={rows}
            getTableAt={getTableAt}
            getStatusColor={getStatusColor}
          />
        ) : (
          <SchemaView
            rows={rows}
            getTableAt={getTableAt}
            getStatusEmoji={getStatusEmoji}
            getStatusColor={getStatusColor}
          />
        )}
      </div>

      {/* Légende */}
      <div className="p-6 border-t border-slate-800">
        <div className="flex gap-6 justify-center text-sm">
          <span>🟢 Retournée</span>
          <span>🔵 Vendable</span>
          <span>🟡 Naissain</span>
          <span>🔴 Alerte</span>
          <span>⬜ Vide</span>
        </div>
      </div>
    </div>
  );
}

// ============ VUE SATELLITE ============
function SatelliteView({
  rows,
  getTableAt,
  getStatusColor,
}: {
  rows: any[];
  getTableAt: (pos: number) => any;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden">
      {/* Image de fond */}
      <img
        src="[images.unsplash.com](https://images.unsplash.com/photo-1500375592092-40eb2168fd21)"
        alt="Parc ostréicole"
        className="w-full h-full object-cover opacity-50"
      />

      {/* Grille superposée */}
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-8">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2">
            <span className="text-xs font-bold w-20 text-right text-cyan-300">
              {row.label}
            </span>
            <div className="flex gap-2">
              {row.positions.map((pos: number) => {
                const table = getTableAt(pos);
                return (
                  <div
                    key={pos}
                    className={`
                      w-12 h-20 rounded-lg border-2
                      flex items-center justify-center
                      backdrop-blur-sm
                      transition hover:scale-110 cursor-pointer
                      ${
                        table
                          ? `${getStatusColor(table.status)} border-white/50`
                          : "bg-slate-800/50 border-slate-600"
                      }
                    `}
                    title={
                      table
                        ? `${table.type} - ${table.lastAction}`
                        : "Emplacement vide"
                    }
                  >
                    {table && (
                      <span className="text-xs font-bold">{table.type}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Labels mer/estran */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
        🌊 Côté Mer
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
        🏖️ Côté Estran
      </div>
    </div>
  );
}

// ============ VUE SCHÉMATIQUE ============
function SchemaView({
  rows,
  getTableAt,
  getStatusEmoji,
  getStatusColor,
}: {
  rows: any[];
  getTableAt: (pos: number) => any;
  getStatusEmoji: (status: string) => string;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicateur mer */}
      <div className="text-center mb-4">
        <div className="inline-block bg-blue-500/20 border border-blue-500/50 px-6 py-2 rounded-full">
          🌊 MER
        </div>
      </div>

      {/* Grille schématique */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-3xl p-6">
        {rows.map((row, rowIndex) => (
          <div key={row.id}>
            <div className="flex items-center gap-4 py-4">
              {/* Label rangée */}
              <div className="w-24 text-right">
                <span className="text-cyan-400 font-bold">{row.label}</span>
              </div>

              {/* Tables de la rangée */}
              <div className="flex-1 flex justify-around">
                {row.positions.map((pos: number) => {
                  const table = getTableAt(pos);
                  return (
                    <div
                      key={pos}
                      className={`
                        w-16 h-24 rounded-xl border-2
                        flex flex-col items-center justify-center
                        transition hover:scale-105 cursor-pointer
                        ${
                          table
                            ? `${getStatusColor(table.status)}/30 border-current`
                            : "bg-slate-800/30 border-slate-700 border-dashed"
                        }
                      `}
                      style={{
                        borderColor: table
                          ? getStatusColor(table.status).replace("bg-", "")
                          : undefined,
                      }}
                    >
                      {table ? (
                        <>
                          <span className="text-2xl">
                            {getStatusEmoji(table.status)}
                          </span>
                          <span className="text-xs mt-1 font-bold">
                            {table.type}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-600 text-2xl">┃┃</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stats de la rangée */}
              <div className="w-20 text-left text-xs text-slate-400">
                {row.positions.filter((p: number) => getTableAt(p)).length}/
                {row.positions.length} tables
              </div>
            </div>

            {/* Séparateur entre rangées */}
            {rowIndex < rows.length - 1 && (
              <div className="border-t border-slate-700/50 mx-24" />
            )}
          </div>
        ))}
      </div>

      {/* Indicateur estran */}
      <div className="text-center mt-4">
        <div className="inline-block bg-amber-500/20 border border-amber-500/50 px-6 py-2 rounded-full">
          🏖️ ESTRAN
        </div>
      </div>
    </div>
  );
}
