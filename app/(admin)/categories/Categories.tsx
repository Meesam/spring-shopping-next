/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, {useState} from "react";
import {createCategory, deleteCategory, fetchCategories} from "@/services/categoryService";
import type {CategoryRequest, CategoryResponse} from "@/types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogFooter, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {IoAddSharp} from "react-icons/io5";
import {BadgeCheckIcon} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {toast} from "sonner";
import CategoryTable from "./CategoryTable";
import AddCategory from "./AddCategory";
import moment from "moment";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {GrMoreVertical} from "react-icons/gr";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {BiLoaderAlt} from "react-icons/bi";

interface CategoryClientProps {
    initialData: CategoryResponse[]
}

const Categories:React.FC<CategoryClientProps> = ({initialData}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletedId, setDeletedId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const {isPending, isError, data, error} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        initialData
    });

    const mutation = useMutation({
        mutationFn: (categoryRequest: CategoryRequest) => {
            return createCategory(categoryRequest);
        },
        onSuccess() {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({queryKey: ["categories"]});
            setDialogOpen(false);
        },
        onError(error) {
            const errorMessage =
                (error &&
                    typeof error === "object" &&
                    "response" in error &&
                    // @ts-expect-error: response may exist on AxiosError
                    error.response?.data?.message) ||
                "Something went wrong";
            return toast.error(errorMessage);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteCategory(deletedId);
        },
        onSuccess() {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({queryKey: ["categories"]});
            setDeleteDialogOpen(false);
        },
        onError(error) {
            setDeleteDialogOpen(false);
            const errorMessage =
                (error &&
                    typeof error === "object" &&
                    "response" in error &&
                    // @ts-expect-error: response may exist on AxiosError
                    error.response?.data?.message) ||
                "Something went wrong";
            return toast.error(errorMessage);
        },
    });

    const handleCategoryDelete = (id: number) => {
        setDeletedId(id)
        setDeleteDialogOpen(true)
    }
    const handleDelete = () => {
        deleteMutation.mutate()
    }

    const columns = React.useMemo<ColumnDef<CategoryResponse>[]>(
        () => [
            {
                accessorKey: "id",
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id,
            },
            {
                accessorFn: (row) => row.title,
                id: "title",
                cell: (info) => info.getValue(),
                header: () => <span>Title</span>,
                footer: (props) => props.column.id,
            },
            {
                accessorFn: (row) => row.createdAt,
                id: "createdAt",
                cell: (info) => moment(info.row.original.createdAt).format("DD/MM/YYYY"),
                header: () => <span>Created At</span>,
                footer: (props) => props.column.id,
            },
            {
                accessorFn: (row) => row.isActive,
                id: "isActive",
                cell: (info) => (
                    <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                        <BadgeCheckIcon/>
                        {info.row.original.isActive ? "Active" : "InActive"}
                    </Badge>
                ),
                header: () => <span>Status</span>,
                footer: (props) => props.column.id,
            },

            {
                accessorKey: "delete",
                cell: (info) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <GrMoreVertical/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel className="cursor-pointer"
                                               onClick={() => handleCategoryDelete(info.row.original.id)}>Delete</DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                header: () => <span>Action</span>,
                footer: (props) => props.column.id,
            },
        ],
        []
    );

    if (isError) {
        const errorMessage =
            (isError &&
                typeof error === "object" &&
                "response" in error &&
                // @ts-expect-error: response may exist on AxiosError
                error.response?.data?.message) ||
            "Something went wrong";
        return toast.error(errorMessage);
    }

    return (
        <>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure to delete this Category?</DialogTitle>
                        <DialogDescription>
                            This action will deactivate this Category, later you can activate again.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={handleDelete}
                        >
                            {deleteMutation.isPending && <BiLoaderAlt className="animate-spin"/>}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="w-full">
                <CardHeader>
                    <CardAction className="flex flex-row gap-2 mt-10 items-start">
                        <Input placeholder="Search" className="w-full"/>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <IoAddSharp/>
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <AddCategory mutation={mutation}/>
                        </Dialog>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <CategoryTable
                        {...{
                            data: data,
                            columns,
                            isPending,
                        }}
                    />
                </CardContent>
                <CardFooter className="flex-col gap-2"></CardFooter>
            </Card>
        </>
    );
};
export default Categories;
