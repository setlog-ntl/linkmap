import React from "react";
import Image from "next/image";

export const SetlogLogo = ({ className, width = 32, height = 32, ...props }: { className?: string; width?: number; height?: number }) => {
    return (
        <Image
            src="/logo.png"
            alt="Linkmap Logo"
            width={width}
            height={height}
            className={className}
            {...props}
        />
    );
};
