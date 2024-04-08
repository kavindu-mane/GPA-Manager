/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdArrowOutward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { calculateGPA } from "@/utils/calculate-gpa";
import { subjectDataType } from "@/types";

export const SemesterTable = ({ data }: { data: any }) => {
  return (
    <Card className="xl:w-1/2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2 text-start">
          <CardTitle>Semester Result</CardTitle>
          <CardDescription>
            A list of all the semesters and their GPA
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/results">
            View All
            <MdArrowOutward className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semester</TableHead>
              <TableHead className="text-right">GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* map through the data and create a table row for each semester */}
            {data?.map((semester: subjectDataType) => (
              <TableRow key={semester.id}>
                <TableCell className="text-start">
                  <div className="font-medium">{semester.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    Credits : {semester.totalCredits}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {calculateGPA(semester?.totalCredits, semester?.gpa)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
