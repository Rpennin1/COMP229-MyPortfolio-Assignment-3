
import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

export default function Education() {
    const { user, token } = useAuth();
    const isAdmin = user?.role === "admin";

    const [qualifications, setQualifications] = useState([]);
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

    // Reset the form
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

    // GET: Everyone can view education records.
    useEffect(() => {
        async function fetchQualifications() {
            try {
                const response = await fetch(
                    `${API_URL}/api/qualifications`
                );

                if (!response.ok) {
                    throw new Error("Unable to retrieve education records.");
                }

                const data = await response.json();
                setQualifications(data);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        }

        fetchQualifications();
    }, []);

    // POST or PUT: Admins can add or update education records.
    async function handleSubmit(event) {
        event.preventDefault();

        if (!isAdmin || !token) {
            setError("Admin access is required.");
            return;
        }

        try {
            const response = await fetch(
                editingId
                    ? `${API_URL}/api/qualifications/${editingId}`
                    : `${API_URL}/api/qualifications`,
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
                throw new Error(
                    data.message || "Unable to save education record."
                );
            }

            if (editingId) {
                setQualifications(
                    qualifications.map((qualification) =>
                        qualification._id === editingId
                            ? data
                            : qualification
                    )
                );
            } else {
                setQualifications([...qualifications, data]);
            }

            resetForm();
            setError("");

        } catch (error) {
            setError(error.message);
        }
    }

    // DELETE: Admins can remove education records.
    async function handleDelete(id) {
        if (!isAdmin || !token) {
            setError("Admin access is required.");
            return;
        }

        if (!window.confirm(
            "Are you sure you want to delete this education record?"
        )) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/qualifications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete education record."
                );
            }

            setQualifications(
                qualifications.filter(
                    (qualification) => qualification._id !== id
                )
            );

        } catch (error) {
            setError(error.message);
        }
    }

    // Load selected education record into the form.
    function handleEdit(qualification) {
        if (!isAdmin) return;

        setEditingId(qualification._id);

        setFormData({
            title: qualification.title,
            firstname: qualification.firstname,
            lastname: qualification.lastname,
            email: qualification.email,
            completion: qualification.completion.split("T")[0],
            description: qualification.description
        });
    }

    return (
        <PageContainer>
            <section className="education-section">

                <h1>Education</h1>

                {/* Only Admins can add or edit education records. */}
                {isAdmin && (
                    <>
                        <h2>
                            {editingId ? "Edit Education" : "Add Education"}
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <label>Qualification / Program</label>
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
                                {editingId ? "Update Education" : "Save Education"}
                            </button>

                            {editingId && (
                                <button type="button" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}

                        </form>
                    </>
                )}

                <p className="education-intro">
                    My education and ongoing learning have helped me develop
                    technical, analytical, and problem-solving skills in
                    software development.
                </p>

                {/* Education records retrieved from MongoDB. */}

                {loading && <p>Loading education records...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && qualifications.length === 0 && !error && (
                    <p>No education records have been added yet.</p>
                )}

                {qualifications.map((qualification) => (
                    <article
                        className="education-card"
                        key={qualification._id}
                    >

                        <div className="education-year">
                            {new Date(
                                qualification.completion
                            ).getFullYear()}
                        </div>

                        <div className="education-info">

                            <h2>{qualification.title}</h2>

                            <p>{qualification.description}</p>

                            <p>
                                {qualification.firstname}{" "}
                                {qualification.lastname}
                            </p>

                        </div>

                        {/* Only Admins see Edit and Delete buttons. */}
                        {isAdmin && (
                            <div className="education-actions">

                                <button
                                    type="button"
                                    onClick={() => handleEdit(qualification)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(qualification._id)}
                                >
                                    Delete
                                </button>

                            </div>
                        )}

                    </article>
                ))}

                {/* My upgrading classes */}
                <article className="education-card">

                    <div className="education-year">
                        2022 - 2024
                    </div>

                    <div className="education-info">

                        <h2>Upgrading classes</h2>

                        <p>
                            Spent this time upgrading my knowledge so that I
                            could go back to school and begin my Software
                            Engineering Technician program.
                        </p>

                    </div>

                </article>

                {/* Current program information */}
                <article className="education-card">

                    <div className="education-year">
                        2024 - Present
                    </div>

                    <div className="education-info">

                        <h2>Centennial College</h2>

                        <h3>Software Engineering Technician</h3>

                        <p>
                            Currently developing skills in programming,
                            database, web development, and software design
                            through hands-on coursework and projects.
                        </p>

                    </div>

                </article>

                {/* Other professional details */}
                <article className="education-card">

                    <div className="education-year">

                        <h2>Professional Development</h2>

                        <p>
                            Continuing to develop technical skills through
                            programming projects, database development,
                            software requirements analysis, and independent
                            learning.
                        </p>

                    </div>

                </article>

            </section>
        </PageContainer>
    );
}
