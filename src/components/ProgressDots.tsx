// @@PROGRESS_DOTS_START
type Props = { index: number; total: number }

export default function ProgressDots({ index, total }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i}
          className={'w-2.5 h-2.5 rounded-full ' + (i===index ? 'bg-blue-500' : 'bg-slate-600')} />
      ))}
    </div>
  )
}
// @@PROGRESS_DOTS_END