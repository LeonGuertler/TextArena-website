"use client";

import { useParams } from "next/navigation";
import { ModelDetails } from "@/components/model-details-neurips";

export default function ModelPage() {
  const params = useParams();
  const modelName = decodeURIComponent(params.modelName);

  return <ModelDetails modelName={modelName} />;
}