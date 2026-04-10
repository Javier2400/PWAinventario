import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"

export const ToastProvider = ToastPrimitives.Provider

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      gap: '8px',
      width: '100%',
      maxWidth: '420px',
      margin: 0,
      listStyle: 'none',
      outline: 'none',
      ...style
    }}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & { variant?: 'default' | 'destructive' }
>(({ style, variant = 'default', ...props }, ref) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: variant === 'destructive' ? '#fee2e2' : '#fff',
    color: variant === 'destructive' ? '#991b1b' : '#3f3f46',
    border: `1px solid ${variant === 'destructive' ? '#fecaca' : '#e4e4e7'}`,
    borderRadius: '6px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    pointerEvents: 'auto',
    position: 'relative'
  }

  return (
    <ToastPrimitives.Root
      ref={ref}
      style={{ ...baseStyle, ...style }}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    style={{ fontSize: '14px', fontWeight: 600, margin: 0, ...style }}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    style={{ fontSize: '12px', opacity: 0.9, margin: '4px 0 0 0', ...style }}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      padding: '4px',
      borderRadius: '4px',
      color: 'inherit',
      opacity: 0.5,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
    {...props}
  >
    <X size={14} />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ style, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    style={{
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '4px',
      border: '1px solid #e4e4e7',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      ...style
    }}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName
