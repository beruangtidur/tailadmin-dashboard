"use client"
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import columns, { Users } from "./columns";

async function fetchUsers(): Promise<Users[]> {
    // Fetch data from your API here.

    const res = await fetch('http://localhost:3000/api/users')
    const users = res.json()

    return users
    // return [
    //     {
    //         id: "728ed52f",
    //         username: "naufalhfhzn",
    //         email: "naufal@example.com",
    //         role: "admin",
    //         createdAt: ""
    //     },
    //     {
    //         id: "728ed52f",
    //         username: "gita",
    //         email: "gita@example.com",
    //         role: "admin",
    //         createdAt: ""
    //     },
    //     {
    //         id: "728ed52f",
    //         username: "rgita",
    //         email: "rgita@example.com",
    //         role: "admin",
    //         createdAt: ""
    //     },
    //     {
    //         id: "728ed52f",
    //         username: "nopsky",
    //         email: "nopsky@example.com",
    //         role: "user",
    //         createdAt: ""
    //     },

    //     // ...
    // ]
}

export default function UserTable() {
    // const data = fetchUsers()
    const queryClient = useQueryClient();
    // const [isLoading_, setIsLoading_] = useState<boolean>(false)
    const { data = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    // useEffect(() => {
    //     setIsLoading_(isLoading)
    // }, [isLoading])

    return (
        <DataTable columns={columns} data={data} />
    )
}
