import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import GovProjectDetailClient from './GovProjectDetailClient';

export function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({
    projectId: project.id,
  }));
}

export default async function GovProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <GovProjectDetailClient projectId={projectId} />;
}
