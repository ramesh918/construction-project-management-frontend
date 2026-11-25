

import { useProject } from "./useProjects";
import { Link, useParams } from "react-router-dom";





function ProjectSummary() {
  const {id: projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
   <>
    <Link to="/projects" className="text-blue-500 hover:underline mb-4 inline-block">Back to Projects</Link>
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">{project.name}</h2>
      <p className="text-gray-600 mb-1">Location: {project.location}</p>
      <p className="text-gray-600 mb-1">Start Date: {project.startDate}</p>
      <p className="text-gray-600 mb-1">End Date: {project.endDate}</p>
      <p className="text-gray-600 mb-1">Budget: ${project.budget.toLocaleString()}</p>
      <p className="text-gray-600 mb-1">Status: {project.status}</p>
      {project.description && <p className="text-gray-600 mb-1">Description: {project.description}</p>}
      {project.documents && project.documents.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">Documents:</h3>
          <ul className="list-disc list-inside">
            {project.documents.map((doc) => (
              <li key={doc.key}>
                <a href={`/api/projects/${project.id}/documents/${doc.key}`} target="_blank" rel="noopener noreferrer">
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {project.costSummary && (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h3 className="text-lg font-bold mb-2">Cost Summary</h3>
        <p className="text-gray-600 mb-1">Budget: ${project.costSummary.budget.toLocaleString()}</p>
        <p className="text-gray-600 mb-1">Material Cost: ${project.costSummary.materialCost.toLocaleString()}</p>
        <p className="text-gray-600 mb-1">Labour Cost: ${project.costSummary.labourCost.toLocaleString()}</p>
        <p className="text-gray-600 mb-1">Other Cost: ${project.costSummary.otherCost.toLocaleString()}</p>
        <p className="text-gray-600 mb-1">Total Cost: ${project.costSummary.totalCost.toLocaleString()}</p>
        <p className="text-gray-600 mb-1">Remaining: ${project.costSummary.remaining.toLocaleString()}</p>
        <p className={`text-gray-600 mb-1 ${project.costSummary.isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
          {project.costSummary.isOverBudget ? 'Over Budget' : 'Within Budget'}
        </p>
      </div>
    )}
    
   </>
   
  );
}

export default ProjectSummary;
