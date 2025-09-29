import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { GrNotification } from "react-icons/gr";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ModeToggle} from "@/components/common/ModeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AppHeader = () => {
    return (
        <header className="w-full sticky top-0 z-50">
            <div className="container-wrapper 3xl:fixed:px-0 px-6">
                <div
                    className="flex h-15 items-center justify-end gap-2 **:data-[slot=separator]:!h-4">
                    <NavigationMenu>
                        <NavigationMenuList className="items-center gap-3 flex">
                            <NavigationMenuItem>
                                <Input type="text" placeholder="Search" className="w-[300px]" />
                            </NavigationMenuItem>
                            <Separator orientation="vertical" />
                            <NavigationMenuItem className="cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <NavigationMenuLink><GrNotification /></NavigationMenuLink>
                                    </PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover>
                            </NavigationMenuItem>
                            <Separator orientation="vertical" />
                            <NavigationMenuItem className="cursor-pointer">
                                <NavigationMenuLink><ModeToggle /></NavigationMenuLink>
                            </NavigationMenuItem>
                            <Separator orientation="vertical" />
                            <NavigationMenuItem className="cursor-pointer">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    )
}

export default AppHeader
