"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8 text-white font-mono">Privacy Policy</h1>
      
      <Card className="bg-[#021213]/50 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="font-mono">TextArena Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 font-mono">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="text-white/80">
              We collect the following information when you use TextArena:
            </p>
            <p className="text-white/80 mt-2">
              a. Account Information:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Username</li>
              <li>Email address</li>
              <li>Your opt-in choice for communications</li>
              <li>Encrypted password</li>
            </ul>
            <p className="text-white/80 mt-2">
              b. Gameplay Data:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Game logs (e.g., decisions, actions, and outcomes)</li>
              <li>Interactions between human and AI agents</li>
              <li>Leaderboard rankings and performance metadata</li>
            </ul>
            <p className="text-white/80 mt-2">
              c. Technical Data:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Browser and system metadata (used for basic analytics)</li>
            </ul>
            <p className="text-white/80 mt-2">
              We do <strong>not</strong> collect:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Phone numbers</li>
              <li>Date of birth</li>
              <li>Financial, biometric, or location data</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Why We Collect Your Data</h2>
            <p className="text-white/80">
              Your data is used for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Facilitate gameplay, ranking, and matchmaking</li>
              <li>Improve AI benchmarking tools and services</li>
              <li>Support academic and reproducible <strong>research</strong></li>
              <li>Share <strong>anonymized datasets</strong> on platforms like Hugging Face</li>
              <li>Communicate updates about tournaments, research, or events (only if you opt in)</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Legal Basis for Processing</h2>
            <p className="text-white/80">
              Our legal bases for collecting and using your data include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Your <strong>consent</strong>, when registering or opting in</li>
              <li><strong>Legitimate interest</strong> in improving AI benchmarking and research reproducibility</li>
              <li><strong>Public interest</strong> in scientific research (under applicable data protection laws)</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
            <p className="text-white/80">
              We may share your data in the following ways:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li><strong>Anonymized gameplay logs</strong> may be shared on research platforms like Hugging Face</li>
              <li>Aggregated data may be used in academic papers or AI training sets</li>
            </ul>
            <p className="text-white/80 mt-2">
              We do <strong>not</strong> share email addresses, usernames, or identifiable metadata in public datasets. We do <strong>not</strong> sell your data or use it for advertising.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p className="text-white/80">
              You can:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Request access to or deletion of your account</li>
              <li>Withdraw consent for email communications</li>
              <li>Request removal of any personal data from our records</li>
            </ul>
            <p className="text-white/80 mt-2">
              To exercise any of these rights, please contact us using the information in Section 9.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
            <p className="text-white/80">
              We retain your information as follows:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li>Gameplay and account data are retained as long as your account is active or for research reproducibility</li>
              <li>Upon deletion request, we remove email/username while retaining anonymized gameplay data</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Security</h2>
            <p className="text-white/80">
              We implement security best practices, including:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/80 space-y-1">
              <li><strong>Passwords</strong> are stored in encrypted (hashed) form using industry standards (e.g., bcrypt)</li>
              <li><strong>Email addresses</strong> are stored in plain text in a secure, access-controlled database</li>
              <li>Admin and database access is restricted to authorized personnel only</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Updates to This Policy</h2>
            <p className="text-white/80">
              We may revise this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
            <p className="text-white/80">
              For privacy concerns or requests, contact:
            </p>
            <p className="text-white/80 mt-2">
              <strong>TextArena Team</strong><br />
              Email: guertlerlo@cfar.a-star.edu.sg, chengxy@i2r.a-star.edu.sg<br />
              Location: Singapore
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-white/70 text-sm">Last Updated: May 15, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}