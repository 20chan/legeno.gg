import { SocketProvider } from '@/components/SocketProvider';

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  )
}
