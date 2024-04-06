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

export const SemesterTable = () => {
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
          <Link to="/">
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
            <TableRow>
              <TableCell className="text-start">
                <div className="font-medium">Semester 1</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Credits : 19
                </div>
              </TableCell>
              <TableCell className="text-right">3.97</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
