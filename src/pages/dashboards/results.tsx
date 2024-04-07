import { ResultTable } from "@/components";
import { subjectDataType } from "@/types";
import useStableRefs from "@/utils/use-stable-refs";
import { useState, useCallback, useEffect } from "react";

export const Results = () => {
  const [subjects, setSubjects] = useState<subjectDataType[]>([]);
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();

  // get subjects
  const getSubjects = useCallback(async () => {
    axiosPrivateInstance.current
      .get("/user/subject")
      .then((res) => {
        if (res.status === 200) setSubjects(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [axiosPrivateInstance]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  return (
    <div className="flex w-full flex-wrap p-2">
      {subjects.map((subject) => (
        <ResultTable
          key={subject.id}
          subject={subject}
          semesters={[
            {
              id: subject.id,
              name: subject.name,
            },
          ]}
          setSubjects={setSubjects}
        />
      ))}
    </div>
  );
};
