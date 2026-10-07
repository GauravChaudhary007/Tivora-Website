import { ClosingScene } from "@/components/home/ClosingScene";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { Flows } from "@/components/home/Flows";
import { HomeHero } from "@/components/home/HomeHero";
import { IsoWorld } from "@/components/home/IsoWorld";
import { ModuleCards } from "@/components/home/ModuleCards";
import { ModuleTrack } from "@/components/home/ModuleTrack";
import { ModulesTour } from "@/components/home/ModulesTour";
import { NepalScene } from "@/components/home/NepalScene";
import { ProofReveal } from "@/components/home/ProofReveal";
import { Strengths } from "@/components/home/Strengths";
import { TourRail } from "@/components/home/TourRail";
import { TradesScene } from "@/components/home/TradesScene";
import { VideoBlock } from "@/components/video/VideoBlock";
import { WorkDeskScene } from "@/components/home/WorkDeskScene";

export default function Page() {
  return (
    <div className="home-flow">
      <TourRail />
      <HomeHero film={<VideoBlock id="master" />} />
      <Strengths />
      <ModulesTour>
        <IsoWorld props underlay={<Flows />} />
      </ModulesTour>
      <ProofReveal />
      <WorkDeskScene />
      <DashboardZoom />
      <NepalScene />
      <ModuleTrack>
        <ModuleCards />
      </ModuleTrack>
      <TradesScene />
      <ClosingScene />
    </div>
  );
}
