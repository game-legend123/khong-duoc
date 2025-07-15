"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateRefusalResponse } from "@/ai/flows/generate-refusal-response";
import { Leaderboard } from "./Leaderboard";
import type { Player } from "@/types";
import {
  Shield,
  Trophy,
  HeartCrack,
  Swords,
  Loader2,
  Sparkles,
  PartyPopper,
} from "lucide-react";

export default function GameUI() {
  const [persistenceScore, setPersistenceScore] = useState(0);
  const [indomitableWillScore, setIndomitableWillScore] = useState(0);
  const [capitulationScore, setCapitulationScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const [refusal, setRefusal] = useState("Bạn muốn làm gì?");
  const [previousResponses, setPreviousResponses] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [leaderboard, setLeaderboard] = useState<Player[]>([
    { name: "Chiến Thần", score: 15500 },
    { name: "Vua Lì Đòn", score: 12000 },
    { name: "Kẻ Bất Bại", score: 9500 },
    { name: "Người Mới", score: 500 },
  ]);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const totalScore = persistenceScore + indomitableWillScore - capitulationScore;

  useEffect(() => {
    // Check if current player's score is high enough for leaderboard
    const lowestLeaderboardScore =
      leaderboard.length > 0 ? leaderboard[leaderboard.length - 1].score : 0;
    if (totalScore > lowestLeaderboardScore) {
      const newLeaderboard = [
        ...leaderboard,
        { name: "Bạn", score: totalScore },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
      setLeaderboard(newLeaderboard);
    }
  }, [totalScore]);

  const handleAction = async (formData: FormData) => {
    const action = formData.get("action") as string;
    if (!action) return;
    formRef.current?.reset();

    startTransition(async () => {
      setRefusal("");

      // Condition to succeed
      if (action.length > 50) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);

        setPersistenceScore((s) => s + 500);
        const newCombo = combo + 1;
        setCombo(newCombo);

        if (newCombo > 0 && newCombo % 3 === 0) {
          setIndomitableWillScore((s) => s + 3000);
          toast({
            title: "Combo 3x!",
            description: "+3000 Indomitable Will! Bạn thật không thể ngăn cản!",
            className: "bg-accent text-accent-foreground border-orange-500",
          });
        } else {
            toast({
                title: "Thành công!",
                description: "+500 Persistence! Nỗ lực của bạn đã được đền đáp!",
                className: "bg-green-500 text-white border-green-600",
            });
        }

      } else {
        // Condition to fail
        setCombo(0);
        try {
          const result = await generateRefusalResponse({
            action,
            previousResponses,
          });
          setRefusal(result.response);
          setPreviousResponses((prev) =>
            [...prev, result.response].slice(-5)
          );
        } catch (error) {
          setRefusal("Không Được! Hệ thống đang bận, thử lại sau.");
        }
      }
    });
  };

  const handleGiveUp = () => {
    startTransition(() => {
        setCapitulationScore((s) => s + 1000);
        setCombo(0);
        setRefusal("Bạn đã bỏ cuộc! Thật đáng tiếc.");
        toast({
            variant: "destructive",
            title: "Bỏ cuộc!",
            description: "-1000 Capitulation. Lần sau hãy kiên trì hơn nhé!",
        });
    });
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-destructive tracking-tighter">
            Không Được!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The Endless Refusal Game
          </p>
        </header>

        <section id="scoreboard" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <Card className="md:col-span-4">
                <CardHeader>
                    <CardTitle className="text-accent text-4xl font-black">
                        {totalScore.toLocaleString()}
                    </CardTitle>
                    <CardDescription>Tổng Điểm</CardDescription>
                </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-center space-x-2 md:flex-col md:space-x-0">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle>{persistenceScore.toLocaleString()}</CardTitle>
                  <CardDescription>Persistence</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-center space-x-2 md:flex-col md:space-x-0">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle>{indomitableWillScore.toLocaleString()}</CardTitle>
                  <CardDescription>Indomitable Will</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-center space-x-2 md:flex-col md:space-x-0">
                <HeartCrack className="h-8 w-8 text-slate-500" />
                <div>
                  <CardTitle>{capitulationScore.toLocaleString()}</CardTitle>
                  <CardDescription>Capitulation</CardDescription>
                </div>
              </CardHeader>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-center space-x-2 md:flex-col md:space-x-0">
                    <PartyPopper className="h-8 w-8 text-blue-500" />
                    <div>
                        <CardTitle>{combo}</CardTitle>
                        <CardDescription>Combo</CardDescription>
                    </div>
                </CardHeader>
             </Card>
          </div>
        </section>

        <section id="interaction" className="mb-8">
          <Card className="min-h-[200px] flex items-center justify-center text-center p-6 relative overflow-hidden">
             {showSuccess && (
              <div className="absolute inset-0 bg-accent/90 flex flex-col items-center justify-center z-10 animate-in fade-in-0 zoom-in-95">
                <Sparkles className="h-16 w-16 text-white animate-pulse" />
                <p className="text-4xl font-black text-white mt-4">THÀNH CÔNG!</p>
              </div>
            )}
            {isPending && !showSuccess && (
                <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
            )}
            {!isPending && !showSuccess && (
              <h2 className="text-3xl md:text-5xl font-bold text-destructive">
                {refusal}
              </h2>
            )}
          </Card>
        </section>

        <section id="actions" className="mb-8">
          <form
            ref={formRef}
            action={handleAction}
            className="flex flex-col md:flex-row gap-2 mb-2"
          >
            <Input
              name="action"
              placeholder="Nhập hành động của bạn ở đây (thử viết thật dài xem sao)..."
              className="flex-grow text-lg p-6"
              disabled={isPending}
            />
            <Button
              type="submit"
              size="lg"
              className="p-6 text-lg"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Swords className="mr-2 h-5 w-5" />
              )}
              Thực Hiện
            </Button>
          </form>
          <Button
            variant="destructive"
            className="w-full p-6 text-lg"
            onClick={handleGiveUp}
            disabled={isPending}
          >
            Bỏ Cuộc
          </Button>
        </section>

        <section id="leaderboard">
          <Leaderboard players={leaderboard} />
        </section>

        <footer className="text-center mt-12 text-muted-foreground text-sm">
            <p>Một sản phẩm được tạo bởi AI. Lấy cảm hứng từ sự từ chối.</p>
        </footer>
      </div>
    </div>
  );
}
