import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/jobs/[id] - Get single job
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            culture: true,
            benefits: true,
            techStack: true,
            website: true,
            size: true,
            industry: true,
            headquarters: true,
            rating: true,
            reviewCount: true,
          },
        },
        skills: {
          include: { skill: true },
        },
        poster: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.job.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check ownership
    if (job.posterId !== session.user.id && job.company.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        benefits: body.benefits ? JSON.stringify(body.benefits) : undefined,
        qualifications: body.qualifications ? JSON.stringify(body.qualifications) : undefined,
        niceToHave: body.niceToHave ? JSON.stringify(body.niceToHave) : undefined,
        location: body.location,
        locationType: body.locationType,
        employmentType: body.employmentType,
        experienceLevel: body.experienceLevel,
        department: body.department,
        minSalary: body.minSalary,
        maxSalary: body.maxSalary,
        currency: body.currency,
        showSalary: body.showSalary,
        status: body.status,
        publishedAt: body.status === 'active' && !job.publishedAt ? new Date() : undefined,
      },
    })

    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob,
    })
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check ownership
    if (job.posterId !== session.user.id && job.company.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.job.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Job deleted successfully',
    })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
