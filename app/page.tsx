import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Heart,
  MessageSquare,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Building2,
  ArrowRight,
  Star,
  Check,
  Play,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                JobSwipe<span className="text-brand-500">AI</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Button asChild>
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Job Matching
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Swipe Your Way to
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              {' '}Your Dream Job
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The revolutionary job matching platform that uses AI to connect you with perfect opportunities.
            No more endless scrolling - just swipe, match, and get hired.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="xl" asChild>
              <Link href="/auth/signup">
                Start Matching Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="#how-it-works">
                <Play className="mr-2 w-5 h-5" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">50K+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100K+</div>
              <div className="text-muted-foreground">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-500">92%</div>
              <div className="text-muted-foreground">Match Accuracy</div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 shadow-2xl overflow-hidden border">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <Heart className="w-10 h-10 text-brand-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Swipe Interface Demo</h3>
                  <p className="text-muted-foreground">Experience the future of job hunting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why JobSwipe AI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've reimagined job searching with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Matching',
                description: 'Our AI analyzes your skills, experience, and preferences to find your perfect job match with 92% accuracy.',
              },
              {
                icon: Zap,
                title: 'Swipe to Apply',
                description: 'No more tedious applications. Simply swipe right on jobs you love and instantly express interest.',
              },
              {
                icon: MessageSquare,
                title: 'Direct Messaging',
                description: 'When you match with a recruiter, start chatting immediately. No waiting for email responses.',
              },
              {
                icon: TrendingUp,
                title: 'AI Resume Analysis',
                description: 'Get instant feedback on your resume with AI-powered suggestions to improve your chances.',
              },
              {
                icon: Shield,
                title: 'Verified Companies',
                description: 'All companies are verified to ensure you only see legitimate opportunities from real employers.',
              },
              {
                icon: Star,
                title: 'Smart Recommendations',
                description: 'The more you use JobSwipe, the smarter it gets. AI learns your preferences for better matches.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get matched with your dream job in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Upload your resume and let our AI build your professional profile. Add your skills, experience, and job preferences.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Swipe on Jobs',
                description: 'Browse curated job recommendations. Swipe right on jobs you like, left to pass, or up to super-like your dream job.',
                icon: Heart,
              },
              {
                step: '03',
                title: 'Match & Connect',
                description: 'When a recruiter likes you back, it\'s a match! Start chatting and schedule interviews directly in the app.',
                icon: MessageSquare,
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-brand-100 absolute -top-4 -left-4">
                  {step.step}
                </div>
                <div className="relative z-10 pt-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-900 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                For Recruiters
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Find Top Talent Faster Than Ever
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Stop wasting time on unqualified candidates. Our AI pre-screens applicants
                and shows you only the best matches for your positions.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'AI-powered candidate matching',
                  'Automated screening and ranking',
                  'Direct messaging with candidates',
                  'Analytics and hiring insights',
                  'Team collaboration tools',
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-success-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup?role=recruiter">
                  Start Hiring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-lg p-8">
                <div className="h-full rounded-xl bg-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">3x</div>
                    <div className="text-white/70">Faster Time to Hire</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start for free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect for getting started</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {['50 swipes per day', '5 super likes per day', 'Basic AI matching', 'Direct messaging', 'Job alerts'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-brand-500 bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">For serious job seekers</p>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {['Unlimited swipes', '30 super likes per day', 'Advanced AI matching', 'Priority in search', 'See who viewed you', 'AI resume review', 'Salary insights'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link href="/auth/signup?plan=pro">Start Free Trial</Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="p-8 rounded-2xl border bg-gradient-to-br from-warning-50 to-warning-100">
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <p className="text-muted-foreground mb-4">Maximum advantage</p>
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {['Everything in Pro', 'Unlimited super likes', 'Profile boost weekly', 'AI interview prep', 'Salary negotiation tips', 'Personal career coach', 'VIP support'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="premium" className="w-full" asChild>
                <Link href="/auth/signup?plan=premium">Go Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of job seekers who have found their perfect match with JobSwipe AI.
          </p>
          <Button size="xl" asChild>
            <Link href="/auth/signup">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">JobSwipe<span className="text-brand-500">AI</span></span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy-policy.html" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms-and-conditions.html" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/help" className="hover:text-foreground">Help Center</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 JobSwipe AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
