import { ClosingScene } from "@/components/home/ClosingScene";
import { HomeHero } from "@/components/home/HomeHero";
import { DashboardFeature, KpiFeature, PlanningFeature, ProductionFeature, WorkDeskFeature } from "@/components/home/Features";
import { ModuleGrid } from "@/components/home/ModuleGrid";
import { NepalScene } from "@/components/home/NepalScene";
import { ApprovalFlow, EntryChain } from "@/components/home/ProcessDiagrams";
import { ProcessFlow } from "@/components/home/ProcessFlow";
import { Strengths } from "@/components/home/Strengths";
import { TourRail } from "@/components/home/TourRail";
import { TradesScene } from "@/components/home/TradesScene";
import { VideoBlock } from "@/components/video/VideoBlock";

export default function Page() {
  return (
    <div className="home-flow">
      <TourRail />
      <HomeHero film={<VideoBlock id="master" />} />
      <Strengths />
      <ProcessFlow />
      <WorkDeskFeature />
      <DashboardFeature />
      <KpiFeature />
      <EntryChain />
      <ApprovalFlow />
      <PlanningFeature />
      <ProductionFeature />
      <NepalScene />
      <ModuleGrid />
      <TradesScene />
      <ClosingScene />
    </div>
  );
}
