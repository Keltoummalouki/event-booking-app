'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthLayout from '@/components/auth/AuthLayout';
import FloatingInput from '@/components/auth/FloatingInput';
import MagneticButton from '@/components/auth/MagneticButton';
import Toast from '@/components/auth/Toast';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { login, isAuthenticated } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'error',
    visible: false,
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const password = watch('password');

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      setIsRedirecting(true);
      setToast({
        message: 'Already logged in. Redirecting...',
        type: 'success',
        visible: true,
      });
      router.push('/dashboard/events');
    }
  }, [router]);

  // Simulate progress during loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [isLoading]);

  const onSubmit = async (data: LoginFormData) => {
    // Prevent multiple submissions
    if (isLoading || isRedirecting) return;

    setIsLoading(true);
    setLoadingProgress(10);

    try {
      const response = await login(data.email, data.password);
      setLoadingProgress(60);

      // ATOMIC: Store token and user synchronously
      // This prevents race condition where dashboard tries to fetch before token is available
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Force a small delay to ensure localStorage write is complete
      await new Promise(resolve => setTimeout(resolve, 50));

      setLoadingProgress(100);

      // Show success toast
      setToast({
        message: `Welcome back, ${response.user.email}!`,
        type: 'success',
        visible: true,
      });

      // Set redirecting state to disable button
      setIsRedirecting(true);

      // Redirect after visual feedback
      // The dashboard will now have the token available when it mounts
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 800);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setToast({
        message: errorMessage,
        type: 'error',
        visible: true,
      });
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return (
    <>
      <AuthLayout
        heroTitle="The Hub for Knowledge"
        heroSubtitle="Connect with industry leaders, discover transformative events, and expand your professional network."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-navy tracking-tight-custom mb-3">
              Welcome back
            </h2>
            <p className="text-slate">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-2"
          >
            <FloatingInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setValue('email', e.target.value)}
              error={errors.email?.message}
              autoComplete="email"
              disabled={isLoading || isRedirecting}
            />

            <FloatingInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setValue('password', e.target.value)}
              error={errors.password?.message}
              autoComplete="current-password"
              disabled={isLoading || isRedirecting}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
              <motion.a
                href="#"
                className="text-sm text-slate hover:text-coral transition-colors"
                whileHover={{ x: 2 }}
              >
                Forgot your password?
              </motion.a>
            </div>

            {/* Submit Button */}
            <MagneticButton
              type="submit"
              isLoading={isLoading || isRedirecting}
              loadingProgress={loadingProgress}
              disabled={isLoading || isRedirecting}
            >
              {isRedirecting ? 'Redirecting...' : 'Sign in'}
              <ArrowRight size={20} />
            </MagneticButton>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-slate">
              Don't have an account?{' '}
              <motion.a
                href="/register"
                className="text-coral font-medium hover:underline"
                whileHover={{ scale: 1.02 }}
              >
                Create one
              </motion.a>
            </p>
          </div>

          {/* Divider with text */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-cream text-slate">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate/20 rounded-lg text-navy hover:border-slate/40 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </motion.button>

            <motion.button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate/20 rounded-lg text-navy hover:border-slate/40 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.button>
          </div>
        </motion.div>
      </AuthLayout>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}