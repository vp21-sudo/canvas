import Image from "next/image";

const TopNav = () => {
  return (
    <nav className=" z-40 absolute top-0 w-full px-3 py-3">
      <Image src={"/drawjslogo-h.png"} alt="logo" width={140} height={50} />
    </nav>
  );
};

export { TopNav };
