import Navbar from '@/components/navbar';
import AuthForm from '@/components/authForm';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const { signup } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-400/5 to-transparent blur-2xl" />
      </div>

      <Navbar />

      <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-neutral-400">Join FlavorAI and start sharing your recipes</p>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-0.5 shadow-xl">
          <div className="rounded-[1rem] bg-neutral-950/60 p-6">
            <AuthForm mode="signup" onSubmit={signup} />
          </div>
        </div>

        <p className="mt-6 text-sm text-neutral-400">
          Already have an account?{' '}
          <a
            href="/auth/signin"
            className="font-medium text-emerald-400 hover:text-emerald-300 transition"
          >
            Sign in
          </a>
        </p>
      </main>
    </div>
  );
}