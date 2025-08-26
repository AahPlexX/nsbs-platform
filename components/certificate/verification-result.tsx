import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, User, BookOpen, Hash } from "lucide-react"
import type { Certificate } from "@/lib/types"

interface Props {
  certificate: Certificate & {
    users: { name: string; email: string }
  }
}

export function VerificationResult({ certificate }: Props) {
  const issueDate = new Date(certificate.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="flex items-center justify-center space-x-2 p-4 bg-mint-sage/10 rounded-lg">
        <CheckCircle className="w-6 h-6 text-evergreen" />
        <span className="text-lg font-semibold text-evergreen">
          Certificate Verified Successfully
        </span>
      </div>

      {/* Certificate Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-mint-sage/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-evergreen flex items-center">
              <User className="w-5 h-5 mr-2" />
              Recipient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-mocha-mousse">{certificate.users.name}</p>
          </CardContent>
        </Card>

        <Card className="border-mint-sage/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-evergreen flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-mocha-mousse">{(certificate as any).courses?.title || 'Course Title'}</p>
          </CardContent>
        </Card>

        <Card className="border-mint-sage/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-evergreen flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Issue Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-mocha-mousse">{issueDate}</p>
          </CardContent>
        </Card>

        <Card className="border-mint-sage/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-evergreen flex items-center">
              <Hash className="w-5 h-5 mr-2" />
              Certificate Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm text-mocha-mousse">{certificate.certificate_number}</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Badge */}
      <div className="text-center">
        <Badge variant="success" className="bg-mint-sage text-evergreen">
          Valid Certificate - Never Expires
        </Badge>
      </div>

      {/* Additional Info */}
      <Card className="border-mint-sage/20 bg-mint-sage/5">
        <CardHeader>
          <CardTitle className="text-lg text-evergreen">About This Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            This certificate was issued by the National Society of Business Sciences (NSBS) upon
            successful completion of the required coursework and examination.
          </p>
          <p className="text-sm text-gray-600">
            NSBS certificates never expire and represent verified professional achievement in
            business sciences education.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
