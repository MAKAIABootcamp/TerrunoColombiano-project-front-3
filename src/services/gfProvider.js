import { facebook, google } from "../firebase/firebaseConfig";

export const loginProvider = [
    {
      name: "google",
      image: "https://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png",
      provider: google,
    },
    {
      name: "facebook",
      image: "https://logodownload.org/wp-content/uploads/2014/09/facebook-logo-3-1.png",
      provider: facebook,
    },
  ];
  