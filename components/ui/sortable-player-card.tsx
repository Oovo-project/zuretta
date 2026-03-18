import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

import type { Player } from "@/types/game";
import { cn } from "@/lib/utils";

export function SortablePlayerCard({
  player,
  index,
}: {
  player: Player;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: player.id,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-center justify-between rounded-[20px] border border-cream-300 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] px-4 py-3 shadow-soft",
        isDragging && "opacity-60",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-soft"
          style={{ background: player.color }}
        >
          {index + 1}
        </div>
        <div>
          <div className="text-base font-semibold text-ink-900">{player.name}</div>
          <div className="text-xs font-medium text-ink-500">予想順位 {index + 1}</div>
        </div>
      </div>
      <button
        type="button"
        className="rounded-2xl border border-cream-300 bg-white p-2 text-amberglow-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
    </div>
  );
}
