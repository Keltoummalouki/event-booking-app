import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Step 1 Schema - Credentials
export const registerStep1Schema = z
    .object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

// Role type for Zod 4
const roleValues = ['ADMIN', 'PARTICIPANT'] as const;

// Register Step 2 Schema - Profile
export const registerStep2Schema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    role: z.enum(roleValues),
});

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
export type Role = (typeof roleValues)[number];
