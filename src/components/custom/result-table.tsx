/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { CircularProgressBar } from "react-percentage-bar";
import { FaPen } from "react-icons/fa6";
import {
  AddSemester,
  AddSubject,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  useToast,
} from "..";
import { MdArrowOutward, MdDeleteForever } from "react-icons/md";
import { semesterDataType, subjectDataType, tableDropDown } from "@/types";
import { calculateGPA, calculatePercentage } from "@/utils/calculate-gpa";
import useStableRefs from "@/utils/use-stable-refs";
import { ReactNode, useState } from "react";

export const ResultTable = ({
  semesters,
  subject,
  setSubjects,
}: {
  semesters: semesterDataType;
  subject: subjectDataType;
  setSubjects: (value: subjectDataType[]) => void;
}) => {
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();
  // toast hook
  const { toast } = useToast();
  const [open, setOpen] = useState<tableDropDown>({});

  // generate pdf
  const generatePdf = (semesterData: subjectDataType) => {
    const doc = new jsPDF();

    // add system name
    doc.setTextColor("#0000ff");
    doc.text("GPA Manager", 14, 10);
    doc.setTextColor("#000000");
    doc.setFontSize(12);
    doc.text("Semester Result - " + semesterData.name, 14, 17);

    autoTable(doc, {});
    const tableRows: any = [];

    semesterData.courses.forEach((course: any) => {
      const courseData = [
        course.name,
        course.credits,
        course.grade,
        course.gpa.toFixed(2),
      ];
      tableRows.push(courseData);
    });

    autoTable(doc, {
      startY: 22,
      head: [["Subject", "Credits", "Grade", "GPA"]],
      body: tableRows,
    });

    doc.save("Results.pdf");
  };

  // delete semester
  const deleteSemester = async (id: string) => {
    await axiosPrivateInstance.current
      .delete("/user/semester/delete/" + id)
      .then((res) => {
        if (res.status === 200) {
          // set subjects
          setSubjects(res.data.data);
          toast({
            title: "Semester successfully deleted",
            description: "Subject has been deleted successfully",
            className: "bg-green-500 text-white",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error deleting semester",
          description: error.response.data.message,
          className: "bg-red-500 text-white",
        });
      });
  };

  // delete subject
  const deleteSubject = async (id: number) => {
    await axiosPrivateInstance.current
      .delete("/user/subject/delete/" + id)
      .then((res) => {
        if (res.status === 200) {
          // set subjects
          setSubjects(res.data.data);
          toast({
            title: "Subject successfully deleted",
            description: "Subject has been deleted successfully",
            className: "bg-green-500 text-white",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error deleting subject",
          description: error.response.data.message,
          className: "bg-red-500 text-white",
        });
      });
  };

  // delete with dialog
  const deleteWithDialog = (subject: string, func: (val: any) => void) => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this{" "}
            {subject} and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={func}
            className="bg-red-500 hover:bg-red-600"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };

  // update with dialog
  const updateWithDialog = (subject: string, element: ReactNode) => {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {subject}</DialogTitle>
          <DialogDescription>
            Make changes to your {subject} here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* update semester */}
        {element}
      </DialogContent>
    );
  };

  return (
    <div className="w-full p-3 xl:w-1/2">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2 text-start">
            <CardTitle>Semester Result</CardTitle>
            <CardDescription className="flex items-center gap-x-3">
              {subject.name} Result
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-transparent">
                    <FaPen className="cursor-pointer" />
                  </button>
                </DialogTrigger>
                {updateWithDialog(
                  "semester",
                  <AddSemester
                    setSubjects={setSubjects}
                    url="update"
                    semester={subject}
                  />,
                )}
              </Dialog>
            </CardDescription>
          </div>
          <CircularProgressBar
            size={5}
            text={calculateGPA(subject.totalCredits, subject.gpa)}
            textStyle={{
              fontSize: "1rem",
              fontWeight: "500",
            }}
            percentage={calculatePercentage(subject.totalCredits, subject.gpa)}
            showPercentage={false}
            radius={30}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">GPA</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* subjects rows */}
              {subject.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="text-start">
                    <div className="font-medium">{course.name}</div>
                    <div className="flex flex-col gap-x-3 text-sm text-muted-foreground">
                      <span className="">Credits : {course.credits}</span>
                      <span className="">Grade : {course.grade}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {course.gpa.toFixed(2)}
                  </TableCell>
                  <TableCell className="">
                    <div className="flex w-full justify-end text-right">
                      {/* dropdown menu */}
                      <DropdownMenu
                        open={open[course.id]}
                        onOpenChange={(isOpen) => {
                          setOpen({ ...open, [course.id]: isOpen });
                        }}
                      >
                        <AlertDialog>
                          <Dialog>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <HiOutlineDotsHorizontal className="h-5 w-5 cursor-pointer" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[200px]"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuGroup>
                                {/* update subject*/}
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                </DialogTrigger>

                                {/*  delete subject */}
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-500 hover:!text-red-400">
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                            {/* delete dialog content */}
                            {deleteWithDialog("subject", () =>
                              deleteSubject(course.id),
                            )}
                            {/* edit dialog content */}
                            {updateWithDialog(
                              "subject",
                              <AddSubject
                                setSubjects={setSubjects}
                                subject={course}
                                url="update"
                                semester={subject.id}
                                semesters={semesters}
                              />,
                            )}
                          </Dialog>
                        </AlertDialog>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* button row */}
          <div className="flex pt-5 w-full justify-end">
            {/* delete with dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* delete button */}
                <Button
                  size="sm"
                  className="ml-auto min-w-28 gap-1 border border-red-400 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Delete
                  <MdDeleteForever className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              {/*  dialog content */}
              {deleteWithDialog("semester", () => deleteSemester(subject.id))}
            </AlertDialog>

            {/* download button */}
            <Button
              size="sm"
              className="ml-2 min-w-28 gap-1"
              onClick={() => generatePdf(subject)}
            >
              Download
              <MdArrowOutward className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
