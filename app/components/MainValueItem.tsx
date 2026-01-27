'use client'

export default function MainValueItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl shadow-lg flex flex-col gap-1 p-6">
      <div className="text-white/80 text-sm font-medium">{label}</div>
      <div className="text-white text-4xl font-bold">{value}</div>
    </div>
  )
}
