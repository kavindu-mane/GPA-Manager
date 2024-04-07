import { AddSemester, AddSubject } from "@/components";
import { semesterDataType } from "@/types";
import useStableRefs from "@/utils/use-stable-refs";
import { useCallback, useEffect, useState } from "react";

export const Manage = () => {
  const [semesters, setSemesters] = useState<semesterDataType>([]);
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();

  // get semesters
  const getSemesters = useCallback(async () => {
    axiosPrivateInstance.current
      .get("/user/subject")
      .then((res) => {
        if (res.status === 200) setSemesters(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [axiosPrivateInstance]);

  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  return (
    <div className="flex w-full flex-col gap-5 p-5 xl:flex-row">
      {/* add subject */}
      <fieldset className="grid w-full gap-6 rounded-lg border p-4 xl:w-1/2">
        <legend className="-ml-1 px-1 text-sm font-medium">Subject</legend>
        <AddSubject semesters={semesters} />
      </fieldset>

      {/* add semester */}
      <fieldset className="grid h-fit w-full gap-6 rounded-lg border p-4 xl:w-1/2">
        <legend className="-ml-1 px-1 text-sm font-medium">Semester</legend>
        <AddSemester setSemesters={setSemesters} />
      </fieldset>
    </div>
  );
};
