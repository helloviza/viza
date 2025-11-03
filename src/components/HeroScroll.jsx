// HeroScroll.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VisaSearchNeo from "./VisaSearchNeo";
import "../styles/Home.css";

import doorTexture from "../assets/door-texture.jpg";
import greeneryBg from "../assets/hero-bg-greenery.jpg";
import planeSvg from "../assets/plane.png";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const doorLeftRef = useRef(null);
  const doorRightRef = useRef(null);
  const greeneryRef = useRef(null);
  const planeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-scroll-container",
        start: "top top",
        end: "bottom+=400 top",
        scrub: 1.5,
        pin: true,
      },
    });

    // 1. Doors slide open
    tl.to(doorLeftRef.current, { xPercent: -100, ease: "power2.out" }, 0);
    tl.to(doorRightRef.current, { xPercent: 100, ease: "power2.out" }, 0);

    // 2. Background fade in
    tl.to(greeneryRef.current, { opacity: 1, scale: 1.02, duration: 1 }, 0.2);

    // 3. Plane fly-by
    tl.fromTo(
      planeRef.current,
      { x: "-20%", opacity: 0, scale: 0.8 },
      { x: "120%", opacity: 1, scale: 1, duration: 1.8, ease: "power1.inOut" },
      0.6
    );

    // 4. Content fade in
    tl.fromTo(contentRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.9);
  }, []);

  return (
    <section className="hero-scroll-container">
      {/* Greenery Background */}
      <div
        ref={greeneryRef}
        className="hero-greenery-bg"
        style={{ backgroundImage: `url(${greeneryBg})` }}
      />

      {/* Doors */}
      <div
        ref={doorLeftRef}
        className="hero-door hero-door-left"
        style={{ backgroundImage: `url(${doorTexture})` }}
      />
      <div
        ref={doorRightRef}
        className="hero-door hero-door-right"
        style={{ backgroundImage: `url(${doorTexture})` }}
      />

      {/* Plane */}
      <img ref={planeRef} src={planeSvg} alt="plane" className="hero-plane" />

      {/* Text + Search */}
      <div ref={contentRef} className="hero-content">
        <h1>Seamless Visa Experiences, Powered by HelloViza</h1>
        <p>Apply. Track. Travel. Effortlessly.</p>
        <div className="hero-search-wrapper">
          <VisaSearchNeo />
        </div>
      </div>
    </section>
  );
}
