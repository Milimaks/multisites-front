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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" {...props}>
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button variant="ghost" size="icon" {...props}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}
