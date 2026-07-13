import { WineClubApp } from "@/components/wine-club-app";
import { WineClubProvider } from "@/context/wine-club-provider";

export default function Home() {
  return (
    <WineClubProvider>
      <WineClubApp />
    </WineClubProvider>
  );
}
