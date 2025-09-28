"use client"

import React from 'react';
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {ForgotPasswordRequest, LoginRequest, LoginResponse} from "@/types";
import {forgotPassword, loginUser} from "@/services/authService";
import {BiLoaderAlt} from "react-icons/bi";
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { cookies } from "next/headers";
import Link from "next/link";

const formSchema = z.object({
    email: z.email({
        message: "Invalid email address.",
    }),
});

const ForgotPasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (forgotPasswordRequest: ForgotPasswordRequest) => {
            return forgotPassword(forgotPasswordRequest);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    React.useEffect(() => {
        if (mutation.isError) {
            const errorMessage =
                (mutation.error &&
                    typeof mutation.error === "object" &&
                    "message" in mutation.error &&
                    mutation.error?.message) ||
                "Something went wrong";
            toast.error(errorMessage);
        }
        if (mutation.isSuccess) {
            toast.success("An reset password link has been sent to your email. Please check your email and follow the instructions to reset your password.");
        }
    }, [mutation.isError, mutation.isSuccess, mutation.error]);

    return (<div className="flex items-center justify-center h-screen overflow-hidden">
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <BiLoaderAlt className="animate-spin" />}
                            Submit
                        </Button>
                        <div className="flex items-center justify-center gap-1">
                            <small>Don't have an account?</small>
                            <Link href="/register" className="text-sm font-semibold text-blue-600">Register</Link>
                        </div>

                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>)
};

export default ForgotPasswordForm;
