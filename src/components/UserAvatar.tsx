import { cn } from '@/lib/utils'

const COLORS = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-pink-500',
]

function colorForName(name: string): string {
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

const SIZE_CLASSES = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
}

interface UserAvatarProps {
  user?: { name?: string; profileImage?: string } | null
  size?: keyof typeof SIZE_CLASSES
  className?: string
}

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const name = user?.name ?? ''
  const initial = name.charAt(0).toUpperCase() || '?'
  const colorClass = name ? colorForName(name) : 'bg-muted'

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', SIZE_CLASSES[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        colorClass,
        SIZE_CLASSES[size],
        className
      )}
    >
      {initial}
    </div>
  )
}
