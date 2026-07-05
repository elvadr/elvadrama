import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiTelegram } from "react-icons/si";
import {
  Play,
  Film,
  MonitorPlay,
  Zap,
  Shield,
  Clock,
  Quote,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import logoSrc from "@assets/مشروع_جديد_1783234120675.jpg";
import posterKhurooj from "@assets/photo_2026-07-05_09-49-15_1783235928357.jpg";
import poster2 from "@assets/photo_2026-06-30_17-26-13_1783237868632.jpg";
import poster3 from "@assets/photo_2026-07-05_09-49-20_1783237705719.jpg";
import poster4 from "@assets/photo_2026-07-05_09-49-24_1783237931662.jpg";
import poster5 from "@assets/photo_2026-07-05_09-49-29_1783237994055.jpg";
import poster6 from "@assets/photo_2026-07-05_09-49-34_1783238186592.jpg";
import poster7 from "@assets/photo_2026-07-05_09-49-39_1783238240871.jpg";
import logoMawlana from "@assets/photo_2026-07-05_10-58-08_1783238315257.jpg";
import logoMushardun from "@assets/photo_2026-07-05_10-58-14_1783238315258.jpg";
import logoYatim from "@assets/photo_2026-07-05_10-58-18_1783238315261.jpg";
import logoBintAlNuman from "@assets/photo_2026-07-05_10-58-22_1783238315263.jpg";

// ── YouTube IFrame API types & singleton loader ───────────────────────────────
declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (e: { data: number }) => void;
          };
        }
      ) => { destroy(): void };
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
const _ytQueue: Array<() => void> = [];
function loadYT(cb: () => void) {
  // Always check window.YT directly — avoids stale module-level flag after HMR
  if (window.YT?.Player) { cb(); return; }
  _ytQueue.push(cb);
  if (document.getElementById("yt-api-script")) return;
  window.onYouTubeIframeAPIReady = () => {
    _ytQueue.splice(0).forEach((fn) => fn());
  };
  const s = document.createElement("script");
  s.id = "yt-api-script";
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
}

const channelUrl = "https://t.me/elvadramatv";
const HERO_INTERVAL = 5000;
const AUTO_ADVANCE_INTERVAL = 7000;

const heroSlides = [
  { id: 1, src: posterKhurooj },
  { id: 2, src: poster2 },
  { id: 3, src: poster3 },
  { id: 4, src: poster4 },
  { id: 5, src: poster5 },
  { id: 6, src: poster6 },
  { id: 7, src: poster7 },
];

const showCards = [
  { id: 1, src: posterKhurooj, title: "الخروج إلى البئر", youtubeId: "TKXR3-vVH6o", titleLogoSrc: "",             genre: "تشويق",           isNew: true  },
  { id: 2, src: poster2,       title: "حلم",              youtubeId: "7QXSDEA6XPw",  titleLogoSrc: "",             genre: "دراما تركية",     isNew: true  },
  { id: 3, src: poster3,       title: "بنت النعمان",      youtubeId: "SDEXEIk0zqE",  titleLogoSrc: logoBintAlNuman, genre: "كوميدي",          isNew: false },
  { id: 4, src: poster4,       title: "اليتيم",           youtubeId: "XK5YO9Qs-bI",  titleLogoSrc: logoYatim,      genre: "دراما",           isNew: false },
  { id: 5, src: poster5,       title: "المشردون",         youtubeId: "dO9nRtjXeks",   titleLogoSrc: logoMushardun,  genre: "دراما",           isNew: false },
  { id: 6, src: poster6,       title: "مولانا",           youtubeId: "9wTg5YbOCwA",   titleLogoSrc: logoMawlana,    genre: "إثارة وتشويق",   isNew: false },
  { id: 7, src: poster7,       title: "سعادة المجنون",    youtubeId: "cCbDivjH4Mc",   titleLogoSrc: "",             genre: "دراما تشويقية",  isNew: false },
];

function genreClass(genre: string) {
  if (genre.includes("كوميدي"))  return "bg-emerald-500/85";
  if (genre.includes("تركية"))   return "bg-blue-500/85";
  if (genre.includes("إثارة"))   return "bg-orange-500/85";
  if (genre.includes("تشويق"))   return "bg-amber-600/85";
  return "bg-rose-600/85";
}

const navLinks = [
  { label: "أعمالنا", href: "#showcase" },
  { label: "البرومو", href: "#promo" },
  { label: "ماذا نقدم", href: "#features" },
  { label: "من نحن", href: "#about" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

const faqItems = [
  { q: "هل الخدمة مجانية تماماً؟", a: "نعم، قناة ELVA Drama مجانية بالكامل. فقط انضم وابدأ المشاهدة فوراً دون أي رسوم." },
  { q: "ما هي جودة المحتوى المتاح؟", a: "نوفر المحتوى بجودات متعددة تصل إلى 4K و1080p لتجربة سينمائية حقيقية." },
  { q: "كم مرة يُضاف محتوى جديد؟", a: "يومياً! نضيف حلقات المسلسلات فور صدورها والأفلام فور توفرها." },
  { q: "هل يوجد إعلانات داخل القناة؟", a: "لا إعلانات مزعجة إطلاقاً، ولا روابط مختصرة. روابط مباشرة وسريعة فقط." },
  { q: "هل يمكنني طلب محتوى معين؟", a: "بالتأكيد! نرحّب بطلبات المشتركين وندرسها بشكل دوري لتلبية اهتماماتكم." },
];

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-white/5 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Join button (left side in RTL) */}
          <div className="flex items-center gap-3">
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" data-testid="link-nav-telegram">
              <Button
                data-testid="button-nav-join"
                className="rounded-full gap-2 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_16px_rgba(234,179,8,0.25)] transition-all text-sm"
              >
                <SiTelegram className="w-4 h-4" />
                <span className="hidden sm:inline">انضم الآن</span>
              </Button>
            </a>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/70 hover:text-white transition-colors p-1"
              onClick={() => setMenuOpen((v) => !v)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Nav links (center, desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200 font-medium"
                data-testid={`link-nav-${link.label}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Logo (right side in RTL) */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="font-black text-lg tracking-wide text-foreground hidden sm:block">
              ELVA Drama
            </span>
            <img
              src={logoSrc}
              alt="ELVA Drama"
              className="w-9 h-9 rounded-full object-cover border border-primary/40"
            />
          </a>
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-3 pb-2 border-t border-white/5 mt-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all font-medium text-right"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// ── Featured Card ─────────────────────────────────────────────────────────────
interface FeaturedCardProps {
  show: (typeof showCards)[0];
  onPlay: () => void;
  onVideoEnd: () => void;
}

function FeaturedCard({ show, onPlay, onVideoEnd }: FeaturedCardProps) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<{ destroy(): void } | null>(null);
  const onVideoEndRef = useRef(onVideoEnd);
  useEffect(() => { onVideoEndRef.current = onVideoEnd; }, [onVideoEnd]);

  // Reset when show changes
  useEffect(() => {
    setPlaying(false);
    setHovered(false);
    if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
  }, [show.id]);

  // Create official YT.Player when playing starts — guaranteed onStateChange callback
  useEffect(() => {
    if (!playing || !show.youtubeId || !playerDivRef.current) return;

    let destroyed = false;
    loadYT(() => {
      if (destroyed || !playerDivRef.current) return;
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: show.youtubeId!,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          controls: 1,
          color: "white",
        },
        events: {
          onStateChange: (e) => {
            // 0 = ENDED
            if (e.data === 0) {
              onVideoEndRef.current();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
    };
  }, [playing, show.youtubeId]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-black"
      style={{ aspectRatio: "16/9" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster image */}
      <motion.img
        src={show.src}
        alt={show.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
        animate={{ opacity: playing ? 0 : 1, scale: hovered && !playing ? 1.04 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <span className="text-xs font-black text-white/80 tracking-[0.2em] drop-shadow">ELVA</span>
        <img src={logoSrc} alt="" className="w-7 h-7 rounded-full object-cover border border-primary/60 shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
      </div>

      {/* Genre tag + جديد badge — top left */}
      <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5 z-10">
        {show.isNew && (
          <motion.span
            className="px-2.5 py-0.5 rounded-full text-xs font-black bg-primary text-black shadow-[0_0_14px_rgba(234,179,8,0.7)]"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦ جديد
          </motion.span>
        )}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white backdrop-blur-sm ${genreClass(show.genre)}`}>
          {show.genre}
        </span>
      </div>

      {/* Play button overlay (visible when not playing) */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            {/* Show title — logo image if available, else text */}
            <motion.div
              className="absolute bottom-6 right-6 text-right"
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {show.titleLogoSrc ? (
                <img
                  src={show.titleLogoSrc}
                  alt={show.title}
                  className="max-h-16 md:max-h-20 w-auto object-contain drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.8))" }}
                />
              ) : (
                <p className="font-black text-white text-2xl md:text-3xl drop-shadow-2xl">
                  {show.title}
                </p>
              )}
            </motion.div>

            {/* Cinematic play button */}
            {show.youtubeId && (
              <motion.button
                data-testid={`button-play-${show.id}`}
                onClick={() => { onPlay(); setPlaying(true); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
                className="group relative flex items-center justify-center"
              >
                {/* Outer ring pulse */}
                <motion.div
                  className="absolute w-28 h-28 rounded-full border-2 border-primary/40"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-20 h-20 rounded-full border border-primary/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                {/* Button core */}
                <div className="relative w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary shadow-[0_0_40px_rgba(234,179,8,0.5)] flex items-center justify-center transition-all duration-300">
                  <Play className="w-7 h-7 fill-black text-black translate-x-0.5" />
                </div>
              </motion.button>
            )}

            {/* "شاهد الإعلان" label */}
            {show.youtubeId && (
              <motion.p
                className="mt-6 text-sm text-white/60 font-medium tracking-widest uppercase"
                animate={{ opacity: hovered ? 1 : 0.6 }}
              >
                شاهد الإعلان
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube player div — YT.Player mounts its own iframe here */}
      <AnimatePresence>
        {playing && show.youtubeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20"
          >
            <div
              ref={playerDivRef}
              className="w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Showcase / Promo Section ──────────────────────────────────────────────────
function ShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const prevIndex = (activeIndex - 1 + showCards.length) % showCards.length;
  const nextIndex = (activeIndex + 1) % showCards.length;

  const goTo = useCallback(
    (index: number, dir?: number) => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      setDirection(dir ?? (index > activeIndex ? 1 : -1));
      setActiveIndex(index);
      setIsVideoPlaying(false);
    },
    [activeIndex]
  );

  const goNext = useCallback(() => goTo(nextIndex, 1), [nextIndex, goTo]);
  const goPrev = useCallback(() => goTo(prevIndex, -1), [prevIndex, goTo]);

  // Auto-advance only when video is NOT playing
  useEffect(() => {
    if (isVideoPlaying) return;
    autoTimer.current = setTimeout(goNext, AUTO_ADVANCE_INTERVAL);
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, [activeIndex, isVideoPlaying, goNext]);

  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false);
    setTimeout(goNext, 700);
  }, [goNext]);

  // Transition variants: direction-aware slide
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "40%" : "-40%", scale: 0.85, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-40%" : "40%", scale: 0.85, opacity: 0 }),
  };

  return (
    <>
      <section id="showcase" className="pt-24 pb-4 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">أعمالنا المميزة</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              اضغط على زر التشغيل لمشاهدة الإعلان الدعائي
            </p>
          </div>

          {/* 3-card carousel: prev (dimmed) | active (large) | next (dimmed) */}
          <div
            className="relative flex items-center justify-center gap-3 md:gap-5 overflow-hidden"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) < 50) return;
              // RTL: swipe right → prev, swipe left → next
              if (delta > 0) goPrev(); else goNext();
            }}
          >

            {/* Prev card — dimmed, smaller, clickable */}
            <motion.div
              className="flex-shrink-0 cursor-pointer relative rounded-xl overflow-hidden group"
              style={{ width: "clamp(100px, 20%, 220px)", aspectRatio: "16/9" }}
              onClick={goPrev}
              whileHover={{ scale: 1.03, opacity: 0.55 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 0.4 }}
              data-testid="card-prev"
            >
              <img src={showCards[prevIndex].src} alt={showCards[prevIndex].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-1.5 left-1.5 flex flex-col items-start gap-1">
                {showCards[prevIndex].isNew && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-primary text-black leading-none">جديد</span>
                )}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white leading-none ${genreClass(showCards[prevIndex].genre)}`}>
                  {showCards[prevIndex].genre}
                </span>
              </div>
              <div className="absolute bottom-2 inset-x-2">
                <p className="text-white/70 font-bold text-xs text-right truncate">{showCards[prevIndex].title}</p>
              </div>
            </motion.div>

            {/* Active card — large, clear, with transitions */}
            <div
              className="flex-shrink-0 relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(234,179,8,0.12)] border border-primary/20"
              style={{ width: "clamp(260px, 56%, 760px)", aspectRatio: "16/9" }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={showCards[activeIndex].id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full h-full"
                >
                  <FeaturedCard
                    show={showCards[activeIndex]}
                    onPlay={() => setIsVideoPlaying(true)}
                    onVideoEnd={handleVideoEnd}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next card — dimmed, smaller, clickable */}
            <motion.div
              className="flex-shrink-0 cursor-pointer relative rounded-xl overflow-hidden group"
              style={{ width: "clamp(100px, 20%, 220px)", aspectRatio: "16/9" }}
              onClick={goNext}
              whileHover={{ scale: 1.03, opacity: 0.55 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 0.4 }}
              data-testid="card-next"
            >
              <img src={showCards[nextIndex].src} alt={showCards[nextIndex].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-1.5 left-1.5 flex flex-col items-start gap-1">
                {showCards[nextIndex].isNew && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-primary text-black leading-none">جديد</span>
                )}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white leading-none ${genreClass(showCards[nextIndex].genre)}`}>
                  {showCards[nextIndex].genre}
                </span>
              </div>
              <div className="absolute bottom-2 inset-x-2">
                <p className="text-white/70 font-bold text-xs text-right truncate">{showCards[nextIndex].title}</p>
              </div>
              {showCards[nextIndex].youtubeId && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary/70 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-black text-black translate-x-0.5" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Active title */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-center mt-5 text-xl font-black text-primary"
            >
              {showCards[activeIndex].title}
            </motion.p>
          </AnimatePresence>

          {/* Dot navigation */}
          <div className="flex justify-center gap-2 mt-4 mb-10">
            {showCards.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                data-testid={`button-showcase-dot-${i}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-8 h-2.5 bg-primary shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                    : "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo anchor (for nav link) */}
      <div id="promo" />
    </>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-card overflow-hidden"
              data-testid={`card-faq-${i}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-right gap-4 hover:bg-white/3 transition-colors"
                data-testid={`button-faq-${i}`}
              >
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="font-bold text-lg flex-1 text-right">{item.q}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-muted-foreground leading-relaxed text-right">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroCurrent, setHeroCurrent] = useState(0);
  const [heroDir, setHeroDir] = useState(1);

  const heroNext = useCallback(() => {
    setHeroDir(1);
    setHeroCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(heroNext, HERO_INTERVAL);
    return () => clearInterval(t);
  }, [heroNext]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroGoTo = (i: number) => {
    setHeroDir(i > heroCurrent ? 1 : -1);
    setHeroCurrent(i);
  };

  return (
    <div className="relative overflow-x-hidden selection:text-primary-foreground selection:bg-primary">
      <Navbar isScrolled={isScrolled} />

      {/* ── HERO ── */}
      <section className="relative h-[100dvh] overflow-hidden">
        <AnimatePresence initial={false} custom={heroDir}>
          <motion.div
            key={heroSlides[heroCurrent].id}
            custom={heroDir}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[heroCurrent].src}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent z-10" />

        {/* Watermark */}
        <div className="absolute bottom-10 left-8 z-20 flex items-center gap-3 opacity-65">
          <img src={logoSrc} alt="ELVA Drama" className="w-11 h-11 rounded-full object-cover border-2 border-primary/60 shadow-[0_0_16px_rgba(234,179,8,0.4)]" />
          <span className="font-black text-base tracking-[0.2em] text-white drop-shadow uppercase">ELVA Drama</span>
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mr-auto text-right"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-primary mb-8 backdrop-blur-sm">
                <Play className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">قناتك الدرامية الأولى</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl">
                عالمك الدرامي{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
                  في مكان واحد
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                انضم إلى آلاف المشتركين واستمتع بأحدث المسلسلات والأفلام العربية والعالمية بجودة عالية وبدون إعلانات.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" data-testid="link-hero-telegram">
                  <Button
                    data-testid="button-hero-join"
                    size="lg"
                    className="w-full sm:w-auto rounded-full gap-3 px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_30px_rgba(234,179,8,0.35)] transition-all"
                  >
                    <SiTelegram className="w-5 h-5" />
                    <span>انضم للقناة مجاناً</span>
                  </Button>
                </a>
                <a href="#showcase" className="w-full sm:w-auto" data-testid="link-hero-showcase">
                  <Button
                    data-testid="button-hero-browse"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-full gap-2 px-8 h-14 text-lg border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-sm text-white"
                  >
                    <span>تصفح المحتوى</span>
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide dots only — no progress bar */}
        <div className="absolute bottom-10 right-8 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => heroGoTo(i)}
              data-testid={`button-hero-dot-${i}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === heroCurrent
                  ? "w-8 h-2.5 bg-primary shadow-[0_0_8px_rgba(234,179,8,0.7)]"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── SHOWCASE + PROMO ── */}
      <ShowcaseSection />

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">ماذا نقدم لك؟</h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                في ELVA Drama نصنع تجربة مشاهدة متكاملة. كل ما تحتاجه في مكان واحد.
              </p>
              <div className="space-y-8">
                {[
                  { icon: <Film className="w-8 h-8 text-primary" />, title: "محتوى حصري", desc: "أحدث الأفلام والمسلسلات العالمية والعربية بجودات متعددة." },
                  { icon: <Zap className="w-8 h-8 text-primary" />, title: "روابط مباشرة", desc: "تحميل ومشاهدة عبر روابط سريعة ومباشرة بدون إعلانات مزعجة." },
                  { icon: <Clock className="w-8 h-8 text-primary" />, title: "تحديث يومي", desc: "حلقات المسلسلات تضاف فور صدورها، والأفلام فور توفرها." },
                  { icon: <MonitorPlay className="w-8 h-8 text-primary" />, title: "جودة عالية", desc: "دقة 4K و1080p للاستمتاع بتجربة سينمائية حقيقية." },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-4"
                    data-testid={`item-feature-${i}`}
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                      <p className="text-muted-foreground">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative" id="about">
              <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative rounded-2xl border border-white/10 bg-card p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                  <Shield className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="font-bold text-xl">لماذا ELVA Drama؟</h3>
                    <p className="text-sm text-muted-foreground">اختيارك الأول للمتعة</p>
                  </div>
                </div>
                <ul className="space-y-5">
                  {[
                    "تصميم أنيق ومنظم للقناة يسهل البحث",
                    "ترجمة احترافية ودقيقة لجميع المحتوى",
                    "مجتمع نشط وتفاعلي لتبادل الآراء",
                    "تلبية طلبات المشتركين بشكل دوري",
                    "لا إعلانات مزعجة أو روابط مختصرة",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3" data-testid={`item-whyus-${i}`}>
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { value: "+٥٠,٠٠٠", label: "مشترك نشط" },
              { value: "+٥,٠٠٠", label: "فيلم ومسلسل" },
              { value: "٢٤/٧", label: "تحديث مستمر" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-colors"
                data-testid={`card-stat-${i}`}
              >
                <div className="text-4xl md:text-6xl font-black text-primary mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  {stat.value}
                </div>
                <div className="text-lg md:text-xl text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">ماذا يقول مشتركونا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "أفضل قناة تابعتها على الإطلاق. تنظيم رائع وجودة لا يعلى عليها.", author: "أحمد س." },
              { text: "الروابط المباشرة هي أكثر ما يميزكم، شكراً لجهودكم المستمرة.", author: "سارة م." },
              { text: "تحديثات يومية سريعة جداً، أصبحت لا أستغني عن ELVA Drama.", author: "خالد ع." },
            ].map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-white/5 relative text-right"
                data-testid={`card-testimonial-${i}`}
              >
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">"{q.text}"</p>
                <p className="text-primary font-bold">{q.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FINAL CTA ── */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container relative mx-auto px-6 text-center">
          <img
            src={logoSrc}
            alt="ELVA Drama"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary/40 shadow-[0_0_40px_rgba(234,179,8,0.25)] mx-auto mb-8"
          />
          <h2 className="text-4xl md:text-6xl font-black mb-6">هل أنت مستعد للمتعة؟</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            انضم الآن إلى مجتمع ELVA Drama واستمتع بمكتبة ضخمة من الأفلام والمسلسلات مجاناً.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" data-testid="link-cta-telegram">
              <Button
                data-testid="button-cta-join"
                size="lg"
                className="rounded-full gap-4 px-10 h-16 text-xl bg-[#229ED9] hover:bg-[#229ED9]/90 text-white font-bold shadow-[0_0_40px_rgba(34,158,217,0.4)] transition-all"
              >
                <SiTelegram className="w-6 h-6" />
                <span>الاشتراك في القناة</span>
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING TELEGRAM BUTTON ── */}
      <motion.a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="link-floating-telegram"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-[#229ED9] text-white font-bold shadow-[0_0_24px_rgba(34,158,217,0.5)] px-4 h-12 overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#229ED9]/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <SiTelegram className="w-5 h-5 relative z-10 flex-shrink-0" />
        <span className="relative z-10 text-sm whitespace-nowrap">انضم للقناة</span>
      </motion.a>

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-white/10 bg-background relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <img src={logoSrc} alt="" className="w-6 h-6 rounded-full object-cover" />
            <span>© {new Date().getFullYear()} ELVA Drama. جميع الحقوق محفوظة.</span>
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors text-xs">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
