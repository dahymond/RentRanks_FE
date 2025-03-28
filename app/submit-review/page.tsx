"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { StarRating } from "@/components/star-rating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressAutocomplete } from "@/components/address-autocomplete"

// Validation schema for the review form
const reviewFormSchema = z.object({
  targetName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  targetType: z.enum(["landlord", "tenant"]),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  phoneNumber: z.string().optional(),
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  comment: z.string().optional(),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

export default function SubmitReviewPage() {
  const { status, data:session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // console.log(status, session)
  
  // Initialize form with default values
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      targetName: "",
      targetType: "tenant",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      rating: 0,
      comment: "",
    },
  })

  useEffect(() => {
    if (status === "unauthenticated" && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [status, router, isRedirecting])

  if (status === "loading" || (status === "unauthenticated" && isRedirecting)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  // Form submission handler
  async function onSubmit(data: ReviewFormValues) {
    setIsSubmitting(true)

    try {
      // Here you would normally send data to your API
      console.log("Form data submitted:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Handle successful submission
      setSubmissionResult({
        success: true,
        message: "Your review has been submitted successfully!",
      })

      // Reset form after successful submission
      form.reset()
    } catch (error) {
      console.error("Error submitting review:", error)
      setSubmissionResult({
        success: false,
        message: "There was an error submitting your review. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
            <p className="text-muted-foreground">Share your experience to help others make informed decisions</p>
          </div>

          {submissionResult ? (
            <Card>
              <CardHeader>
                <CardTitle
                  className={
                    submissionResult.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }
                >
                  {submissionResult.success ? "Review Submitted" : "Submission Error"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{submissionResult.message}</p>
                <Button className="mt-4" onClick={() => setSubmissionResult(null)}>
                  Write Another Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Target Name */}
                    <FormField
                      control={form.control}
                      name="targetName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Who are you reviewing?</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name (e.g., John Smith)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Target Type Selection */}
                    <FormField
                      control={form.control}
                      name="targetType"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Review Type</FormLabel>
                            <FormDescription>Are you reviewing them as your landlord or tenant?</FormDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormLabel
                              htmlFor="target-type-switch"
                              className={
                                field.value === "tenant" ? "text-primary font-medium" : "text-muted-foreground"
                              }
                            >
                              Tenant
                            </FormLabel>
                            <FormControl>
                              <Switch
                                id="target-type-switch"
                                checked={field.value === "landlord"}
                                onCheckedChange={(checked) => field.onChange(checked ? "landlord" : "tenant")}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="target-type-switch"
                              className={
                                field.value === "landlord" ? "text-primary font-medium" : "text-muted-foreground"
                              }
                            >
                              Landlord
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Address Fields */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Property Address</h3>

                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <AddressAutocomplete
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value.addressLine1)
                                  form.setValue("city", value.city)
                                  form.setValue("state", value.state)
                                  form.setValue("zipCode", value.zipCode)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2 (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Apt, Suite, Unit, etc." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Rating */}
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Rating</FormLabel>
                          <FormControl>
                            <div className="py-2">
                              <StarRating rating={field.value} setRating={field.onChange} count={5} size={32} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Comment */}
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Review (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your experience with this person..."
                              className="min-h-32 resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Be honest, detailed, and constructive</FormDescription>
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Post Review"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

