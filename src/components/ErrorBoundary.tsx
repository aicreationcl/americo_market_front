import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-5">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold">Algo salió mal</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Ocurrió un error inesperado. Puedes recargar la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
