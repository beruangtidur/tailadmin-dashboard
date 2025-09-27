"use client";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  uoe: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
})


export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      uoe: "",
      password: "",
    },
  })

  // const loginAction = async (formData: FormData) => {
  //   toast.loading('Logging in...');
  //   const email = formData.get("email");
  //   const password = formData.get("password");

  //   const res = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/' });

  //   toast.dismiss();
  //   if (res?.error) {
  //     if (res?.error === "CredentialsSignin") {
  //       toast.error("Username or password is incorrect.");
  //     }
  //     else {
  //       toast.error("Something went wrong. Please try again.");
  //     }
  //   } else {
  //     toast.success('Logged in successfully!');
  //     window.location.href = '/';
  //   }
  // }

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    toast.loading('Logging in...');
    const { uoe, password } = values;

    const res = await signIn('credentials', { uoe, password, redirect: false, callbackUrl: '/' });

    toast.dismiss();
    if (res?.error) {
      if (res?.error === "CredentialsSignin") {
        toast.error("Username or password is incorrect.");
      }
      else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success('Logged in successfully!');
      window.location.href = '/';
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="uoe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email <span className="text-error-500">*</span>{" "}</FormLabel>
                      <FormControl>
                        <Input placeholder="yourUsername/Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password <span className="text-error-500">*</span>{" "}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="yourPassword" {...field} />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="sm">Login</Button>
              </form>
            </Form>
            {/* <form action={loginAction}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email/Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" name="email" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form> */}
{/* 
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
