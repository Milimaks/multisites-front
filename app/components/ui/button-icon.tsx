import { ChevronRight } from "lucide-react";
import { Button } from "./button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";

type ButtonIconProps = {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  tooltip?: boolean;
  tooltipContent?: string | null;
};

export function ButtonIcon({
  Icon = ChevronRight,
  tooltip = false,
  tooltipContent = null,
  ...props
}: ButtonIconProps) {
  return tooltip ? (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="ghost" size="icon" {...props} asChild>
          <Icon className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  ) : (
    <Button variant="ghost" size="icon" {...props}>
      <Icon className="w-5 h-5" />
    </Button>
  );
}
