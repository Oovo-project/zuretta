import { Dice5, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Player } from "@/types/game";

import {
  PlayerDot,
  PrimaryButton,
  ScreenContainer,
  ScreenHeading,
  SecondaryButton,
  SectionCard,
} from "../ui/primitives";

export function PlayerRegistrationScreen({
  players,
  playerCount,
  onAddPlayer,
  onRemovePlayer,
  onShuffle,
  onStart,
}: {
  players: Player[];
  playerCount: number;
  onAddPlayer: (name: string) => boolean;
  onRemovePlayer: (playerId: string) => void;
  onShuffle: () => void;
  onStart: () => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("ニックネームを入力してください。");
      return;
    }

    const added = onAddPlayer(trimmed);
    if (!added) {
      setMessage(`プレイヤーは ${playerCount} 人までです。`);
      return;
    }

    setName("");
    setMessage("");
  };

  return (
    <ScreenContainer>
      <ScreenHeading title="プレイヤー登録" subtitle="ニックネームを入力しよう" />

      <div className="flex items-center gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAdd();
            }
          }}
          placeholder="ニックネームを入力"
          className="h-14 flex-1 rounded-[20px] border border-cream-300 bg-white px-5 text-base text-ink-900 outline-none ring-0 placeholder:text-ink-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          aria-label="プレイヤーを追加"
          className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-amberglow-300 bg-cta-gradient text-white shadow-button transition duration-150 active:scale-[0.97]"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>
      <div className="text-xs font-medium text-amberglow-700">
        {message || `${players.length} / ${playerCount} 人を登録中`}
      </div>

      <SectionCard className="flex-1 space-y-3">
        <div className="text-sm font-bold text-amberglow-700">プレイヤー一覧</div>
        <div className="space-y-2">
          {players.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-300 px-4 py-6 text-center text-sm font-medium text-ink-500">
              まずは名前を追加してください。
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-[20px] border border-cream-300 bg-white/90 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <PlayerDot color={player.color} label={index + 1} />
                  <div>
                    <div className="font-semibold text-ink-900">{player.name}</div>
                    <div className="text-xs font-medium text-ink-500">
                      {index + 1} 番目に回答
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePlayer(player.id)}
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-2 text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <div className="space-y-3">
        <SecondaryButton onClick={onShuffle} disabled={players.length < 2}>
          <Dice5 className="mr-2 h-5 w-5" />
          順番をシャッフル
        </SecondaryButton>
        <PrimaryButton onClick={onStart} disabled={players.length !== playerCount}>
          この順番でスタート
        </PrimaryButton>
      </div>
    </ScreenContainer>
  );
}
