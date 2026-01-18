"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function InlineEditorScript() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  useEffect(() => {
    if (!isEditMode) return;

    // Check if script is already loaded
    if (document.querySelector('script[data-cms-editor]')) return;

    const script = document.createElement("script");
    script.src = "https://backend-production-162b.up.railway.app/inline-editor.js";
    script.dataset.cmsOrg = "beckons";
    script.dataset.cmsApi = "https://backend-production-162b.up.railway.app";
    script.dataset.cmsAdmin = "https://sphereos-admin.vercel.app";
    script.dataset.cmsEditor = "true"; // marker to prevent duplicate loading
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount if needed
    };
  }, [isEditMode]);

  return null;
}
