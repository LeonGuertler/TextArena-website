import Image from "next/image"
import Link from "next/link"

// Example sponsors with two images each: black/white + color
const sponsors = [
  {
    name: "Google",
    imageBW: "/google-bw.png",
    imageColor: "/google-color.png",
    website: "https://google.com",
    hoverText: "Google – Proud Sponsor",
    description: "A global technology company specializing in search, online advertising, and cloud computing."
  },
  {
    name: "Anthropic",
    imageBW: "/anthropic-bw.png",
    imageColor: "/anthropic-color.png",
    website: "https://anthropic.com",
    hoverText: "Anthropic – Proud Sponsor",
    description: "An AI research company focused on developing safe and ethical AI systems."
  },
  {
    name: "AWS",
    imageBW: "/aws-bw.png",
    imageColor: "/aws-color.png",
    website: "https://aws.amazon.com",
    hoverText: "AWS – Proud Sponsor",
    description: "A leading cloud computing platform providing scalable infrastructure services."
  },
  {
    name: "OpenRouter",
    imageBW: "/openrouter-bw.png",
    imageColor: "/openrouter-color.png",
    website: "https://openrouter.ai",
    hoverText: "OpenRouter – Proud Sponsor",
    description: "A unified API gateway for accessing various AI language models."
  },
]

// For team members, give each a “link” prop for the click-through
const teamMembers = [
  {
    name: "Leon Guertler",
    title: "Research @ A*Star",
    image: "/leon.jpeg", // If leon.jpg is in the "public" folder, use this path
    link: "https://x.com/LeonGuertler",
  },
  {
    name: "Bobby Cheng",
    title: "Research @ A*Star",
    image: "/bobby.jpeg",
    link: "https://x.com/bobbycxy",
  },
  {
    name: "Leshem Coshen",
    title: "Research @ MIT,\nMIT-IBM Watson lab",
    image: "/leshem.jpg",
    link: "https://x.com/LChoshen",
  },
  {
    name: "Henry Mao",
    title: "Independent Researcher",
    image: "/henry.jpg",
    link: "https://x.com/Calclavia",
  },
  {
    name: "Cheston Tan",
    title: "Research @ A*Star",
    image: "/cheston.jpeg",
    link: "https://www.a-star.edu.sg/cfar/about-cfar/our-team/dr-cheston-tan",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      {/* Intro / Mission */}
      <section className="mb-12">
        <p className="text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
          sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla
          enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
        </p>
      </section>

      {/* Sponsors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Sponsors</h2>
        <p className="mb-4">
          We are incredibly grateful for the support of our sponsors. Their generosity and belief in our mission
          have been instrumental in bringing TextArena to life. We extend our heartfelt thanks to Google,
          Anthropic, AWS, and OpenRouter for their invaluable contributions.
        </p>
        <p className="mb-6">
          If you're interested in supporting our project, please don't hesitate to reach out to us at{" "}
          <Link href="mailto:guertlerlo@cfar.a-star.edu.sg" className="text-primary hover:underline">
            guertlerlo@cfar.a-star.edu.sg
          </Link>
          . Your support can help us continue to innovate and expand the possibilities of AI-powered text
          adventures.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
        {sponsors.map((sponsor) => (
          <div key={sponsor.name} className="relative group inline-block p-8">
            <Link href={sponsor.website} target="_blank">
              {/* Black-and-white image */}
              <Image
                src={sponsor.imageBW}
                alt={sponsor.name}
                width={200}
                height={200}
                className="transition-opacity group-hover:opacity-0"
              />
              {/* Color image that appears on hover */}
              <Image
                src={sponsor.imageColor}
                alt={sponsor.name}
                width={200}
                height={200}
                className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {sponsor.description}
            </div>
          </div>
        ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
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
                    // Added a border hover effect and slight opacity change
                    className="rounded-full mb-2 border-2 border-transparent hover:border-white transition-all hover:opacity-90"
                  />
                </Link>
              </div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{member.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Acknowledgements */}
      <section className="mt-24 pt-12 border-t">
        <h2 className="text-2xl font-semibold mb-4">Acknowledgements</h2>
        <p>
          We would also like to thank our other contributors: <br />
          <span className="font-medium">Gabriel Chua</span>, <span className="font-medium">Romir Patel</span>,
          {" and "}<span className="font-medium">Dylan Hillier</span>.
        </p>
      </section>
    </div>
  )
}