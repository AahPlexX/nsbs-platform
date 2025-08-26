'use client';

import React, { useState } from 'react';

// Simple utility function to combine class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  place?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

function Tooltip({
  content,
  children,
  place = 'top',
  className,
  disabled = false,
  ...props
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  const tooltipClasses = cn(
    'absolute z-50 px-3 py-1.5 text-xs text-white bg-slate-900 rounded-md shadow-lg pointer-events-none transition-opacity duration-200',
    place === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    place === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    place === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    place === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    isVisible ? 'opacity-100' : 'opacity-0',
    className
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {content && (
        <div className={tooltipClasses}>
          {content}
          {/* Arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-slate-900 transform rotate-45',
              place === 'top' &&
                'top-full left-1/2 -translate-x-1/2 -translate-y-1',
              place === 'bottom' &&
                'bottom-full left-1/2 -translate-x-1/2 translate-y-1',
              place === 'left' &&
                'left-full top-1/2 -translate-y-1/2 -translate-x-1',
              place === 'right' &&
                'right-full top-1/2 -translate-y-1/2 translate-x-1'
            )}
          />
        </div>
      )}
    </div>
  );
}

// Create a wrapper for legacy Radix-style tooltip usage in sidebar
interface LegacyTooltipProps {
  children: React.ReactNode;
  tooltip?:
    | string
    | {
        children: React.ReactNode;
        side?: 'top' | 'bottom' | 'left' | 'right';
        hidden?: boolean;
      }
    | undefined;
}

function SidebarTooltipWrapper({ children, tooltip }: LegacyTooltipProps) {
  if (!tooltip) {
    return <>{children}</>;
  }

  if (typeof tooltip === 'string') {
    return (
      <Tooltip content={tooltip} place="right">
        {children}
      </Tooltip>
    );
  }

  return (
    <Tooltip
      content={tooltip.children}
      place={tooltip.side === 'right' ? 'right' : 'top'}
      disabled={tooltip.hidden ?? false}
    >
      {children}
    </Tooltip>
  );
}

// Legacy compatibility components for existing usage
function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export {
  SidebarTooltipWrapper,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
};

