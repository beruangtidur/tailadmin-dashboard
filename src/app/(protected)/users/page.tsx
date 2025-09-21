import DialogFormTrigger from "./_components/DialogFormTrigger"
import UserTable from "./_components/UserTable"

export const metadata = {
    title: "Users Mangement"
}

export default async function UsersPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between pb-9">
                <h2 className="text-xl font-bold">Users Management</h2>
                <div className="flex gap-2 self-end">
                    <DialogFormTrigger action="create" />
                </div>
            </div>
            <UserTable />
        </div>
    )
}