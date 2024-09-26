"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<User, keyof User>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         First Name
          {column.getIsSorted() === "asc" ? <ArrowUpDown className="h-4 w-4 ml-2" /> : null}
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         Last Name
          {column.getIsSorted() === "asc" ? <ArrowUpDown className="h-4 w-4 ml-2" /> : null}
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          {column.getIsSorted() === "asc" ? <ArrowUpDown className="h-4 w-4 ml-2" /> : null}
        </Button>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { id } = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger>
  //           <Button variant="ghost">
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent>
  //           <Link href={`/teacher/users/${id}`}>
  //             <DropdownMenuItem>
  //               <Pencil className="h-4 w-4 mr-2" />
  //               Edit
  //             </DropdownMenuItem>
  //           </Link>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];