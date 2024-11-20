import { Search } from "lucide-react";

import { Button, ButtonProps } from "./button";

export const ButtonIconHelp = ({ variant = "ghost", size }: ButtonProps) => {
  return (
    <Button variant={variant} size={size}>
      <Search className="h-4 w-4" />
    </Button>
  );
};
