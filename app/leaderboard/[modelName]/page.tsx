"use client";

import { useParams } from "next/navigation";
import { ModelDetails } from "@/components/model-details";

// export default function ModelPage() {
//   const params = useParams();
//   // Ensure that the parameter name matches your file name. For [modelName].tsx, use params.modelName.
//   const modelName = params.modelName;

//   console.log("Model name from URL:", modelName); // Check in the browser console

//   if (!modelName) {
//     return <div>Error: Model name is missing in URL</div>;
//   }

//   return <ModelDetails modelName={modelName} />;
// }

// export default function ModelPage({ params }) {
//   return <ModelDetails modelName={params.modelName} />
// }
export default function ModelPage({ params }) {
  const modelName = decodeURIComponent(params.modelName);
  return <ModelDetails modelName={modelName} />;
}
// export default function ModelPage({ params }) {
//   // params.modelName will be an array of URL segments, e.g., ["Model", "One"]
//   const modelName = params.modelName.join("/");
//   return <ModelDetails modelName={modelName} />;
// }
