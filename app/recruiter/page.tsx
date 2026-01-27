import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Avatar, AvatarGroup } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { formatRelativeTime, formatSalaryRange } from '@/lib/utils'
import {
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Target,
} from 'lucide-react'

async function getDashboardData(userId: string) {
  // Get company
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: true,
      companyMember: { include: { company: true } },
    },
  })

  const company = user?.company || user?.companyMember?.company

  if (!company) {
    return null
  }

  // Get stats
  const [jobs, matches, applications, recentCandidates] = await Promise.all([
    prisma.job.findMany({
      where: { companyId: company.id },
      include: {
        _count: {
          select: { applications: true, swipes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.match.count({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
        status: 'active',
      },
    }),
    prisma.application.count({
      where: {
        job: { companyId: company.id },
        status: 'pending',
      },
    }),
    prisma.swipe.findMany({
      where: {
        job: { companyId: company.id },
        direction: { in: ['right', 'up'] },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        job: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const totalViews = jobs.reduce((acc, job) => acc + (job.viewCount || 0), 0)
  const totalSwipes = jobs.reduce((acc, job) => acc + job._count.swipes, 0)
  const totalApplications = jobs.reduce((acc, job) => acc + job._count.applications, 0)

  return {
    company,
    jobs,
    stats: {
      activeJobs: jobs.filter((j) => j.status === 'active').length,
      totalMatches: matches,
      pendingApplications: applications,
      totalViews,
      totalSwipes,
      totalApplications,
    },
    recentCandidates,
  }
}

export default async function RecruiterDashboard() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'recruiter') {
    redirect('/discover')
  }

  const data = await getDashboardData(session.user.id)

  if (!data) {
    redirect('/recruiter/company/setup')
  }

  return (
    <AppLayout showSidebar>
      <div className="container max-w-7xl mx-auto py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your jobs.
            </p>
          </div>
          <Button asChild>
            <Link href="/recruiter/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold">{data.stats.activeJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-brand-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-success-500">+2</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Matches</p>
                  <p className="text-3xl font-bold">{data.stats.totalMatches}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-success-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-success-500">+12%</span> match rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold">{data.stats.totalApplications}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-warning-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-warning-500">{data.stats.pendingApplications}</span> pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Job Views</p>
                  <p className="text-3xl font-bold">{data.stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-success-500">+18%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Jobs
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/recruiter/jobs">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No jobs posted yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Post your first job to start receiving applications
                    </p>
                    <Button asChild>
                      <Link href="/recruiter/jobs/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Post a Job
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              href={`/recruiter/jobs/${job.id}`}
                              className="font-medium hover:text-brand-500 truncate"
                            >
                              {job.title}
                            </Link>
                            <StatusBadge status={job.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {job.viewCount} views
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {job._count.swipes} interested
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {job._count.applications} applications
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/recruiter/jobs/${job.id}`}>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Interest</CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentCandidates.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No candidates yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recentCandidates.map((swipe) => (
                      <div key={swipe.id} className="flex items-center space-x-3">
                        <Avatar
                          src={swipe.sender.image}
                          name={swipe.sender.name}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {swipe.sender.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            Interested in {swipe.job?.title}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(swipe.createdAt)}
                        </span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/recruiter/candidates">
                        View All Candidates
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-brand-50 border border-brand-100">
                    <p className="text-sm text-brand-700">
                      <Target className="w-4 h-4 inline mr-1" />
                      Your "Senior Engineer" post has 85% match rate with top candidates
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-success-50 border border-success-100">
                    <p className="text-sm text-success-700">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Application rate increased 23% this week
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning-50 border border-warning-100">
                    <p className="text-sm text-warning-700">
                      <Clock className="w-4 h-4 inline mr-1" />
                      5 candidates are waiting for your response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
