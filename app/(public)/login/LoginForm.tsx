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
import {LoginRequest, LoginResponse} from "@/types";
import {loginUser} from "@/services/authService";
import {BiLoaderAlt} from "react-icons/bi";
import {toast} from "sonner";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    email: z.email({
        message: "Invalid email address.",
    }),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters.",
    }),
});

const LoginForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (loginRequest: LoginRequest) => {
            return loginUser(loginRequest);
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
                    "response" in mutation.error &&
                    // @ts-expect-error: response may exist on AxiosError
                    mutation.error.response?.data?.message) ||
                "Something went wrong";
            toast.error(errorMessage);
        }
        if (mutation.isSuccess) {
            toast.success("Login successful!");
            const user = mutation.data as LoginResponse;
            localStorage.setItem("accessToken", user.accessToken);
            localStorage.setItem("accessTokenExpiresAt", user.accessTokenExpiresAt);
            localStorage.setItem("refreshToken", user.refreshToken);
            localStorage.setItem("refreshTokenExpiresAt", user.refreshTokenExpiresAt);
            localStorage.setItem("user", JSON.stringify(user.user));
            router.push('/dashboard');
        }
    }, [mutation]);

    return (<div className="flex items-center justify-center h-screen overflow-hidden">
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
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
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center">
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
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
                            Login
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>)
};

export default LoginForm;
