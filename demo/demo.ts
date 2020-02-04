import { Scenes } from "../src";
import "./styles.css";

const pagination = document.querySelectorAll("#pagination li");
const acceptance = document.querySelector<HTMLInputElement>("#acceptance");

new Scenes({
  preTransition: ({ nextIndex, currentIndex }, cb) => {
    if (nextIndex > 1) {
      if (!acceptance.checked) {
        nextIndex = currentIndex;
      }
    }
    return cb(nextIndex);
  },
  postTransition: ({ prevIndex, currentIndex }) => {
    pagination[prevIndex].classList.remove("active");
    pagination[currentIndex].classList.add("active");
  }
});
