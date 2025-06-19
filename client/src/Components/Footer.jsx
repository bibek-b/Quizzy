import instagramIcon from "../assets/instagramIcon.svg";
import facebookIcon from "../assets/facebookIcon.svg";
import linkedInIcon from "../assets/linkedInIcon.svg";
import twitterIcon from "../assets/twitterIcon.svg";
import youtubeIcon from "../assets/youtubeIcon.svg";

const Footer = () => {
  return (
    <footer className="bg-[#dde3e9] text-2xl flex items-center justify-center h-16">
      <div className="flex gap-2 text-[#333333]" ><span>Quizzy</span>Bibek &copy;<p>{new Date().getFullYear()}</p></div>
    </footer>
  );
};

export default Footer;
