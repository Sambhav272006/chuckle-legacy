'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SimpleLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Heart,
  MessageSquare,
  Eye,
  Star,
  TrendingUp,
  Shield,
  Rocket,
  Brain,
  BarChart3,
} from 'lucide-react'
import toast from 'react-hot-toast'

const plans = {
  jobseeker: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '50 swipes per day', included: true },
        { text: '5 super likes per day', included: true },
        { text: 'Basic AI matching', included: true },
        { text: 'Direct messaging', included: true },
        { text: 'Job alerts', included: true },
        { text: 'Unlimited swipes', included: false },
        { text: 'See who viewed you', included: false },
        { text: 'AI resume review', included: false },
        { text: 'Priority in search', included: false },
        { text: 'Profile boost', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      period: 'month',
      description: 'For serious job seekers',
      popular: true,
      features: [
        { text: 'Unlimited swipes', included: true },
        { text: '30 super likes per day', included: true },
        { text: 'Advanced AI matching', included: true },
        { text: 'Priority in search', included: true },
        { text: 'See who viewed you', included: true },
        { text: 'AI resume review', included: true },
        { text: 'Salary insights', included: true },
        { text: 'Unlimited AI credits', included: false },
        { text: 'Weekly profile boost', included: false },
        { text: 'Personal career coach', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      period: 'month',
      description: 'Maximum advantage',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited super likes', included: true },
        { text: 'Unlimited AI credits', included: true },
        { text: 'Weekly profile boost', included: true },
        { text: 'AI interview prep', included: true },
        { text: 'Salary negotiation tips', included: true },
        { text: 'Personal career coach', included: true },
        { text: 'VIP support', included: true },
        { text: 'Early access to features', included: true },
        { text: 'Background verified badge', included: true },
      ],
    },
  ],
  recruiter: [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      period: 'forever',
      description: 'Try out the platform',
      features: [
        { text: '1 active job posting', included: true },
        { text: 'Basic candidate matching', included: true },
        { text: 'Direct messaging', included: true },
        { text: 'Company profile', included: true },
        { text: 'Unlimited job posts', included: false },
        { text: 'AI candidate screening', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'Team collaboration', included: false },
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: 99,
      period: 'month',
      description: 'For growing teams',
      popular: true,
      features: [
        { text: '10 active job postings', included: true },
        { text: 'AI candidate screening', included: true },
        { text: 'Advanced matching', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Team collaboration (3 seats)', included: true },
        { text: 'Featured job posts', included: true },
        { text: 'Priority support', included: true },
        { text: 'Unlimited posts', included: false },
        { text: 'Custom branding', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      period: 'month',
      description: 'For large organizations',
      features: [
        { text: 'Unlimited job postings', included: true },
        { text: 'Unlimited team seats', included: true },
        { text: 'Custom branding', included: true },
        { text: 'API access', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'Advanced security', included: true },
        { text: 'Training & onboarding', included: true },
      ],
    },
  ],
}

const features = [
  {
    icon: Zap,
    title: 'Unlimited Swipes',
    description: 'Never miss an opportunity with unlimited daily swipes on job postings.',
  },
  {
    icon: Star,
    title: 'Super Likes',
    description: 'Stand out from the crowd by super liking your dream jobs.',
  },
  {
    icon: Brain,
    title: 'AI Resume Review',
    description: 'Get AI-powered suggestions to optimize your resume and profile.',
  },
  {
    icon: Eye,
    title: 'See Who Viewed You',
    description: 'Know which recruiters are interested in your profile.',
  },
  {
    icon: Rocket,
    title: 'Profile Boost',
    description: 'Get your profile seen by more recruiters with weekly boosts.',
  },
  {
    icon: BarChart3,
    title: 'Salary Insights',
    description: 'Access salary data and negotiation tips for your target roles.',
  },
]

export default function PremiumPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const isRecruiter = session?.user?.role === 'recruiter'
  const currentPlans = isRecruiter ? plans.recruiter : plans.jobseeker

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId)

    try {
      // In a real app, this would redirect to Stripe checkout
      toast.success('Redirecting to checkout...')

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo, just show success
      toast.success('Subscription activated!')
    } catch (error) {
      toast.error('Failed to process subscription')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <SimpleLayout>
      <div className="container max-w-6xl mx-auto py-12 px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-warning-400 to-warning-500 text-white text-sm font-medium mb-6">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Supercharge Your Job Search
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to AI features, priority matching, and tools to land your dream job faster.
          </p>
        </div>

        {/* Role Toggle */}
        <Tabs defaultValue={isRecruiter ? 'recruiter' : 'jobseeker'} className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="jobseeker">For Job Seekers</TabsTrigger>
              <TabsTrigger value="recruiter">For Recruiters</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobseeker" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.jobseeker.map((plan) => (
                <Card
                  key={plan.id}
                  className={plan.popular ? 'border-2 border-brand-500 relative' : ''}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-brand-500">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className={`flex items-center space-x-2 ${
                            feature.included ? '' : 'text-muted-foreground'
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${
                              feature.included ? 'text-success-500' : 'text-muted-foreground/50'
                            }`}
                          />
                          <span className="text-sm">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.id === 'premium' ? 'premium' : plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                      isLoading={isLoading === plan.id}
                      disabled={plan.price === 0}
                    >
                      {plan.price === 0 ? 'Current Plan' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recruiter" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.recruiter.map((plan) => (
                <Card
                  key={plan.id}
                  className={plan.popular ? 'border-2 border-brand-500 relative' : ''}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="bg-brand-500">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className={`flex items-center space-x-2 ${
                            feature.included ? '' : 'text-muted-foreground'
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${
                              feature.included ? 'text-success-500' : 'text-muted-foreground/50'
                            }`}
                          />
                          <span className="text-sm">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.id === 'enterprise' ? 'premium' : plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                      isLoading={isLoading === plan.id}
                      disabled={plan.price === 0}
                    >
                      {plan.price === 0 ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accelerate your job search
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Pro plan comes with a 7-day free trial. No credit card required to start.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and Apple Pay.',
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: "Absolutely! You can change your plan at any time. We'll prorate the difference.",
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
