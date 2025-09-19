import { useState } from 'react';

type AuthFormProps = {
  mode: 'signup' | 'signin';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
};

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, name: mode === 'signup' ? name : undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === 'signup' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white
                       placeholder:text-neutral-400 focus:border-emerald-400/40 focus:outline-none
                       focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white
                     placeholder:text-neutral-400 focus:border-emerald-400/40 focus:outline-none
                     focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white
                     placeholder:text-neutral-400 focus:border-emerald-400/40 focus:outline-none
                     focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium
                   bg-gradient-to-r from-emerald-500 via-cyan-500 to-fuchsia-500 text-white
                   hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)] active:scale-[0.98] transition"
      >
        {mode === 'signup' ? 'Create Account' : 'Login'}
      </button>
    </form>
  );
}
