import { ClosingScene } from "@/components/home/ClosingScene";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { HeroCore } from "@/components/home/HeroCore";
import { IsoWorld } from "@/components/home/IsoWorld";
import { ModuleCards } from "@/components/home/ModuleCards";
import { ModuleTrack } from "@/components/home/ModuleTrack";
import { NepalScene } from "@/components/home/NepalScene";
import { ProofReveal } from "@/components/home/ProofReveal";
import { TradesScene } from "@/components/home/TradesScene";
import { WorkDeskScene } from "@/components/home/WorkDeskScene";

export default function Page() {
  return (
    <>
      <HeroCore>
        <IsoWorld props />
      </HeroCore>
      <ProofReveal>
        <IsoWorld props />
      </ProofReveal>
      <WorkDeskScene />
      <DashboardZoom />
      <NepalScene />
      <ModuleTrack>
        <ModuleCards />
      </ModuleTrack>
      <TradesScene />
      <ClosingScene>
        <IsoWorld />
      </ClosingScene>
    </>
  );
}
