import { ShieldQuestion } from "lucide-react";

import { Button, ButtonProps } from "./button";

export const ButtonIconSearch = ({ variant = "ghost", size }: ButtonProps) => {
  return (
    <Button variant={variant} size={size}>
      <ShieldQuestion className="h-4 w-4" />
    </Button>
  );
};
