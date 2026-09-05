"use client";

import type { ReactNode } from "react";
import { AudioProvider } from "@/lib/audio";
import { GateProvider } from "@/lib/gate";
import { I18nProvider } from "@/lib/i18n";
import { MediaContext, type MediaAvailability } from "@/lib/media";

export function Providers({
  children,
  media,
}: {
  children: ReactNode;
  /** Resolved on the server — see `lib/media.server.ts`. */
  media: MediaAvailability;
}) {
  return (
    <MediaContext.Provider value={media}>
      <I18nProvider>
        <AudioProvider>
          <GateProvider>{children}</GateProvider>
        </AudioProvider>
      </I18nProvider>
    </MediaContext.Provider>
  );
}

export default Providers;
