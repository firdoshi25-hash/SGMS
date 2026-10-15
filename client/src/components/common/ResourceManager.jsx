import { useEffect, useState } from "react";
import { api } from "../../services/api";

function initialValues(fields, item) {
  return Object.fromEntries(fields.map((field) => {
    const value = item?.[field.name] ?? field.defaultValue ?? "";
    if (field.type === "tags" && Array.isArray(value)) return [field.name, value.join(", ")];
    if (field.type === "date" && value) return [field.name, String(value).slice(0, 10)];
    return [field.name, value];
  }));
}

function displayValue(field, value) {
  if (value === null || value === undefined || value === "") return "Not set";
  if (field.type === "date") return new Date(value).toLocaleDateString();
  if (Array.isArray(value)) return value.join(", ") || "None";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (field.type === "url") return value;
  return String(value);
}

function ResourceManager({ title, description, endpoint, fields, emptyMessage, readOnly = false, onChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState(() => initialValues(fields));

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get(`/${endpoint}`)
      .then(({ items: records }) => { if (active) setItems(records); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [endpoint]);

  function openForm(item = null) {
    setEditing(item);
    setValues(initialValues(fields, item));
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    setEditing(null);
    setFormOpen(false);
    setValues(initialValues(fields));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = Object.fromEntries(fields.map((field) => {
      let value = values[field.name];
      if (field.type === "number") value = value === "" ? undefined : Number(value);
      if (field.type === "tags") value = String(value).split(",").map((tag) => tag.trim()).filter(Boolean);
      if (field.type === "date" && value === "") value = undefined;
      return [field.name, value];
    }).filter(([, value]) => value !== undefined));

    try {
      const response = editing
        ? await api.patch(`/${endpoint}/${editing._id}`, payload)
        : await api.post(`/${endpoint}`, payload);
      setItems((previous) => editing
        ? previous.map((item) => item._id === response.item._id ? response.item : item)
        : [response.item, ...previous]);
      setNotice(editing ? "Changes saved." : "Record created.");
      closeForm();
      onChange?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete “${item[fields[0].name]}”? This cannot be undone.`)) return;
    setError("");
    try {
      await api.delete(`/${endpoint}/${item._id}`);
      setItems((previous) => previous.filter((record) => record._id !== item._id));
      setNotice("Record deleted.");
      onChange?.();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="resource-page">
      <div className="page-heading">
        <div><h1>{title}</h1><p>{description}</p></div>
        {!readOnly && <button className="primary-button" type="button" onClick={() => openForm()}>Add {title.replace(/s$/, "")}</button>}
      </div>
      {error && <div className="state-message error" role="alert">{error}</div>}
      {notice && <div className="state-message success" role="status">{notice}</div>}
      {loading ? <div className="state-message">Loading {title.toLowerCase()}...</div> : null}
      {!loading && !error && items.length === 0 && <div className="state-message">{emptyMessage || `No ${title.toLowerCase()} yet. Add one to get started.`}</div>}
      {!loading && items.length > 0 && (
        <div className="resource-list">
          {items.map((item) => (
            <article className="resource-item" key={item._id}>
              <div className="resource-copy">
                <h2>{item[fields[0].name] || title}</h2>
                {fields.slice(1).map((field) => {
                  const value = item[field.name];
                  if (value === undefined || value === "") return null;
                  return (
                    <p className="resource-detail" key={field.name}>
                      <strong>{field.label}:</strong> {field.type === "status" ? <span className={`status-label ${String(value).toLowerCase()}`}>{displayValue(field, value)}</span> : displayValue(field, value)}
                    </p>
                  );
                })}
                <small className="resource-created">Added {new Date(item.createdAt).toLocaleDateString()}</small>
              </div>
              {!readOnly && <div className="resource-actions">
                <button className="secondary-button" type="button" onClick={() => openForm(item)}>Edit</button>
                <button className="danger-button" type="button" onClick={() => remove(item)}>Delete</button>
              </div>}
            </article>
          ))}
        </div>
      )}
      {formOpen && (
        <div className="form-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <form className="resource-form" role="dialog" aria-modal="true" aria-labelledby="resource-form-title" onSubmit={save}>
            <h2 id="resource-form-title">{editing ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}</h2>
            {fields.map((field) => (
              <label key={field.name}>
                {field.label}
                {field.readOnly ? (
                  <span className="status-label pending">{displayValue(field, values[field.name])}</span>
                ) : field.type === "textarea" ? (
                  <textarea name={field.name} value={values[field.name] ?? ""} required={field.required} maxLength={field.maxLength} onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.value }))} />
                ) : field.type === "select" || field.type === "status" ? (
                  <select name={field.name} value={values[field.name] ?? ""} required={field.required} onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.value }))}>
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input name={field.name} type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.checked }))} />
                ) : (
                  <input name={field.name} type={field.type === "tags" ? "text" : field.type || "text"} value={values[field.name] ?? ""} required={field.required} min={field.min} max={field.max} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.value }))} />
                )}
              </label>
            ))}
            {error && <div className="state-message error" role="alert">{error}</div>}
            <div className="resource-form-actions">
              <button className="secondary-button" type="button" onClick={closeForm}>Cancel</button>
              <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ResourceManager;