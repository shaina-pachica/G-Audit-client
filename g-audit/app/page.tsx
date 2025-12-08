'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { Lock, Mail, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { DeveloperCredit } from '../components/devcredit';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'employee' | 'owner'>('employee');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      if (role === 'owner') {
        router.push('/dashboard/owner');
      } else {
        router.push('/dashboard/employee');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial from-[#86aae0] via-[#5f93e0] to-[#0248b2] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-40 h-40 bg-white/10 rounded-full">
              <Image
                src="/g-audit.png"
                alt="App Logo"
                width={180}
                height={100}
                className="rounded-xl"
              />
            </div>
          </div>
          <h1 className="font-bold  text-white mb-2 text-5xl">G-Audit</h1>
          <p className="text-blue-100 text-sm">
            Sign in to access your dashboard
          </p>
        </header>

        <div className="bg-card rounded-lg shadow-2xl overflow-hidden bg-transparent">
          {/* Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors border ${
                      role === 'employee'
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-muted text-foreground border-border hover:bg-muted/80'
                    }`}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors border ${
                      role === 'owner'
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-muted text-foreground border-border hover:bg-muted/80'
                    }`}
                  >
                    Owner
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-white text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-10 text-sm bg-background border-border focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-white text-sm font-medium mb-5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-10 text-sm bg-background border-border focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-md transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Demo: use any credentials
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Developer Credit */}
      <DeveloperCredit />
    </div>
  );
}
