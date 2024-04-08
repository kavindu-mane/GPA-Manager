import { Input } from "@/components/ui/input";
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
import { errorTypes, semesterDataType, subjectDataType } from "@/types";
import { transferZodErrors } from "@/utils/transfer-zod-errors";
import useStableRefs from "@/utils/use-stable-refs";
import { AddSemesterFormSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// default value for errors
const errorDefault: errorTypes = {
  semester: [],
  message: "",
};

export const AddSemester = ({
  setSemesters, // set semester details state
  setSubjects, // set all subject details state
  url = "add", // url for the request
  semester, // selected semester details
}: {
  setSemesters?: (val: semesterDataType) => void;
  setSubjects?: (val: subjectDataType[]) => void;
  url?: string;
  semester?: subjectDataType;
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
  const form = useForm<z.infer<typeof AddSemesterFormSchema>>({
    resolver: zodResolver(AddSemesterFormSchema),
    defaultValues: {
      semester: "",
    },
  });

  useEffect(() => {
    form.reset({
      semester: semester?.name || "",
    });
  }, [form, semester?.name]);

  // form submit handler
  const onSubmit = async (data: z.infer<typeof AddSemesterFormSchema>) => {
    setLoading(true);
    setErrors(errorDefault);

    // if url is add, then add semester
    if (url === "add") {
      await axiosPrivateInstance.current
        .post("/user/semester/" + url, data)
        .then((res) => {
          if (res.status === 201) {
            toast({
              title: "Semester successfully added",
              description: "Semester has been added successfully",
              className: "bg-green-500 text-white",
            });
            if (setSemesters) setSemesters(res.data.data);
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
      //  if url is update, then update semester
      await axiosPrivateInstance.current
        .put("/user/semester/" + url + "/" + semester?.id, data)
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Semester successfully updated",
              description: "Semester has been updated successfully",
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
        {/*semester */}
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem className="text-start">
              <FormLabel>Semester</FormLabel>
              <FormControl>
                <Input className="h-10" placeholder="Semester I" {...field} />
              </FormControl>
              <FormMessage>
                {errors?.semester && errors?.semester[0]}
              </FormMessage>
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
            <span className="capitalize">{url}</span> Semester
            <IoIosSend className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
