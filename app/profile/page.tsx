'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SimpleLayout } from '@/components/layout/app-layout'
import { Avatar } from '@/components/ui/avatar'
import { Badge, SkillBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CircularProgress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
import { SelectField } from '@/components/ui/select'
import { ProfileSkeleton } from '@/components/ui/skeleton'
import { cn, formatDate, parseJsonSafe } from '@/lib/utils'
import {
  Edit2,
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Plus,
  Sparkles,
  Upload,
  Camera,
  Check,
  X,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  locationType?: string
  employmentType?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
}

interface Education {
  id: string
  institution: string
  degree?: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  isCurrent: boolean
  description?: string
}

interface Skill {
  id: string
  skill: { name: string }
  proficiency: string
  isTopSkill: boolean
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [completionScore, setCompletionScore] = useState(0)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  // Edit states
  const [editData, setEditData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        setProfile(data.user?.profile || {})
        setExperiences(data.user?.experience || [])
        setEducation(data.user?.education || [])
        setSkills(data.user?.skills || [])
        setCompletionScore(data.completionScore || 0)
        setEditData({
          name: data.user?.name || '',
          ...data.user?.profile,
        })
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error()

      setProfile({ ...profile, ...editData })
      setEditingSection(null)
      toast.success('Profile updated!')

      // Update session if name changed
      if (editData.name !== session?.user?.name) {
        await updateSession({ name: editData.name })
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOptimizeProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to optimize')
        return
      }

      const data = await response.json()
      toast.success('AI optimization complete!')

      // Show suggestions in a modal or update the form
      setEditData({
        ...editData,
        headline: data.suggestions.optimizedHeadline,
        bio: data.suggestions.optimizedBio,
      })
    } catch (error) {
      toast.error('Failed to optimize profile')
    }
  }

  if (isLoading) {
    return (
      <SimpleLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <ProfileSkeleton />
        </div>
      </SimpleLayout>
    )
  }

  return (
    <SimpleLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-700 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/30 text-white"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              <div className="relative">
                <Avatar
                  src={session?.user?.image || (profile?.avatarUrl as string)}
                  name={session?.user?.name}
                  size="3xl"
                  className="ring-4 ring-background"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-background shadow-lg rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
                    <p className="text-muted-foreground">
                      {(profile?.headline as string) || 'Add a headline to stand out'}
                    </p>
                    {profile?.location && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location as string}
                      </p>
                    )}
                  </div>
                  <Button onClick={() => setEditingSection('basic')}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                <CircularProgress
                  value={completionScore}
                  size={48}
                  strokeWidth={4}
                  color={completionScore >= 80 ? 'success' : completionScore >= 50 ? 'warning' : 'brand'}
                  showValue={false}
                />
                <div>
                  <p className="text-2xl font-bold">{completionScore}%</p>
                  <p className="text-xs text-muted-foreground">Profile Complete</p>
                </div>
              </div>

              {profile?.isOpenToWork && (
                <Badge variant="success" size="lg" className="h-12">
                  <Check className="w-4 h-4 mr-1" />
                  Open to Work
                </Badge>
              )}

              <Button
                variant="outline"
                onClick={handleOptimizeProfile}
                className="h-12"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Optimize
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="preferences">Job Preferences</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid gap-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    About Me
                    <Button variant="ghost" size="sm" onClick={() => setEditingSection('about')}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.bio ? (
                    <p className="whitespace-pre-line">{profile.bio as string}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Add a bio to tell recruiters about yourself
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Contact Information
                    <Button variant="ghost" size="sm" onClick={() => setEditingSection('contact')}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span>{session?.user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span>{profile.phone as string}</span>
                    </div>
                  )}
                  {profile?.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-brand-500 hover:underline"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a
                      href={profile.githubUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-brand-500 hover:underline"
                    >
                      <Github className="w-5 h-5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {profile?.website && (
                    <a
                      href={profile.website as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-brand-500 hover:underline"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Work Experience
                  <Button onClick={() => setEditingSection('add-experience')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No experience added yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your work experience to stand out to recruiters
                    </p>
                    <Button onClick={() => setEditingSection('add-experience')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{exp.title}</h4>
                              <p className="text-muted-foreground">{exp.company}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-sm">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Education
                  <Button onClick={() => setEditingSection('add-education')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {education.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No education added yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your educational background
                    </p>
                    <Button onClick={() => setEditingSection('add-education')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{edu.institution}</h4>
                              <p className="text-muted-foreground">
                                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                              </p>
                              {edu.startDate && (
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                                </p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills
                  <Button onClick={() => setEditingSection('add-skill')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No skills added yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your skills to get better job matches
                    </p>
                    <Button onClick={() => setEditingSection('add-skill')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skills
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill.skill.name}
                        proficiency={skill.proficiency as 'beginner' | 'intermediate' | 'advanced' | 'expert'}
                        removable
                        onRemove={() => {}}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Job Preferences
                  <Button onClick={() => setEditingSection('preferences')}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Preferences
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Job Types</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Full-time</Badge>
                      <Badge variant="secondary">Remote</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Expected Salary</p>
                    <p className="font-medium">
                      {profile?.expectedSalary
                        ? `$${(profile.expectedSalary as number).toLocaleString()}/year`
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Notice Period</p>
                    <p className="font-medium">{(profile?.noticePeriod as string) || 'Immediate'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Willing to Relocate</p>
                    <p className="font-medium">{profile?.willingToRelocate ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        <Modal
          isOpen={editingSection === 'basic'}
          onClose={() => setEditingSection(null)}
          title="Edit Profile"
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={(editData.name as string) || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <Input
              label="Headline"
              value={(editData.headline as string) || ''}
              onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
              placeholder="e.g., Senior Software Engineer at Tech Co"
            />
            <Input
              label="Location"
              value={(editData.location as string) || ''}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={editingSection === 'about'}
          onClose={() => setEditingSection(null)}
          title="Edit About"
        >
          <div className="space-y-4">
            <Textarea
              label="Bio"
              value={(editData.bio as string) || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
              maxLength={2000}
              showCount
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </SimpleLayout>
  )
}
