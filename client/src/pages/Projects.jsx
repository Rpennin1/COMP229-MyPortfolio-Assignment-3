
import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

export default function Projects() {
    const { user, token } = useAuth();
    const isAdmin = user?.role === "admin";

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        completion: "",
        description: ""
    });

    // Handle form changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    // GET: Everyone can view projects.
    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(
                    `${API_URL}/api/projects`
                );

                if (!response.ok) {
                    throw new Error("Unable to retrieve projects.");
                }

                const data = await response.json();
                setProjects(data);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    // POST or PUT: Admins can save or update projects.
    async function handleSubmit(event) {
        event.preventDefault();

        if (!isAdmin || !token) {
            setError("Admin access is required.");
            return;
        }

        try {
            const response = await fetch(
                editingId
                    ? `${API_URL}/api/projects/${editingId}`
                    : `${API_URL}/api/projects`,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save project.");
            }

            if (editingId) {
                setProjects(
                    projects.map((project) =>
                        project._id === editingId
                            ? data
                            : project
                    )
                );
            } else {
                setProjects([...projects, data]);
            }

            resetForm();
            setError("");

        } catch (error) {
            setError(error.message);
        }
    }

    // Reset form
    function resetForm() {
        setFormData({
            title: "",
            firstname: "",
            lastname: "",
            email: "",
            completion: "",
            description: ""
        });

        setEditingId(null);
    }

    // Load selected project into form
    function handleEdit(project) {
        if (!isAdmin) return;

        setEditingId(project._id);

        setFormData({
            title: project.title,
            firstname: project.firstname,
            lastname: project.lastname,
            email: project.email,
            completion: project.completion.split("T")[0],
            description: project.description
        });
    }

    // DELETE: Admins can remove projects.
    async function handleDelete(id) {
        if (!isAdmin || !token) {
            setError("Admin access is required.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/projects/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete project.");
            }

            setProjects(
                projects.filter((project) => project._id !== id)
            );

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <PageContainer>
            <section className="projects-section">

                <h1>My Projects</h1>

                <p>
                    Here are some of the projects I have completed
                    and worked on during my studies.
                </p>

                {/* Only Admins can add or edit projects. */}
                {isAdmin && (
                    <>
                        <h2>{editingId ? "Edit Project" : "Add a Project"}</h2>

                        <form onSubmit={handleSubmit}>

                            <label>Project Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />

                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <label>Completion Date</label>
                            <input
                                type="date"
                                name="completion"
                                value={formData.completion}
                                onChange={handleChange}
                                required
                            />

                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            <button type="submit">
                                {editingId ? "Update Project" : "Save Project"}
                            </button>

                            {editingId && (
                                <button type="button" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}

                        </form>
                    </>
                )}

                <h2>Project Portfolio</h2>

                {loading && <p>Loading projects...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && projects.length === 0 && (
                    <p>No projects have been added yet.</p>
                )}

                {projects.map((project) => (
                    <article className="project-card" key={project._id}>

                        <div className="project-info">

                            <h2>{project.title}</h2>

                            <p>{project.description}</p>

                            <p>
                                <strong>Completed:</strong>{" "}
                                {new Date(project.completion).toLocaleDateString()}
                            </p>

                            <p>
                                <strong>Created by:</strong>{" "}
                                {project.firstname} {project.lastname}
                            </p>

                            <p>
                                <strong>Email:</strong> {project.email}
                            </p>

                        </div>

                        {/* Only Admins see Edit and Delete buttons. */}
                        {isAdmin && (
                            <div className="project-actions">

                                <button
                                    type="button"
                                    onClick={() => handleEdit(project)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(project._id)}
                                >
                                    Delete
                                </button>

                            </div>
                        )}

                    </article>
                ))}

            </section>
        </PageContainer>
    );
}
