import { ClosingSection } from "@/components/ClosingSection";
import { CouplePortrait } from "@/components/CouplePortrait";
import { Countdown } from "@/components/Countdown";
import { Hero } from "@/components/Hero";
import { InvitationMessage } from "@/components/InvitationMessage";
import { RSVP } from "@/components/RSVP";
import { Seam } from "@/components/ui/Seam";
import { Timeline } from "@/components/Timeline";
import { Venue } from "@/components/Venue";

/**
 * The order here must match `SECTION_SURFACES` in `lib/tones.ts`, which decides
 * the stock each section is printed on and how it blends into its neighbours:
 *
 *   film → white → gold → cream → gold → white → beige → film
 *
 * The seams are the small ornaments printed across each join.
 */
export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Seam motif="rings" />
      <Countdown />
      <Seam motif="blossom" />
      <InvitationMessage />
      <Seam motif="leaf" />
      <CouplePortrait />
      <Seam motif="rings" />
      <Venue />
      <Seam motif="blossom" />
      <Timeline />
      <Seam motif="leaf" />
      <RSVP />
      <Seam motif="rings" />
      <ClosingSection />
    </main>
  );
}
