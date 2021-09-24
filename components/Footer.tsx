import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();
  return (
    <div
      className={`max-w-7xl mx-auto h-16 flex items-center px-4 mt-12 ${
        ["/app"].includes(router.route) && "fixed bottom-0",
        ["/"].includes(router.route) && "fixed bottom-5 left-8"
      }`}
    >
      <span className="dark:text-gray-300 opacity-50">
        Made with ♥ by{" "}
        <a
          className="underline"
          href="https://www.youtube.com/channel/UCstSEHcCLMGdac9wkbMeAIw"
        >
          Laura Gao
        </a>{" "}
        and{" "}
        <a className="underline" href="https://twitter.com/amyli0">
          Amy Li
        </a>{" "}
        from TOPS Class of 2023
      </span>
    </div>
  );
}
