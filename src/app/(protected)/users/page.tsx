import { columns, Users } from "./_components/columns"
import { DataTable } from "./_components/data-table"

async function getData(): Promise<Users[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            username: "naufalhfhzn",
            email: "naufal@example.com",
            role: "admin",
            createdAt: ""
        },
        {
            id: "728ed52f",
            username: "gita",
            email: "gita@example.com",
            role: "admin",
            createdAt: ""
        },
        {
            id: "728ed52f",
            username: "rgita",
            email: "rgita@example.com",
            role: "admin",
            createdAt: ""
        },
        {
            id: "728ed52f",
            username: "nopsky",
            email: "nopsky@example.com",
            role: "user",
            createdAt: ""
        },
       
        // ...
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}