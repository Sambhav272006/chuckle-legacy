'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SimpleLayout } from '@/components/layout/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, SearchInput } from '@/components/ui/input'
import { Badge, MatchBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { MatchScore } from '@/components/ui/progress'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { RangeSlider } from '@/components/ui/slider'
import { cn, formatSalaryRange, formatLocationType, formatEmploymentType, formatExperienceLevel, formatRelativeTime } from '@/lib/utils'
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
  X,
  ChevronDown,
  Bookmark,
  Heart,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Job {
  id: string
  title: string
  slug: string
  description: string
  company: {
    name: string
    logo?: string
    industry?: string
  }
  location?: string
  locationType: string
  employmentType: string
  experienceLevel: string
  minSalary?: number
  maxSalary?: number
  currency: string
  skills: { skill: { name: string } }[]
  aiMatchScore?: number
  createdAt: string
  isFeatured?: boolean
}

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
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Filters
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 300000])
  const [location, setLocation] = useState('')

  const fetchJobs = async (reset = false) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        mode: 'browse',
        page: reset ? '1' : page.toString(),
        limit: '20',
        search: searchQuery,
        location,
        locationType: selectedLocationTypes.join(','),
        employmentType: selectedEmploymentTypes.join(','),
        experienceLevel: selectedExperienceLevels.join(','),
        minSalary: salaryRange[0].toString(),
        maxSalary: salaryRange[1] > 0 ? salaryRange[1].toString() : '',
      })

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()

      if (reset) {
        setJobs(data.jobs || [])
        setPage(1)
      } else {
        setJobs((prev) => [...prev, ...(data.jobs || [])])
      }
      setHasMore(data.pagination?.page < data.pagination?.pages)
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(true)
  }, [])

  const handleSearch = () => {
    fetchJobs(true)
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
    fetchJobs()
  }

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const clearFilters = () => {
    setSelectedLocationTypes([])
    setSelectedEmploymentTypes([])
    setSelectedExperienceLevels([])
    setSalaryRange([0, 300000])
    setLocation('')
    setSearchQuery('')
    fetchJobs(true)
  }

  const activeFilterCount =
    selectedLocationTypes.length +
    selectedEmploymentTypes.length +
    selectedExperienceLevels.length +
    (salaryRange[0] > 0 || salaryRange[1] < 300000 ? 1 : 0) +
    (location ? 1 : 0)

  return (
    <SimpleLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">
            Search and filter through thousands of opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      placeholder="City or region"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      leftIcon={<MapPin className="w-4 h-4" />}
                    />
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Work Type</label>
                    <div className="flex flex-wrap gap-2">
                      {locationTypes.map((type) => (
                        <Badge
                          key={type.value}
                          variant={selectedLocationTypes.includes(type.value) ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(type.value, selectedLocationTypes, setSelectedLocationTypes)}
                        >
                          {type.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Employment</label>
                    <div className="flex flex-wrap gap-2">
                      {employmentTypes.map((type) => (
                        <Badge
                          key={type.value}
                          variant={selectedEmploymentTypes.includes(type.value) ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(type.value, selectedEmploymentTypes, setSelectedEmploymentTypes)}
                        >
                          {type.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience</label>
                    <div className="flex flex-wrap gap-2">
                      {experienceLevels.map((level) => (
                        <Badge
                          key={level.value}
                          variant={selectedExperienceLevels.includes(level.value) ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(level.value, selectedExperienceLevels, setSelectedExperienceLevels)}
                        >
                          {level.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mt-6">
                  <RangeSlider
                    label="Salary Range"
                    min={0}
                    max={300000}
                    step={10000}
                    value={salaryRange}
                    onChange={setSalaryRange}
                    formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSearch}>Apply Filters</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job List */}
        {isLoading && jobs.length === 0 ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  variant="bordered"
                  interactive
                  className={cn(job.isFeatured && 'border-brand-200 bg-brand-50/30')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={job.company.logo}
                        name={job.company.name}
                        size="lg"
                        className="hidden sm:flex"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            {job.isFeatured && (
                              <Badge variant="premium" size="sm" className="mb-2">
                                Featured
                              </Badge>
                            )}
                            <Link href={`/jobs/${job.slug}`}>
                              <h3 className="text-lg font-semibold hover:text-brand-500 transition-colors">
                                {job.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground">
                              {job.company.name}
                              {job.company.industry && ` • ${job.company.industry}`}
                            </p>
                          </div>

                          {job.aiMatchScore && (
                            <MatchScore score={job.aiMatchScore} size="sm" />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                          {job.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {formatLocationType(job.locationType)}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {formatEmploymentType(job.employmentType)}
                          </span>
                          {(job.minSalary || job.maxSalary) && (
                            <span className="flex items-center text-success-600 font-medium">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatSalaryRange(job.minSalary || null, job.maxSalary || null, job.currency)}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatRelativeTime(job.createdAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.slice(0, 5).map((s, i) => (
                            <Badge key={i} variant="secondary" size="sm">
                              {s.skill.name}
                            </Badge>
                          ))}
                          {job.skills.length > 5 && (
                            <Badge variant="secondary" size="sm">
                              +{job.skills.length - 5}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <Button asChild>
                            <Link href={`/jobs/${job.slug}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-success-500">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  isLoading={isLoading}
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </SimpleLayout>
  )
}
