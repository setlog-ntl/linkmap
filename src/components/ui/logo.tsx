import React from "react";

export const SetlogLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            fill="none"
            className={className}
            {...props}
        >
            {/* Connecting Lines */}
            <path
                d="M50 100 H 150"
                stroke="url(#paint0_linear_logo)"
                strokeWidth="8"
                strokeLinecap="round"
            />

            {/* Left Node (Frontend - Blue) */}
            <rect x="35" y="70" width="30" height="60" rx="8" fill="#3B82F6" />
            <rect
                x="35"
                y="70"
                width="30"
                height="60"
                rx="8"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
            />

            {/* Center Node (My Project - Green - Emphasized) */}
            <rect x="85" y="60" width="30" height="80" rx="8" fill="#10B981" />
            <rect
                x="85"
                y="60"
                width="30"
                height="80"
                rx="8"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
            />

            {/* Right Node (Backend - Purple) */}
            <rect x="135" y="70" width="30" height="60" rx="8" fill="#8B5CF6" />
            <rect
                x="135"
                y="70"
                width="30"
                height="80"
                rx="8"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
            />

            {/* Gradient for line */}
            <defs>
                <linearGradient
                    id="paint0_linear_logo"
                    x1="50"
                    y1="100"
                    x2="150"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.5" stopColor="#10B981" />
                    <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
            </defs>
        </svg>
    );
};
