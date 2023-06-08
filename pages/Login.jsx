"use client";
import React, { useContext, useState } from "react";
import { db, app } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/Login.module.css";
import { toast } from "react-nextjs-toast";
import { collection, getDocs } from "firebase/firestore";
import devsLogoDark from "../public/assets/images/logo.png";
import Switch from "react-switch";
import { SunIcon } from "../components/SunIcon";
import { MoonIcon } from "../components/MoonIcon";
import { ThemeContext } from "../src/context/ThemeContext";

const Login = ({ setLoggedIn, setUser, loggedIn }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const loginMsg = () => {
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        const facultyRef = collection(db, "Faculty");
        const querySnapshot = await getDocs(facultyRef);
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (doc.id === auth.currentUser.uid) {
            setUser({
              name: data.name,
              email: data.email,
              type: data.type,
            });
            setLoggedIn(true);
            toast.notify("Successfully logged in!!", { type: "success" });
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.notify(errorCode + " " + errorMessage, { type: "error" });
      })
      .finally(() => {
        if (loggedIn) {
          toast.notify("User not found!", { type: "error" });
        }
      });
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  return (
    <div className="page-width">
      <div className="loginHeader">
        <img
          className="loginLogo"
          src={
            theme === "dark"
              ? "/assets/images/devs-dark.png"
              : "/assets/images/devs-light.png"
          }
        />
        <Switch
          checked={theme === "dark" ? true : false}
          onChange={toggleTheme}
          uncheckedHandleIcon={
            <SunIcon
              width={16}
              height={16}
              style={{ marginTop: "-6px", marginLeft: "2px" }}
            />
          }
          checkedHandleIcon={
            <MoonIcon
              width={16}
              height={16}
              style={{ marginTop: "-6px", marginLeft: "2px" }}
            />
          }
          onColor={"#2a66ff"}
          offColor={"#C9C9C9"}
          uncheckedIcon={false}
          checkedIcon={false}
          height={24}
          width={48}
          handleDiameter={20}
        />
      </div>
      <div className="loginWrapper">
        <div>
          <form
            className="loginForm"
            onSubmit={(e) => {
              e.preventDefault();
              loginMsg();
            }}
          >
            <h2 className="loginTitle">Welcome Back!</h2>
            <h5 className="loginSubtitle">
              Login into your account to access your dashboard
            </h5>
            <input
              type="email"
              placeholder="Email"
              style={{ textIndent: "10px" }}
              className="loginInputs"
              onChange={(e) => {
                if (e.target.value) {
                  setEmail(e.target.value.trim());
                }
              }}
            />
            <input
              type="password"
              style={{ textIndent: "10px" }}
              placeholder="Password"
              className="loginInputs"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <Switch
                checked={rememberMe}
                onChange={handleRememberMe}
                onColor={"#2a66ff"}
                offColor={"#C9C9C9"}
                uncheckedIcon={false}
                checkedIcon={false}
                height={24}
                width={48}
                handleDiameter={19}
              />
              <label>Remember Me</label>
            </div>
            <button type="submit" className="loginButton">
              Log In
            </button>
            <div>
              Need help with login?{" "}
              <a style={{ color: "var(--devs-blue)" }} href="#">
                {" "}
                Contact Us!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
