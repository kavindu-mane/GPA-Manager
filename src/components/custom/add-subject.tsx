/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from "..";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { AddSubjectFormSchema } from "@/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transferZodErrors } from "@/utils/transfer-zod-errors";
import useStableRefs from "@/utils/use-stable-refs";
import { errorTypes, semesterDataType, subjectDataType } from "@/types";

// grade list
const grades = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
];

// default value for errors
const errorDefault: errorTypes = {
  semester: [],
  subject: [],
  grade: [],
  credits: [],
  message: "",
};

export const AddSubject = ({
  semesters,
  setSubjects,
  url = "add",
  id,
  semester,
  subject,
}: {
  semesters: semesterDataType;
  setSubjects?: (val: subjectDataType[]) => void;
  url?: string;
  id?: number;
  semester?: string;
  subject?: any;
}) => {
  // error state
  const [errors, setErrors] = useState(errorDefault);
  // loading state
  const [loading, setLoading] = useState(false);
  // toast hook
  const { toast } = useToast();
  // initialize axios private instance for authorized requests
  const { axiosPrivateInstance } = useStableRefs();
  // form hook
  const form = useForm<z.infer<typeof AddSubjectFormSchema>>({
    resolver: zodResolver(AddSubjectFormSchema),
    defaultValues: {
      semester: "",
      subject: "",
      grade: "",
      // @ts-ignore
      credits: "",
    },
  });

  useEffect(() => {
    form.reset({
      semester: semester || "",
      subject: subject?.name || "",
      grade: subject?.grade || "",
      credits: subject?.credits.toString() || "",
    });
  }, [form, semester, subject?.credits, subject?.grade, subject?.name]);

  // form submit handler
  const onSubmit = async (data: z.infer<typeof AddSubjectFormSchema>) => {
    setLoading(true);
    setErrors(errorDefault);

    // if url is add, then add subject
    if (url === "add") {
      await axiosPrivateInstance.current
        .post("/user/subject/add", data)
        .then((res) => {
          if (res.status === 201) {
            toast({
              title: "Subject successfully added",
              description: "Subject has been added successfully",
              className: "bg-green-500 text-white",
            });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            // if any validation error occurred
            setErrors(transferZodErrors(err.response.data).error);
          } else {
            setErrors((prev) => ({
              ...prev,
              message: err?.response?.data.message || err.message || err,
            }));
          }
        })
        .finally(() => {
          setLoading(false);
          form.reset();
        });
    } else if (url === "update") {
      //  if url is update, then update subject
      await axiosPrivateInstance.current
        .put("/user/subject/update/" + id, data)
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Subject successfully updated",
              description: "Subject has been updated successfully",
              className: "bg-green-500 text-white",
            });
            if (setSubjects) setSubjects(res.data.data);
          }
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            // if any validation error occurred
            setErrors(transferZodErrors(err.response.data).error);
          } else {
            setErrors((prev) => ({
              ...prev,
              message: err?.response?.data.message || err.message || err,
            }));
          }
        })
        .finally(() => {
          setLoading(false);
          form.reset();
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* semester */}
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem className="text-start">
              <FormLabel className="">Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder="Select a Semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id.toString()}>
                      {sem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage>
                {errors?.semester && errors?.semester[0]}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* subject name */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="text-start">
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  className="h-10"
                  placeholder="Programming I"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors?.subject && errors?.subject[0]}</FormMessage>
            </FormItem>
          )}
        />

        {/* grade */}
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem className="text-start">
              <FormLabel className="">Grade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder="Select a Grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage>{errors?.grade && errors?.grade[0]}</FormMessage>
            </FormItem>
          )}
        />

        {/* credits */}
        <FormField
          control={form.control}
          name="credits"
          render={({ field }) => (
            <FormItem className="text-start">
              <FormLabel className="">Credits</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder="Select a Credit Value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from(Array(10).keys()).map((credit) => {
                    return (
                      <SelectItem key={credit} value={(credit + 1).toString()}>
                        {credit + 1}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage>{errors?.credits && errors?.credits[0]}</FormMessage>
            </FormItem>
          )}
        />

        {/*common error message */}
        <FormMessage>{errors?.message}</FormMessage>

        {/* submit button */}
        <div className="flex justify-end">
          <Button
            disabled={loading}
            type="submit"
            size="sm"
            className="ml-auto gap-1"
          >
            <span className="capitalize">{url}</span> Subject
            <IoIosSend className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
