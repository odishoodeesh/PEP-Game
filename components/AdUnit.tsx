
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ className = "" }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    let timer: number;

    const initializeAd = () => {
      try {
        // Check if the element exists and has width to prevent "availableWidth=0"
        if (adRef.current && adRef.current.offsetWidth > 0) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else if (adRef.current) {
          // If still no width, retry once after a short delay
          timer = window.setTimeout(initializeAd, 300);
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    };

    // Wait for animations/transitions to settle
    timer = window.setTimeout(initializeAd, 200);

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`flex justify-center my-6 overflow-hidden w-full mx-auto ${className}`} style={{ minHeight: '90px' }}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%', 
          minWidth: '250px', 
          minHeight: '90px',
          backgroundColor: 'rgba(255,255,255,0.02)' 
        }}
        data-ad-client="ca-pub-9619447476010525"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdUnit;
