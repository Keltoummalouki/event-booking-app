'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Shield, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthLayout from '@/components/auth/AuthLayout';
import FloatingInput from '@/components/auth/FloatingInput';
import MagneticButton from '@/components/auth/MagneticButton';
import Toast from '@/components/auth/Toast';
import PasswordStrength from '@/components/auth/PasswordStrength';
import RoleCard from '@/components/auth/RoleCard';
import {
  registerStep1Schema,
  registerStep2Schema,
  RegisterStep1Data,
  RegisterStep2Data
} from '@/lib/validations/auth';
import { register as registerUser } from '@/services/auth.service';

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'error',
    visible: false,
  });

  // Step 1 Form
  const step1Form = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Step 2 Form
  const step2Form = useForm<RegisterStep2Data>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      role: undefined,
    },
  });

  const step1Values = step1Form.watch();
  const step2Values = step2Form.watch();

  // Progress simulation
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

  const handleStep1Submit = step1Form.handleSubmit(() => {
    setCurrentStep(2);
  });

  const handleStep2Submit = step2Form.handleSubmit(async (data) => {
    setIsLoading(true);
    setLoadingProgress(10);

    try {
      await registerUser({
        email: step1Values.email,
        password: step1Values.password,
        role: data.role,
      });

      setLoadingProgress(100);
      setCurrentStep(3);

      // Auto redirect after success animation
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setToast({
        message: errorMessage,
        type: 'error',
        visible: true,
      });
      setIsLoading(false);
    }
  });

  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <>
      <AuthLayout
        heroTitle="Join the Community"
        heroSubtitle="Create your account and unlock access to exclusive events, workshops, and networking opportunities."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      ${currentStep >= step
                        ? 'bg-coral text-white'
                        : 'bg-slate/10 text-slate'
                      }
                    `}
                    animate={{
                      scale: currentStep === step ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {currentStep > step ? (
                      <CheckCircle size={20} />
                    ) : (
                      step
                    )}
                  </motion.div>
                  {step < 3 && (
                    <motion.div
                      className="w-16 lg:w-24 h-0.5 mx-2"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: currentStep > step ? 1 : 0,
                        backgroundColor: currentStep > step ? '#F97316' : '#64748B40',
                      }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate px-1">
              <span>Credentials</span>
              <span className="text-center">Profile</span>
              <span className="text-right">Complete</span>
            </div>
          </div>

          {/* Form Steps */}
          <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait" custom={currentStep}>
              {/* Step 1: Credentials */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h2 className="font-serif text-2xl lg:text-3xl text-navy tracking-tight-custom mb-2">
                    Create your account
                  </h2>
                  <p className="text-slate mb-8">
                    Let's start with your credentials
                  </p>

                  <form onSubmit={handleStep1Submit} className="space-y-2">
                    <FloatingInput
                      label="Email address"
                      type="email"
                      value={step1Values.email}
                      onChange={(e) => step1Form.setValue('email', e.target.value)}
                      error={step1Form.formState.errors.email?.message}
                      autoComplete="email"
                    />

                    <FloatingInput
                      label="Password"
                      type="password"
                      value={step1Values.password}
                      onChange={(e) => step1Form.setValue('password', e.target.value)}
                      error={step1Form.formState.errors.password?.message}
                      autoComplete="new-password"
                    />

                    <PasswordStrength password={step1Values.password} />

                    <FloatingInput
                      label="Confirm password"
                      type="password"
                      value={step1Values.confirmPassword}
                      onChange={(e) => step1Form.setValue('confirmPassword', e.target.value)}
                      error={step1Form.formState.errors.confirmPassword?.message}
                      autoComplete="new-password"
                    />

                    <div className="pt-4">
                      <MagneticButton type="submit">
                        Continue
                        <ArrowRight size={20} />
                      </MagneticButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Profile */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h2 className="font-serif text-2xl lg:text-3xl text-navy tracking-tight-custom mb-2">
                    Complete your profile
                  </h2>
                  <p className="text-slate mb-8">
                    Tell us a bit more about yourself
                  </p>

                  <form onSubmit={handleStep2Submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        label="First name"
                        type="text"
                        value={step2Values.firstName}
                        onChange={(e) => step2Form.setValue('firstName', e.target.value)}
                        error={step2Form.formState.errors.firstName?.message}
                        autoComplete="given-name"
                      />

                      <FloatingInput
                        label="Last name"
                        type="text"
                        value={step2Values.lastName}
                        onChange={(e) => step2Form.setValue('lastName', e.target.value)}
                        error={step2Form.formState.errors.lastName?.message}
                        autoComplete="family-name"
                      />
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-4">
                        Select your role
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        <RoleCard
                          icon={User}
                          title="Participant"
                          description="Discover and attend events, workshops, and networking sessions."
                          isSelected={step2Values.role === 'PARTICIPANT'}
                          onClick={() => step2Form.setValue('role', 'PARTICIPANT')}
                        />
                        <RoleCard
                          icon={Shield}
                          title="Administrator"
                          description="Create and manage events, oversee participants and analytics."
                          isSelected={step2Values.role === 'ADMIN'}
                          onClick={() => step2Form.setValue('role', 'ADMIN')}
                        />
                      </div>
                      {step2Form.formState.errors.role && (
                        <p className="text-error text-sm mt-2">
                          {step2Form.formState.errors.role.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-2 py-4 px-6 text-slate hover:text-navy transition-colors"
                        whileHover={{ x: -4 }}
                      >
                        <ArrowLeft size={20} />
                        Back
                      </motion.button>

                      <div className="flex-1">
                        <MagneticButton
                          type="submit"
                          isLoading={isLoading}
                          loadingProgress={loadingProgress}
                        >
                          Create account
                          <ArrowRight size={20} />
                        </MagneticButton>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle size={40} className="text-white" />
                  </motion.div>

                  <motion.h2
                    className="font-serif text-3xl text-navy tracking-tight-custom mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome aboard!
                  </motion.h2>

                  <motion.p
                    className="text-slate mb-8 max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your account has been created successfully. Redirecting you to login...
                  </motion.p>

                  <motion.div
                    className="w-full max-w-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="h-1 bg-slate/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-coral"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Link */}
          {currentStep < 3 && (
            <div className="mt-8 text-center">
              <p className="text-slate">
                Already have an account?{' '}
                <motion.a
                  href="/login"
                  className="text-coral font-medium hover:underline"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign in
                </motion.a>
              </p>
            </div>
          )}
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