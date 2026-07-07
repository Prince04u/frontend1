"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DESIGN_ASSETS, getCarouselBanner } from "@/lib/designAssets";
import { getPromoBanners } from "@/lib/platformApi";

const DEFAULT_SLIDES = DESIGN_ASSETS.carouselBanners.map(
  ({ id, badge, amount, title, emoji, link }) => ({
    id,
    badge,
    amount,
    title,
    emoji,
    link,
  })
);

const resolveSlideImage = (slide, index) => {
  if (slide?.id) {
    const asset = getCarouselBanner(slide.id);
    if (asset?.image) return asset.image;
  }
  return DESIGN_ASSETS.carouselBanners[index]?.image || null;
};

export default function PromoBanner() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPromoBanners()
      .then((res) => {
        if (cancelled) return;
        const carousel = res?.data?.carousel;
        if (Array.isArray(carousel) && carousel.length) {
          setSlides(carousel);
          setActive(0);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  const slide = slides[active] || slides[0];
  if (!slide) return null;

  const imageSrc = resolveSlideImage(slide, active);

  const bannerInner = imageSrc ? (
    <>
      <Image
        src={imageSrc}
        alt={slide.title || "Promotion"}
        fill
        sizes="(max-width: 480px) 100vw, 480px"
        className="club-banner-img"
        priority={active === 0}
      />
      <span className="club-banner-sr">{slide.title}</span>
    </>
  ) : (
    <>
      <div className="club-banner-content">
        <span className="club-banner-badge">{slide.badge}</span>
        <div className="club-banner-amount">{slide.amount}</div>
        <div className="club-banner-title">{slide.title}</div>
      </div>
      <div className="club-banner-coins">{slide.emoji}</div>
    </>
  );

  return (
    <div className="club-banner-wrap">
      {slide.link ? (
        <Link
          href={slide.link}
          className={`club-banner club-banner-link ${imageSrc ? "club-banner-has-image" : ""}`}
        >
          {bannerInner}
          {slides.length > 1 && (
            <div className="club-banner-dots">
              {slides.map((_, i) => (
                <span key={i} className={i === active ? "active" : ""} />
              ))}
            </div>
          )}
        </Link>
      ) : (
        <div className={`club-banner ${imageSrc ? "club-banner-has-image" : ""}`}>
          {bannerInner}
          {slides.length > 1 && (
            <div className="club-banner-dots">
              {slides.map((_, i) => (
                <span key={i} className={i === active ? "active" : ""} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
