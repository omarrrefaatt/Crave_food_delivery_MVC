import Navbar from "../../Common/Components/Navbar/navbar";
import Carousel from "./Components/Carousel/carousel";
import InfoCard from "./Components/Info-Card/infoCard";
import aboutUsImage from "../../assets/food_background.jpg";
import StatisticCard from "../../Common/Components/Statistics-Card/statisticsCard";
import SectionHeader from "./Components/Section-Header/sectionHeader";
import SectionBackground from "./Components/Section-Background/sectionBackground";
import SectionContent from "./Components/Section-Content/sectionContent";
import { infoCardsData, statisticsData, sectionContentData } from "./constants";
import Footer from "../../Common/Components/Footer/footer";

const HomePage: React.FC = () => {
  return (
    // HomePage Container
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center relative max-w-full">
        {/* Navbar Container*/}

        {/* Carousel Container*/}
        <div className="w-full translate-y-[6.6px]">
          <Carousel />
        </div>
        {/* Cards Container */}
        <div className="-translate-y-32 flex flex-row justify-start items-center space-x-10">
          {infoCardsData.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              paragraph={card.paragraph}
              icon={card.icon}
              buttonText={card.buttonText}
              buttonRedirectPath={card.buttonRedirectPath}
            />
          ))}
        </div>
        {/* About Us Section */}
        {/* Section Header Container*/}
        <div className="-translate-y-14  " id="aboutUs">
          {" "}
          {/* Section Header */}
          <SectionHeader
            headerText="We’re Always Ready to Serve You the Best Meals"
            subText="Our dedicated team is committed to bringing you delicious, high-quality food made with fresh ingredients—delivered fast and with care. Trust us to be your go-to partner for satisfying your cravings, anytime."
          />
        </div>

        {/* Section Content */}
        <SectionContent
          headerText={sectionContentData[0].headerText}
          subText1={sectionContentData[0].subText1}
          subText2={sectionContentData[0].subText2}
          subText3={sectionContentData[0].subText3}
          imageSrc={sectionContentData[0].imageSrc}
        ></SectionContent>
        {/* Section Background */}
        <SectionBackground backgroundImage={aboutUsImage} bgColor="crimson">
          {statisticsData.map((stat, index) => (
            <StatisticCard
              key={index}
              number={stat.number}
              text={stat.text}
              iconPath={stat.iconPath}
            />
          ))}
        </SectionBackground>
        {/* customer rviews  Section */}
        <div id="custome-reviews" className=" ">
          {" "}
          <SectionHeader
            headerText="Delivering Delicious Meals Right to Your Doorstep"
            subText="Hear from our satisfied customers about their experiences with our fast, fresh, and flavorful food deliveries. We're committed to making every meal a delightful experience, from order to delivery."
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
