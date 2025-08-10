import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative h-[45vh] w-full my-16">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      <div className="relative container mx-auto px-4 md:px-24 h-full w-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mt-16 tracking-wider mb-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Skills that power careers
          </h1>
          <p className="text-xl text-muted-foreground/90 mb-5">
            Unlock your potential with expert-led courses and hands-on learning paths.
            </p>

          <Button className="px-8 py-6 mt-4 rounded-lg bg-purple-600/40 hover:bg-purple-600" variant={'outline'}>Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
