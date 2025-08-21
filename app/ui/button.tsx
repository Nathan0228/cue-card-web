import { forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
	size?: 'default' | 'sm' | 'lg' | 'icon'
	asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
		const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
		
		const variants = {
			default: 'bg-black text-white hover:bg-gray-800',
			destructive: 'bg-red-600 text-white hover:bg-red-700',
			outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
			secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
			ghost: 'text-gray-700 hover:bg-gray-100',
			link: 'text-blue-600 underline-offset-4 hover:underline',
		}
		
		const sizes = {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
		}
		
		const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim()
		
		if (asChild) {
			return props.children
		}
		
		return (
			<button
				className={classes}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button } 