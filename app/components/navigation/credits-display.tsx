"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePionextCredits } from "@/contexts/pionext-credits-context";

export function CreditsDisplay() {
  const { balance, isLoading } = usePionextCredits();

  if (isLoading) {
    return null;
  }

  return (
    <Button variant="ghost" asChild className="flex items-center gap-2">
      <Link href="/profile">
        <Coins className="h-4 w-4" />
        <span>{balance.toLocaleString()} PIONEXT</span>
      </Link>
    </Button>
  );
} 