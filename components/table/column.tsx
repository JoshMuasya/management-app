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
    {
        accessorKey: "indemnityClause",
        header: "Indemnity Clause",
    },
    {
        accessorKey: "nokName",
        header: "Next of Kin Name",
    },
    {
        accessorKey: "nokPhonenumber",
        header: "Next of Kin Phonenumber",
    },
    {
        accessorKey: "nokAddress",
        header: "Next of Kin Address",
    }
];
