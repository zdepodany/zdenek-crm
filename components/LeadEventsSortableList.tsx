"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderLeadEvents } from "@/lib/actions";
import { LEAD_EVENT_TYPES, LEAD_EVENT_CONTACT_METHODS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { DeleteLeadEventButton } from "@/components/DeleteLeadEventButton";

export type LeadEventListItem = {
  id: string;
  type: string;
  date: string;
  method: string | null;
  note: string | null;
  webId: string | null;
  clientId: string | null;
};

type WebRef = { id: string; url: string; clientName: string };
type ClientRef = { id: string; name: string };

function SortableEventRow({
  item,
  web,
  client,
  leadId,
}: {
  item: LeadEventListItem;
  web: WebRef | null;
  client: ClientRef | null;
  leadId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
  };

  const getEventTypeLabel = (value: string) =>
    LEAD_EVENT_TYPES.find((t) => t.value === value)?.label ?? value;
  const getMethodLabel = (value: string) =>
    LEAD_EVENT_CONTACT_METHODS.find((m) => m.value === value)?.label ?? value;

  const dateObj = new Date(item.date);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 ${
        isDragging ? "shadow-md ring-2 ring-slate-300 dark:ring-slate-600" : ""
      }`}
    >
      <button
        type="button"
        className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-slate-400 hover:bg-slate-200/80 hover:text-slate-600 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-slate-300"
        aria-label="Přesunout akci"
        {...attributes}
        {...listeners}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm8-12a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {getEventTypeLabel(item.type)}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(dateObj)}
          </span>
          {item.method && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              ({getMethodLabel(item.method)})
            </span>
          )}
        </div>
        <div className="mt-1 space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
          {web && (
            <p>
              Web:{" "}
              <Link
                href={`/websites/${web.id}`}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {web.url ? web.url.replace(/^https?:\/\//, "") : "(bez adresy)"}
              </Link>
            </p>
          )}
          {client && (
            <p>
              Klient:{" "}
              <Link
                href={`/clients/${client.id}`}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {client.name}
              </Link>
            </p>
          )}
          {item.note && <p className="whitespace-pre-wrap">{item.note}</p>}
        </div>
      </div>
      <DeleteLeadEventButton eventId={item.id} leadId={leadId} />
    </div>
  );
}

type LeadEventsSortableListProps = {
  leadId: string;
  initialEvents: LeadEventListItem[];
  websites: WebRef[];
  clients: ClientRef[];
};

export function LeadEventsSortableList({
  leadId,
  initialEvents,
  websites,
  clients,
}: LeadEventsSortableListProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialEvents);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(initialEvents);
  }, [initialEvents]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    setIsSaving(true);
    try {
      await reorderLeadEvents(leadId, newItems.map((i) => i.id));
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      {isSaving && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Ukládám pořadí…</p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((item) => {
              const web = item.webId ? websites.find((w) => w.id === item.webId) ?? null : null;
              const client = item.clientId
                ? clients.find((c) => c.id === item.clientId) ?? null
                : null;
              return (
                <SortableEventRow
                  key={item.id}
                  item={item}
                  web={web}
                  client={client}
                  leadId={leadId}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Přetáhněte akci za ikonu ⋮⋮ pro změnu pořadí.
      </p>
    </div>
  );
}
