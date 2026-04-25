import { GameBoard } from "@/components/game/GameBoard";

const Index = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* ambient background grid */}
      <div aria-hidden className="absolute inset-0 bg-grid pointer-events-none" />
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-[640px] w-[1100px] rounded-full bg-accent/10 blur-[160px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 right-0 h-[480px] w-[760px] rounded-full bg-[hsl(var(--accent-blue))]/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-10 sm:py-14">
        <h2 className="sr-only">CipherFlow — 3D Mastermind code-breaker game</h2>
        <GameBoard />
        <footer className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          Crafted for the Cipher Protocol · v1.0
        </footer>
      </div>
    </main>
  );
};

export default Index;
