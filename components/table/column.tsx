"use client"

import { ClientFormData } from "@/interface";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ClientFormData>[] = [
    {
        accessorKey: "clientId",
        header: "Client ID",
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "pin",
        header: "Pin",
    },
    {
        accessorKey: "address",
        header: "Client Address",
    },
    {
        accessorKey: "servicesProvided",
        header: "Services Provided",
    },
];
