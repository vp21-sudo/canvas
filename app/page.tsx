"use client";
import CanvasComponent from "@/components/canvas";
import { BottomOptions, Options } from "@/components/options";
import { TopNav } from "@/components/top-nav";

const Page = () => {
  return (
    <div className=" w-full ">
      <TopNav />
      <Options />
      <BottomOptions />
      <div className=" z-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        <CanvasComponent />
      </div>
    </div>
  );
};

export default Page;
