import { useRef } from "react";
import { playSound } from "../soundEffects";

interface Props {
  title: string;
  imageSrc: string;
  videoSrc?: string;
  onClick: () => void;
}

export function GameCard({ title, imageSrc, videoSrc, onClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const playPreview = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play();
  };

  const stopPreview = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <button
      onPointerEnter={playPreview}
      onPointerLeave={stopPreview}
      onClick={() => {
        playSound("click");
        onClick();
      }}
      tabIndex={-1}
      className={`game-card group relative flex h-full min-h-0 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 text-left transition-all duration-300 ${
        videoSrc
          ? "video-card origin-center hover:z-40 hover:scale-[1.4]"
          : "hover:-translate-y-2"
      }`}
    >
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
      />
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      )}
      <span
        className={`relative z-10 w-full bg-gradient-to-t from-game-bg from-25% via-game-bg/95 to-transparent px-4 pb-4 pt-14 transition-opacity duration-200 ${
          videoSrc ? "group-hover:opacity-0" : ""
        }`}
      >
        <h2 className="text-2xl font-extrabold leading-tight text-krishna-cream">{title}</h2>
      </span>
    </button>
  );
}
