import React from "react";
import Image from "next/image";

export const SetlogLogo = ({ className, width = 32, height = 32, ...props }: { className?: string; width?: number; height?: number }) => {
    return (
        <span className="relative inline-block" style={{ width, height }}>
            <Image
                src="/logo.png"
                alt="Linkmap Logo"
                width={width}
                height={height}
                className={`${className ?? ''} dark:hidden`}
                {...props}
            />
            <Image
                src="/logo-dark.png"
                alt="Linkmap Logo"
                width={width}
                height={height}
                className={`${className ?? ''} hidden dark:block absolute inset-0`}
                {...props}
            />
        </span>
    );
};
