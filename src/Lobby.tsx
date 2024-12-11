import Button from "@mui/material/Button";
import "./Lobby.css";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import animatedImg from "../src/assets/animated.png";
import React, { useEffect, useRef } from "react";
import MyAssets from "../src/assets/myassetslogo.png";
import spending from "../src/assets/spending-money.png";
import tools from "../src/assets/financial-forecast.png";
import confident from "../src/assets/success.png";
import transactionPage from "../src/assets/transactions.png";
import dashboardPage from "../src/assets/dashboardPage.png";
import walletPage from "../src/assets/walletPage.png";
import analyticsPage from "../src/assets/analyticsPage.png";
import messagePage from "../src/assets/chatPage.png";
import financePic from "./assets/lady.jpg";
import github from "./assets/githubs.png";
import ig from "./assets/instagrams.png";
import { Link } from "react-router-dom";
interface CircleElement extends HTMLElement {
  x?: number;
  y?: number;
}

function Lobby() {
  const titleSectionRef = useRef<HTMLDivElement | null>(null);
  const featuresSectionRef = useRef<HTMLDivElement | null>(null);
  const aboutUsSectionRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll(
      ".circle"
    ) as NodeListOf<CircleElement>;

    const color = "#ffd700";

    circles.forEach((circle) => {
      circle.x = 0;
      circle.y = 0;
      circle.style.backgroundColor = color;
    });

    window.addEventListener("mousemove", function (e) {
      coords.x = e.clientX;
      coords.y = e.clientY;
    });

    function animateCircles() {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circle, index) => {
        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";

        circle.style.transform = `scale(${
          (circles.length - index) / circles.length
        })`;
        circle.style.opacity = `${1 - index / circles.length}`;

        circle.x = x;
        circle.y = y;

        const nextIndex = index + 1 < circles.length ? index + 1 : 0;
        const nextCircle = circles[nextIndex] as CircleElement;

        const nextCircleX = nextCircle.x ?? x;
        const nextCircleY = nextCircle.y ?? y;

        x += (nextCircleX - x) * 0.3;
        y += (nextCircleY - y) * 0.3;
      });

      requestAnimationFrame(animateCircles);
    }

    animateCircles();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll("li");
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("reveal");
            }, index * 100);
          });

          entry.target.classList.add("reveal");
        } else {
          const items = entry.target.querySelectorAll("li");
          items.forEach((item) => {
            item.classList.remove("reveal");
          });
          entry.target.classList.remove("reveal");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="landingPage">
      <div className="navBar">
        <img src={MyAssets} id="logo" alt="myAssets" />
        <ul>
          <li onClick={() => scrollToSection(titleSectionRef)}>Home</li>
          <li onClick={() => scrollToSection(featuresSectionRef)}>Features</li>
          <li onClick={() => scrollToSection(aboutUsSectionRef)}>About Us</li>
          <li onClick={() => scrollToSection(footerRef)}>Contact Us</li>
        </ul>
        <div className="buttons">
          <Link to="/login"> Login </Link>
        </div>
      </div>

      <div className="titleSection" ref={titleSectionRef}>
        <div className="text">
          <h1 id="company-name"> MyAssets</h1>
          <h1>
            {" "}
            Take Control of Your Financial Journey: Master Your Investments, and
            Build an Unstoppable Legacy of Wealth and Wisdom
          </h1>
          <div className="getStarted">
            <Link to="/register">
              <Button variant="contained">
                Get Started
                <ArrowCircleRightIcon fontSize="large" />
              </Button>
            </Link>
          </div>
        </div>
        <img src={animatedImg} alt="Animated" className="animatedImage" />
      </div>
      <div className="home-content">
        <div className="aboutUs reveal-on-scroll" ref={aboutUsSectionRef}>
          <div className="aboutUs-texts">
            <a
              id="aboutus-pic"
              href="https://www.freepik.com/free-photo/lady-is-using-mobile-telephone-with-her-business-report-document_3805540.htm#fromView=search&page=1&position=1&uuid=10dfb10b-14ae-4947-8b59-56f2e28bc493"
            >
              <img src={financePic} />
            </a>
            <h2>
              {" "}
              MyAssets provides an all-in-one solution for managing your money
              with ease. The platform offers powerful tools to help you track
              expenses, monitor income, and gain valuable insights through
              interactive charts and analytics. Whether you're budgeting for the
              future or analyzing spending habits, the user-friendly interface
              makes it simple to stay in control of your finances. Make informed
              financial decisions with our comprehensive financial management
              app.
            </h2>
          </div>
          <div className="aboutUsSections">
            <div className="aboutUs-data">
              <img src={spending} id="icon-img" />
              <h2>
                {" "}
                Simplifies spending tracking with real-time updates and easy
                categorization.
              </h2>
            </div>
            <div className="aboutUs-data">
              <img src={tools} id="icon-img" />
              <h2>
                {" "}
                Offers personalized insights and actionable recommendations.
              </h2>
            </div>
            <div className="aboutUs-data">
              <img src={confident} id="icon-img" />
              <h2>
                {" "}
                Boosts your confidence by making financial management intuitive
                and accessible.
              </h2>
            </div>
          </div>
        </div>
        <div className="features reveal-on-scroll" ref={featuresSectionRef}>
          <h1>Key Features</h1>
          <section className="featuresSection">
            <div className="feature">
              <div className="feature-caption">
                <h2> Dashboard</h2>{" "}
              </div>
              <img
                src={dashboardPage}
                className="feature-img"
                alt="moneyManagement"
              />
            </div>
            <div className="feature">
              <div className="feature-caption">
                <h2>Transactions</h2>{" "}
              </div>
              <img
                src={transactionPage}
                className="feature-img"
                alt="moneyManagement"
              />
            </div>
            <div className="feature">
              <div className="feature-caption">
                <h2>Wallet</h2>{" "}
              </div>
              <img
                src={walletPage}
                className="feature-img"
                alt="moneyManagement"
              />
            </div>
            <div className="feature">
              <div className="feature-caption">
                <h2> Analytics </h2>{" "}
              </div>
              <img
                src={analyticsPage}
                className="feature-img"
                alt="moneyManagement"
              />
            </div>
            <div className="feature">
              <div className="feature-caption">
                <h2>Messages </h2>{" "}
              </div>
              <img
                src={messagePage}
                className="feature-img"
                alt="moneyManagement"
              />
            </div>
          </section>
        </div>
      </div>
      <div className="footer" ref={footerRef}>
        <div className="footer-left">
          <div className="footer-left-title">
            <h2> MyAssets</h2>
          </div>
          <div className="footer-left-profile">
            <div className="email">
              <p> Email</p>
              <p> icencodes@gmail.com</p>
            </div>
            <div className="phone">
              <p> Phone Number</p>
              <p> (+62) 812-9203-9645 </p>
            </div>
          </div>
          <div className="footer-left-socials">
            <h2> Follow Me</h2>
            <div className="socialMedia">
              <a href="https://github.com/VincentiusJacob">
                {" "}
                <img src={github} />
              </a>
              <a href="https://www.instagram.com/vincentiusjg?igsh=MXBwbzlkOHc1d3Zzdw==">
                {" "}
                <img src={ig} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-right">
          <h1>
            {" "}
            Stay Updated! Enter your email to receive the latest news and
            updates from us.
          </h1>
          <div className="footer-right-input">
            <input type="email" placeholder="Email Address..." name="email" />
            <button> Send </button>
          </div>
        </div>
      </div>

      {[...Array(20)].map((_, index) => (
        <div key={index} className="circle"></div>
      ))}
    </div>
  );
}

export default Lobby;
