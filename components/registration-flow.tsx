// components/registration-flow.tsx
"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, TriangleAlertIcon } from 'lucide-react'
// import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons'

export function RegistrationFlow({ registrationResult }: {
  registrationResult: {
    status: 'profile_exists' | 'profile_claimed' | 'profile_created'
    profile_id: string
    is_claimed: boolean
    claimed_by_you: boolean
    message: string
  }
}) {
  const router = useRouter()
  const [action, setAction] = useState<'none' | 'view' | 'claim'>('none')

  useEffect(() => {
    // Handle automatic redirects based on registration result
    if (registrationResult.status === 'profile_created' || 
        registrationResult.status === 'profile_claimed') {
      router.push(`/profile/${registrationResult.profile_id}`)
    }
  }, [registrationResult, router])

  if (registrationResult.status === 'profile_exists') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Already Exists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={registrationResult.is_claimed ? 'destructive' : 'default'}>
              {registrationResult.is_claimed ? (
                <>
                  <TriangleAlertIcon className="h-4 w-4" />
                  <AlertTitle>Profile Claimed</AlertTitle>
                  <AlertDescription>
                    This profile is already claimed by another user.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Profile Available</AlertTitle>
                  <AlertDescription>
                    We found an unclaimed profile matching your email.
                  </AlertDescription>
                </>
              )}
            </Alert>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => router.push(`/profile/${registrationResult.profile_id}`)}
                variant="outline"
              >
                View Profile
              </Button>
              
              {!registrationResult.is_claimed && (
                <Button 
                  onClick={async () => {
                    // Call API to claim profile
                    try {
                      const response = await fetch('/api/claim-profile', {
                        method: 'POST',
                        body: JSON.stringify({
                          profile_id: registrationResult.profile_id
                        })
                      })
                      const result = await response.json()
                      if (result.success) {
                        router.push(`/profile/${registrationResult.profile_id}`)
                      }
                    } catch (error) {
                      console.error('Claim failed:', error)
                    }
                  }}
                >
                  Claim This Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default case (should redirect automatically)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading your profile...</p>
    </div>
  )
}