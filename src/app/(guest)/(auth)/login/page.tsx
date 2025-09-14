import SignInForm from "@/app/(guest)/(auth)/login/_components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page ",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function Login() {
  return <SignInForm />;
}
