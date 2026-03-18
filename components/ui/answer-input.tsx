import { Minus, Plus } from "lucide-react";

import { clamp } from "@/lib/utils";
import type { Question } from "@/types/game";

import { ChoiceChip, SectionCard } from "./primitives";

function buildValues(question: Question): number[] {
  const values: number[] = [];
  for (let value = question.min; value <= question.max; value += question.step) {
    values.push(value);
  }
  return values;
}

function formatValue(question: Question, value: number): string {
  return question.unit ? `${value}${question.unit}` : String(value);
}

export function AnswerInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  const values = buildValues(question);

  if (
    question.answerType === "scale_1_5" ||
    question.answerType === "scale_1_10" ||
    question.answerType === "custom_scale"
  ) {
    return (
      <SectionCard className="space-y-5">
        <div className="text-center">
          <div className="bg-gradient-to-r from-amberglow-600 to-amberglow-400 bg-clip-text font-display text-5xl font-extrabold text-transparent">
            {question.scaleLabels?.[value - question.min] ?? formatValue(question, value)}
          </div>
          <div className="mt-2 text-sm font-medium text-ink-500">
            {question.instructionText}
          </div>
        </div>
        <div
          className={
            question.answerType === "scale_1_10"
              ? "grid grid-cols-5 gap-2"
              : "grid grid-cols-2 gap-2"
          }
        >
          {values.map((entry, index) => {
            const label = question.scaleLabels?.[index] ?? entry;
            return (
              <ChoiceChip
                key={entry}
                active={value === entry}
                onClick={() => onChange(entry)}
                className="min-h-14"
              >
                {label}
              </ChoiceChip>
            );
          })}
        </div>
        <div className="flex justify-between text-xs font-semibold text-amberglow-600">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </SectionCard>
    );
  }

  if (question.answerType === "stepper") {
    return (
      <SectionCard className="space-y-5">
        <div className="text-center">
          <div className="bg-gradient-to-r from-amberglow-600 to-amberglow-400 bg-clip-text font-display text-5xl font-extrabold text-transparent">
            {formatValue(question, value)}
          </div>
          <div className="mt-2 text-sm font-medium text-ink-500">
            {question.instructionText}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onChange(clamp(value - question.step, question.min, question.max))}
            className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cream-300 bg-white text-amberglow-700 shadow-soft"
          >
            <Minus className="h-6 w-6" />
          </button>
          <div className="min-w-28 rounded-[24px] bg-cream-50 px-4 py-4 text-center text-sm font-semibold text-ink-700">
            {question.min} 〜 {question.max}
            {question.unit}
          </div>
          <button
            type="button"
            onClick={() => onChange(clamp(value + question.step, question.min, question.max))}
            className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cream-300 bg-white text-amberglow-700 shadow-soft"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-between text-xs font-semibold text-amberglow-600">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="space-y-5">
      <div className="text-center">
        <div className="bg-gradient-to-r from-amberglow-600 to-amberglow-400 bg-clip-text font-display text-5xl font-extrabold text-transparent">
          {formatValue(question, value)}
        </div>
        <div className="mt-2 text-sm font-medium text-ink-500">
          {question.instructionText}
        </div>
      </div>
      <div className="space-y-3">
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="zuretta-slider w-full"
        />
        <div className="flex justify-between text-xs font-semibold text-amberglow-600">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <ChoiceChip
          onClick={() => onChange(clamp(value - question.step, question.min, question.max))}
          className="px-3 py-2"
        >
          -{question.step}
        </ChoiceChip>
        <ChoiceChip
          onClick={() => onChange(clamp(value + question.step, question.min, question.max))}
          className="px-3 py-2"
        >
          +{question.step}
        </ChoiceChip>
      </div>
    </SectionCard>
  );
}
