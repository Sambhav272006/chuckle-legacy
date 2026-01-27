'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  Globe,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'basic', title: 'Basic Info' },
  { id: 'experience', title: 'Experience' },
  { id: 'skills', title: 'Skills' },
  { id: 'preferences', title: 'Preferences' },
  { id: 'complete', title: 'Complete' },
]

const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL',
  'Git', 'Agile', 'Scrum', 'Communication', 'Leadership', 'Problem Solving',
]

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]

const workTypes = [
  { value: 'remote', label: 'Remote', icon: Globe },
  { value: 'hybrid', label: 'Hybrid', icon: Building2 },
  { value: 'onsite', label: 'On-site', icon: MapPin },
]

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    location: '',
    yearsOfExperience: '',
    currentTitle: '',
    skills: [] as string[],
    jobTypes: [] as string[],
    workType: 'any',
    minSalary: '',
    maxSalary: '',
    isOpenToWork: true,
  })

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      await handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const toggleJobType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter((t) => t !== type)
        : [...prev.jobTypes, type],
    }))
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // Save profile data
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: formData.headline,
          bio: formData.bio,
          location: formData.location,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          isOpenToWork: formData.isOpenToWork,
          expectedSalary: parseInt(formData.maxSalary) || 0,
        }),
      })

      if (!response.ok) throw new Error()

      // Mark onboarding as complete
      await updateSession({ onboardingComplete: true })

      toast.success('Profile setup complete!')
      router.push('/discover')
    } catch (error) {
      toast.error('Failed to save profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Welcome to JobSwipe AI!
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Let's set up your profile to find your perfect job match. This will only take a few minutes.
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-brand-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-sm text-muted-foreground">50K+ Jobs</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success-600" />
                </div>
                <p className="text-sm text-muted-foreground">100K+ Users</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-warning-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-warning-600" />
                </div>
                <p className="text-sm text-muted-foreground">92% Match Rate</p>
              </div>
            </div>
          </div>
        )

      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                This helps recruiters understand who you are
              </p>
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g., Senior Software Engineer | React Expert"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              helperText="This appears at the top of your profile"
            />

            <Textarea
              label="Bio"
              placeholder="Tell us about your experience, skills, and what you're looking for..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              maxLength={500}
              showCount
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
              <Input
                label="Current Title"
                placeholder="e.g., Software Engineer"
                value={formData.currentTitle}
                onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
              />
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Experience</h2>
              <p className="text-muted-foreground">
                Help us understand your background
              </p>
            </div>

            <div className="text-center">
              <label className="block text-sm font-medium mb-4">
                Years of Experience
              </label>
              <div className="flex justify-center gap-3">
                {['0-1', '2-4', '5-7', '8-10', '10+'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setFormData({ ...formData, yearsOfExperience: range })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.yearsOfExperience === range
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-muted hover:border-brand-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-muted/50 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI will automatically extract your experience and skills
              </p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        )

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Skills</h2>
              <p className="text-muted-foreground">
                Select skills that match your expertise
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={formData.skills.includes(skill) ? 'default' : 'secondary'}
                  className="cursor-pointer text-sm py-2 px-3"
                  onClick={() => toggleSkill(skill)}
                >
                  {formData.skills.includes(skill) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Selected: {formData.skills.length} skills
              </p>
              <Input
                placeholder="Add a custom skill..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement
                    if (input.value.trim()) {
                      toggleSkill(input.value.trim())
                      input.value = ''
                    }
                  }
                }}
              />
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Job Preferences</h2>
              <p className="text-muted-foreground">
                What are you looking for?
              </p>
            </div>

            {/* Work Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Work Type</label>
              <div className="grid grid-cols-3 gap-3">
                {workTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, workType: type.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.workType === type.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-muted hover:border-brand-200'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                      formData.workType === type.value ? 'text-brand-600' : 'text-muted-foreground'
                    }`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <Badge
                    key={type.value}
                    variant={formData.jobTypes.includes(type.value) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleJobType(type.value)}
                  >
                    {formData.jobTypes.includes(type.value) && (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Expected Salary Range (USD/year)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Min"
                  value={formData.minSalary}
                  onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  type="number"
                />
                <Input
                  placeholder="Max"
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  type="number"
                />
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center">
              <Check className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Your profile is ready. Start swiping to find your dream job!
            </p>
            <div className="p-6 rounded-xl bg-brand-50 border border-brand-100 max-w-md mx-auto">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-brand-500" />
              <h3 className="font-medium mb-2">AI Tip</h3>
              <p className="text-sm text-brand-700">
                The more you interact with JobSwipe, the better our AI gets at finding your perfect matches!
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="font-medium">{steps[currentStep].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              isLoading={isSubmitting}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Start Swiping
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
