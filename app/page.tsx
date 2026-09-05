import { ClosingSection } from "@/components/ClosingSection";
import { CoupleGallery } from "@/components/CoupleGallery";
import { Countdown } from "@/components/Countdown";
import { Hero } from "@/components/Hero";
import { InvitationMessage } from "@/components/InvitationMessage";
import { RSVP } from "@/components/RSVP";
import { Timeline } from "@/components/Timeline";
import { Venue } from "@/components/Venue";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Countdown />
      <InvitationMessage />
      <CoupleGallery />
      <Venue />
      <Timeline />
      <RSVP />
      <ClosingSection />
    </main>
  );
}
