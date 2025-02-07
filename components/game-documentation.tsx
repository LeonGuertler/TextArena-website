import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

interface GameDocumentationProps {
  name: string
  description: string
  rules: string[]
  actionSpace: string
  observationSpace: string
  gameplay: string[]
  keyRules: { title: string; rules: string[] }[]
  rewards: { outcome: string; player: string; opponent: string }[]
  parameters: { name: string; type: string; description: string; impact: string[] }[]
  variants: { id: string; isOpen: string; numRows: string; numCols: string }[]
  exampleUsage: string
  troubleshooting: { issue: string; solution: string }[]
  contact: string
  gifSrc: string
}

export function GameDocumentation({
  name,
  description,
  rules,
  actionSpace,
  observationSpace,
  gameplay,
  keyRules,
  rewards,
  parameters,
  variants,
  exampleUsage,
  troubleshooting,
  contact,
  gifSrc,
}: GameDocumentationProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{name} Environment Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gameplay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square relative">
              <Image
                src={gifSrc || "/placeholder.svg"}
                alt={`${name} gameplay`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Action Space</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{actionSpace}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Observation Space</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{observationSpace}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Gameplay</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {gameplay.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Key Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {keyRules.map((section, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {section.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex}>{rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Reward for Player</TableHead>
                  <TableHead>Reward for Opponent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward, index) => (
                  <TableRow key={index}>
                    <TableCell>{reward.outcome}</TableCell>
                    <TableCell>{reward.player}</TableCell>
                    <TableCell>{reward.opponent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            {parameters.map((param, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">
                  {param.name} ({param.type})
                </h3>
                <p>{param.description}</p>
                <ul className="list-disc pl-5 mt-2">
                  {param.impact.map((item, impactIndex) => (
                    <li key={impactIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Env-id</TableHead>
                  <TableHead>is_open</TableHead>
                  <TableHead>num_rows</TableHead>
                  <TableHead>num_cols</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant, index) => (
                  <TableRow key={index}>
                    <TableCell>{variant.id}</TableCell>
                    <TableCell>{variant.isOpen}</TableCell>
                    <TableCell>{variant.numRows}</TableCell>
                    <TableCell>{variant.numCols}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{exampleUsage}</code>
            </pre>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            {troubleshooting.map((item, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{item.issue}</h3>
                <p>{item.solution}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{contact}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex justify-center">
        <Button>Play Now</Button>
      </div>
    </div>
  )
}

