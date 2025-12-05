import { cn } from "@/lib/utils";

interface StepCardProps {
  svg? : any;
  title: string;
  description: string;
  stepNumber: number;
  variant: "green" | "orange" | "red";
  disabled? : boolean;
}

const StepCard = ({ svg: Svg, title, description, stepNumber, variant }: StepCardProps) => {
  return (
    <div className="flex items-center justify-between p-5 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          variant === "green" && "bg-step-green/10 text-step-green",
          variant === "orange" && "bg-step-orange/10 text-step-orange",
          variant === "red" && "bg-step-red/10 text-step-red"
        )}>
          {Svg}
        </div>
        <div className="space-y-0.5">
          <h3 className="font-normal text-text-color">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={cn(
        "px-8 py-1.5 rounded-full cursor-pointer font-medium text-white text-base tracking-wide",
        variant === "green" && "bg-gradient-to-r from-[#FF3B2F] to-[#FFD21A]",
        variant === "orange" && "bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF]",
        variant === "red" && "bg-gradient-to-r from-[#0FA34A] to-[#C7E30A] "
      )}>
        STEP {stepNumber}
      </div>
    </div>
  );
};

export default StepCard;
