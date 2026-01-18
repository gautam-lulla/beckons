'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface InlineEditorLoaderProps {
  orgSlug: string;
  apiBase?: string;
  adminBase?: string;
}

/**
 * Loads the CMS inline editor script when ?edit=true is present in the URL.
 * This component has zero impact on normal visitors - the script only loads
 * when edit mode is explicitly requested.
 */
export function InlineEditorScript({
  orgSlug,
  apiBase = 'https://backend-production-162b.up.railway.app',
  adminBase = 'https://admin-gules-psi-18.vercel.app',
}: InlineEditorLoaderProps) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    console.log('[InlineEditorScript] isEditMode:', isEditMode, 'orgSlug:', orgSlug);

    if (!isEditMode) {
      console.log('[InlineEditorScript] Not in edit mode, skipping');
      return;
    }

    // Check if script is already loaded
    if (document.querySelector('script[data-cms-editor]')) {
      console.log('[InlineEditorScript] Script already loaded, skipping');
      return;
    }

    console.log('[InlineEditorScript] Loading inline editor script...');

    // Dynamically inject the editor script
    const script = document.createElement('script');
    script.src = `${apiBase}/inline-editor.js`;
    script.dataset.cmsOrg = orgSlug;
    script.dataset.cmsApi = apiBase;
    if (adminBase) {
      script.dataset.cmsAdmin = adminBase;
    }
    script.dataset.cmsEditor = 'true';
    script.defer = true;

    script.onload = () => console.log('[InlineEditorScript] Script loaded successfully');
    script.onerror = (e) => console.error('[InlineEditorScript] Script failed to load:', e);

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [isEditMode, orgSlug, apiBase, adminBase]);

  return null;
}

export default InlineEditorScript;
