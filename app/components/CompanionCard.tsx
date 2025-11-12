"use client";

import Image from "next/image";
import { useNavigation } from "./NavigationProvider";
import { useState } from "react";
import { addBookmark, removeBookmark } from "@/lib/actions/companion.actions";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked?: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked = false,
}: CompanionCardProps) => {
  const { navigate, isLoading } = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const handleLaunchLesson = () => {
    navigate(`/companions/${id}`);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(id);
      } else {
        await addBookmark(id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button
          className="companion-bookmark disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleBookmarkToggle}
          disabled={isBookmarkLoading}
        >
          <Image
            src={
              isBookmarked
                ? "/icons/bookmark-filled.svg"
                : "/icons/bookmark.svg"
            }
            alt="bookmark"
            width={12.5}
            height={15}
          />
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <button
        onClick={handleLaunchLesson}
        disabled={isLoading}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Launch Lesson"
        )}
      </button>
    </article>
  );
};

export default CompanionCard;
