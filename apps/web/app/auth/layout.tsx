const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen flex items-center justify-center bg-slate-900">
      {children}
    </main>
  );
};

export default AuthLayout;
