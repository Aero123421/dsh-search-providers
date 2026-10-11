declare module '*.css' { const css: string; export default css }
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type { ComponentType, ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
  export const Button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'toolbar'; size?: 'md' | 'sm' }>
  export const Input: ComponentType<InputHTMLAttributes<HTMLInputElement>>
  export const Switch: ComponentType<{ checked: boolean; onChange(value: boolean): void; label: string; disabled?: boolean }>
  export const StateDot: ComponentType<{ state: 'ongoing' | 'done' | 'pending'; size?: number }>
  export const IconSearchOutlineRegular: ComponentType<{ size?: number }>
  export const Modal: ComponentType<{ open: boolean; onClose(): void; title: string; closeLabel: string; children?: ReactNode; footer?: ReactNode; className?: string; contentClassName?: string }>
}
