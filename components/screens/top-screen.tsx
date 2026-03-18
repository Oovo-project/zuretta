import { BookOpen, Play, Smartphone, Users } from "lucide-react";

import { questionBank } from "@/lib/question-bank";

import {
  Badge,
  LogoMark,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
} from "../ui/primitives";

export function TopScreen({
  onStart,
  onShowHowTo,
}: {
  onStart: () => void;
  onShowHowTo: () => void;
}) {
  return (
    <ScreenContainer className="justify-center">
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="space-y-5 text-center">
          <div className="flex justify-center">
            <LogoMark />
          </div>
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-amberglow-400 via-amberglow-500 to-amberglow-600 bg-clip-text font-display text-5xl font-extrabold text-transparent">
              ズレッタ
            </h1>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-ink-500">
              zuretta
            </p>
            <p className="text-lg font-semibold text-amberglow-700">
              ホンネのズレを楽しむパーティーゲーム
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge icon={<Users className="h-4 w-4" />}>3〜8人</Badge>
            <Badge icon={<Smartphone className="h-4 w-4" />}>スマホ1台</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <PrimaryButton onClick={onStart}>
            <Play className="mr-2 h-5 w-5" />
            いますぐ遊ぶ
          </PrimaryButton>
          <SecondaryButton onClick={onShowHowTo}>
            <BookOpen className="mr-2 h-5 w-5" />
            遊び方
          </SecondaryButton>
        </div>

        <div className="space-y-3 rounded-[28px] border border-cream-300 bg-white/75 px-5 py-4 text-center shadow-soft">
          <p className="text-sm font-semibold text-amberglow-700">
            みんなのホンネ、ズレてない？
          </p>
          <p className="text-sm font-medium text-amberglow-600">
            ホンネのギャップで盛り上がろう
          </p>
          <p className="text-xs font-medium text-ink-500">
            初期お題 {questionBank.length} 問。秘密回答 → 予想 → 公開までスマホ1台で完結。
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
