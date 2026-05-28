import { Navigate, useParams } from "react-router";

export function CurriculumDetailPage() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/curriculums" replace />;
  }

  return <Navigate to={`/curriculums/${id}/edit`} replace />;
}
