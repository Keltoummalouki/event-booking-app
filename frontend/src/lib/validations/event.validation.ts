import { z } from 'zod';

// Event Status enum values matching backend
const eventStatusValues = ['DRAFT', 'PUBLISHED', 'CANCELED'] as const;

// Event Form Schema - matches CreateEventDto from backend
export const eventFormSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters'),
    
    description: z
        .string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters'),
    
    date: z
        .string()
        .min(1, 'Date is required')
        .refine((dateStr) => {
            const selectedDate = new Date(dateStr);
            const now = new Date();
            // Reset time to start of day for fair comparison
            now.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            return selectedDate >= now;
        }, {
            message: 'Event date must be in the future or today',
        }),
    
    location: z
        .string()
        .min(1, 'Location is required')
        .min(3, 'Location must be at least 3 characters')
        .max(300, 'Location must not exceed 300 characters'),
    
    capacity: z
        .number({
            required_error: 'Capacity is required',
            invalid_type_error: 'Capacity must be a number',
        })
        .int('Capacity must be a whole number')
        .min(1, 'Capacity must be at least 1')
        .max(100000, 'Capacity seems unreasonably high'),
    
    status: z.enum(eventStatusValues, {
        errorMap: () => ({ message: 'Status must be either DRAFT or PUBLISHED' }),
    }),
});

// Type inference for form data
export type EventFormData = z.infer<typeof eventFormSchema>;

// Export event status type
export type EventStatus = (typeof eventStatusValues)[number];
