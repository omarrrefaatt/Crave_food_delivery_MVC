interface SectionContentProps {
  headerText: string;
  subText1: string;
  subText2: string;
  subText3: string;
  imageSrc: string;
}

const SectionContent: React.FC<SectionContentProps> = ({
  headerText,
  subText1,
  subText2,
  subText3,
  imageSrc,
}) => {
  return (
    <div
      className="flex flex-row items-start justify-between space-x-8 mb-10"
      id="whoWeAre"
    >
      {/* Who Are We Text Container */}
      <div className="flex flex-col justify-start items-start space-y-8 w-[600px]">
        {/* Who Are We Header Text */}
        <p className="text-2xl font-bold font-serif">
          <span className="underline underline-offset-[24px] decoration-crimson">
            {headerText.split(" ")[0]}
          </span>{" "}
          {headerText.split(" ").slice(1).join(" ")}
        </p>
        {/* Who Are We Sub-Text */}
        <p className="text-gray-400 text-md">{subText1}</p>
        <p className="text-gray-400 text-md">{subText2}</p>
        <p className="text-gray-400 text-md">{subText3}</p>
      </div>
      {/* Who Are We Image Container */}
      <div className="h-[365px] w-[600px]">
        {/* Who Are We Image */}
        <img src={imageSrc} alt="" className="w-full h-full"></img>
      </div>
    </div>
  );
};

export default SectionContent;
