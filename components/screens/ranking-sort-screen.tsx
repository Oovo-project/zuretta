import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import type { Player, Question } from "@/types/game";

import { SortablePlayerCard } from "../ui/sortable-player-card";
import {
  PrimaryButton,
  ScreenContainer,
  ScreenHeading,
  SecondaryButton,
} from "../ui/primitives";

export function RankingSortScreen({
  players,
  question,
  onConfirm,
}: {
  players: Player[];
  question: Question;
  onConfirm: (playerIds: string[]) => void;
}) {
  const [orderedPlayers, setOrderedPlayers] = useState(players);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setOrderedPlayers((current) => {
      const oldIndex = current.findIndex((player) => player.id === active.id);
      const newIndex = current.findIndex((player) => player.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeading title="みんなで予想しよう" subtitle={question.rankingHint} />

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="flex w-8 flex-col items-center justify-between text-[11px] font-semibold text-amberglow-700">
          <span>
            {question.min}
            {question.unit}
          </span>
          <div className="relative flex flex-1 items-center">
            <div className="h-full w-0.5 rounded-full bg-gradient-to-b from-mint via-ink-300 to-pink" />
          </div>
          <span>
            {question.max}
            {question.unit}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedPlayers.map((player) => player.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedPlayers.map((player, index) => (
                <SortablePlayerCard key={player.id} player={player} index={index} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="space-y-3">
        <SecondaryButton onClick={() => setOrderedPlayers(players)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          やり直す
        </SecondaryButton>
        <PrimaryButton onClick={() => onConfirm(orderedPlayers.map((player) => player.id))}>
          この順番で決定
        </PrimaryButton>
      </div>
    </ScreenContainer>
  );
}
