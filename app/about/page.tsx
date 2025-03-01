"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Updated sponsors with single image URLs
const sponsors = [
  {
    name: "Anthropic",
    image: "https://companieslogo.com/img/orig/anthropic_BIG-be6f1e6e.png?t=1700716362",
    website: "https://anthropic.com",
    description: "An AI research company focused on developing safe and ethical AI systems.",
  },
  {
    name: "AWS",
    image: "https://movielabs.com/wp-content/uploads/2022/10/aws-logo-png-4.png",
    website: "https://aws.amazon.com",
    description: "A leading cloud computing platform providing scalable infrastructure services.",
  },
  {
    name: "OpenRouter",
    image: "https://millpondresearch.com/img/openrouter-logo-transparent.png",
    website: "https://openrouter.ai",
    description: "A unified API gateway for accessing various AI language models.",
  },
];

// Team members remain unchanged
const teamMembers = [
  {
    name: "Leon Guertler",
    title: "Research @ A*Star",
    image: "/leon.jpeg",
    link: "https://x.com/LeonGuertler",
    isFirstAuthor: true,
  },
  {
    name: "Bobby Cheng",
    title: "Research @ A*Star",
    image: "/bobby.jpeg",
    link: "https://x.com/bobbycxy",
    isFirstAuthor: true,
  },
  {
    name: "Leshem Coshen",
    title: "Research @ MIT,\nMIT-IBM Watson lab",
    image: "/leshem.jpg",
    link: "https://x.com/LChoshen",
    isFirstAuthor: false,
  },
  {
    name: "Cheston Tan",
    title: "Research @ A*Star",
    image: "/cheston.jpeg",
    link: "https://www.a-star.edu.sg/cfar/about-cfar/our-team/dr-cheston-tan",
    isFirstAuthor: false,
  },
];

export default function AboutPage() {
  const [tooltips, setTooltips] = useState({
    Anthropic: { position: { x: 0, y: 0 }, show: false },
    AWS: { position: { x: 0, y: 0 }, show: false },
    OpenRouter: { position: { x: 0, y: 0 }, show: false },
  });

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 font-mono">About Us</h1>

      {/* Intro / Mission */}
      <section className="mb-12">
        <p className="text-lg text-gray-400 mb-4 font-mono">
          Don't focus on us, focus on getting Humanity to No. 1!
        </p>
      </section>

      {/* Sponsors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 font-mono">Our Sponsors</h2>
        <p className="mb-4 text-gray-400 font-mono">
          We actually are very grateful for the amazing support TextArena received from the community and the sponsors!
        </p>
        <p className="mb-6 text-gray-400 font-mono">
          If you're interested in supporting TextArena, please don't hesitate
          to reach out {" "}
          <Link
            href="mailto:guertlerlo@cfar.a-star.edu.sg"
            className="text-primary hover:underline font-mono"
          >
            guertlerlo@cfar.a-star.edu.sg
          </Link>
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex justify-center items-center w-[150px] h-[150px] p-2 rounded-lg bg-transparent transition-colors duration-300 ease-in-out hover:bg-gray-200 group relative"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left; // X position relative to the wrapper
                const y = e.clientY - rect.top; // Y position relative to the wrapper
                setTooltips((prev) => ({
                  ...prev,
                  [sponsor.name]: {
                    position: { x: x + 5, y: y + 5 }, // Offset to position below cursor
                    show: true,
                  },
                }));
              }}
              onMouseLeave={() => {
                setTooltips((prev) => ({
                  ...prev,
                  [sponsor.name]: {
                    ...prev[sponsor.name],
                    show: false,
                  },
                }));
              }}
            >
              <Link href={sponsor.website} target="_blank">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  width={sponsor.name === "AWS" ? 100 : 120}
                  height={sponsor.name === "AWS" ? 40 : 80}
                  className="max-w-full max-h-[80px] filter brightness-0 invert group-hover:filter-none group-hover:scale-110 transition-all duration-300 ease-in-out"
                />
              </Link>
              <div
                className={`absolute text-xs px-2 py-1 rounded w-48 font-mono bg-[hsl(var(--navbar))] text-[hsl(var(--navbar-foreground))] ${tooltips[sponsor.name].show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{
                  left: tooltips[sponsor.name].position.x,
                  top: tooltips[sponsor.name].position.y,
                  transform: "translate(-50%, 10px)", // Reduced downward shift to 10px
                  transition: "opacity 300ms ease-in-out", // Ensure smooth opacity transition
                }}
              >
                {sponsor.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 font-mono">Our Team</h2>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center w-40">
              <div className="flex justify-center">
                <Link href={member.link} target="_blank">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full mb-2 border-2 border-transparent hover:border-white transition-all hover:opacity-90"
                  />
                </Link>
              </div>
              <h3 className="font-medium text-white font-mono">
                {member.name}
                {member.isFirstAuthor && "*"}
              </h3>
              <p className="text-sm text-gray-400 whitespace-pre-line font-mono">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* First Authors Note */}
      <p className="text-gray-500 text-sm mt-16 mb-4 font-mono">
        * First authors
      </p>

      {/* Acknowledgements */}
      <section className="mt-4 pt-12 border-t">
        <h2 className="text-2xl font-semibold mb-4 font-mono">
          Acknowledgements
        </h2>
        <p className="font-mono text-gray-400">
          We would also like to thank our other contributors: <br />
          <span className="font-medium font-mono">Henry Mao</span>,{" "}
          <span className="font-medium font-mono">Gabriel Chua</span>,{" "}
          <span className="font-medium font-mono">Romir Patel</span>,{" "}
          <span className="font-medium font-mono">Ayudh Saxena</span>,{" "}
          <span className="font-medium font-mono">Vincent Cheng</span>, and{" "}
          {/* To add in Simon. */}

          <span className="font-medium font-mono">Dylan Hillier</span>.
        </p>
      </section>
    </div>
  );
}