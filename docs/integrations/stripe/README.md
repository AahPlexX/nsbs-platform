# Stripe Payment Integration Guide

Comprehensive guide for Stripe 18.4.0 payment processing integration with Next.js 15.5.0 App Router and TypeScript 5.9.2.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Configuration Setup](#configuration-setup)
- [Payment Flow Patterns](#payment-flow-patterns)
- [Checkout Sessions](#checkout-sessions)
- [Webhook Handling](#webhook-handling)
- [Subscription Management](#subscription-management)
- [Error Handling](#error-handling)
- [Type Safety](#type-safety)
- [Security Best Practices](#security-best-practices)
- [Testing Patterns](#testing-patterns)

## Architecture Overview

The NSBS Platform integrates Stripe for secure payment processing with proper separation between client and server operations, webhook validation, and comprehensive error handling.

### Key Components

```typescript
/**
 * Stripe integration architecture for secure payment processing.
 * 
 * @remarks
 * - Server-side operations for sensitive data and API calls
 * - Client-side components for payment UI and user interaction
 * - Webhook endpoints for real-time payment status updates
 * - Type safety throughout the payment flow
 * - Comprehensive error handling and validation
 */

// lib/stripe/config.ts
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

if (!stripeWebhookSecret) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
}

export { stripeSecretKey, stripePublishableKey, stripeWebhookSecret }
```

## Configuration Setup

### Server-Side Stripe Client

```typescript
/**
 * Server-side Stripe client configuration.
 * 
 * @remarks
 * Configured for server-side operations with proper error handling
 * and TypeScript support for all Stripe operations.
 */

// lib/stripe/server.ts
import Stripe from 'stripe'
import { stripeSecretKey } from './config'

/**
 * Server-side Stripe client instance.
 * 
 * @remarks
 * Configured with API version for consistency and TypeScript support.
 * Used for all server-side Stripe operations including checkout sessions,
 * payment intents, and subscription management.
 */
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'NSBS Platform',
    version: '1.0.0',
    url: 'https://nsbs-platform.com'
  }
})

/**
 * Stripe webhook configuration for signature verification.
 */
export const webhookConfig = {
  secret: process.env.STRIPE_WEBHOOK_SECRET!,
  tolerance: 300 // 5 minutes
} as const
```

### Client-Side Stripe Setup

```typescript
/**
 * Client-side Stripe integration for payment forms.
 * 
 * @remarks
 * Provides React components and hooks for payment processing
 * with proper error handling and loading states.
 */

// lib/stripe/client.ts
'use client'

import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js'
import { stripePublishableKey } from './config'

let stripePromise: Promise<StripeType | null>

/**
 * Gets the Stripe.js instance for client-side operations.
 * 
 * @returns Promise resolving to Stripe instance
 * 
 * @example Stripe Elements integration
 * ```typescript
 * import { Elements } from '@stripe/react-stripe-js'
 * import { getStripe } from '@/lib/stripe/client'
 * 
 * export function CheckoutPage() {
 *   const stripePromise = getStripe()
 *   
 *   return (
 *     <Elements stripe={stripePromise}>
 *       <CheckoutForm />
 *     </Elements>
 *   )
 * }
 * ```
 */
export function getStripe(): Promise<StripeType | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

/**
 * Stripe Elements appearance configuration for consistent theming.
 */
export const stripeElementsOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0066cc',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  },
  clientSecret: '' // Will be set dynamically
} as const
```

## Payment Flow Patterns

### Course Purchase Flow

```typescript
/**
 * Complete course purchase flow with Stripe Checkout.
 * 
 * @remarks
 * Demonstrates secure payment processing from course selection
 * to enrollment completion with proper error handling.
 */

// lib/stripe/checkout.ts
import { stripe } from './server'
import { createServerClient } from '@/lib/supabase/server'
import type { Course, User } from '@/lib/types'

/**
 * Creates a Stripe Checkout session for course purchase.
 * 
 * @param course - Course to purchase
 * @param user - User making the purchase
 * @param successUrl - URL to redirect to after successful payment
 * @param cancelUrl - URL to redirect to if payment is cancelled
 * @returns Stripe Checkout session
 * 
 * @example Course checkout creation
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const { courseId } = await request.json()
 *   const user = await requireAuth()
 *   const course = await getCourse(courseId)
 *   
 *   if (!course) {
 *     return NextResponse.json({ error: 'Course not found' }, { status: 404 })
 *   }
 *   
 *   const session = await createCheckoutSession(
 *     course,
 *     user,
 *     `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/success`,
 *     `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`
 *   )
 *   
 *   return NextResponse.json({ sessionId: session.id })
 * }
 * ```
 */
export async function createCheckoutSession(
  course: Course,
  user: User,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    // Check if user is already enrolled
    const supabase = await createServerClient()
    const existingEnrollment = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()

    if (existingEnrollment.data) {
      throw new Error('User is already enrolled in this course')
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: course.currency.toLowerCase(),
            product_data: {
              name: course.title,
              description: course.short_description,
              images: course.thumbnail_url ? [course.thumbnail_url] : [],
              metadata: {
                course_id: course.id,
                course_slug: course.slug,
                category: course.category
              }
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        course_id: course.id,
        user_id: user.id,
        type: 'course_purchase'
      },
      payment_intent_data: {
        metadata: {
          course_id: course.id,
          user_id: user.id,
          type: 'course_purchase'
        }
      }
    })

    // Store pending order in database
    await supabase.from('orders').insert({
      user_id: user.id,
      course_id: course.id,
      amount: course.price,
      currency: course.currency,
      status: 'pending',
      stripe_session_id: session.id
    })

    return session
  } catch (error: unknown) {
    console.error('Checkout session creation error:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to create checkout session'
    )
  }
}

/**
 * Creates a Payment Intent for custom payment flows.
 * 
 * @param course - Course to purchase
 * @param user - User making the purchase
 * @returns Stripe Payment Intent
 * 
 * @example Custom payment form
 * ```typescript
 * export async function createPaymentIntent(
 *   course: Course,
 *   user: User
 * ): Promise<Stripe.PaymentIntent> {
 *   const paymentIntent = await stripe.paymentIntents.create({
 *     amount: course.price,
 *     currency: course.currency.toLowerCase(),
 *     customer: user.stripe_customer_id,
 *     metadata: {
 *       course_id: course.id,
 *       user_id: user.id,
 *       type: 'course_purchase'
 *     }
 *   })
 *   
 *   return paymentIntent
 * }
 * ```
 */
export async function createPaymentIntent(
  course: Course,
  user: User,
  options: {
    readonly automatic_payment_methods?: boolean
    readonly capture_method?: 'automatic' | 'manual'
  } = {}
): Promise<Stripe.PaymentIntent> {
  try {
    const {
      automatic_payment_methods = true,
      capture_method = 'automatic'
    } = options

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price,
      currency: course.currency.toLowerCase(),
      customer: user.stripe_customer_id,
      automatic_payment_methods: automatic_payment_methods ? { enabled: true } : undefined,
      capture_method,
      metadata: {
        course_id: course.id,
        user_id: user.id,
        type: 'course_purchase'
      }
    })

    // Store payment intent in database
    const supabase = await createServerClient()
    await supabase.from('orders').insert({
      user_id: user.id,
      course_id: course.id,
      amount: course.price,
      currency: course.currency,
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id
    })

    return paymentIntent
  } catch (error: unknown) {
    console.error('Payment intent creation error:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to create payment intent'
    )
  }
}
```

### Client-Side Payment Components

```typescript
/**
 * React components for Stripe payment processing.
 * 
 * @remarks
 * Provides reusable components for payment forms with proper
 * error handling, loading states, and type safety.
 */

// components/payment/checkout-form.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getStripe } from '@/lib/stripe/client'
import type { Course } from '@/lib/types'

interface CheckoutFormProps {
  readonly course: Course
  readonly clientSecret: string
}

/**
 * Stripe Payment Element form for course purchases.
 * 
 * @param props - Component properties
 * @param props.course - Course being purchased
 * @param props.clientSecret - Stripe Payment Intent client secret
 * @returns Payment form component
 * 
 * @example Usage
 * ```typescript
 * export default function CoursePurchasePage({ params }: { params: { slug: string } }) {
 *   const [clientSecret, setClientSecret] = useState<string>('')
 *   const course = await getCourse(params.slug)
 *   
 *   useEffect(() => {
 *     // Create payment intent and get client secret
 *     createPaymentIntent(course.id).then(setClientSecret)
 *   }, [course.id])
 *   
 *   if (!clientSecret) return <LoadingSpinner />
 *   
 *   return (
 *     <Elements stripe={getStripe()} options={{ clientSecret }}>
 *       <CheckoutForm course={course} clientSecret={clientSecret} />
 *     </Elements>
 *   )
 * }
 * ```
 */
function CheckoutFormInner({ course, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message ?? 'Payment submission failed')
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/courses/${course.slug}/success`
        }
      })

      if (confirmError) {
        setError(confirmError.message ?? 'Payment confirmation failed')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }, [stripe, elements, clientSecret, course.slug])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
        <div className="text-sm text-gray-600">
          <p>{course.title}</p>
          <p className="font-semibold">${course.price / 100} {course.currency}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? 'Processing...' : `Pay $${course.price / 100}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

/**
 * Checkout form wrapper with Stripe Elements provider.
 * 
 * @param props - Component properties
 * @returns Checkout form with Stripe Elements context
 */
export function CheckoutForm({ course, clientSecret }: CheckoutFormProps) {
  const stripePromise = getStripe()

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0066cc',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormInner course={course} clientSecret={clientSecret} />
    </Elements>
  )
}

/**
 * Hook for managing payment processing state.
 * 
 * @returns Payment processing utilities and state
 */
export function usePaymentProcessing() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const processPayment = useCallback(async (
    courseId: string,
    onSuccess?: (sessionId: string) => void
  ) => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      })

      const data = (await response.json()) as { sessionId?: string; error?: string }

      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'Failed to create checkout session')
      }

      if (data.sessionId) {
        if (onSuccess) {
          onSuccess(data.sessionId)
        } else {
          // Redirect to Stripe Checkout
          const stripe = await getStripe()
          if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId })
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment processing failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    processPayment,
    isProcessing,
    error,
    clearError: () => setError(null)
  }
}
```

## Webhook Handling

### Webhook Event Processing

```typescript
/**
 * Stripe webhook event processing for payment status updates.
 * 
 * @remarks
 * Handles all Stripe webhook events with proper signature verification,
 * error handling, and database updates for payment status changes.
 */

// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

/**
 * Handles Stripe webhook events.
 * 
 * @param request - Next.js request with Stripe webhook payload
 * @returns Response confirming webhook processing
 * 
 * @example Webhook configuration in Stripe Dashboard
 * ```
 * Endpoint URL: https://your-domain.com/api/stripe/webhook
 * Events:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * ```
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    await handleWebhookEvent(event)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Processes individual Stripe webhook events.
 * 
 * @param event - Stripe webhook event
 * 
 * @example Event processing flow
 * ```typescript
 * // 1. Payment Intent succeeded → Update order status
 * // 2. Checkout Session completed → Create enrollment
 * // 3. Payment failed → Update order status and notify user
 * // 4. Subscription events → Update subscription status
 * ```
 */
async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = await createServerClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutSessionCompleted(session, supabase)
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentIntentSucceeded(paymentIntent, supabase)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentIntentFailed(paymentIntent, supabase)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      await handleInvoicePaymentSucceeded(invoice, supabase)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await handleInvoicePaymentFailed(invoice, supabase)
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionEvent(subscription, event.type, supabase)
      break
    }

    default:
      console.log(`Unhandled webhook event type: ${event.type}`)
  }
}

/**
 * Handles successful checkout session completion.
 * 
 * @param session - Stripe Checkout Session
 * @param supabase - Supabase client
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { course_id, user_id } = session.metadata ?? {}

  if (!course_id || !user_id) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  try {
    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string
      })
      .eq('stripe_session_id', session.id)

    if (orderError) {
      console.error('Failed to update order:', orderError)
      return
    }

    // Create enrollment
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id,
        course_id,
        status: 'active',
        enrolled_at: new Date().toISOString(),
        progress_percentage: 0
      })

    if (enrollmentError) {
      console.error('Failed to create enrollment:', enrollmentError)
      return
    }

    console.log(`Enrollment created for user ${user_id} in course ${course_id}`)
  } catch (error: unknown) {
    console.error('Checkout session processing error:', error)
  }
}

/**
 * Handles successful payment intent.
 * 
 * @param paymentIntent - Stripe Payment Intent
 * @param supabase - Supabase client
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: SupabaseClient<Database>
): Promise<void> {
  const { course_id, user_id, type } = paymentIntent.metadata

  if (type !== 'course_purchase') {
    return
  }

  try {
    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update order for payment intent:', error)
    }

    console.log(`Payment succeeded for course ${course_id}, user ${user_id}`)
  } catch (error: unknown) {
    console.error('Payment intent processing error:', error)
  }
}

/**
 * Handles failed payment intent.
 * 
 * @param paymentIntent - Stripe Payment Intent
 * @param supabase - Supabase client
 */
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: SupabaseClient<Database>
): Promise<void> {
  try {
    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update order for failed payment:', error)
    }

    console.log(`Payment failed for payment intent: ${paymentIntent.id}`)
  } catch (error: unknown) {
    console.error('Failed payment processing error:', error)
  }
}

/**
 * Handles subscription-related events.
 * 
 * @param subscription - Stripe Subscription
 * @param eventType - Type of subscription event
 * @param supabase - Supabase client
 */
async function handleSubscriptionEvent(
  subscription: Stripe.Subscription,
  eventType: string,
  supabase: SupabaseClient<Database>
): Promise<void> {
  const customerId = subscription.customer as string
  
  // Get user by Stripe customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  try {
    switch (eventType) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Failed to update subscription:', error)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Failed to cancel subscription:', error)
        }
        break
      }
    }

    console.log(`Subscription ${eventType} processed for user ${user.id}`)
  } catch (error: unknown) {
    console.error('Subscription event processing error:', error)
  }
}
```

## Type Safety

### Stripe Types and Validation

```typescript
/**
 * Type-safe Stripe integration with comprehensive validation.
 * 
 * @remarks
 * Provides strongly typed interfaces for all Stripe operations
 * with runtime validation using Zod schemas.
 */

// lib/stripe/types.ts
import { z } from 'zod'
import type Stripe from 'stripe'

/**
 * Stripe webhook event types that we handle.
 */
export type StripeWebhookEvent = 
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'

/**
 * Payment status enumeration.
 */
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'

/**
 * Checkout session creation parameters.
 */
export interface CheckoutSessionParams {
  readonly courseId: string
  readonly userId: string
  readonly successUrl: string
  readonly cancelUrl: string
  readonly couponCode?: string
}

/**
 * Payment intent creation parameters.
 */
export interface PaymentIntentParams {
  readonly courseId: string
  readonly userId: string
  readonly amount: number
  readonly currency: string
  readonly automaticPaymentMethods?: boolean
  readonly captureMethod?: 'automatic' | 'manual'
}

/**
 * Subscription creation parameters.
 */
export interface SubscriptionParams {
  readonly userId: string
  readonly priceId: string
  readonly trialPeriodDays?: number
  readonly couponCode?: string
}

/**
 * Zod schema for checkout session creation.
 */
export const checkoutSessionSchema = z.strictObject({
  courseId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  couponCode: z.string().optional()
})

/**
 * Zod schema for payment intent creation.
 */
export const paymentIntentSchema = z.strictObject({
  courseId: z.string().uuid(),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  automaticPaymentMethods: z.boolean().optional(),
  captureMethod: z.enum(['automatic', 'manual']).optional()
})

/**
 * Zod schema for subscription creation.
 */
export const subscriptionSchema = z.strictObject({
  priceId: z.string(),
  trialPeriodDays: z.number().int().positive().optional(),
  couponCode: z.string().optional()
})

/**
 * Zod schema for webhook signature verification.
 */
export const webhookSchema = z.strictObject({
  signature: z.string(),
  payload: z.string(),
  timestamp: z.number().optional()
})

/**
 * Type-safe wrapper for Stripe operations.
 */
export class StripeService {
  constructor(private readonly stripe: Stripe) {}

  /**
   * Creates a checkout session with validation.
   * 
   * @param params - Checkout session parameters
   * @returns Stripe Checkout Session
   */
  async createCheckoutSession(
    params: CheckoutSessionParams
  ): Promise<Stripe.Checkout.Session> {
    const validatedParams = checkoutSessionSchema.parse(params)
    
    // Implementation would go here
    throw new Error('Not implemented')
  }

  /**
   * Creates a payment intent with validation.
   * 
   * @param params - Payment intent parameters
   * @returns Stripe Payment Intent
   */
  async createPaymentIntent(
    params: PaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    const validatedParams = paymentIntentSchema.parse(params)
    
    // Implementation would go here
    throw new Error('Not implemented')
  }

  /**
   * Retrieves a payment intent by ID.
   * 
   * @param paymentIntentId - Payment Intent ID
   * @returns Stripe Payment Intent
   */
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  /**
   * Cancels a payment intent.
   * 
   * @param paymentIntentId - Payment Intent ID
   * @returns Canceled Payment Intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.cancel(paymentIntentId)
  }

  /**
   * Creates a refund for a payment.
   * 
   * @param paymentIntentId - Payment Intent ID
   * @param amount - Amount to refund (optional, defaults to full amount)
   * @param reason - Reason for refund
   * @returns Stripe Refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason
  ): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason
    })
  }
}

/**
 * Singleton Stripe service instance.
 */
let stripeService: StripeService | undefined

export function getStripeService(): StripeService {
  if (!stripeService) {
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    stripeService = new StripeService(stripe)
  }
  return stripeService
}
```

## Error Handling

### Payment Error Patterns

```typescript
/**
 * Comprehensive error handling for Stripe payment operations.
 * 
 * @remarks
 * Provides structured error handling with user-friendly messages
 * and proper error categorization for different failure modes.
 */

// lib/stripe/errors.ts

/**
 * Custom error class for Stripe-related errors.
 */
export class StripeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error' | 'rate_limit_error' | 'validation_error',
    public readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'StripeError'
  }
}

/**
 * Handles and categorizes Stripe errors.
 * 
 * @param error - Unknown error from Stripe operations
 * @returns Structured error with user-friendly message
 */
export function handleStripeError(error: unknown): StripeError {
  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case 'card_error':
        return new StripeError(
          getCardErrorMessage(error.code),
          error.code ?? 'card_error',
          'card_error',
          400
        )

      case 'invalid_request_error':
        return new StripeError(
          'Invalid payment request. Please try again.',
          error.code ?? 'invalid_request',
          'invalid_request_error',
          400
        )

      case 'api_error':
        return new StripeError(
          'Payment processing is temporarily unavailable. Please try again later.',
          error.code ?? 'api_error',
          'api_error',
          500
        )

      case 'authentication_error':
        return new StripeError(
          'Payment authentication failed. Please contact support.',
          error.code ?? 'authentication_error',
          'authentication_error',
          401
        )

      case 'rate_limit_error':
        return new StripeError(
          'Too many payment requests. Please wait and try again.',
          error.code ?? 'rate_limit_error',
          'rate_limit_error',
          429
        )

      default:
        return new StripeError(
          'Payment processing failed. Please try again.',
          'unknown_stripe_error',
          'api_error',
          500
        )
    }
  }

  if (error instanceof Error) {
    return new StripeError(
      'Payment processing failed. Please try again.',
      'unknown_error',
      'api_error',
      500
    )
  }

  return new StripeError(
    'An unexpected error occurred. Please try again.',
    'unexpected_error',
    'api_error',
    500
  )
}

/**
 * Gets user-friendly message for card errors.
 * 
 * @param code - Stripe error code
 * @returns User-friendly error message
 */
function getCardErrorMessage(code: string | null | undefined): string {
  switch (code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.'
    
    case 'insufficient_funds':
      return 'Your card has insufficient funds. Please use a different payment method.'
    
    case 'expired_card':
      return 'Your card has expired. Please use a different payment method.'
    
    case 'incorrect_cvc':
      return 'Your card security code is incorrect. Please check and try again.'
    
    case 'incorrect_number':
      return 'Your card number is incorrect. Please check and try again.'
    
    case 'invalid_expiry_month':
    case 'invalid_expiry_year':
      return 'Your card expiry date is invalid. Please check and try again.'
    
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.'
    
    case 'generic_decline':
      return 'Your card was declined. Please contact your bank or try a different payment method.'
    
    default:
      return 'There was an issue with your payment method. Please try again.'
  }
}

/**
 * Error handling middleware for API routes.
 * 
 * @param handler - API route handler
 * @returns Wrapped handler with error handling
 */
export function withStripeErrorHandling<T extends readonly unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error: unknown) {
      const stripeError = handleStripeError(error)
      
      return NextResponse.json(
        {
          success: false,
          error: stripeError.message,
          code: stripeError.code,
          type: stripeError.type
        },
        { status: stripeError.statusCode }
      )
    }
  }
}
```

## Security Best Practices

### Payment Security Patterns

```typescript
/**
 * Security best practices for Stripe integration.
 * 
 * @remarks
 * Demonstrates secure payment processing patterns including
 * webhook signature verification, PCI compliance, and data protection.
 */

// lib/stripe/security.ts

/**
 * Validates Stripe webhook signature.
 * 
 * @param payload - Raw webhook payload
 * @param signature - Stripe signature header
 * @param secret - Webhook endpoint secret
 * @returns True if signature is valid
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitizes payment metadata to prevent injection attacks.
 * 
 * @param metadata - Raw metadata object
 * @returns Sanitized metadata
 */
export function sanitizePaymentMetadata(
  metadata: Record<string, unknown>
): Record<string, string> {
  const sanitized: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(metadata)) {
    // Only allow specific keys and string values
    if (typeof key === 'string' && typeof value === 'string') {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '')
      const sanitizedValue = value.substring(0, 500) // Limit length
      
      if (sanitizedKey && sanitizedValue) {
        sanitized[sanitizedKey] = sanitizedValue
      }
    }
  }
  
  return sanitized
}

/**
 * Rate limiting for payment endpoints.
 * 
 * @param identifier - Request identifier (IP, user ID, etc.)
 * @param limit - Maximum requests per window
 * @param window - Time window in seconds
 * @returns True if request is allowed
 */
export async function checkPaymentRateLimit(
  identifier: string,
  limit: number = 5,
  window: number = 300 // 5 minutes
): Promise<boolean> {
  // Implementation would use Redis or similar for distributed rate limiting
  // This is a simplified example
  const key = `payment_rate_limit:${identifier}`
  
  // In a real implementation, you would:
  // 1. Check current count from Redis
  // 2. Increment if below limit
  // 3. Set expiry if first request in window
  // 4. Return false if limit exceeded
  
  return true // Placeholder
}

/**
 * Validates payment amount to prevent manipulation.
 * 
 * @param courseId - Course ID
 * @param amount - Payment amount in cents
 * @returns True if amount matches course price
 */
export async function validatePaymentAmount(
  courseId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('price')
    .eq('id', courseId)
    .single()
  
  return course?.price === amount
}

/**
 * Security headers for payment pages.
 */
export const paymentSecurityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://api.stripe.com",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'payment=(self)'
} as const
```

---

This comprehensive Stripe integration guide demonstrates secure, type-safe payment processing patterns for the NSBS Platform with Next.js 15.5.0 App Router and TypeScript 5.9.2.