"use client";

import { useParams } from "next/navigation";
import { ModelDetails } from "@/components/model-details-neurips";

export default function ModelPageWithIds() {
  const params = useParams();
  const modelName = decodeURIComponent(params.modelName);
  const modelId = params.modelId;
  const humanId = params.humanId;

  return <ModelDetails modelName={modelName} modelId={modelId} humanId={humanId} />;
}