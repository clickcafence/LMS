"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client"; // Ensure User matches your actual data structure

// Adjusting the type to match the subset of fields you need
export const columns: ColumnDef<Pick<User, "firstName" | "lastName" | "email">>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        {column.getIsSorted() && <ArrowUpDown className="h-4 w-4 ml-2" />}
      </Button>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        {column.getIsSorted() && <ArrowUpDown className="h-4 w-4 ml-2" />}
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        {column.getIsSorted() && <ArrowUpDown className="h-4 w-4 ml-2" />}
      </Button>
    ),
  },
];
