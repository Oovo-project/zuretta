import { EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

import type { Player, Question } from "@/types/game";

import { AnswerInput } from "../ui/answer-input";
import { Badge, PrimaryButton, ScreenContainer, SectionCard } from "../ui/primitives";

export function SecretAnswerScreen({
  player,
  question,
  onConfirm,
}: {
  player: Player;
  question: Question;
  onConfirm: (value: number) => void;
}) {
  const [value, setValue] = useState(question.defaultValue);
  const accent = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${player.color}, #FF8C00)`,
    }),
    [player.color],
  );

  return (
    <ScreenContainer className="justify-between">
      <div className="space-y-6">
        <div className="flex justify-center">
          <Badge icon={<EyeOff className="h-4 w-4 text-amberglow-700" />}>
            他の人に見せないでください
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-soft"
            style={accent}
          >
            {player.order}
          </div>
          <div className="font-display text-[28px] font-extrabold text-ink-900">
            {player.name} の番
          </div>
        </div>

        <SectionCard className="py-6 text-center">
          <p className="text-lg font-bold text-ink-700">{question.text}</p>
        </SectionCard>

        <AnswerInput question={question} value={value} onChange={setValue} />
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={() => onConfirm(value)}>この回答で決定</PrimaryButton>
        <p className="text-center text-xs font-medium text-amberglow-700">
          確定後は変更できません
        </p>
      </div>
    </ScreenContainer>
  );
}
