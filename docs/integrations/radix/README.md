# Radix UI Integration Guide

Comprehensive guide for Radix UI component integration with Next.js 15.5.0 App Router, React 19.1.1, and TypeScript 5.9.2.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Patterns](#component-patterns)
- [Accessibility Features](#accessibility-features)
- [Styling Integration](#styling-integration)
- [Composite Components](#composite-components)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Type Safety](#type-safety)
- [Custom Components](#custom-components)
- [Best Practices](#best-practices)

## Architecture Overview

The NSBS Platform leverages Radix UI as the foundation for accessible, unstyled component primitives, styled with Tailwind CSS and enhanced with custom functionality.

### Key Components

```typescript
/**
 * Radix UI integration architecture for accessible components.
 * 
 * @remarks
 * - Unstyled primitives for maximum customization
 * - Built-in accessibility features (ARIA, keyboard navigation)
 * - Composable component patterns
 * - Type-safe prop forwarding
 * - Consistent styling with Tailwind CSS
 * - Custom variants using class-variance-authority
 */

// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button variant definitions using class-variance-authority.
 * 
 * @remarks
 * Provides consistent styling variants while maintaining
 * flexibility for custom styling and accessibility features.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean
}

/**
 * Button component built on Radix UI Slot primitive.
 * 
 * @param props - Button properties extending HTML button attributes
 * @param props.className - Additional CSS classes
 * @param props.variant - Button visual variant
 * @param props.size - Button size variant
 * @param props.asChild - Render as child component instead of button
 * @returns Accessible button component with consistent styling
 * 
 * @example Basic button usage
 * ```typescript
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 * 
 * @example As child component (polymorphic)
 * ```typescript
 * <Button asChild>
 *   <Link href="/courses">View Courses</Link>
 * </Button>
 * ```
 * 
 * @example With icon
 * ```typescript
 * <Button variant="outline" size="icon">
 *   <PlusIcon />
 *   <span className="sr-only">Add item</span>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }
```

## Component Patterns

### Dialog Components

```typescript
/**
 * Dialog component patterns with Radix UI primitives.
 * 
 * @remarks
 * Demonstrates proper dialog composition with accessibility features,
 * focus management, and consistent styling patterns.
 */

// components/ui/dialog.tsx
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Dialog root component.
 */
const Dialog = DialogPrimitive.Root

/**
 * Dialog trigger component.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * Dialog portal for rendering outside component tree.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * Dialog close button component.
 */
const DialogClose = DialogPrimitive.Close

/**
 * Dialog overlay component with backdrop styling.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  readonly showCloseButton?: boolean
}

/**
 * Dialog content component with proper focus management.
 * 
 * @param props - Dialog content properties
 * @param props.className - Additional CSS classes
 * @param props.children - Dialog content
 * @param props.showCloseButton - Whether to show close button
 * @returns Dialog content with overlay and close functionality
 * 
 * @example Basic dialog
 * ```typescript
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="outline">Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Confirm Action</DialogTitle>
 *       <DialogDescription>
 *         This action cannot be undone.
 *       </DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DialogClose>
 *       <Button variant="destructive">Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * Dialog header component for title and description.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

/**
 * Dialog footer component for actions.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

/**
 * Dialog title component with proper heading semantics.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * Dialog description component with muted styling.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

### Form Components

```typescript
/**
 * Form components using Radix UI primitives with React Hook Form.
 * 
 * @remarks
 * Integrates Radix UI form primitives with React Hook Form for
 * type-safe form handling with comprehensive validation.
 */

// components/ui/form.tsx
'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

/**
 * Form provider component wrapping React Hook Form.
 */
const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * Form field component with controller integration.
 * 
 * @template TFieldValues - Form values type
 * @template TName - Field name type
 * @param props - Controller properties
 * @returns Form field with validation and error handling
 * 
 * @example Form field usage
 * ```typescript
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input placeholder="Enter your email" {...field} />
 *       </FormControl>
 *       <FormDescription>
 *         We'll never share your email.
 *       </FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * Hook to access form field context.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * Form item wrapper component.
 */
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

/**
 * Form label component with proper association.
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

/**
 * Form control wrapper for input elements.
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

/**
 * Form description component for additional context.
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

/**
 * Form error message component.
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

### Select Components

```typescript
/**
 * Select component using Radix UI Select primitive.
 * 
 * @remarks
 * Provides accessible dropdown selection with keyboard navigation,
 * proper ARIA attributes, and consistent styling.
 */

// components/ui/select.tsx
'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Select root component.
 */
const Select = SelectPrimitive.Root

/**
 * Select group component for organizing options.
 */
const SelectGroup = SelectPrimitive.Group

/**
 * Select value display component.
 */
const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  readonly size?: 'sm' | 'default'
}

/**
 * Select trigger component with size variants.
 * 
 * @param props - Select trigger properties
 * @param props.className - Additional CSS classes
 * @param props.size - Trigger size variant
 * @param props.children - Trigger content
 * @returns Select trigger with dropdown icon
 * 
 * @example Basic select
 * ```typescript
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *     <SelectItem value="option3">Option 3</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size = 'default', children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      size === 'sm' && 'h-8 px-2 py-1 text-xs',
      size === 'default' && 'h-9',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * Select content component with portal and positioning.
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUpIcon className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDownIcon className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * Select label component for option groups.
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * Select item component with check indicator.
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * Select separator component.
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
```

## Accessibility Features

### ARIA and Keyboard Navigation

```typescript
/**
 * Accessibility patterns and enhancements for Radix UI components.
 * 
 * @remarks
 * Demonstrates proper ARIA attributes, keyboard navigation,
 * and focus management patterns for enhanced accessibility.
 */

// components/ui/command.tsx
'use client'

import * as React from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from './dialog'

/**
 * Command component with search and keyboard navigation.
 * 
 * @remarks
 * Provides a command palette interface with full keyboard navigation,
 * search filtering, and proper ARIA attributes for accessibility.
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

/**
 * Command dialog component for modal command palette.
 * 
 * @param props - Dialog properties
 * @returns Modal command palette with search and navigation
 * 
 * @example Command palette dialog
 * ```typescript
 * const [open, setOpen] = useState(false)
 * 
 * useEffect(() => {
 *   const down = (e: KeyboardEvent) => {
 *     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
 *       e.preventDefault()
 *       setOpen((open) => !open)
 *     }
 *   }
 *   document.addEventListener('keydown', down)
 *   return () => document.removeEventListener('keydown', down)
 * }, [])
 * 
 * return (
 *   <CommandDialog open={open} onOpenChange={setOpen}>
 *     <CommandInput placeholder="Type a command or search..." />
 *     <CommandList>
 *       <CommandEmpty>No results found.</CommandEmpty>
 *       <CommandGroup heading="Suggestions">
 *         <CommandItem onSelect={() => router.push('/courses')}>
 *           <FileIcon className="mr-2 h-4 w-4" />
 *           <span>Courses</span>
 *         </CommandItem>
 *       </CommandGroup>
 *     </CommandList>
 *   </CommandDialog>
 * )
 * ```
 */
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Command input component with search icon.
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

/**
 * Command list container with proper scrolling.
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

/**
 * Command empty state component.
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * Command group component for organizing items.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * Command separator component.
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * Command item component with hover and selection states.
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * Command shortcut component for displaying keyboard shortcuts.
 */
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
```

### Focus Management

```typescript
/**
 * Focus management utilities for accessible component interactions.
 * 
 * @remarks
 * Provides utilities for managing focus states, trap focus within
 * modals, and ensure proper keyboard navigation patterns.
 */

// lib/accessibility/focus.ts
import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook for managing focus trap within a container.
 * 
 * @param isActive - Whether the focus trap is active
 * @returns Ref to attach to the container element
 * 
 * @example Focus trap in modal
 * ```typescript
 * function Modal({ isOpen, onClose, children }) {
 *   const trapRef = useFocusTrap(isOpen)
 *   
 *   return isOpen ? (
 *     <div ref={trapRef} className="modal">
 *       <button onClick={onClose}>Close</button>
 *       {children}
 *     </div>
 *   ) : null
 * }
 * ```
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const closeButton = container.querySelector('[data-close]') as HTMLElement
        closeButton?.click()
      }
    }

    // Focus first element when trap becomes active
    firstElement?.focus()

    container.addEventListener('keydown', handleTabKey)
    container.addEventListener('keydown', handleEscapeKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      container.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isActive])

  return containerRef
}

/**
 * Hook for managing focus restoration after modal closes.
 * 
 * @returns Functions to save and restore focus
 */
export function useFocusRestore() {
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus()
      previouslyFocusedElementRef.current = null
    }
  }, [])

  return { saveFocus, restoreFocus }
}

/**
 * Hook for keyboard navigation in lists.
 * 
 * @param items - Array of items to navigate
 * @param onSelect - Callback when item is selected
 * @returns Keyboard event handlers and current index
 */
export function useKeyboardNavigation<T>(
  items: readonly T[],
  onSelect: (item: T, index: number) => void
) {
  const [currentIndex, setCurrentIndex] = useState(-1)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setCurrentIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setCurrentIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        )
        break
      
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (currentIndex >= 0 && currentIndex < items.length) {
          onSelect(items[currentIndex], currentIndex)
        }
        break
      
      case 'Home':
        e.preventDefault()
        setCurrentIndex(0)
        break
      
      case 'End':
        e.preventDefault()
        setCurrentIndex(items.length - 1)
        break
    }
  }, [items, currentIndex, onSelect])

  return {
    currentIndex,
    setCurrentIndex,
    handleKeyDown
  }
}
```

## Type Safety

### Component Type Patterns

```typescript
/**
 * Type-safe patterns for Radix UI component composition.
 * 
 * @remarks
 * Demonstrates proper typing for component variants, polymorphic
 * components, and compound component patterns with full type safety.
 */

// types/radix-components.ts
import type { VariantProps } from 'class-variance-authority'
import type * as RadixDialog from '@radix-ui/react-dialog'
import type * as RadixSelect from '@radix-ui/react-select'

/**
 * Base component props with common patterns.
 */
interface BaseComponentProps {
  /** Additional CSS classes */
  readonly className?: string
  /** Children elements */
  readonly children?: React.ReactNode
}

/**
 * Polymorphic component props for 'asChild' pattern.
 */
interface PolymorphicProps {
  /** Render as child component instead of default element */
  readonly asChild?: boolean
}

/**
 * Size variant type for consistent sizing across components.
 */
type SizeVariant = 'sm' | 'default' | 'lg'

/**
 * Visual variant type for consistent styling.
 */
type VisualVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

/**
 * Button component props with full type safety.
 */
interface ButtonProps
  extends BaseComponentProps,
    PolymorphicProps,
    Omit<React.ComponentProps<'button'>, 'className'> {
  readonly variant?: VisualVariant
  readonly size?: SizeVariant
}

/**
 * Dialog component props extending Radix primitives.
 */
interface DialogProps extends RadixDialog.DialogProps {
  readonly children: React.ReactNode
}

interface DialogContentProps
  extends BaseComponentProps,
    Omit<RadixDialog.DialogContentProps, 'className'> {
  readonly showCloseButton?: boolean
  readonly size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
}

interface DialogHeaderProps extends BaseComponentProps {
  readonly children: React.ReactNode
}

interface DialogFooterProps extends BaseComponentProps {
  readonly children: React.ReactNode
  readonly orientation?: 'horizontal' | 'vertical'
}

/**
 * Select component props with type-safe value handling.
 */
interface SelectProps<T extends string = string>
  extends Omit<RadixSelect.SelectProps, 'value' | 'onValueChange'> {
  readonly value?: T
  readonly onValueChange?: (value: T) => void
  readonly placeholder?: string
}

interface SelectTriggerProps
  extends BaseComponentProps,
    Omit<RadixSelect.SelectTriggerProps, 'className'> {
  readonly size?: SizeVariant
  readonly variant?: 'default' | 'outline'
}

interface SelectItemProps<T extends string = string>
  extends BaseComponentProps,
    Omit<RadixSelect.SelectItemProps, 'className' | 'value'> {
  readonly value: T
  readonly children: React.ReactNode
}

/**
 * Form component props with React Hook Form integration.
 */
interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends ControllerProps<TFieldValues, TName> {}

interface FormItemProps extends BaseComponentProps {}

interface FormLabelProps
  extends BaseComponentProps,
    Omit<React.ComponentProps<typeof LabelPrimitive.Root>, 'className'> {}

interface FormControlProps
  extends Omit<React.ComponentProps<typeof Slot>, 'className'> {}

interface FormDescriptionProps extends BaseComponentProps {}

interface FormMessageProps extends BaseComponentProps {
  readonly children?: React.ReactNode
}

/**
 * Tooltip component props for enhanced accessibility.
 */
interface TooltipProps {
  readonly children: React.ReactNode
  readonly content: React.ReactNode
  readonly side?: 'top' | 'right' | 'bottom' | 'left'
  readonly align?: 'start' | 'center' | 'end'
  readonly delayDuration?: number
  readonly skipDelayDuration?: number
}

/**
 * Popover component props with positioning options.
 */
interface PopoverProps {
  readonly children: React.ReactNode
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly modal?: boolean
}

interface PopoverContentProps
  extends BaseComponentProps,
    Omit<RadixPopover.PopoverContentProps, 'className'> {
  readonly size?: SizeVariant
  readonly align?: 'start' | 'center' | 'end'
  readonly side?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * Dropdown menu component props with keyboard navigation.
 */
interface DropdownMenuProps {
  readonly children: React.ReactNode
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly modal?: boolean
}

interface DropdownMenuItemProps
  extends BaseComponentProps,
    Omit<RadixDropdownMenu.DropdownMenuItemProps, 'className'> {
  readonly inset?: boolean
  readonly destructive?: boolean
}

interface DropdownMenuSubProps {
  readonly children: React.ReactNode
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
}

/**
 * Navigation menu component props for complex navigation.
 */
interface NavigationMenuProps
  extends BaseComponentProps,
    Omit<RadixNavigationMenu.NavigationMenuProps, 'className'> {}

interface NavigationMenuItemProps
  extends BaseComponentProps,
    Omit<RadixNavigationMenu.NavigationMenuItemProps, 'className'> {}

interface NavigationMenuLinkProps
  extends BaseComponentProps,
    Omit<RadixNavigationMenu.NavigationMenuLinkProps, 'className'> {
  readonly active?: boolean
}

/**
 * Utility type for extracting variant props from component definitions.
 */
type ExtractVariantProps<T> = T extends VariantProps<infer V> ? V : never

/**
 * Utility type for component ref forwarding.
 */
type ComponentRef<T extends React.ElementType> = React.ComponentRef<T>

/**
 * Utility type for polymorphic component props.
 */
type PolymorphicComponentProps<
  T extends React.ElementType,
  P = {}
> = P & Omit<React.ComponentProps<T>, keyof P> & {
  readonly as?: T
}

export type {
  BaseComponentProps,
  PolymorphicProps,
  SizeVariant,
  VisualVariant,
  ButtonProps,
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  SelectProps,
  SelectTriggerProps,
  SelectItemProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
  TooltipProps,
  PopoverProps,
  PopoverContentProps,
  DropdownMenuProps,
  DropdownMenuItemProps,
  DropdownMenuSubProps,
  NavigationMenuProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  ComponentRef,
  PolymorphicComponentProps,
}
```

---

This comprehensive Radix UI integration guide demonstrates accessible, type-safe component patterns for the NSBS Platform with Next.js 15.5.0 App Router and TypeScript 5.9.2.