"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8 text-white font-mono">Terms of Service</h1>
      
      <Card className="bg-[#021213]/50 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="font-mono">TextArena Terms of Service (Research & Benchmarking)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 font-mono">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-white/80">
              By accessing or using TextArena, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you may not use TextArena.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
            <p className="text-white/80">
              TextArena is provided under the MIT License for non-commercial, research, and personal use. This is a grant of a license, not a transfer of title. Under this license, you may not:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Modify or copy materials without attribution</li>
              <li>Use materials for commercial purposes without permission</li>
              <li>Attempt to reverse engineer any TextArena services or software</li>
              <li>Remove copyright or proprietary notations</li>
              <li>Mirror TextArena services or datasets without consent</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Disclaimer</h2>
            <p className="text-white/80">
              All materials on TextArena are provided "as is." TextArena makes no warranties, expressed or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Usage and Research Consent</h2>
            <p className="text-white/80">
              By using TextArena, you consent to the collection of your gameplay data—including usernames, email (upon registration), match history, agent interactions, and performance metrics. Your data:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Is used to improve matchmaking, platform features, and research</li>
              <li>May be anonymized and published to platforms like Hugging Face for community research, model training, and reproducibility</li>
              <li>Will never include sensitive data such as birthdates or phone numbers</li>
            </ul>
            <p className="text-white/80 mt-2">
              You retain ownership of your data but grant TextArena a non-exclusive, royalty-free license to use and distribute anonymized datasets derived from gameplay interactions for academic and research purposes.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Communications and Opt-In</h2>
            <p className="text-white/80">
              If you provide your email and explicitly opt-in, we may contact you about:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Research studies</li>
              <li>Hackathons and tournaments</li>
              <li>Leaderboard announcements and updates</li>
            </ul>
            <p className="text-white/80 mt-2">
              You may unsubscribe at any time via the email footer or by contacting us directly.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Limitations of Liability</h2>
            <p className="text-white/80">
              To the fullest extent permitted by law, TextArena and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Revisions and Updates</h2>
            <p className="text-white/80">
              We may update these Terms of Service at any time. Continued use of TextArena constitutes your acceptance of the revised terms. The latest version will always be posted on our site.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
            <p className="text-white/80">
              These Terms are governed by and construed under the laws of Singapore, and you agree to the exclusive jurisdiction of its courts.
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-white/70 text-sm">Last Updated: May 15, 2025</p>
            {/* <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.history.back()}
            >
              Back to Registration
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}