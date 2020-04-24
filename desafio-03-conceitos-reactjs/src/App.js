import React, { useState, useEffect } from "react";

import "./styles.css";

import api from "./services/api";

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setProjects(response.data);
    });
  }, []);

  async function handleAddRepository() {
    api
      .post("repositories", {
        title: "Projeto " + (projects.length + 1),
        url: "www.project.com",
        techs: ["Javascript", "NodeJS", "ReactJS"],
      })
      .then((response) => {
        setProjects([...projects, response.data]);
      });
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);

      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      throw err;
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {projects.map((project) => (
          <li key={project.id}>
            {project.title}
            <button onClick={() => handleRemoveRepository(project.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
