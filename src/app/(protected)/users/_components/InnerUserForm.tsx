"use client"

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDialog } from '@/context/DialogContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import type { Users } from './columns'

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
    username: z.string().min(2).max(50).optional(),
    email: z.email().min(2).max(50).optional(),
    role: z.string().optional(),
})
const resetSchema = z.object({
    id: z.string(),
    password: z.string().min(8).max(20),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>
type ResetValues = z.infer<typeof resetSchema>

const handleCreateUser = async (formData: CreateValues, queryClient: QueryClient, setIsDialogOpen: (isDialogOpen: boolean) => void, form: UseFormReturn<CreateValues>) => {
    try {
        const res = await fetch('/api/users', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        if (data.status === "error") {
            toast.error(data.msg)
        }

        if (data.status === "success") {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            form.reset()
            toast.success('User Berhasil dibuat')
        }

    } catch (error) {
        console.log(error)

    }
}

const handleUpdateUser = async (formData: EditValues, queryClient: QueryClient, setIsDialogOpen: (open: boolean) => void, form: UseFormReturn<EditValues>) => {
    const changedData = Object.keys(form.formState.dirtyFields).reduce((acc, key) => {
        acc[key as keyof EditValues] = form.getValues(key as keyof EditValues);
        return acc;
    }, {} as Partial<EditValues>);

    try {
        const res = await fetch('/api/users/' + formData.id, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(changedData)
        })


        const data = await res.json()

        if (data.status === "error") {
            toast.success(data.msg)
        }

        if (data.status === "success") {
            form.reset(data.data)
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success('User Berhasil diupdate')
        }
    } catch (error) {
        console.log(error)

    }
}

const handleDeleteUser = async (setIsSubmittig: (open: boolean) => void, id: string, setIsDialogOpen: (open: boolean) => void, queryClient: QueryClient) => {
    setIsSubmittig(true)
    try {
        const res = await fetch('/api/users/' + id, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        })

        const data = await res.json()

        if (data.status === "error") {
            toast.error(data.msg)
        }

        if (data.status === "success") {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success('User Berhasil dihapus')
        }
    } catch (error) {
        console.log(error)

    }
}

const handleResetPassword = async (formData: ResetValues, setIsDialogOpen: (open: boolean) => void, queryClient: QueryClient) => {
    try {
        const res = await fetch('/api/users/' + formData.id, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        if (data.status === "error") {
            toast.error(data.msg)
        }

        if (data.status === "success") {
            setIsDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success('User password has been reset')
        }
    } catch (error) {
        console.log(error)
    }
}

const CreateFormComponent = () => {
    const queryClient = useQueryClient()
    const { setIsDialogOpen } = useDialog()
    const createForm = useForm<CreateValues>({ 
        resolver: zodResolver(createSchema),
        defaultValues: {
            username: "",
            email: "",
            role: "user",
            password: "",
            confirmPassword: "",
        }
    })

    return (
        <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit((values) => handleCreateUser(values, queryClient, setIsDialogOpen, createForm))} className="space-y-3 text-right">
                <FormField
                    control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
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
                <FormField
                    control={createForm.control}
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
                <Button type="submit" disabled={createForm.formState.isSubmitting} className="mt-2 hover:text-white">
                    {createForm.formState.isSubmitting ? <Loader2 className='animate-spin' /> : ""}
                    Create user
                </Button>
            </form>
        </Form>
    )
}

const EditFormComponent = ({ user }: { user: Users }) => {
    const queryClient = useQueryClient()
    const { setIsDialogOpen } = useDialog()
    const editForm = useForm<EditValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })
    return (
        <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((values) => handleUpdateUser(values, queryClient, setIsDialogOpen, editForm))} className="space-y-3 text-right">
                <FormField
                    control={editForm.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="hidden"  {...field} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={editForm.control}
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
                    control={editForm.control}
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
                    control={editForm.control}
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
                <Button type="submit" disabled={editForm.formState.isSubmitting || !editForm.formState.isDirty} className="mt-2">
                    {editForm.formState.isSubmitting ? <><Loader2 className='animate-spin' /> Updating...</> : "Update user"}
                </Button>
            </form>
        </Form>

    )
}

const ResetFormComponent = ({ user }: { user: Users }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const queryClient = useQueryClient()
    const { setIsDialogOpen } = useDialog()

    const resetForm = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            id: user?.id ?? "",
            password: "",
        },
    })

    return (
        <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit((values) => handleResetPassword(values, setIsDialogOpen, queryClient))} className="space-y-3 text-right">
                <FormField
                    control={resetForm.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <Input type="hidden"  {...field} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="yourNewPassword" {...field} className='relative' />
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
                <Button type="submit" disabled={resetForm.formState.isSubmitting} className="mt-2">
                    {resetForm.formState.isSubmitting ? <><Loader2 className='animate-spin' />Reseting...</> : "Reset Password"}
                </Button>
            </form>
        </Form>
    )
}

const DeleteFormComponent = ({ user }: { user: Users }) => {
    const [isDeleteSubmitting, setIsDeleteSubmitting] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const { setIsDialogOpen } = useDialog()

    return (
        <DialogFooter className='text-right'>
            <Button variant="destructive" className="mt-2 hover:bg-foreground" disabled={isDeleteSubmitting} type="submit" onClick={() => handleDeleteUser(setIsDeleteSubmitting, user!.id, setIsDialogOpen, queryClient)}>  {isDeleteSubmitting ? <Loader2 className='animate-spin' /> : ""} Confirm</Button>
        </DialogFooter>

    )
}

export default function InnerUserForm({ action, user }: { action: string, user?: Users }) {
    return (
        <>
            {action == 'create' && (
                <CreateFormComponent />
            )}

            {action == 'edit' && user && (
                <EditFormComponent user={user} />
            )}

            {action == 'delete' && user && (
                <DeleteFormComponent user={user} />
            )}

            {action == 'reset' && user && (
                <ResetFormComponent user={user} />
            )}
        </>
    )
}
