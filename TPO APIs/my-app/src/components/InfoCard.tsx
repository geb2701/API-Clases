import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
