import { BellRing, Check } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import PremiumLogoCard from "./logo-card-premium";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

type CardProps = React.ComponentProps<typeof Card> & {
  target: string;
  isPremium?: boolean;
  title?: string;
  description?: string;
  button?: string;
};

export default function CardCanva({
  className,
  isPremium,
  target,
  title,
  description,
  button,
  ...props
}: CardProps) {
  return (
    <Card
      className={cn(
        "w-[380px]",
        className,
        isPremium ? "bg-can-premium" : "bg-can-not-premium ",
        "flex-1  md:w-1/3 lg:w-1/4 "
      )}
      {...props}
    >
      <CardHeader className=" justify-between items-center">
        <p className="bg-white rounded-full pl-2 pr-2 card-text-can">
          {target ? target : "Pour tous"}
        </p>
        <PremiumLogoCard color="#fdbc68" isPremium={isPremium} />
      </CardHeader>
      <CardContent className="grid gap-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="canva" className="w-full">
          {button}
        </Button>
      </CardFooter>
    </Card>
  );
}
