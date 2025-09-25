import { Calendar, Home, Search, Settings } from "lucide-react";
import { AiOutlineProduct } from "react-icons/ai";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Products",
        url: "/products",
        icon: AiOutlineProduct,
    },
    {
        title: "Categories",
        url: "/categories",
        icon: Calendar,
    },
    {
        title: "Attributes",
        url: "/attributes",
        icon: Calendar,
    },
    {
        title: "Orders",
        url: "/orders",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-bold">
                        Spring Shopping Admin
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-4">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
