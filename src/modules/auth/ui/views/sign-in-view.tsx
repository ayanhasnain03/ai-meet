"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon, Github } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/");
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  const handleOAuth = (provider: "google" | "github") => {
    console.log(`Signing in with ${provider}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-8">
      <Card className="w-full max-w-4xl overflow-hidden border-none shadow-2xl md:grid md:grid-cols-2">
        <div className="p-6 md:p-10 space-y-6 bg-background">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="xyz@gmail.com"
                          {...field}
                        />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <Alert className="bg-destructive/10 border-none text-destructive">
                  <OctagonAlertIcon className="h-4 w-4" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Button type="submit" disabled={pending} className="w-full">
                Sign in
              </Button>

              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 h-px bg-border top-1/2" />
                <span className="bg-background px-3 text-sm text-muted-foreground relative z-10">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleOAuth("google")}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 488 512"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v98h135.7c-5.9 31.6-23.5 58.4-50.1 76.2v63.4h81.1c47.4-43.7 74.3-108.1 74.3-185.8zM249 500c67.3 0 123.7-22.4 164.9-60.8l-81.1-63.4c-22.9 15.5-52.2 24.7-83.8 24.7-64.3 0-118.9-43.4-138.4-101.7H25.6v64.1C66.5 441.3 151.3 500 249 500zM110.6 299.3c-10.4-30.6-10.4-63.6 0-94.2V140.9H25.6c-29.5 59.1-29.5 129.1 0 188.2l85-65.8zM249 97.6c35.2 0 67.1 12.1 92.1 35.7l69.1-69.1C373 27.5 314.7 0 249 0 151.3 0 66.5 58.7 25.6 140.9l85 64.2c19.5-58.3 74.1-101.7 138.4-101.7z" />
                  </svg>
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleOAuth("github")}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Form>
        </div>

        <div className="bg-gradient-to-br from-green-700 to-green-900 hidden md:flex flex-col items-center justify-center text-white px-6 py-10 gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            className="h-[92px] w-[92px]"
            height={92}
            width={92}
          />
          <p className="text-2xl font-semibold">Meet.Ai</p>
        </div>
      </Card>
    </div>
  );
};
