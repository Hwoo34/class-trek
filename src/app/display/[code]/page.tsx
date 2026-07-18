import { DisplayRoom } from "@/components/display-room";

interface DisplayPageProps {
  params: Promise<{ code: string }>;
}

export default async function DisplayPage({ params }: DisplayPageProps) {
  const { code } = await params;
  return <DisplayRoom code={code.toUpperCase()} />;
}
