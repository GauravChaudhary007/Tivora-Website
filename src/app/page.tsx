import { ClosingScene } from "@/components/home/ClosingScene";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { HeroCore } from "@/components/home/HeroCore";
import { IsoWorld } from "@/components/home/IsoWorld";
import { ModuleTrack } from "@/components/home/ModuleTrack";
import { NepalScene } from "@/components/home/NepalScene";
import { OneBillScene } from "@/components/home/OneBillScene";
import { ProofReveal } from "@/components/home/ProofReveal";
import { TradesScene } from "@/components/home/TradesScene";
import { WorkDeskScene } from "@/components/home/WorkDeskScene";

export default function Page() {
  return (
    <>
      <HeroCore>
        <IsoWorld collapsed />
      </HeroCore>
      <OneBillScene>
        <IsoWorld props />
      </OneBillScene>
      <ProofReveal>
        <IsoWorld />
      </ProofReveal>
      <WorkDeskScene />
      <DashboardZoom />
      <NepalScene />
      <ModuleTrack />
      <TradesScene />
      <ClosingScene>
        <IsoWorld />
      </ClosingScene>
    </>
  );
}
