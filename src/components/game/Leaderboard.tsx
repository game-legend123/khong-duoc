"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { Player } from "@/types";

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Bảng Xếp Hạng
        </CardTitle>
        <CardDescription>Những người chơi kiên trì nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Hạng</TableHead>
              <TableHead>Tên Người Chơi</TableHead>
              <TableHead className="text-right">Điểm Số</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={player.name} className={player.name === "Bạn" ? "bg-accent/20" : ""}>
                <TableCell className="font-medium text-lg">{index + 1}</TableCell>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="text-right font-bold text-accent text-lg">
                  {player.score.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
