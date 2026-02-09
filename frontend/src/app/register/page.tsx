'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

import AuthLayout from '@/components/auth/AuthLayout';
import FloatingInput from '@/components/auth/FloatingInput';
import MagneticButton from '@/components/auth/MagneticButton';
import Toast from '@/components/auth/Toast';
import {
  registerStep1Schema,
  registerStep2Schema,
  RegisterStep1Data,
  RegisterStep2Data
} from '@/lib/validations/auth';
import { register as registerUser } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<RegisterStep1Data | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'error' as 'success' | 'error', visible: false });

  const formStep1 = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
    mode: 'onChange'
  });

  const formStep2 = useForm<RegisterStep2Data>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { role: 'PARTICIPANT' }
  });

  const onStep1Submit = (data: RegisterStep1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const onFinalSubmit = async (data: RegisterStep2Data) => {
    if (!step1Data) return;
    setIsLoading(true);

    try {
      await registerUser({
        email: step1Data.email,
        password: step1Data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });

      setStep(3);
      setToast({ message: 'Compte créé avec succès !', type: 'success', visible: true });
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      setToast({ message: error.message || "Erreur d'inscription", type: 'error', visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Join the Community"
      heroSubtitle="Start your journey today and get access to exclusive workshops and professional networking."
    >
      <div className="relative overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-3xl text-navy mb-2">Create Account</h2>
                <p className="text-slate">Let's start with your credentials</p>
              </div>

              <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="space-y-4">
                <FloatingInput
                  label="Email address"
                  error={formStep1.formState.errors.email?.message}
                  value={formStep1.watch('email')}
                  {...formStep1.register('email')}
                />
                <FloatingInput
                  label="Password"
                  type="password"
                  error={formStep1.formState.errors.password?.message}
                  {...formStep1.register('password')}
                />
                <FloatingInput
                  label="Confirm Password"
                  type="password"
                  error={formStep1.formState.errors.confirmPassword?.message}
                  {...formStep1.register('confirmPassword')}
                />
                <MagneticButton type="submit">
                  Continue <ArrowRight size={20} />
                </MagneticButton>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-6"
            >
              <button onClick={() => setStep(1)} className="flex items-center text-slate hover:text-navy transition-colors mb-4">
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>

              <div>
                <h2 className="font-serif text-3xl text-navy mb-2">Almost there</h2>
                <p className="text-slate">Complete your profile</p>
              </div>

              <form onSubmit={formStep2.handleSubmit(onFinalSubmit)} className="space-y-4">
                <FloatingInput
                  label="First Name"
                  error={formStep2.formState.errors.firstName?.message}
                  {...formStep2.register('firstName')}
                />
                <FloatingInput
                  label="Last Name"
                  error={formStep2.formState.errors.lastName?.message}
                  {...formStep2.register('lastName')}
                />
                <div className="pt-4">
                  <label className="block text-sm font-medium text-navy mb-3">Role</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="PARTICIPANT"
                        {...formStep2.register('role')}
                        className="mr-2"
                      />
                      <span className="text-slate">Participant</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="ADMIN"
                        {...formStep2.register('role')}
                        className="mr-2"
                      />
                      <span className="text-slate">Admin</span>
                    </label>
                  </div>
                </div>
                <MagneticButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'} <ArrowRight size={20} />
                </MagneticButton>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-4 py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-serif text-navy">Welcome aboard!</h2>
              <p className="text-slate max-w-xs">Your account is ready. Redirecting you to login...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </AuthLayout>
  );
}
