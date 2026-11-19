
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

export default function AdminContacts() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        contactNumber: "",
        email: "",
        message: "",
    });

    // GET: Load contacts (Admin only).
    useEffect(() => {
        if (!user || !token) {
            navigate("/signin");
            return;
        }

        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        async function fetchContacts() {
            try {
                const response = await fetch(
                    `${API_URL}/api/contacts`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load contacts."
                    );
                }

                setContacts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, [user, token, navigate]);

    // Handle changes in the edit form.
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // Load selected contact into the form.
    function handleEdit(contact) {
        setEditingId(contact._id);

        setFormData({
            firstname: contact.firstname,
            lastname: contact.lastname,
            contactNumber: contact.contactNumber,
            email: contact.email,
            message: contact.message,
        });
    }

    // PUT: Update contact.
    async function handleUpdate(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/contacts/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const updatedContact = await response.json();

            if (!response.ok) {
                throw new Error(
                    updatedContact.message || "Unable to update contact."
                );
            }

            setContacts(
                contacts.map((contact) =>
                    contact._id === editingId
                        ? updatedContact
                        : contact
                )
            );

            setEditingId(null);
            alert("Contact updated successfully!");
        } catch (error) {
            alert(error.message);
        }
    }

    // DELETE: Remove contact.
    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete contact."
                );
            }

            setContacts(
                contacts.filter((contact) => contact._id !== id)
            );

            alert("Contact deleted successfully!");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <PageContainer>
            <section className="admin-contacts">
                <h1>Manage Contact Messages</h1>

                {loading && <p>Loading contacts...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && contacts.length === 0 && (
                    <p>No contact messages found.</p>
                )}

                {!loading && !error && contacts.map((contact) => (
                    <div className="contact-card" key={contact._id}>
                        <h2>
                            {contact.firstname} {contact.lastname}
                        </h2>

                        <p><strong>Email:</strong> {contact.email}</p>
                        <p><strong>Phone:</strong> {contact.contactNumber}</p>
                        <p><strong>Message:</strong> {contact.message}</p>

                        <button onClick={() => handleEdit(contact)}>
                            Edit
                        </button>

                        <button onClick={() => handleDelete(contact._id)}>
                            Delete
                        </button>

                        {editingId === contact._id && (
                            <form onSubmit={handleUpdate}>
                                <h3>Edit Contact</h3>

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

                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
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

                                <label>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />

                                <button type="submit">
                                    Update Contact
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </section>
        </PageContainer>
    );
}
