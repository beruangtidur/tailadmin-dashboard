import DialogFormTrigger from "./_components/DialogFormTrigger"
import UserTable from "./_components/UserTable"

export const metadata = {
    title: "Users Mangement"
}

// async function fetchUsers(): Promise<Users[]> {
//     // Fetch data from your API here.

//     const res = await fetch('http://localhost:3000/api/users')
//     const users = await res.json()

//     return users
//     // return [
//     //     {
//     //         id: "728ed52f",
//     //         username: "naufalhfhzn",
//     //         email: "naufal@example.com",
//     //         role: "admin",
//     //         createdAt: ""
//     //     },
//     //     {
//     //         id: "728ed52f",
//     //         username: "gita",
//     //         email: "gita@example.com",
//     //         role: "admin",
//     //         createdAt: ""
//     //     },
//     //     {
//     //         id: "728ed52f",
//     //         username: "rgita",
//     //         email: "rgita@example.com",
//     //         role: "admin",
//     //         createdAt: ""
//     //     },
//     //     {
//     //         id: "728ed52f",
//     //         username: "nopsky",
//     //         email: "nopsky@example.com",
//     //         role: "user",
//     //         createdAt: ""
//     //     },

//     //     // ...
//     // ]
// }

export default async function UsersPage() {
//       const queryClient = useQueryClient();

//   const { data = [], isLoading } = useQuery({
//     queryKey: ["users"],
//     queryFn: fetchUsers,
//   });
    // const data = await fetchUsers()

    return (
        <div className="container mx-auto py-10">
            {/* <h1 className="text-2xl mb-9">Users Management</h1> */}
            <div className="flex items-center justify-between pb-9">
                <h2 className="text-xl font-bold">Users Management</h2>
                <div className="flex gap-2 self-end">
                    {/* <Button variant="outline">Export</Button> */}
                    <DialogFormTrigger action="create" />
                </div>
            </div>
            <UserTable />
            {/* <DataTable columns={columns} data={data} /> */}
        </div>
    )
}