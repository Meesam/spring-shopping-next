import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { BiLoaderAlt } from "react-icons/bi";
import type { AddCategoryProps } from "@/types";
import React from "react";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
});

const AddCategory: React.FC<AddCategoryProps> = ({ mutation }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add/Edit Category</DialogTitle>
          <DialogDescription>Create and Edit category.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {mutation.isPending && <BiLoaderAlt className="animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Form>
  );
};

export default AddCategory;
