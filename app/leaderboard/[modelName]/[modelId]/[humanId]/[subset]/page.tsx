
"use client";

import { useParams } from "next/navigation";
import { ModelDetails } from "@/components/model-details";

export default function ModelPageWithIds() {
  const params = useParams();
  const modelName = decodeURIComponent(params.modelName as string);
  const modelId = params.modelId;
  const humanId = params.humanId;
  const subset = params.subset ? decodeURIComponent(params.subset as string) : "All"; // Extract the subset parameter with default

  return <ModelDetails modelName={modelName} modelId={modelId} humanId={humanId} subset={subset} />;
}