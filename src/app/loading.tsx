import Image from "next/image";

const funnyLoadingTexts = [
  "Getting some things from the Server",
  "Drawing the GUI",
  "Pulling down the blinds",
  "Making some coffee",
  "Loading the loading screen",
];

const Page = () => {
  const text =
    funnyLoadingTexts[Math.floor(Math.random() * funnyLoadingTexts.length)];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <Image
        className="translate-x-6 animate-wiggle animate-infinite"
        // eslint-disable-next-line spellcheck/spell-checker
        src="/Karotte.svg"
        alt=""
        width={200}
        height={200}
      />
      <p className="py-2 text-center text-2xl tracking-tight text-slate-600 ">
        {text}
      </p>
    </main>
  );
};

export default Page;
