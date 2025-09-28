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
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {ActivateUserByOtpRequest, NewOtpRequest} from "@/types";
import {activateUserByOtp, generateNewOtp} from "@/services/authService";
import {BiLoaderAlt} from "react-icons/bi";
import {toast} from "sonner";
import {useRouter} from 'next/navigation';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const formSchema = z.object({
    otp: z.string().min(6, {
        message: "OTP must be 6 characters.",
    }),
})

const ActivateAccountPage = () => {
    const router = useRouter();
    const [isNewOtpGenerated, setIsNewOtpGenerated] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(300); // 60 seconds = 1 minute
    const [isRunning, setIsRunning] = React.useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        }
    });

    const mutation = useMutation({
        mutationFn: (activateUserByOtpRequest: ActivateUserByOtpRequest) => {
            return activateUserByOtp(activateUserByOtpRequest)
        },
    });

    const newOtpMutation = useMutation({
        mutationFn: (newOtpRequest: NewOtpRequest) => {
            return generateNewOtp(newOtpRequest)
        },
    })

    const onNewGenerate = () => {
        const payload = {
            email: localStorage.getItem("temp-email") || ""
        }
        newOtpMutation.mutate(payload);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        debugger
        const payload = {
            ...values,
            email: localStorage.getItem("temp-email") || ""
        }
        mutation.mutate(payload);
    };

    React.useEffect(() => {
        if (mutation.isError) {
            debugger
            const errorMessage =
                (mutation.error &&
                    typeof mutation.error === "object" &&
                    "message" in mutation.error &&
                    mutation.error?.message) ||
                "Something went wrong";
            toast.error(errorMessage);
        }
        if (mutation.isSuccess) {
            toast.success("Your account is activated successfully, you can login now!");
            localStorage.removeItem("temp-email");
            router.push('/login');
        }
    }, [mutation.isError, mutation.isSuccess, mutation.error, router]);

    React.useEffect(() => {
        if (newOtpMutation.isError) {
            const errorMessage =
                (newOtpMutation.error &&
                    typeof newOtpMutation.error === "object" &&
                    "message" in newOtpMutation.error &&
                    newOtpMutation.error?.message) ||
                "Something went wrong";
            toast.error(errorMessage);
        }
        if (newOtpMutation.isSuccess) {
            toast.success("New OTP is generated successfully, please check your registered email inbox and activate your account with new OTP!");
            setIsNewOtpGenerated(true)
            setTimeLeft(300);
            setIsRunning(true);
        }
    }, [newOtpMutation.isError, newOtpMutation.isSuccess, newOtpMutation.error, router]);

    const startTimer = () => {
        setTimeLeft(300);
        setIsRunning(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


    React.useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prevTime: number) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            setIsNewOtpGenerated(true)
        }

        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [isRunning, timeLeft]);

    React.useEffect(()=>{
        startTimer()
    },[])


    // @ts-ignore
    // @ts-ignore
    return (<div className="flex items-center justify-center h-screen overflow-hidden">
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Activate your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>OTP</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0}/>
                                                        <InputOTPSlot index={1}/>
                                                        <InputOTPSlot index={2}/>
                                                        <InputOTPSlot index={3}/>
                                                        <InputOTPSlot index={4}/>
                                                        <InputOTPSlot index={5}/>
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription className="flex flex-col gap-1">
                                                <small>Please enter the otp sent to your registered email
                                                    address.</small>
                                                <small>OTP active until: <small
                                                    className="text-blue-500">{formatTime(timeLeft)}
                                                </small></small>
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center gap-2">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <BiLoaderAlt className="animate-spin"/>}
                            Activate
                        </Button>
                        <Button
                            type="button"
                            disabled={newOtpMutation.isPending || !isNewOtpGenerated}
                            onClick={onNewGenerate}
                        >
                            {newOtpMutation.isPending && <BiLoaderAlt className="animate-spin"/>}
                            Generate new OTP
                        </Button>

                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>)
};

export default ActivateAccountPage;
