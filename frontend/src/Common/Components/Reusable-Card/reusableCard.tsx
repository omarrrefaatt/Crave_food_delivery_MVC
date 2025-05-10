interface ReusableCardProps {
  backgroundColor?: string;
  children: React.ReactNode;
}

const ReusableCard: React.FC<ReusableCardProps> = ({
  backgroundColor = "customBlue",
  children,
}) => {
  return (
    // Cards Container
    <div
      className={`flex flex-col justify-center items-start rounded-xl hover:-translate-y-4 hover:shadow-xl ease-in-out duration-500 transition-all bg-${backgroundColor} hover:shadow-${backgroundColor}`}
    >
      {children}
    </div>
  );
};

export default ReusableCard;
