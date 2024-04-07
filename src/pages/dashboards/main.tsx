/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardCard, OverallGPA, SemesterTable } from "@/components";
import { calculateGPA, calculatePercentage } from "@/utils/calculate-gpa";
import useStableRefs from "@/utils/use-stable-refs";
import { useState, useCallback, useEffect } from "react";
import { MdOutlineTimeline, MdTopic } from "react-icons/md";
import { SiWeightsandbiases } from "react-icons/si";

export const DashboardMain = () => {
  const [statistics, setStatistics] = useState<any>({});
  const [data, setData] = useState(null);
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();

  // get statistics
  const getStatistics = useCallback(async () => {
    axiosPrivateInstance.current
      .get("/user/statistics")
      .then((res) => {
        if (res.status === 200) {
          setStatistics(res.data.stats);
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [axiosPrivateInstance]);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  return (
    <div className="h-full w-full space-y-10 p-5">
      {/* cards */}
      <div className="flex flex-wrap justify-center gap-5">
        {/* semesters */}
        <DashboardCard
          title="Semesters"
          value={statistics?.totalSemesters || 0}
        >
          <MdOutlineTimeline className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>

        {/* subjects */}
        <DashboardCard title="Subjects" value={statistics?.totalSubjects || 0}>
          <MdTopic className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>

        {/* credits */}
        <DashboardCard title="Credits" value={statistics?.totalCredits || 0}>
          <SiWeightsandbiases className="h-4 w-4 text-muted-foreground" />
        </DashboardCard>
      </div>

      {/* table and chart */}
      <div className="flex flex-col gap-5 xl:flex-row">
        <SemesterTable data = {data} />
        <OverallGPA
          percentage={calculatePercentage(
            statistics?.totalCredits,
            statistics?.totalGPA,
          )}
          gpa={calculateGPA(statistics?.totalCredits, statistics?.totalGPA)}
        />
      </div>
    </div>
  );
};
