import { ClosingScene } from "@/components/home/ClosingScene";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { Flows } from "@/components/home/Flows";
import { HeroCore } from "@/components/home/HeroCore";
import { IsoWorld } from "@/components/home/IsoWorld";
import { ModuleCards } from "@/components/home/ModuleCards";
import { ModuleTrack } from "@/components/home/ModuleTrack";
import { NepalScene } from "@/components/home/NepalScene";
import { ProofReveal } from "@/components/home/ProofReveal";
import { TradesScene } from "@/components/home/TradesScene";
import { VideoBlock } from "@/components/video/VideoBlock";
import { WorkDeskScene } from "@/components/home/WorkDeskScene";

export default function Page() {
  return (
    <>
      <HeroCore film={<VideoBlock id="master" />}>
        <IsoWorld props underlay={<Flows />} />
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
