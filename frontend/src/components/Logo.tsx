type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?: LogoSize;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-8 rounded-lg",
    text: "text-base font-bold",
  },
  md: {
    container: "w-12 h-12 rounded-xl",
    text: "text-2xl font-bold",
  },
  lg: {
    container: "w-16 h-16 rounded-xl",
    text: "text-3xl font-extrabold",
  },
  xl: {
    container: "w-20 h-20 rounded-2xl",
    text: "text-5xl font-black",
  },
};

export const Logo = ({ size = "sm" }: LogoProps) => {
  const config = sizeConfig[size];

  return (
    <div className={`${config.container} bg-gradient-to-br from-primary to-accent flex items-center justify-center`}>
      <span className={`text-white ${config.text}`}>SR</span>
    </div>
  );
};
