import { z } from 'zod'

// Auth validations
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  role: z.enum(['jobseeker', 'recruiter']).default('jobseeker'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Profile validations
export const profileSchema = z.object({
  headline: z.string().max(200, 'Headline must be less than 200 characters').optional(),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  currentSalary: z.number().min(0).optional(),
  expectedSalary: z.number().min(0).optional(),
  noticePeriod: z.string().optional(),
  isOpenToWork: z.boolean().optional(),
  isRemoteOnly: z.boolean().optional(),
  willingToRelocate: z.boolean().optional(),
})

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  locationType: z.enum(['onsite', 'remote', 'hybrid']).optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional(),
})

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000).optional(),
})

// Job validations
export const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  location: z.string().optional(),
  locationType: z.enum(['onsite', 'remote', 'hybrid']).default('onsite'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).default('full-time'),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).default('mid'),
  department: z.string().optional(),
  minSalary: z.number().min(0).optional(),
  maxSalary: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  showSalary: z.boolean().default(true),
  skills: z.array(z.object({
    skillId: z.string(),
    isRequired: z.boolean().default(true),
    importance: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  })).optional(),
})

// Company validations
export const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().max(2000).optional(),
  mission: z.string().max(500).optional(),
  culture: z.string().max(1000).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  headquarters: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
})

// Job preferences validations
export const jobPreferenceSchema = z.object({
  jobTypes: z.array(z.string()).optional(),
  experienceLevels: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  preferredRoles: z.array(z.string()).optional(),
  minSalary: z.number().min(0).optional(),
  maxSalary: z.number().min(0).optional(),
  preferredLocations: z.array(z.string()).optional(),
  remotePreference: z.enum(['onsite', 'remote', 'hybrid', 'any']).optional(),
  companySize: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  dealBreakers: z.array(z.string()).optional(),
})

// Message validations
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000),
  messageType: z.enum(['text', 'image', 'file', 'system', 'ai_suggestion']).default('text'),
})

// Application validations
export const applicationSchema = z.object({
  coverLetter: z.string().max(5000).optional(),
  resumeUrl: z.string().url().optional(),
  answers: z.record(z.string()).optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type JobInput = z.infer<typeof jobSchema>
export type CompanyInput = z.infer<typeof companySchema>
export type JobPreferenceInput = z.infer<typeof jobPreferenceSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
