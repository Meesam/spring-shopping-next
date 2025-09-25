// @ts-ignore
import Link from "next/link"
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const Header = () => {
    return (
        <header className="w-full sticky top-0 z-50">
            <div className="container-wrapper 3xl:fixed:px-0 px-6">
                <div
                    className="3xl:fixed:container flex h-15 items-center gap-2 **:data-[slot=separator]:!h-4">
                    <NavigationMenu className="items-center gap-0.5 hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem className="cursor-pointer">
                                <NavigationMenuLink href="/">Home</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="cursor-pointer">
                                <NavigationMenuLink href="/about">
                                    About Us
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="cursor-pointer">
                                <NavigationMenuLink href="/login">Login</NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

            </div>

        </header>

    )
}

export default Header;
