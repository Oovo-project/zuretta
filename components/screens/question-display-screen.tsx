import { Clock3, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { CATEGORY_META } from "@/lib/question-bank";
import type { Question } from "@/types/game";

import {
  Badge,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  SectionCard,
} from "../ui/primitives";

export function QuestionDisplayScreen({
  question,
  roundIndex,
  totalRounds,
  canChangeQuestion,
  onChangeQuestion,
  onAnswer,
}: {
  question: Question;
  roundIndex: number;
  totalRounds: number;
  canChangeQuestion: boolean;
  onChangeQuestion: () => void;
  onAnswer: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(question.timerSeconds);

  useEffect(() => {
    setSecondsLeft(question.timerSeconds);
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [question.id, question.timerSeconds]);

  return (
    <ScreenContainer className="justify-center">
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="flex justify-center">
          <Badge>
            ラウンド {roundIndex + 1} / {totalRounds}
          </Badge>
        </div>

        <SectionCard className="space-y-5 px-7 py-9 text-center">
          <div className="flex justify-center">
            <Badge icon={<Sparkles className="h-4 w-4" />}>
              {CATEGORY_META[question.category].label}
            </Badge>
          </div>
          <h2 className="font-display text-[32px] font-extrabold leading-tight text-ink-900">
            {question.text}
          </h2>
          <p className="text-base font-semibold text-amberglow-700">
            {question.instructionText}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Clock3 className="h-4 w-4 text-amberglow-600" />
            <span>残り {secondsLeft} 秒</span>
          </div>
        </SectionCard>

        <div className="space-y-3">
          <SecondaryButton onClick={onChangeQuestion} disabled={!canChangeQuestion}>
            <RefreshCw className="mr-2 h-4 w-4" />
            お題を変える
          </SecondaryButton>
          <PrimaryButton onClick={onAnswer}>回答する</PrimaryButton>
        </div>
      </div>
    </ScreenContainer>
  );
}
