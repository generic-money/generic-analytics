'use client'

export default function ValueItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-1">
      <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">{label}</div>
      <div className="text-zinc-900 dark:text-zinc-100 text-3xl font-bold">{value}</div>
    </div>
  )
}
