"use client";

import { useEffect, useState } from "react";

import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

export default function Home() {

const [tables, setTables] = useState<any[]>([]);
const [editingId, setEditingId] =
  useState<string | null>(null);
  
useEffect(() => {

  const savedTables =
    localStorage.getItem("oysterTables");

  if (savedTables) {

    setTables(JSON.parse(savedTables));

  } else {

    setTables([
      {
        id: "1",
        status: "green",
        type: "T",
        position: 0,
        lastAction: "18/03/2026",
      },
      {
        id: "2",
        status: "blue",
        type: "N",
        position: 4,
        lastAction: "16/03/2026",
      },
      {
        id: "3",
        status: "yellow",
        type: "T",
        position: 10,
        lastAction: "12/03/2026",
      },
    ]);
  }

}, []);
useEffect(() => {

  localStorage.setItem(
    "oysterTables",
    JSON.stringify(tables)
  );

}, [tables]);

  const totalCases = 20;

  function addTable() {

  console.log("Ajout d'une table");

  const occupiedPositions = tables.map(
    (table) => table.position
  );

  let freePosition = -1;

  for (let i = 0; i < totalCases; i++) {

    if (!occupiedPositions.includes(i)) {
      freePosition = i;
      break;
    }
  }

  if (freePosition === -1) {

    alert("Plus de place disponible dans le parc");

    return;
  }

  const newTable = {
    id: Date.now().toString(),
    status: "yellow",
    type: "N",
    position: freePosition,
    lastAction: new Date().toLocaleDateString(),
  };

  setTables((prev) => [...prev, newTable]);
}

  function removeTable(id: string) {

    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette table ?"
    );

    if (!confirmDelete) return;

    setTables(
      tables.filter(
        (table) => table.id !== id
      )
    );
  }

  function changeStatus(id: string) {

    setTables(
      tables.map((table) => {

        if (table.id !== id) return table;

        let nextStatus = "green";

        if (table.status === "green")
          nextStatus = "blue";

        else if (table.status === "blue")
          nextStatus = "yellow";

        else if (table.status === "yellow")
          nextStatus = "red";

        else if (table.status === "red")
          nextStatus = "green";

        return {
          ...table,
          status: nextStatus,
          lastAction:
            new Date().toLocaleDateString(),
        };
      })
    );
  }


function resetTimer(id: string) {
    setTables(
    tables.map((table) => {

      if (table.id !== id) return table;

      return {
        ...table,
        lastAction:
          new Date().toLocaleDateString(),
      };
    })
  );
}


function editDate(id: string) {

  const newDate = prompt(
    "Entrer une nouvelle date (jj/mm/aaaa)"
  );

  if (!newDate) return;

  setTables(
    tables.map((table) => {

      if (table.id !== id) return table;

      return {
        ...table,
        lastAction: newDate,
      };
    })
  );
}

function updateDate(
  id: string,
  newDate: string
) {

  setTables(
    tables.map((table) => {

      if (table.id !== id) return table;

      return {
        ...table,
        lastAction: newDate,
      };
    })
  );

  setEditingId(null);
}

  function changeType(id: string) {

    setTables(
      tables.map((table) => {

        if (table.id !== id) return table;

        return {
          ...table,
          type:
            table.type === "T"
              ? "N"
              : "T",
        };
      })
    );
  }

  function handleDragEnd(event: any) {

    const { active, over } = event;

    if (!over) return;

    setTables((prev) =>
      prev.map((table) =>
        table.id === active.id
          ? {
              ...table,
              position: Number(over.id),
            }
          : table
      )
    );
  }

  function getColor(status: string) {

    if (status === "green")
      return "bg-green-500/30 border-green-500";

    if (status === "blue")
      return "bg-blue-500/30 border-blue-500";

    if (status === "yellow")
      return "bg-yellow-500/30 border-yellow-500";

    if (status === "red")
      return "bg-red-500/30 border-red-500";

    return "bg-slate-700 border-slate-600";
  }
function getDaysSince(dateString: string) {

  const parts = dateString.split("/");

  const date = new Date(
    Number(parts[2]),
    Number(parts[1]) - 1,
    Number(parts[0])
  );

  const today = new Date();

  const diffTime =
    today.getTime() - date.getTime();

  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  return diffDays;
}
  function getLabel(status: string) {

    if (status === "green")
      return "🟢 Retournée";

    if (status === "blue")
      return "🔵 Vendable";

    if (status === "yellow")
      return "🟡 Naissain";

    if (status === "red")
      return "🔴 Alerte";

    return "⬜";
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-5xl font-bold">
            OysterOS
          </h1>

          <p className="text-slate-400 mt-2">
            Gestion intelligente du parc
          </p>
        </div>

        <button
          onClick={addTable}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-2xl font-bold"
        >
          + Ajouter une table 
        </button> <a
  href="/map"
  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold"
>
  🛰️ Vue aérienne
</a>
        

      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <div className="grid grid-cols-5 gap-4">

          {Array.from({
            length: totalCases,
          }).map((_, index) => {

            const table = tables.find(
              (z) => z.position === index
            );

            return (
              <DropZone
                key={index}
                id={index.toString()}
              >

                {table && (
                  <DraggableTable
  table={table}
  color={getColor(table.status)}
  label={getLabel(table.status)}
  onDelete={() =>
    removeTable(table.id)
  }
  onChangeType={() =>
    changeType(table.id)
  }
  onChangeStatus={() =>
    changeStatus(table.id)
  }
  getDaysSince={getDaysSince}
  onResetTimer={() =>
  resetTimer(table.id)
  }
  editingId={editingId}
setEditingId={setEditingId}
updateDate={updateDate}
/>
                )}

              </DropZone>
            );
          })}

        </div>

      </DndContext>

    </div>
  );
}

function DropZone({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {

  const { setNodeRef, isOver } =
    useDroppable({
      id,
    });

  return (
    <div
      ref={setNodeRef}
      className={`
        h-44 rounded-3xl border-2
        flex items-center justify-center
        transition
        ${
          isOver
            ? "border-cyan-400 bg-cyan-400/10"
            : "border-slate-700 bg-slate-900"
        }
      `}
    >
      {children}
    </div>
  );
}

function DraggableTable({
  table,
  color,
  label,
  onDelete,
  onChangeType,
  onChangeStatus,
  getDaysSince,
  onResetTimer,
  editingId,
setEditingId,
updateDate,
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: table.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-full h-full rounded-3xl border-2
        relative p-4
        ${color}
      `}
    >

      <div
        {...listeners}
        {...attributes}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-500 w-8 h-8 rounded-full"
      >
        ×
      </button>

      <button
        onClick={onChangeType}
        className="absolute bottom-2 right-2 z-10 bg-black/40 hover:bg-black/70 px-3 py-1 rounded-xl"
      >
        {table.type}
      </button>

      <div className="flex flex-col items-center justify-center h-full text-center">

        <button
          onClick={onChangeStatus}
          className="z-10"
        >
          <p className="font-bold text-lg">
            {label}
          </p>
        </button>

        <p className="mt-2 text-sm">
          {table.type === "T"
            ? "🅣 Triploïde"
            : "🅝 Naturel"}
        </p>

        <p className="mt-3 text-xs text-slate-200">
          Dernière action :
        </p>

        {/*<p className="text-sm font-bold">
          {table.lastAction}
        </p>
        */}
        {editingId === table.id ? (

  <input
    type="text"
    defaultValue={table.lastAction}
    autoFocus
    onBlur={(e) =>
      updateDate(
        table.id,
        e.target.value
      )
    }
    onKeyDown={(e) => {

      if (e.key === "Enter") {

        updateDate(
          table.id,
          (
            e.target as HTMLInputElement
          ).value
        );
      }
    }}
    className="
      bg-black/40
      border border-cyan-400
      rounded-xl
      px-2 py-1
      text-sm
      text-center
      z-20 relative
    "
  />

) : (

  <button
    onClick={() =>
      setEditingId(table.id)
    }
    className="
      text-sm font-bold
      hover:text-cyan-300
      transition
      z-20 relative
    "
  >
    {table.lastAction}
  </button>

)}
<button
  onClick={onResetTimer}
  className="mt-3 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-2 rounded-xl text-sm font-bold z-20 relative"
>
  Intervention faite
</button>

<p
  className={`
    mt-2 text-xs font-bold
    ${
      getDaysSince(table.lastAction) > 15
        ? "text-red-400"
        : getDaysSince(table.lastAction) > 7
        ? "text-yellow-300"
        : "text-green-400"
    }
  `}
>
  ⏱️ {getDaysSince(table.lastAction)} jours
</p>
      </div>

    </div>
  );
}