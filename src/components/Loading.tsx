import clsx from 'clsx'

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        'animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent',
        className
      )}
    />
  )
}
