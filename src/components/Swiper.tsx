'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { SwiperCore } from '../core';
import { DEFAULT_OPTIONS, type SwiperOptions, type SwiperState } from '../types';

export interface SwiperProps extends SwiperOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.RefObject<SwiperRef>;
}

export interface SwiperRef {
  getState: () => SwiperState;
}

export const Swiper: React.FC<SwiperProps> = ({
  children,
  className,
  style,
  slideWidth = DEFAULT_OPTIONS.slideWidth,
  visibleSlides = DEFAULT_OPTIONS.visibleSlides,
  gap = DEFAULT_OPTIONS.gap,
  dragSensitivity = DEFAULT_OPTIONS.dragSensitivity,
  lerpFactor = DEFAULT_OPTIONS.lerpFactor,
  forcePower = DEFAULT_OPTIONS.forcePower,
  snap = DEFAULT_OPTIONS.snap,
  snapAlign = DEFAULT_OPTIONS.snapAlign,
  velocityPower = DEFAULT_OPTIONS.velocityPower,
  velocitySamples = DEFAULT_OPTIONS.velocitySamples,
  ref,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    coreRef.current = new SwiperCore(containerRef.current, {
      slideWidth,
      visibleSlides,
      gap,
      dragSensitivity,
      lerpFactor,
      forcePower,
      snap,
      snapAlign,
      velocityPower,
      velocitySamples,
    });

    return () => {
      coreRef.current?.destroy();
      coreRef.current = null;
    };
  }, [slideWidth, visibleSlides, gap, dragSensitivity, lerpFactor, forcePower, snap, snapAlign, velocityPower, velocitySamples]);

  useEffect(() => {
    coreRef.current?.measure();
  }, [children]);

  useEffect(() => {
    if (ref && coreRef.current) {
      ref.current = { getState: () => coreRef.current!.getState() };
    }
  }, [ref]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
};

export default Swiper;
