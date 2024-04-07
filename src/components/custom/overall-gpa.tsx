import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "..";
import { CircularProgressBar } from "react-percentage-bar";

export const OverallGPA = ({
  percentage,
  gpa,
}: {
  percentage: number;
  gpa: string;
}) => {
  return (
    <Card className="h-fit xl:w-1/2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2 text-start">
          <CardTitle>Overall GPA</CardTitle>
          <CardDescription>
            The GPA of all the semesters combined
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center p-10">
        <CircularProgressBar
          showPercentage={false}
          percentage={percentage}
          radius={120}
          text={gpa}
          textStyle={{
            fontSize: "3rem",
          }}
        />
      </CardContent>
    </Card>
  );
};
