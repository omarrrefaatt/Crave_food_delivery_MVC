import React from "react";
import Navbar from "../../Common/Components/Navbar/navbar";
import map from "../../assets/map.png";
import ReusableCard from "../../Common/Components/Reusable-Card/reusableCard";
import Footer from "../../Common/Components/Footer/footer";
import Button from "../../Common/Components/Button/button";
import { useState } from "react";
import SuccessMessage from "../../Common/Components/Success-Message/successMessage";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-start relative w-full h-screen font-serif">
        <hr className="bg-gray-100 -translate-y-[14px] w-full mb-10" />
        <div className="flex felx-row justify-center items-start space-x-10 shadow-md p-4 mb-6">
          <div className="flex-col justify-start items-center flex space-y-5 p-4">
            <h1 className="text-2xl font-bold">
              We <span className="text-crimson">exist</span> in more than{" "}
              <span className="font-sans text-crimson">30 countries</span>
            </h1>
            <img src={map} alt="map" className="w-[1000px] h-[500px]" />
          </div>
          <ReusableCard backgroundColor="white">
            <div className="flex flex-col items-start font-serif p-4 space-y-4">
              <p className="font-bold text-2xl">
                Contact <span className="text-crimson">With</span> Us
              </p>
              <hr className="bg-crimson my-2 w-1/12 h-1" />
              <p className="text-black text-md">
                If you have any questions please fell free to contact with us.
              </p>
            </div>
            <hr className="bg-gray-500 my-2 w-full" />
            <form className="w-full">
              <div className="flex flex-row space-x-4 p-2 items-center">
                <input
                  type="text"
                  value={name}
                  className="text-gray-400 rounded-md border-2 p-2 w-full"
                  placeholder="Name"
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="text-gray-400 rounded-md border-2 p-2 w-full"
                  placeholder="Subject"
                  required={true}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="p-2 flex-col items-start justify-start w-full space-y-4">
                {" "}
                <input
                  type="text"
                  className="text-gray-400 rounded-md border-2 p-2 w-full"
                  placeholder="Email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  className="text-gray-400 rounded-md border-2 p-2 w-full h-40"
                  placeholder="Your Message"
                  required={true}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </form>
            <hr className="bg-gray-500 my-2 w-full" />
            <div className="w-full p-2">
              {" "}
              <SuccessMessage
                text="Your message has been sent successfully, A confirmation email will be sent to you"
                isVisible={showSuccessMessage}
              />
            </div>

            <div className="w-full p-4 justify-center flex flex-row">
              <Button
                text="Send"
                width="w-3/5"
                onClick={() => {
                  setShowSuccessMessage(true);
                }}
              ></Button>
            </div>
          </ReusableCard>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
