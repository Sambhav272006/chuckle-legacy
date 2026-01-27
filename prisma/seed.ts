import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create skills
  const skillNames = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
    'Node.js', 'Express', 'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring Boot', 'Kotlin', 'Go', 'Rust', 'C++', 'C#',
    'Ruby', 'Ruby on Rails', 'PHP', 'Laravel',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'GraphQL', 'REST API', 'gRPC', 'WebSocket',
    'React Native', 'Flutter', 'Swift', 'iOS', 'Android',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science',
    'Figma', 'UI/UX Design', 'Product Management', 'Agile', 'Scrum',
    'Git', 'CI/CD', 'DevOps', 'Linux', 'Security',
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
  ]

  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name, isPopular: true },
      })
    )
  )
  console.log(`Created ${skills.length} skills`)

  // Create demo recruiter user
  const hashedPassword = await bcrypt.hash('Demo123!', 12)

  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@demo.com' },
    update: {},
    create: {
      email: 'recruiter@demo.com',
      name: 'Sarah Chen',
      password: hashedPassword,
      role: 'recruiter',
      onboardingComplete: true,
      profile: {
        create: {
          headline: 'Senior Technical Recruiter',
          bio: 'Passionate about connecting top talent with amazing opportunities.',
          location: 'San Francisco, CA',
        },
      },
      subscription: {
        create: {
          plan: 'business',
          status: 'active',
          swipesRemaining: 999,
          superLikesRemaining: 999,
          aiCreditsRemaining: 100,
        },
      },
    },
  })

  // Create company
  const company = await prisma.company.upsert({
    where: { slug: 'techcorp-inc' },
    update: {},
    create: {
      name: 'TechCorp Inc.',
      slug: 'techcorp-inc',
      description: 'A leading technology company building the future of work. We create innovative solutions that help businesses thrive in the digital age.',
      mission: 'To empower businesses with cutting-edge technology solutions.',
      culture: 'We believe in fostering a culture of innovation, collaboration, and continuous learning. Our team is diverse, inclusive, and passionate about making a difference.',
      benefits: JSON.stringify([
        'Competitive salary',
        'Equity package',
        'Health, dental, and vision insurance',
        'Unlimited PTO',
        'Remote-first culture',
        '401(k) matching',
        'Learning budget',
        'Home office stipend',
      ]),
      techStack: JSON.stringify(['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']),
      website: 'https://techcorp.example.com',
      industry: 'Technology',
      size: '201-500',
      founded: 2015,
      headquarters: 'San Francisco, CA',
      locations: JSON.stringify(['San Francisco, CA', 'New York, NY', 'Remote']),
      isVerified: true,
      isPremium: true,
      rating: 4.5,
      reviewCount: 128,
      ownerId: recruiter.id,
    },
  })

  // Create demo job seeker
  const jobSeeker = await prisma.user.upsert({
    where: { email: 'jobseeker@demo.com' },
    update: {},
    create: {
      email: 'jobseeker@demo.com',
      name: 'Alex Johnson',
      password: hashedPassword,
      role: 'jobseeker',
      onboardingComplete: true,
      profile: {
        create: {
          headline: 'Full Stack Developer | React & Node.js Expert',
          bio: 'Passionate full-stack developer with 5 years of experience building scalable web applications. I love tackling complex problems and creating elegant solutions.',
          location: 'New York, NY',
          yearsOfExperience: 5,
          expectedSalary: 150000,
          isOpenToWork: true,
          isRemoteOnly: false,
          willingToRelocate: true,
        },
      },
      subscription: {
        create: {
          plan: 'pro',
          status: 'active',
          swipesRemaining: 999,
          superLikesRemaining: 30,
          aiCreditsRemaining: 50,
        },
      },
      preferences: {
        create: {
          jobTypes: JSON.stringify(['full-time', 'contract']),
          experienceLevels: JSON.stringify(['mid', 'senior']),
          preferredRoles: JSON.stringify(['Software Engineer', 'Full Stack Developer', 'Frontend Developer']),
          minSalary: 120000,
          maxSalary: 200000,
          remotePreference: 'hybrid',
          companySize: JSON.stringify(['51-200', '201-500', '501-1000']),
        },
      },
    },
  })

  // Add skills to job seeker
  const jobSeekerSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git']
  for (const skillName of jobSeekerSkills) {
    const skill = skills.find((s) => s.name === skillName)
    if (skill) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: jobSeeker.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          userId: jobSeeker.id,
          skillId: skill.id,
          proficiency: 'advanced',
          yearsUsed: 4,
          isTopSkill: ['React', 'Node.js', 'TypeScript'].includes(skillName),
        },
      })
    }
  }

  // Create sample jobs
  const jobsData = [
    {
      title: 'Senior Full Stack Engineer',
      description: `We're looking for a Senior Full Stack Engineer to join our growing team. You'll work on building and scaling our core platform, collaborating with product and design teams to deliver amazing user experiences.

Key Responsibilities:
- Design and implement new features across the full stack
- Write clean, maintainable, and well-tested code
- Mentor junior developers and conduct code reviews
- Collaborate with cross-functional teams
- Contribute to architectural decisions`,
      requirements: `- 5+ years of experience in full-stack development
- Strong proficiency in React, Node.js, and TypeScript
- Experience with cloud platforms (AWS preferred)
- Strong understanding of database design and optimization
- Excellent communication and collaboration skills`,
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      minSalary: 180000,
      maxSalary: 240000,
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
      isFeatured: true,
    },
    {
      title: 'Frontend Engineer',
      description: `Join our frontend team to build beautiful, performant user interfaces. You'll work closely with our design team to bring mockups to life and create delightful user experiences.

What you'll do:
- Build responsive, accessible web applications
- Optimize performance and user experience
- Write reusable components and libraries
- Collaborate with backend engineers on API design`,
      requirements: `- 3+ years of frontend development experience
- Expert knowledge of React and modern JavaScript
- Experience with state management solutions
- Strong CSS skills and attention to design detail
- Testing experience (Jest, React Testing Library)`,
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      minSalary: 120000,
      maxSalary: 160000,
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
      isFeatured: false,
    },
    {
      title: 'Backend Engineer',
      description: `We're seeking a Backend Engineer to help build and scale our API infrastructure. You'll work on high-performance services that power our applications.

Responsibilities:
- Design and build scalable backend services
- Optimize database queries and system performance
- Implement security best practices
- Build and maintain CI/CD pipelines`,
      requirements: `- 4+ years of backend development experience
- Strong experience with Node.js or Python
- Deep understanding of SQL and NoSQL databases
- Experience with microservices architecture
- Knowledge of containerization and orchestration`,
      location: 'New York, NY',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      minSalary: 140000,
      maxSalary: 180000,
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
      isFeatured: false,
    },
    {
      title: 'DevOps Engineer',
      description: `Join our platform team to build and maintain our cloud infrastructure. You'll be responsible for ensuring our systems are reliable, scalable, and secure.

What you'll do:
- Manage and improve our cloud infrastructure
- Implement monitoring and alerting solutions
- Automate deployment and operations
- Collaborate on security and compliance`,
      requirements: `- 3+ years of DevOps/SRE experience
- Strong experience with AWS or GCP
- Proficiency in Infrastructure as Code (Terraform)
- Experience with Kubernetes and Docker
- Strong scripting skills (Python, Bash)`,
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      minSalary: 150000,
      maxSalary: 190000,
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Python'],
      isFeatured: true,
    },
    {
      title: 'Product Designer',
      description: `We're looking for a Product Designer to help shape the future of our platform. You'll work closely with product and engineering to design intuitive, beautiful experiences.

Responsibilities:
- Lead design for new features and products
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Establish and maintain our design system`,
      requirements: `- 4+ years of product design experience
- Strong portfolio demonstrating UX/UI skills
- Proficiency in Figma and prototyping tools
- Experience with design systems
- Strong communication and presentation skills`,
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      minSalary: 160000,
      maxSalary: 200000,
      skills: ['Figma', 'UI/UX Design', 'Product Management'],
      isFeatured: false,
    },
  ]

  for (const jobData of jobsData) {
    const slug = jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8)

    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        slug,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        locationType: jobData.locationType,
        employmentType: jobData.employmentType,
        experienceLevel: jobData.experienceLevel,
        minSalary: jobData.minSalary,
        maxSalary: jobData.maxSalary,
        currency: 'USD',
        showSalary: true,
        status: 'active',
        isFeatured: jobData.isFeatured,
        publishedAt: new Date(),
        companyId: company.id,
        posterId: recruiter.id,
        benefits: JSON.stringify([
          'Competitive salary',
          'Equity package',
          'Health insurance',
          'Unlimited PTO',
          'Remote-friendly',
        ]),
      },
    })

    // Add skills to job
    for (const skillName of jobData.skills) {
      const skill = skills.find((s) => s.name === skillName)
      if (skill) {
        await prisma.jobSkill.create({
          data: {
            jobId: job.id,
            skillId: skill.id,
            isRequired: true,
            importance: 'high',
          },
        })
      }
    }
  }

  console.log('Database seeded successfully!')
  console.log('\nDemo Accounts:')
  console.log('Job Seeker: jobseeker@demo.com / Demo123!')
  console.log('Recruiter: recruiter@demo.com / Demo123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
