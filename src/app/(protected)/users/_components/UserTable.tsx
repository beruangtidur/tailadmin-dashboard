"use client"
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import columns, { Users } from "./columns";

async function fetchUsers(): Promise<Users[]> {
    // Fetch data from your API here.
    const res = await fetch('http://localhost:3000/api/users')
    const users = res.json()

    return users
}

export default function UserTable() {
    const { data = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    return (
        <DataTable columns={columns} data={data} isLoading={isLoading} />
    )
}
