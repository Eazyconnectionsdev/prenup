"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Hero stagger animations
    const heroEls = document.querySelectorAll(".hero-gradient .rv");
    if (heroEls.length) {
      gsap.to(heroEls, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
    }

    // Bidirectional scroll reveal for all non-hero .rv elements
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".rv")
    ).filter((el) => !el.closest(".hero-gradient"));

    revealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    // Hero image parallax
    const heroImg = document.getElementById("hero-img");
    if (heroImg) {
      gsap.to(heroImg, {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-gradient",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }

    // Divider image parallax
    const dividerImg = document.getElementById("divider-img");
    if (dividerImg) {
      gsap.to(dividerImg, {
        y: "-15%",
        ease: "none",
        scrollTrigger: {
          trigger: dividerImg,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }

    const refreshScroll = () => {
      ScrollTrigger.refresh();
      lenis.resize();
    };

    window.addEventListener("resize", refreshScroll);
    window.addEventListener("load", refreshScroll);

    const timer = setTimeout(refreshScroll, 400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", refreshScroll);
      window.removeEventListener("load", refreshScroll);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScrollProvider;
