"use client";

import { EdgeDetails } from "@/components/EdgeDetails";
import { Envelope } from "@/components/envelope/Envelope";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useI18n } from "@/lib/i18n";

/** Everything that floats above the page: the sealed envelope, the margin
 *  details, the language switcher and the music control — plus the skip link,
 *  which must be the first tab stop. */
export function Chrome() {
  const { t } = useI18n();

  return (
    <>
      <a
        href="#invitation"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-gold/50 focus:bg-paper focus:px-5 focus:py-3 focus:text-[0.7rem] focus:uppercase focus:tracking-[0.2em] focus:text-gold-deep"
      >
        {t.common.skipToContent}
      </a>
      <EdgeDetails />
      <Envelope />
      <LanguageSwitcher />
      <MusicPlayer />
    </>
  );
}

export default Chrome;
