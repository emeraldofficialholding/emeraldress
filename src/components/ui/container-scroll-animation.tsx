"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      // Effetto "laptop chrome" solo su desktop (≥ lg = 1024px).
      // Sotto, tablet/mobile renderizzano il contenuto in un container fluido.
      setIsDesktop(window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Mobile / iPad: niente effetto 3D, niente altezza fissa, no monitor finto.
  // Il contenuto rispetta il suo flow naturale e scorre con la pagina.
  if (!isDesktop) {
    return (
      <div className="w-full relative px-4 py-8" ref={containerRef}>
        <div className="max-w-5xl mx-auto">{titleComponent}</div>
        <div className="mt-6 max-w-5xl mx-auto w-full bg-background rounded-2xl border border-neutral-200 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-[80rem] flex items-center justify-center relative p-20"
      ref={containerRef}
    >
      <div
        className="py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-y-auto rounded-2xl bg-background md:rounded-2xl md:p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
    </motion.div>
  );
};
