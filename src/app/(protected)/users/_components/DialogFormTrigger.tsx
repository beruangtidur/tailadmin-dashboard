'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { JSX } from '@fullcalendar/core/preact.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { Edit, Eye, EyeOff, KeyRound, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const createSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.email().min(2).max(50),
    role: z.enum(["admin", "user"], {
        error: "The role must be either admin or password"
    }),
    password: z.string().min(8).max(20),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    error: "Password doesn't match",
    path: ["confirmPassword"]
})
const editSchema = z.object({
    id: z.string(),
    username: z.string().min(2).max(50),
    email: z.email().min(2).max(50),
    role: z.string(),
})
const resetSchema = z.object({
    password: z.string().min(8).max(20),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>
type ResetValues = z.infer<typeof resetSchema>
type DialogFormProps = {
    action: 'create' | 'edit' | 'delete' | 'reset'
    user?: z.infer<typeof createSchema>
}


const handleCreateUser = async (data: CreateValues, queryClient: QueryClient, setIsDialogOpen: (isDialogOpen: boolean) => void, form: UseFormReturn<CreateValues>) => {
    try {
        const res = await fetch('/api/users', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })

        const realData = await res.json()

        // console.log(realData)
        if (realData.status === "error") {
            toast.error(realData.msg)
        }

        if (realData.status === "success") {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            form.reset()
            toast.success('User Berhasil dibuat')
        }

    } catch (error) {

    }
}

const handleUpdateUser = async (data: EditValues, queryClient: QueryClient, setIsDialogOpen: (isDialogOpen: boolean) => void, form: UseFormReturn<EditValues>) => {
    const changedData = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
        acc[key as keyof EditValues] = form.getValues(key as keyof EditValues);
        return acc;
    }, {} as Partial<EditValues>);

    try {
        const res = await fetch('/api/users/' + data.id, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(changedData)
        })

        if (res.ok && res.status === 200) {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            form.reset()
        }
    } catch (error) {

    }
}

const handleDeleteUser = async (e: React.MouseEvent<HTMLButtonElement>, id: string, queryClient: QueryClient, setIsDialogOpen: (isDialogOpen: boolean) => void,) => {
    try {
        const res = await fetch('/api/users/' + id, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        })

        if (res.ok && res.status === 200) {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    } catch (error) {

    }
}


export default function DialogFormTrigger({ action, user }: DialogFormProps) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const queryClient = useQueryClient()
    const form = useForm<CreateValues | EditValues>({
        resolver: zodResolver((action === "create") ? createSchema : editSchema),
        defaultValues: {
            username: user?.username || "",
            email: user?.email || "",
            role: user?.role || "",
            password: "",
            confirmPassword: "",
            id: user?.id
        },
    })
    const resetForm = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            password: "",
        },
    })

    const [dialogTitle, setDialogTitle] = useState<string>("")
    const [dialogButton, setDialogButton] = useState<JSX.Element | null>(null)
    const [dialogContent, setDialogContent] = useState<JSX.Element | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const renderDialogButton: JSX.Element = () => {
        if (action == 'create') return <Button><Plus />Add user</Button>
        if (action == 'edit') return <Button size="icon" className="size-8 bg-green-700 text-white" ><Edit /></Button>
        if (action == 'delete') return <Button size="icon" className="size-8 bg-red-500 text-white"><Trash2 /></Button>
        if (action == 'reset') return <Button size="icon" className="size-8 bg-slate-700 text-white"><KeyRound /></Button>
    }

    useEffect(() => {
        switch (action) {
            case 'create':
                setDialogTitle('Create User')
                break;
            case 'edit':
                setDialogTitle('Edit User')
                break;
            case 'delete':
                setDialogTitle("Delete this user?")
                break;
            case 'reset':
                setDialogTitle('Reset Password')
                break;

            default:
                break;
        }
    }, [])

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {renderDialogButton()}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                {action == 'create' && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => handleCreateUser(values, queryClient, setIsDialogOpen, form))} className="space-y-3 text-right">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="yourUsername" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {action == 'create' && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="yourPassword" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="yourPassword" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>

                            )}

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="user">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2">
                                {form.formState.isSubmitting ? <Loader2 className='animate-spin' /> : ""}
                                Create user
                            </Button>
                        </form>
                    </Form>
                )}

                {action == 'edit' && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => handleUpdateUser(values, queryClient, setIsDialogOpen, form))} className="space-y-3 text-right">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input type="hidden"  {...field} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="yourUsername" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="user">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={!form.formState.isDirty} className="mt-2">Update user</Button>
                        </form>
                    </Form>
                )}

                {action == 'delete' && (
                    <DialogFooter className='text-right'>
                        <Button variant='destructive' className="mt-2" type="submit" onClick={(e) => handleDeleteUser(e, user?.id, queryClient, setIsDialogOpen)}>Confirm</Button>
                    </DialogFooter>
                )}

                {action == 'reset' && (
                    <Form {...resetForm}>
                        <form onSubmit={resetForm.handleSubmit(handleCreateUser)} className="space-y-3 text-right">
                            <FormField
                                control={resetForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? 'text' : 'password'} placeholder="yourNewPassword" {...field} className='relative' />
                                                {/* <EyeOffIcon /> */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </Button>

                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="passcon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <Button type="submit" variant="destructive" className="mt-2">Reset Password</Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
