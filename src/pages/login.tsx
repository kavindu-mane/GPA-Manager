import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { errorTypes } from "@/types";
import { transferZodErrors } from "@/utils/transfer-zod-errors";
import { LoginFormSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// default value for errors
const errorDefault: errorTypes = {
  email: [],
  password: [],
  message: "",
};

export const Login = () => {
  // error state
  const [errors, setErrors] = useState(errorDefault);
  // loading state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // toast hook
  const { toast } = useToast();

  // form hook
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // form submit handler
  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true);
    setErrors(errorDefault);
    await axios
      .post("/login", data)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Login successful",
            description: "Redirecting to dashboard...",
            className: "bg-green-500 text-white",
          });
          navigate("/", { replace: true });
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
  };

  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      {/* left side */}
      <div className="flex h-full items-center justify-center px-4 py-12">
        {/* login form */}
        <div className="mx-auto grid w-full max-w-md gap-6 rounded-sm p-6 shadow-sm ring-[1px] ring-slate-200 drop-shadow-xl">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="name@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {errors?.email && errors?.email[0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-10"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {errors?.password && errors?.password[0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/*common error message */}
                <FormMessage>{errors?.message}</FormMessage>

                <Button disabled={loading} type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </div>
          {/* sign up */}
          <div className="mt-4 flex justify-center gap-x-2 text-center text-sm">
            Don&apos;t have an account?
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      {/*right side -  image */}
      <div className="hidden bg-muted lg:block">
        <img
          src="/assets/login.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
