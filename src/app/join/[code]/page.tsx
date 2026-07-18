import { StudentRoom } from "@/components/student-room";

interface StudentPageProps {
  params: Promise<{ code: string }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { code } = await params;
  return <StudentRoom code={code.toUpperCase()} />;
}
