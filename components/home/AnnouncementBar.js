"use client";

import { useEffect, useState } from "react";
import { usePlatformStatus } from "@/components/platform/PlatformStatusProvider";
import { getAnnouncements } from "@/lib/platformApi";
import { BRAND_NAME } from "@/lib/brand";
import AnnouncementsModal from "./AnnouncementsModal";

const DEFAULT_MARQUEE = {
  text: `Welcome to ${BRAND_NAME} • Play Wingo • Deposit & Win`,
  link: "/wallet",
  linkLabel: "Detail",
};

export default function AnnouncementBar() {
  const { maintenanceMode, message } = usePlatformStatus();
  const [marquee, setMarquee] = useState(DEFAULT_MARQUEE);
  const [marqueeEnabled, setMarqueeEnabled] = useState(true);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements()
      .then((res) => {
        if (cancelled) return;
        const nextMarquee = res?.data?.marquee;
        const nextItems = Array.isArray(res?.data?.items) ? res.data.items : [];

        if (nextMarquee === null) {
          setMarqueeEnabled(false);
        } else if (nextMarquee?.text) {
          setMarqueeEnabled(true);
          setMarquee({
            text: nextMarquee.text,
            link: nextMarquee.link || "/wallet",
            linkLabel: nextMarquee.linkLabel || "Detail",
          });
        }

        setItems(nextItems);
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!maintenanceMode && !marqueeEnabled && items.length === 0) {
    return null;
  }

  const displayText = maintenanceMode
    ? message || "Platform is under maintenance. Betting, deposits, and withdrawals may be unavailable."
    : marquee.text;

  const detailLabel = maintenanceMode ? "View" : marquee.linkLabel || "Detail";

  return (
    <>
      <div
        className={`club-announce ${maintenanceMode ? "maintenance" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setModalOpen(true);
          }
        }}
      >
        <div className="club-announce-icon">{maintenanceMode ? "⚠️" : "📢"}</div>
        <div className="club-marquee">
          <span>{displayText}</span>
        </div>
        <button
          type="button"
          className="club-announce-detail"
          onClick={(event) => {
            event.stopPropagation();
            setModalOpen(true);
          }}
        >
          {detailLabel}
        </button>
      </div>

      <AnnouncementsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={items}
        marquee={marqueeEnabled ? marquee : null}
        maintenanceMode={maintenanceMode}
        maintenanceMessage={message}
      />
    </>
  );
}
