import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../App";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]); // Explicitly set type as an array

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/projects`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setProjects([]); // Fallback
        }
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4">All Projects</h1>
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map((project) => (
              <li key={project._id} className="list-group-item d-flex align-items-center">
                <img
                  src={project.image}
                  alt={project.title}
                  width="50"
                  className="rounded-circle me-3"
                />
                <div>
                  <strong>{project.name}</strong>
                  <div>{project.title}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
