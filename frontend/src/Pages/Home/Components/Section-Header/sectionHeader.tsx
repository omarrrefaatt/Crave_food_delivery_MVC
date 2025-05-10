import breakIcon from "../../../../assets/deliveryIcon.svg";

interface SectionWithHeaderProps {
  headerText: string;
  subText: string;
}

const SectionHeader: React.FC<SectionWithHeaderProps> = ({
  headerText,
  subText,
}) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-8 my-10">
      {/* Header Text */}
      <h1 className="text-3xl font-serif font-bold">{headerText}</h1>
      {/* Break Icon */}
      <img src={breakIcon} alt="" className="w-80 h-50" />
      {/* Sub-Text */}
      <p className="w-[1000px] text-lg text-gray-400 font-serif">{subText}</p>
    </div>
  );
};

export default SectionHeader;
