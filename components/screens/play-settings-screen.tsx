import type { ReactNode } from "react";

import type { GameSettings } from "@/types/game";
import {
  CATEGORY_META,
  MODE_META,
  PLAYER_COUNT_OPTIONS,
  ROUND_OPTIONS,
} from "@/lib/question-bank";

import {
  ChoiceChip,
  PrimaryButton,
  ScreenContainer,
  ScreenHeading,
  SectionCard,
} from "../ui/primitives";

function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-amberglow-700">{label}</div>
      {children}
    </div>
  );
}

export function PlaySettingsScreen({
  settings,
  onChange,
  onStart,
}: {
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
  onStart: () => void;
}) {
  return (
    <ScreenContainer>
      <ScreenHeading title="プレイ設定" subtitle="ジャンルとモードを選ぼう" />

      <SectionCard className="space-y-6">
        <SettingsGroup label="プレイ人数">
          <div className="grid grid-cols-6 gap-2">
            {PLAYER_COUNT_OPTIONS.map((count) => (
              <ChoiceChip
                key={count}
                active={settings.playerCount === count}
                onClick={() => onChange({ playerCount: count })}
                className="px-0"
              >
                {count}
              </ChoiceChip>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup label="お題ジャンル">
          <div className="grid gap-2">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <ChoiceChip
                key={key}
                active={settings.category === key}
                onClick={() =>
                  onChange({ category: key as GameSettings["category"] })
                }
                className="w-full text-left"
              >
                <div>{meta.label}</div>
                <div className="mt-1 text-xs font-medium opacity-80">
                  {meta.description}
                </div>
              </ChoiceChip>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup label="モード">
          <div className="grid gap-2">
            {Object.entries(MODE_META).map(([key, meta]) => (
              <ChoiceChip
                key={key}
                active={settings.mode === key}
                onClick={() => onChange({ mode: key as GameSettings["mode"] })}
                className="w-full text-left"
              >
                <div>{meta.label}</div>
                <div className="mt-1 text-xs font-medium opacity-80">
                  {meta.description}
                </div>
              </ChoiceChip>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup label="ラウンド数">
          <div className="grid grid-cols-4 gap-2">
            {ROUND_OPTIONS.map((rounds) => (
              <ChoiceChip
                key={rounds}
                active={settings.rounds === rounds}
                onClick={() => onChange({ rounds })}
              >
                {rounds}
              </ChoiceChip>
            ))}
          </div>
        </SettingsGroup>
      </SectionCard>

      <PrimaryButton onClick={onStart}>ゲームスタート</PrimaryButton>
    </ScreenContainer>
  );
}
