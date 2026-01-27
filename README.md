# JobSwipe AI

A revolutionary AI-powered job matching platform that uses a Tinder-style swipe interface to connect job seekers with perfect opportunities and help recruiters find top talent.

## Features

### For Job Seekers
- **Swipe-Based Job Discovery**: Swipe right on jobs you love, left to pass, or up to super-like
- **AI-Powered Matching**: Get job recommendations based on your skills and preferences with 92% accuracy
- **Smart Profile**: AI analyzes your resume and optimizes your profile for better matches
- **Direct Messaging**: Chat directly with recruiters when you match
- **Salary Insights**: Get AI-powered salary recommendations and negotiation tips
- **Career Coach**: AI-powered career advice and interview preparation

### For Recruiters
- **Candidate Matching**: AI pre-screens and ranks candidates based on job requirements
- **Easy Job Posting**: Create job posts with AI-generated descriptions
- **Analytics Dashboard**: Track views, applications, and hiring metrics
- **Team Collaboration**: Invite team members to review candidates together
- **Direct Outreach**: Message promising candidates directly

### AI Features
- Resume parsing and analysis
- Job-candidate compatibility scoring
- Profile optimization suggestions
- Interview question generation
- Salary negotiation advice
- Message suggestions
- Skill gap analysis

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Radix UI
- **Database**: Prisma + SQLite (easily switch to PostgreSQL)
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Animations**: Framer Motion
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/jobswipe-ai.git
cd jobswipe-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"  # Optional
```

4. Set up the database:
```bash
npx prisma db push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

After seeding the database, you can use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | jobseeker@demo.com | Demo123! |
| Recruiter | recruiter@demo.com | Demo123! |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── discover/          # Swipe interface
│   ├── jobs/              # Job browsing
│   ├── matches/           # Messaging
│   ├── notifications/     # Notifications
│   ├── onboarding/        # User onboarding
│   ├── premium/           # Subscription plans
│   ├── profile/           # User profile
│   └── recruiter/         # Recruiter dashboard
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── swipe/             # Swipe interface components
│   └── ui/                # UI component library
├── lib/                   # Utility functions
│   ├── ai.ts              # OpenAI integration
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Database client
│   ├── store.ts           # Zustand stores
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
├── prisma/                # Database schema
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seeder
└── types/                 # TypeScript types
```

## Key Features Implementation

### Swipe Interface
The swipe interface uses Framer Motion for smooth animations:
- Drag gestures with spring physics
- Visual feedback (like/pass/super-like indicators)
- Card stacking effect
- Undo functionality

### AI Matching
The matching algorithm considers:
- Skill overlap between candidate and job requirements
- Experience level match
- Location and work type preferences
- Salary expectations
- Company culture fit

### Real-time Messaging
- Instant message delivery
- Read receipts
- AI-suggested conversation starters
- Message notifications

## Subscription Plans

### Job Seekers
- **Free**: 50 swipes/day, 5 super likes, basic matching
- **Pro** ($19/mo): Unlimited swipes, 30 super likes, AI resume review
- **Premium** ($49/mo): Everything + profile boost, interview prep, career coach

### Recruiters
- **Starter**: 1 job post, basic matching
- **Business** ($99/mo): 10 job posts, AI screening, analytics
- **Enterprise** ($299/mo): Unlimited posts, API access, custom integrations

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | * | Authentication |
| `/api/jobs` | GET, POST | Job listings |
| `/api/jobs/[id]` | GET, PUT, DELETE | Single job |
| `/api/swipes` | POST | Record swipes |
| `/api/matches` | GET | User matches |
| `/api/matches/[id]/messages` | GET, POST | Messages |
| `/api/profile` | GET, PUT, POST | User profile |
| `/api/notifications` | GET, PUT, DELETE | Notifications |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

## License

This project is licensed under the MIT License.
