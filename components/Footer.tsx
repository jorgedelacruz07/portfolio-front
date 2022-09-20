import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="m-8 lg:mx-auto md:max-w-4xl">
      <div className="flex justify-around">
        <Link href="/">
          <a className="px-2">Home</a>
        </Link>
        <Link href="/experiences">
          <a className="px-2">Experiences</a>
        </Link>
        <Link href="/projects">
          <a className="px-2">Projects</a>
        </Link>
      </div>
    </footer>
  );
};
