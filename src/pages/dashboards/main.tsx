import { DashboardCard } from "@/components/custom/dashboard-card";
import { SemesterTable } from "@/components/custom/semester-table";
import { MdOutlineTimeline, MdTopic } from "react-icons/md";
import { SiWeightsandbiases } from "react-icons/si";

export const DashboardMain = () => {
  return (
    <div className="h-full w-full space-y-10 p-5">
      {/* cards */}
      <div className="flex flex-wrap justify-center gap-5">
        {/* semesters */}
        <DashboardCard title="Semesters" value="3">
          <MdOutlineTimeline className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>

        {/* subjects */}
        <DashboardCard title="Subjects" value="23">
          <MdTopic className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>

        {/* credits */}
        <DashboardCard title="Credits" value="45">
          <SiWeightsandbiases className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>
      </div>

      {/* table and chart */}
      <div className="">
        <SemesterTable />
      </div>
    </div>
  );
};
