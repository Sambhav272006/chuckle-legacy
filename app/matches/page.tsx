'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { SimpleLayout } from '@/components/layout/app-layout'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MessageSkeleton } from '@/components/ui/skeleton'
import { cn, formatRelativeTime } from '@/lib/utils'
import {
  Send,
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Info,
  Search,
  Check,
  CheckCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Match {
  id: string
  otherUser: {
    id: string
    name: string
    image?: string
    role: string
    profile?: {
      headline?: string
      avatarUrl?: string
    }
  }
  job?: {
    id: string
    title: string
    company: {
      name: string
      logo?: string
    }
  }
  aiScore?: number
  lastMessage?: {
    content: string
    isFromMe: boolean
    createdAt: string
    isRead: boolean
  }
  createdAt: string
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
  messageType: string
}

export default function MatchesPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const preSelectedMatchId = searchParams.get('id')

  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch matches
  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch('/api/matches')
        const data = await response.json()
        setMatches(data.matches || [])

        // Auto-select match if provided in URL
        if (preSelectedMatchId) {
          const match = data.matches?.find((m: Match) => m.id === preSelectedMatchId)
          if (match) {
            setSelectedMatch(match)
          }
        }
      } catch (error) {
        toast.error('Failed to load matches')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [preSelectedMatchId])

  // Fetch messages when match is selected
  useEffect(() => {
    if (!selectedMatch) return

    async function fetchMessages() {
      try {
        const response = await fetch(`/api/matches/${selectedMatch.id}/messages`)
        const data = await response.json()
        setMessages(data.messages || [])
        setSuggestions(data.suggestions || [])
      } catch (error) {
        toast.error('Failed to load messages')
      }
    }

    fetchMessages()
  }, [selectedMatch])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedMatch) return

    setIsSending(true)

    // Optimistic update
    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      content: content.trim(),
      senderId: session?.user?.id || '',
      receiverId: selectedMatch.otherUser.id,
      createdAt: new Date().toISOString(),
      isRead: false,
      messageType: 'text',
    }
    setMessages((prev) => [...prev, tempMessage])
    setNewMessage('')

    try {
      const response = await fetch(`/api/matches/${selectedMatch.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!response.ok) throw new Error()

      const data = await response.json()

      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMessage.id ? data.message : m))
      )
    } catch (error) {
      toast.error('Failed to send message')
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
    } finally {
      setIsSending(false)
    }
  }

  const filteredMatches = matches.filter((match) =>
    match.otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SimpleLayout className="h-screen overflow-hidden">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Matches List */}
        <div className={cn(
          'w-full md:w-96 border-r bg-card flex flex-col',
          selectedMatch && 'hidden md:flex'
        )}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">No matches yet</h3>
                <p className="text-sm text-muted-foreground">
                  Keep swiping to find your perfect match!
                </p>
              </div>
            ) : (
              <div>
                {filteredMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={cn(
                      'w-full p-4 flex items-start space-x-3 hover:bg-muted/50 transition-colors text-left',
                      selectedMatch?.id === match.id && 'bg-muted'
                    )}
                  >
                    <Avatar
                      src={match.otherUser.image || match.otherUser.profile?.avatarUrl}
                      name={match.otherUser.name}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{match.otherUser.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(match.lastMessage?.createdAt || match.createdAt)}
                        </span>
                      </div>
                      {match.job && (
                        <p className="text-xs text-brand-500 truncate mb-1">
                          {match.job.title} at {match.job.company.name}
                        </p>
                      )}
                      <p className={cn(
                        'text-sm truncate',
                        match.lastMessage?.isFromMe ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {match.lastMessage ? (
                          <>
                            {match.lastMessage.isFromMe && (
                              match.lastMessage.isRead ? (
                                <CheckCheck className="w-3 h-3 inline mr-1 text-brand-500" />
                              ) : (
                                <Check className="w-3 h-3 inline mr-1" />
                              )
                            )}
                            {match.lastMessage.content}
                          </>
                        ) : (
                          <span className="text-muted-foreground italic">No messages yet</span>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          'flex-1 flex flex-col',
          !selectedMatch && 'hidden md:flex'
        )}>
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-card">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedMatch(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar
                    src={selectedMatch.otherUser.image || selectedMatch.otherUser.profile?.avatarUrl}
                    name={selectedMatch.otherUser.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{selectedMatch.otherUser.name}</p>
                    {selectedMatch.job && (
                      <p className="text-xs text-muted-foreground">
                        {selectedMatch.job.title} at {selectedMatch.job.company.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-brand-500" />
                    </div>
                    <h3 className="font-medium mb-2">Start the conversation!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Say hello and introduce yourself
                    </p>
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">AI Suggestions:</p>
                        {suggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="mx-1"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion.substring(0, 50)}...
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((message) => {
                    const isFromMe = message.senderId === session?.user?.id
                    return (
                      <div
                        key={message.id}
                        className={cn('flex', isFromMe ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'message-bubble',
                            isFromMe ? 'sent' : 'received'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={cn(
                            'flex items-center justify-end space-x-1 mt-1',
                            isFromMe ? 'text-white/70' : 'text-muted-foreground'
                          )}>
                            <span className="text-[10px]">
                              {formatRelativeTime(message.createdAt)}
                            </span>
                            {isFromMe && (
                              message.isRead ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(newMessage)
                  }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim() || isSending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a match to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}
