'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userAtom } from "@/app/atoms";
import { useSetAtom } from "jotai";
import { login } from "../queries/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
})

export default function SignIn() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      const response = await login(formData);

      if (response.ok) {
        setUser({
          name: values.name,
          email: values.email,
        })
        toast.success("Login successful");
        router.push("/home");
      } else {
        throw new Error("Invalid credentials");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-y-8 shadow p-10 rounded">
        <h1 className="text-2xl font-medium text-center">Login</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@doe.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
      </form>
    </Form>
  );
}
