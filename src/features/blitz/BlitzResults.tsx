import { BlitzResult } from "./types";
import Card from "../../components/ui/Card";

type Props = {
  result: BlitzResult;
  onRestart?: () => void;
};

export function BlitzResults({ result, onRestart }: Props) {
  const pct = Math.round(result.accuracy * 100);
  return (
    <Card className="p-6 flex flex-col gap-4" aria-live="polite">
      <div className="text-2xl font-semibold">Session Summary</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Duration" value={`${result.durationSec}s`} />
        <Stat label="Answered" value={String(result.totalAnswered)} />
        <Stat label="Correct" value={String(result.totalCorrect)} />
        <Stat label="Accuracy" value={`${pct}%`} />
      </div>
      <div className="text-xs text-muted-foreground">
        Saved {new Date(result.playedAt).toLocaleString()}
      </div>
      <div>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          Run Again
        </button>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}


