import OpenAI from 'openai'
import { parseJsonSafe } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Check if AI is configured
export function isAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

// Resume parsing and analysis
export async function analyzeResume(resumeText: string): Promise<{
  summary: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    highlights: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    year: string
  }>
  suggestedRoles: string[]
  improvements: string[]
  atsScore: number
  keywords: string[]
}> {
  if (!isAIConfigured()) {
    return {
      summary: 'AI analysis not available - configure OpenAI API key',
      skills: [],
      experience: [],
      education: [],
      suggestedRoles: [],
      improvements: ['Configure AI to get personalized recommendations'],
      atsScore: 0,
      keywords: [],
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert resume analyst and career coach. Analyze the provided resume and extract structured information. Provide actionable insights and suggestions for improvement. Return a JSON object with the following structure:
{
  "summary": "Professional summary in 2-3 sentences",
  "skills": ["skill1", "skill2", ...],
  "experience": [{"title": "", "company": "", "duration": "", "highlights": []}],
  "education": [{"institution": "", "degree": "", "field": "", "year": ""}],
  "suggestedRoles": ["role1", "role2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "atsScore": 0-100,
  "keywords": ["keyword1", "keyword2", ...]
}`,
      },
      {
        role: 'user',
        content: `Analyze this resume:\n\n${resumeText}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Job-candidate matching score
export async function calculateMatchScore(
  candidateProfile: {
    skills: string[]
    experience: string
    preferences: string
    bio: string
  },
  jobDetails: {
    title: string
    description: string
    requirements: string
    skills: string[]
  }
): Promise<{
  score: number
  insights: string[]
  strengths: string[]
  gaps: string[]
  recommendation: string
}> {
  if (!isAIConfigured()) {
    return {
      score: Math.floor(Math.random() * 40) + 50, // Random score between 50-90 for demo
      insights: ['AI matching not available - configure OpenAI API key'],
      strengths: ['Profile looks promising'],
      gaps: ['Unable to analyze without AI'],
      recommendation: 'Review manually',
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert recruiter AI that evaluates job-candidate fit. Analyze the candidate profile against the job requirements and provide a detailed match analysis. Return a JSON object:
{
  "score": 0-100,
  "insights": ["insight1", "insight2", ...],
  "strengths": ["strength1", "strength2", ...],
  "gaps": ["gap1", "gap2", ...],
  "recommendation": "Brief recommendation for both parties"
}`,
      },
      {
        role: 'user',
        content: `Evaluate this match:

CANDIDATE PROFILE:
Skills: ${candidateProfile.skills.join(', ')}
Experience: ${candidateProfile.experience}
Preferences: ${candidateProfile.preferences}
Bio: ${candidateProfile.bio}

JOB DETAILS:
Title: ${jobDetails.title}
Description: ${jobDetails.description}
Requirements: ${jobDetails.requirements}
Required Skills: ${jobDetails.skills.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Generate personalized profile summary
export async function generateProfileSummary(profile: {
  name: string
  headline: string
  experience: string
  skills: string[]
  education: string
}): Promise<{
  summary: string
  strengths: string[]
  uniqueValue: string
}> {
  if (!isAIConfigured()) {
    return {
      summary: 'Professional with diverse experience and skills.',
      strengths: ['Adaptable', 'Skilled', 'Motivated'],
      uniqueValue: 'Brings unique perspective to teams',
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a personal branding expert. Generate a compelling professional summary that highlights the candidate's unique value proposition. Return a JSON object:
{
  "summary": "2-3 sentence compelling professional summary",
  "strengths": ["top 3-5 professional strengths"],
  "uniqueValue": "What makes this candidate stand out"
}`,
      },
      {
        role: 'user',
        content: `Generate a professional summary for:
Name: ${profile.name}
Headline: ${profile.headline}
Experience: ${profile.experience}
Skills: ${profile.skills.join(', ')}
Education: ${profile.education}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Generate job description
export async function generateJobDescription(input: {
  title: string
  company: string
  industry: string
  skills: string[]
  experienceLevel: string
  locationType: string
}): Promise<{
  description: string
  requirements: string
  responsibilities: string
  qualifications: string[]
  niceToHave: string[]
  benefits: string[]
}> {
  if (!isAIConfigured()) {
    return {
      description: `We are looking for a ${input.title} to join our team.`,
      requirements: 'Relevant experience required.',
      responsibilities: 'Contribute to team projects and initiatives.',
      qualifications: ['Relevant degree or experience', 'Strong communication skills'],
      niceToHave: ['Additional certifications', 'Leadership experience'],
      benefits: ['Competitive salary', 'Health insurance', 'Flexible work'],
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert HR professional and technical writer. Generate a compelling and comprehensive job description. Return a JSON object:
{
  "description": "Engaging job overview paragraph",
  "requirements": "Detailed requirements section",
  "responsibilities": "List of key responsibilities as a string",
  "qualifications": ["qualification1", "qualification2", ...],
  "niceToHave": ["nice1", "nice2", ...],
  "benefits": ["benefit1", "benefit2", ...]
}`,
      },
      {
        role: 'user',
        content: `Generate a job description for:
Title: ${input.title}
Company: ${input.company}
Industry: ${input.industry}
Required Skills: ${input.skills.join(', ')}
Experience Level: ${input.experienceLevel}
Location Type: ${input.locationType}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Generate interview questions
export async function generateInterviewQuestions(
  jobTitle: string,
  skills: string[],
  experienceLevel: string
): Promise<{
  technical: string[]
  behavioral: string[]
  situational: string[]
}> {
  if (!isAIConfigured()) {
    return {
      technical: [
        'Tell me about your experience with the required technologies.',
        'How do you approach problem-solving in your work?',
      ],
      behavioral: [
        'Describe a challenging project you completed.',
        'How do you handle disagreements with team members?',
      ],
      situational: [
        'How would you handle a tight deadline with incomplete requirements?',
        'What would you do if you noticed a critical bug right before release?',
      ],
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert interviewer. Generate relevant interview questions tailored to the role. Return a JSON object:
{
  "technical": ["5 technical questions relevant to the role and skills"],
  "behavioral": ["5 behavioral questions using STAR format prompts"],
  "situational": ["5 situational/hypothetical questions"]
}`,
      },
      {
        role: 'user',
        content: `Generate interview questions for:
Job Title: ${jobTitle}
Required Skills: ${skills.join(', ')}
Experience Level: ${experienceLevel}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Optimize profile for better matches
export async function optimizeProfile(profile: {
  headline: string
  bio: string
  skills: string[]
  targetRoles: string[]
}): Promise<{
  optimizedHeadline: string
  optimizedBio: string
  suggestedSkills: string[]
  tips: string[]
  keywordSuggestions: string[]
}> {
  if (!isAIConfigured()) {
    return {
      optimizedHeadline: profile.headline,
      optimizedBio: profile.bio,
      suggestedSkills: ['Communication', 'Problem-solving', 'Teamwork'],
      tips: ['Add more keywords', 'Include measurable achievements'],
      keywordSuggestions: ['leadership', 'innovation', 'collaboration'],
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a career coach and profile optimization expert. Analyze and optimize the profile for better job matching. Return a JSON object:
{
  "optimizedHeadline": "Improved headline with keywords",
  "optimizedBio": "Enhanced bio with better structure and keywords",
  "suggestedSkills": ["skills to add based on target roles"],
  "tips": ["actionable improvement tips"],
  "keywordSuggestions": ["keywords to include"]
}`,
      },
      {
        role: 'user',
        content: `Optimize this profile:
Current Headline: ${profile.headline}
Current Bio: ${profile.bio}
Current Skills: ${profile.skills.join(', ')}
Target Roles: ${profile.targetRoles.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Generate message suggestions
export async function generateMessageSuggestions(context: {
  senderRole: 'jobseeker' | 'recruiter'
  matchContext: string
  jobTitle?: string
  previousMessages?: string[]
}): Promise<{
  suggestions: string[]
  icebreakers: string[]
  followUps: string[]
}> {
  if (!isAIConfigured()) {
    const suggestions =
      context.senderRole === 'jobseeker'
        ? [
            "Hi! I'm excited about this opportunity. I'd love to learn more about the role.",
            "Thank you for matching! I believe my experience aligns well with what you're looking for.",
            "Hello! I'm very interested in this position. When would be a good time to chat?",
          ]
        : [
            'Hi! Your profile caught my attention. Would you be interested in discussing this opportunity?',
            "Hello! I think you'd be a great fit for our team. Let's schedule a call!",
            'Thanks for your interest! I'd love to tell you more about the role and our company.',
          ]
    return {
      suggestions,
      icebreakers: suggestions,
      followUps: ['Looking forward to hearing from you!', 'Let me know if you have any questions.'],
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a professional communication coach. Generate appropriate message suggestions for job-related conversations. Return a JSON object:
{
  "suggestions": ["3 personalized message options"],
  "icebreakers": ["3 conversation starters"],
  "followUps": ["3 follow-up message options"]
}`,
      },
      {
        role: 'user',
        content: `Generate messages for:
Sender: ${context.senderRole}
Context: ${context.matchContext}
${context.jobTitle ? `Job Title: ${context.jobTitle}` : ''}
${context.previousMessages?.length ? `Previous messages: ${context.previousMessages.join(' | ')}` : 'This is the first message'}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Skill gap analysis
export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: string,
  industry: string
): Promise<{
  missingSkills: string[]
  learningPath: Array<{
    skill: string
    priority: 'high' | 'medium' | 'low'
    resources: string[]
    timeEstimate: string
  }>
  marketDemand: string
  salaryImpact: string
}> {
  if (!isAIConfigured()) {
    return {
      missingSkills: ['Leadership', 'Cloud Computing', 'Data Analysis'],
      learningPath: [
        {
          skill: 'Cloud Computing',
          priority: 'high',
          resources: ['AWS Certification', 'Coursera Cloud Courses'],
          timeEstimate: '2-3 months',
        },
      ],
      marketDemand: 'High demand for these skills',
      salaryImpact: 'Could increase salary by 15-25%',
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a career development expert. Analyze skill gaps and provide actionable learning recommendations. Return a JSON object:
{
  "missingSkills": ["critical skills to acquire"],
  "learningPath": [{"skill": "", "priority": "high|medium|low", "resources": [], "timeEstimate": ""}],
  "marketDemand": "Analysis of market demand for these skills",
  "salaryImpact": "Potential salary impact of acquiring these skills"
}`,
      },
      {
        role: 'user',
        content: `Analyze skill gap for:
Current Skills: ${currentSkills.join(', ')}
Target Role: ${targetRole}
Industry: ${industry}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Company culture fit analysis
export async function analyzeCultureFit(
  candidatePreferences: {
    workStyle: string
    values: string[]
    environment: string
  },
  companyProfile: {
    culture: string
    values: string[]
    workEnvironment: string
  }
): Promise<{
  fitScore: number
  alignments: string[]
  potentialChallenges: string[]
  recommendation: string
}> {
  if (!isAIConfigured()) {
    return {
      fitScore: 75,
      alignments: ['Similar values', 'Matching work style preferences'],
      potentialChallenges: ['May need adjustment period'],
      recommendation: 'Good cultural fit with minor adaptations needed',
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an organizational psychologist. Analyze culture fit between candidate and company. Return a JSON object:
{
  "fitScore": 0-100,
  "alignments": ["areas of strong alignment"],
  "potentialChallenges": ["potential friction points"],
  "recommendation": "Overall assessment and advice"
}`,
      },
      {
        role: 'user',
        content: `Analyze culture fit:
CANDIDATE:
Work Style: ${candidatePreferences.workStyle}
Values: ${candidatePreferences.values.join(', ')}
Preferred Environment: ${candidatePreferences.environment}

COMPANY:
Culture: ${companyProfile.culture}
Values: ${companyProfile.values.join(', ')}
Work Environment: ${companyProfile.workEnvironment}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

// Salary negotiation advice
export async function getSalaryAdvice(
  role: string,
  experience: number,
  location: string,
  currentOffer: number,
  skills: string[]
): Promise<{
  marketRange: { min: number; max: number; median: number }
  negotiationTips: string[]
  leveragePoints: string[]
  counterOfferSuggestion: number
  explanation: string
}> {
  if (!isAIConfigured()) {
    const baseMultiplier = 1 + experience * 0.05
    return {
      marketRange: {
        min: Math.round(currentOffer * 0.9),
        max: Math.round(currentOffer * 1.3),
        median: Math.round(currentOffer * 1.1),
      },
      negotiationTips: [
        'Research market rates thoroughly',
        'Highlight unique skills and achievements',
        'Consider the total compensation package',
      ],
      leveragePoints: ['Strong skill set', 'Market demand for your expertise'],
      counterOfferSuggestion: Math.round(currentOffer * 1.15),
      explanation: 'Based on market trends and your experience level',
    }
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a salary negotiation expert with deep knowledge of tech compensation. Provide data-driven salary advice. Return a JSON object:
{
  "marketRange": {"min": number, "max": number, "median": number},
  "negotiationTips": ["specific negotiation strategies"],
  "leveragePoints": ["unique leverage points for this candidate"],
  "counterOfferSuggestion": number,
  "explanation": "Reasoning for the recommendation"
}`,
      },
      {
        role: 'user',
        content: `Provide salary advice for:
Role: ${role}
Years of Experience: ${experience}
Location: ${location}
Current Offer: $${currentOffer.toLocaleString()}
Key Skills: ${skills.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}
