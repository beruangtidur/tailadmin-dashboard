import DialogFormTrigger from "@/components/dialog/DialogFormTrigger"
import { Plus } from "lucide-react"
import InnerUserForm from "./_components/InnerUserForm"
import UserTable from "./_components/UserTable"

export const metadata = {
    title: "User Management"
}

export default async function UsersPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between pb-9">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex gap-2 self-end">
                    <DialogFormTrigger title="Add User" triggerLabel={<><Plus />New User</>} triggerVariant="default">
                        <InnerUserForm action="create"/>
                    </DialogFormTrigger>
                </div>
            </div>
            <UserTable />
        </div>
    )
}