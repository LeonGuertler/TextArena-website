"use client";

import { useParams } from "next/navigation";
import { ModelDetails } from "@/components/model-details";


export default function ModelPage({ params }) {
  const modelName = decodeURIComponent(params.modelName);
  return <ModelDetails modelName={modelName} />;
}
