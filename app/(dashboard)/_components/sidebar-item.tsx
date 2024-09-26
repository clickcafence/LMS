"use client"


import { LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../../lib/utils";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({
    icon: Icon,   
    label,
    href,
}: SidebarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();

    // Complicated logic to determine if the current route is active
    const isActive = 
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }
    
    return (
        <button
        onClick={onClick}
        type="button"
        className={cn(
            "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive && `dark:text-slate-200 dark:bg-sky-200/20 dark:hover:bg-sky-200/20 dark:hover:text-sky-700 text-gray-900 bg-gray-200/20 hover:bg-gray-200/20 hover:text-gray-900`
        )}
    >
        <div className="flex items-center gap-x-2 py-4">
            <Icon 
                size={22}   
                className={cn(
                    "text-slate-500",
                    isActive && `dark:text-sky-300 text-gray-900`
                )}
            />
            {label}
        </div>
        <div 
        //това е страничната лента на навбара.
            className={cn(
                "ml-auto opacity-0 border-2",
                isActive && `dark:border-sky-700 dark:text-white border-gray-900 bg-gray-200/20 dark:bg-sky-200/20 h-full transition-all opacity-100`
            )}
        />
    </button>
    )
}