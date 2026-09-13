import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import PMProjectDetailClient from './PMProjectDetailClient';

export function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({
    projectId: project.id,
  }));
}

export default async function PMProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <PMProjectDetailClient projectId={projectId} />;
}
