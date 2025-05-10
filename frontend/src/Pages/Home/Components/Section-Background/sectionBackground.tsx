interface SectionBackgroundProps {
  backgroundImage: string;
  children: React.ReactNode;
  bgColor?: string;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({
  backgroundImage,
  children,
  bgColor = "crimson",
}) => {
  return (
    <div
      className="h-80 relative w-full mb-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`absolute inset-0 bg-${bgColor} opacity-75 flex flex-row justify-center items-center space-x-10`}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionBackground;
