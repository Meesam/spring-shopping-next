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
import {ChangePasswordRequest, User} from "@/types";
import {resetPassword} from "@/services/authService";
import {BiLoaderAlt} from "react-icons/bi";
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const formSchema = z.object({
    email: z.email({
        message: "Invalid email address.",
    }),
    newPassword: z.string().min(5, {
        message: "Password must be at least 5 characters.",
    }),
    confirmPassword: z.string().min(5, {
        message: "Password must be at least 5 characters.",
    })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});

const ChangePasswordForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    const mutation = useMutation({
        mutationFn: (changePasswordRequest: ChangePasswordRequest) => {
            return resetPassword(changePasswordRequest);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // @ts-ignore
        delete values.confirmPassword;
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
            toast.success("Password is changed, go to your registered email inbox and activate your account with OTP!");
            localStorage.setItem("temp-email",form.getValues().email);
            router.push('/activateaccount');
        }
    }, [mutation.isError, mutation.isSuccess, mutation.error, router]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');
            if (emailParam) {
                form.reset({ email: emailParam });
            }
        }
    }, []);

    return (<div className="flex items-center justify-center h-screen overflow-hidden">
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
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
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Enter your password"
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
                            <small>Already have an account?</small>
                            <Link href="/login" className="text-sm font-semibold text-blue-600">Login</Link>
                        </div>

                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>)
};

export default ChangePasswordForm;
