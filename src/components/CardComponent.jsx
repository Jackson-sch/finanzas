import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardComponent({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">{children}</CardContent>
    </Card>
  );
}
