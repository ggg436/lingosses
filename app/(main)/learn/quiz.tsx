"use client";

import { Card } from "@/components/ui/card";

export const Quiz = () => {
  return (
    <Card className="h-full p-4 mb-4">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a lesson to start practicing
        </p>
      </div>
    </Card>
  );
}; 