'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { SelectField } from '@/components/ui/select'
import { LabeledSwitch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  Save,
  Eye,
  Briefcase,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const locationTypes = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
  { value: 'executive', label: 'Executive' },
]

const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL',
]

export default function NewJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    locationType: 'hybrid',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    department: '',
    minSalary: '',
    maxSalary: '',
    showSalary: true,
    skills: [] as string[],
    benefits: [] as string[],
    status: 'active',
  })

  const [newBenefit, setNewBenefit] = useState('')

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const addBenefit = (benefit: string) => {
    if (benefit && !formData.benefits.includes(benefit)) {
      setFormData({ ...formData, benefits: [...formData.benefits, benefit] })
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefit: string) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((b) => b !== benefit),
    })
  }

  const handleAIGenerate = async () => {
    if (!formData.title) {
      toast.error('Please enter a job title first')
      return
    }

    setIsGenerating(true)
    try {
      // In a real app, this would call the AI endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate AI-generated content
      setFormData({
        ...formData,
        description: `We are looking for a talented ${formData.title} to join our growing team. You will be working on exciting projects that impact millions of users worldwide.

In this role, you will collaborate with cross-functional teams to design, develop, and deliver high-quality solutions. We value innovation, collaboration, and continuous learning.

If you're passionate about technology and want to make a real impact, we'd love to hear from you!`,
        requirements: `• 3+ years of relevant experience
• Strong problem-solving skills
• Excellent communication abilities
• Experience with modern development practices
• Bachelor's degree in related field or equivalent experience`,
        responsibilities: `• Design and implement new features
• Collaborate with team members on technical solutions
• Write clean, maintainable code
• Participate in code reviews
• Contribute to team knowledge sharing`,
      })

      toast.success('AI generated job description!')
    } catch (error) {
      toast.error('Failed to generate description')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (status: 'active' | 'draft') => {
    if (!formData.title) {
      toast.error('Job title is required')
      return
    }

    if (!formData.description) {
      toast.error('Job description is required')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          minSalary: formData.minSalary ? parseInt(formData.minSalary) : null,
          maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : null,
          skills: formData.skills.map((name) => ({ name, isRequired: true })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create job')
      }

      toast.success(status === 'active' ? 'Job posted successfully!' : 'Job saved as draft')
      router.push('/recruiter/jobs')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create job')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout showSidebar>
      <div className="container max-w-4xl mx-auto py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/recruiter/jobs">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground">
              Create a job posting to attract top talent
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Job Details
                <Button
                  variant="outline"
                  onClick={handleAIGenerate}
                  isLoading={isGenerating}
                  disabled={!formData.title}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Job Title *"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <Textarea
                label="Description *"
                placeholder="Describe the role, team, and what makes this opportunity exciting..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={5000}
                showCount
                className="min-h-[150px]"
              />

              <Textarea
                label="Requirements"
                placeholder="List the qualifications and experience needed..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="min-h-[100px]"
              />

              <Textarea
                label="Responsibilities"
                placeholder="Describe the day-to-day responsibilities..."
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Location & Type */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Employment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <SelectField
                  label="Work Type"
                  options={locationTypes}
                  value={formData.locationType}
                  onValueChange={(v) => setFormData({ ...formData, locationType: v })}
                />

                <SelectField
                  label="Employment Type"
                  options={employmentTypes}
                  value={formData.employmentType}
                  onValueChange={(v) => setFormData({ ...formData, employmentType: v })}
                />

                <SelectField
                  label="Experience Level"
                  options={experienceLevels}
                  value={formData.experienceLevel}
                  onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}
                />

                <Input
                  label="Department"
                  placeholder="e.g., Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Salary */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Minimum Salary (USD/year)"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.minSalary}
                  onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                />

                <Input
                  label="Maximum Salary (USD/year)"
                  type="number"
                  placeholder="e.g., 150000"
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                />
              </div>

              <LabeledSwitch
                label="Show salary on job posting"
                description="Candidates prefer jobs with transparent compensation"
                checked={formData.showSalary}
                onCheckedChange={(checked) => setFormData({ ...formData, showSalary: checked })}
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="default" removable onRemove={() => removeSkill(skill)}>
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill(newSkill)
                    }
                  }}
                />
                <Button variant="outline" onClick={() => addSkill(newSkill)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Suggested skills:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills
                    .filter((s) => !formData.skills.includes(s))
                    .slice(0, 8)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => addSkill(skill)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit) => (
                  <Badge key={benefit} variant="success" removable onRemove={() => removeBenefit(benefit)}>
                    {benefit}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a benefit..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addBenefit(newBenefit)
                    }
                  }}
                />
                <Button variant="outline" onClick={() => addBenefit(newBenefit)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Health Insurance', 'Dental & Vision', '401k Match', 'Unlimited PTO', 'Remote Work', 'Equity', 'Learning Budget', 'Gym Membership']
                  .filter((b) => !formData.benefits.includes(b))
                  .map((benefit) => (
                    <Badge
                      key={benefit}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => addBenefit(benefit)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {benefit}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="ghost" asChild>
              <Link href="/recruiter/jobs">Cancel</Link>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit('active')}
                isLoading={isSubmitting}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
