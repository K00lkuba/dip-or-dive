// @@ERROR_BOUNDARY_START
import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : 'Unknown error' }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen grid place-items-center p-6">
          <div className="max-w-lg text-center space-y-3">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-slate-300">{this.state.message}</p>
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
              onClick={() => location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
// @@ERROR_BOUNDARY_END