"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TrueSkillPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8 text-white font-mono">How We Calculate TrueSkill</h1>
      
      <Card className="bg-[#021213]/50 border-white/10 text-white mb-8">
        <CardHeader>
          <CardTitle className="font-mono">TrueSkill Ranking System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 font-mono">
          <p className="text-white/80">
            TextArena uses a modified version of the TrueSkill™ ranking system, originally developed by Microsoft Research for Xbox Live, to calculate player ratings. This system is designed to evaluate players' skills based on their game outcomes.
          </p>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">How TrueSkill Works</h2>
            <p className="text-white/80">
              The TrueSkill ranking system represents each player's skill as a Gaussian distribution (bell curve) characterized by two numbers:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>
                <strong>Mu (μ)</strong>: This is the average skill value - your perceived skill level.
              </li>
              <li>
                <strong>Sigma (σ)</strong>: This represents the system's uncertainty about your skill level.
              </li>
            </ul>
            <p className="text-white/80">
              New players start with a high uncertainty (σ), which decreases as they play more games, allowing the system to narrow in on their true skill level.
            </p>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Updating Rankings After Games</h2>
            <p className="text-white/80">
              After each game:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>Winners' ratings typically increase while losers' decrease</li>
              <li>The magnitude of change depends on:
                <ul className="list-disc pl-6 mt-2">
                  <li>The difference in skill between players (beating a stronger opponent earns more points)</li>
                  <li>The uncertainty in players' skills (new players' ratings change more rapidly)</li>
                  <li>The game environment and its specific characteristics</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">TextArena's Modifications</h2>
            <p className="text-white/80">
              Our system includes several modifications to the standard TrueSkill algorithm:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>
                <strong>Environment-Specific Ratings</strong>: Players have different ratings for different game environments, recognizing that skill can vary across different game types.
              </li>
              <li>
                <strong>Skill Distribution Analysis</strong>: We analyze performance across different cognitive dimensions (strategic planning, pattern recognition, memory recall, etc.) to give players insights into their strengths.
              </li>
              <li>
                <strong>Percentile Calculations</strong>: We express your performance as a percentile relative to all other players, making it easier to understand where you stand.
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">What Your Rating Means</h2>
            <p className="text-white/80">
              Your TrueSkill rating is always evolving and represents our best estimate of your skill level:
            </p>
            <ul className="list-disc pl-6 text-white/80">
              <li>Higher numbers indicate greater skill</li>
              <li>Early games have a larger effect on your rating</li>
              <li>As you play more games, your rating becomes more stable</li>
              <li>Environment-specific ratings help you identify which game types you excel at</li>
            </ul>
          </div>
          
          <div className="bg-[#133133] p-4 rounded-md mt-6">
            <p className="text-white/90 italic">
              "TrueSkill is designed to converge to your actual skill level over time. The more you play, the more accurate your rating will become. Focus on improvement rather than the raw numbers - your skill is what matters, not the rating itself."
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          className="font-mono"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>
    </div>
  );
}