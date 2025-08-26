import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function PurchasesPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/sign-in")
  }

  // Fetch user's purchases
  const { data: purchases } = await supabase
    .from("purchases")
    .select(
      `
      *,
      courses (
        slug,
        title,
        description,
        price
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/account">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Purchase History</h1>
        <p className="text-muted-foreground">
          View your course purchase history and access your courses
        </p>
      </div>

      <div className="space-y-4">
        {purchases?.map((purchase) => (
          <Card key={purchase.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{purchase.courses?.title}</CardTitle>
                    <CardDescription>
                      Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    ${(purchase.amount / 100).toFixed(2)}
                  </p>
                  <Badge variant={purchase.status === "completed" ? "success" : "secondary"}>
                    {purchase.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <strong>Order ID:</strong> {purchase.stripe_payment_intent_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Payment Method:</strong> Card ending in ****
                  </p>
                </div>

                {purchase.status === "completed" && (
                  <Button asChild>
                    <Link href={`/learn/${purchase.courses?.slug}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Access Course
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {(!purchases || purchases.length === 0) && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Purchases Yet</h2>
            <p className="text-muted-foreground mb-6">
              Browse our course catalog and start your professional development journey.
            </p>
            <Button asChild size="lg">
              <Link href="/coursecatalog">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
