'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'


type GlobalDialogProps = {
    /** Text untuk tombol trigger */
    triggerLabel: string | React.ReactNode
    /** Variasi tombol trigger, default = "default" */
    triggerVariant?: "default" | "destructive" | "outline" | "secondary"
    /** Judul dialog */
    title: string
    /** Konten custom (misalnya form) */
    children?: React.ReactNode,

    customClassTrigger?: string
}

export default function DialogFormTrigger({
    triggerLabel,
    triggerVariant = "default",
    title,
    children,
    customClassTrigger
}: GlobalDialogProps) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className={cn('size-8', customClassTrigger)} variant={triggerVariant}>{triggerLabel}</Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => { e.preventDefault() }}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children && React.cloneElement(children as React.ReactElement, { setIsDialogOpen })}
    
            </DialogContent>
        </Dialog>
    )
}
