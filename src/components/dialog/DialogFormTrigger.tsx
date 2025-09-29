'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogContext } from '@/context/DialogContext'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'


type GlobalDialogProps = {
    triggerLabel: React.ReactNode
    triggerVariant?: "default" | "destructive" | "outline" | "secondary"
    title: string
    children?: React.ReactNode,
    customClassTrigger?: string,
    sizeIcon?: boolean
}

export default function DialogFormTrigger({
    triggerLabel,
    triggerVariant = "default",
    title,
    children,
    customClassTrigger,
    sizeIcon = false
}: GlobalDialogProps) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    return (
        <DialogContext.Provider value={{ setIsDialogOpen }}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size={sizeIcon ? "icon" : "default"} className={cn("hover:text-white", customClassTrigger)} variant={triggerVariant}>{triggerLabel}</Button>
                </DialogTrigger>
                <DialogContent onOpenAutoFocus={(e) => { e.preventDefault() }}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </DialogContext.Provider>
    )
}
