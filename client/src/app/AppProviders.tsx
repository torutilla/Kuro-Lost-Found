import AuthProvider from "../features/auth/hooks/useAuth.tsx";
import { SocketProvider } from "../shared/context/IOSocketProvider.tsx";
import ToastProvider from "../shared/hooks/useToast.tsx";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>{children}</ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default AppProviders;
