"use client";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import "@/styles/admin.css";

// ── API helpers (Next.js Route Handlers; auth via session cookie) ──
const getMenu = () => fetch("/api/menu").then((r) => r.json());

const saveMenu = async (menu) => {
  // Strip large base64 images to avoid 413 Content Too Large error
  // The API will preserve existing images automatically
  const menuWithoutImages = {
    ...menu,
    sections: menu.sections.map((s) => ({
      ...s,
      items: s.items.map((it) => ({
        ...it,
        img: it.img && it.img.startsWith("data:") ? "" : it.img, // Keep external URLs, strip base64
      })),
    })),
  };

  const res = await fetch("/api/menu", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuWithoutImages),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Save failed: ${res.status}`);
  return data;
};

// Multipart upload (replaces the old base64 JSON upload).
const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Image upload failed.");
  return data.url;
};

// ── helpers ────────────────────────────────────────────────
const blankItem = () => ({
  name: "", desc: "", price: "", img: "", spicy: false, vegan: false, label: null, chefPick: false,
});

const blankSection = (title = "") => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ("cat-" + Date.now().toString(36)),
  icon: "fas fa-utensils",
  title,
  subtitle: "",
  note: null,
  items: [],
  tab: title,
});

const PRESETS = {
  popular: { title: "Popular", tab: "Popular", icon: "fas fa-fire-flame-curved", subtitle: "Our guests' all-time favourites" },
  chef:    { title: "Chef's Special", tab: "Chef's Special", icon: "fas fa-crown", subtitle: "Exclusive creations from our executive chef" },
};

// ============================================================
//  IMAGE FIELD  (upload from device OR paste a URL)
// ============================================================
function ImageField({ currentSrc, onFileSelected, onUrlChange }) {
  const fileRef = useRef(null);
  const [showUrl, setShowUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(currentSrc || "");

  useEffect(() => {
    setUrlDraft(currentSrc || "");
    setShowUrl(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    onFileSelected(file, localUrl);
    setShowUrl(false);
    e.target.value = "";
  };

  const applyUrl = () => {
    onUrlChange(urlDraft.trim());
    setShowUrl(false);
  };

  return (
    <div className="admin-image-field">
      <span className="admin-field-label">Image</span>

      {currentSrc
        ? <img src={currentSrc} className="admin-img-preview" alt="preview" />
        : (
          <div className="admin-img-placeholder">
            <i className="fas fa-image" /> No image yet
          </div>
        )}

      <div className="admin-img-btns">
        <button type="button" className="admin-btn sm" onClick={() => fileRef.current?.click()}>
          📁 Upload from device
        </button>
        <button type="button" className="admin-btn sm" onClick={() => setShowUrl((v) => !v)}>
          🔗 {showUrl ? "Hide URL" : "Use image URL"}
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      {showUrl && (
        <div className="admin-url-row">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
          />
          <button type="button" className="admin-btn sm gold" onClick={applyUrl}>Apply</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  ITEM FORM  (add new or edit existing)
// ============================================================
function ItemForm({ initial, onSave, onCancel, uploading }) {
  const [draft, setDraft] = useState({ ...blankItem(), ...(initial || {}) });
  const [imgSrc, setImgSrc] = useState(initial?.img || "");
  const [pendingFile, setPendingFile] = useState(null);

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const handleFileSelected = (file, localUrl) => {
    setPendingFile(file);
    setImgSrc(localUrl);
  };

  const handleUrlChange = (url) => {
    setPendingFile(null);
    setImgSrc(url);
    set("img", url);
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      alert("Please enter an item name.");
      return;
    }
    onSave({ ...draft, img: imgSrc }, pendingFile);
  };

  return (
    <div>
      <div className="admin-item-form-grid">
        <div className="admin-field">
          <label>Name *</label>
          <input value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Chicken Tikka" autoFocus />
        </div>
        <div className="admin-field">
          <label>Price</label>
          <input value={draft.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. $16.95" />
        </div>
        <div className="admin-field full">
          <label>Description</label>
          <textarea value={draft.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Describe the dish…" />
        </div>
        <div className="admin-field full">
          <label>Label <span style={{ textTransform: "none", fontSize: ".7rem" }}>(optional — e.g. &quot;Carrot Pudding&quot;)</span></label>
          <input value={draft.label || ""} onChange={(e) => set("label", e.target.value || null)} placeholder="Shown in brackets next to name" />
        </div>
      </div>

      <ImageField currentSrc={imgSrc} onFileSelected={handleFileSelected} onUrlChange={handleUrlChange} />

      <div className="admin-form-foot">
        <div className="admin-checks">
          <label className="admin-check">
            <input type="checkbox" checked={draft.spicy} onChange={(e) => set("spicy", e.target.checked)} />
            🌶️ Spicy
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={draft.vegan} onChange={(e) => set("vegan", e.target.checked)} />
            🌿 Vegan
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={draft.chefPick || false} onChange={(e) => set("chefPick", e.target.checked)} />
            👨‍🍳 Chef's Pick
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="admin-btn gold" onClick={handleSave} disabled={uploading}>
            {uploading ? "Uploading image…" : "💾 Save item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  ITEM CARD
// ============================================================
function ItemCard({ item, sections, sectionId, onEdit, onDelete, onMove }) {
  const handleMove = (e) => {
    const targetId = e.target.value;
    if (targetId) onMove(targetId);
    e.target.value = "";
  };

  return (
    <div className="admin-item-card">
      <div className="admin-card-thumb">
        {item.img
          ? <img src={item.img} alt={item.name} />
          : <i className="fas fa-utensils" />}
      </div>

      <div className="admin-card-body">
        <div className="admin-card-top">
          <span className="admin-card-name">{item.name}</span>
          {item.price && <span className="admin-card-price">{item.price}</span>}
        </div>
        {item.desc && <div className="admin-card-desc">{item.desc}</div>}
        <div className="admin-card-badges">
          {item.chefPick && <span className="badge" style={{ background: "rgba(212,175,55,.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,.3)" }}>👨‍🍳 Chef's Pick</span>}
          {item.spicy && <span className="badge spicy">🌶️ Spicy</span>}
          {item.vegan && <span className="badge vegan">🌿 Vegan</span>}
          {item.label && <span className="badge label-b">{item.label}</span>}
        </div>
      </div>

      <div className="admin-card-actions">
        <button className="admin-btn sm" onClick={onEdit}>✏️ Edit</button>
        <select className="admin-move-select" defaultValue="" onChange={handleMove} title="Move to another category">
          <option value="" disabled>Move to…</option>
          {sections.filter((s) => s.id !== sectionId).map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <button className="admin-btn sm danger" onClick={onDelete}>🗑️ Delete</button>
      </div>
    </div>
  );
}

// ============================================================
//  CATEGORY SETTINGS
// ============================================================
function CategorySettings({ section, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ ...section });

  useEffect(() => { setDraft({ ...section }); setOpen(false); }, [section.id]); // eslint-disable-line

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const handleApply = () => {
    if (!draft.title.trim()) { alert("Category title is required."); return; }
    if (!draft.id.trim())    { alert("Category ID is required.");    return; }
    onUpdate(draft);
    setOpen(false);
  };

  return (
    <div className="admin-cat-settings">
      <button type="button" className="admin-cat-settings-toggle" onClick={() => setOpen((v) => !v)}>
        ⚙️ {open ? "Hide" : "Edit"} category settings
      </button>

      {open && (
        <div className="admin-cat-settings-form">
          <div className="admin-cat-settings-grid">
            <div className="admin-field">
              <label>Title *</label>
              <input value={draft.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Tab label</label>
              <input value={draft.tab} onChange={(e) => set("tab", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Icon class</label>
              <input value={draft.icon} onChange={(e) => set("icon", e.target.value)} placeholder="fas fa-utensils" />
            </div>
            <div className="admin-field">
              <label>URL ID</label>
              <input value={draft.id} onChange={(e) => set("id", e.target.value)} />
            </div>
            <div className="admin-field full">
              <label>Subtitle</label>
              <input value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </div>
            <div className="admin-field full">
              <label>Note <span style={{ textTransform: "none", fontSize: ".7rem" }}>(optional, shown under the heading on the menu)</span></label>
              <input value={draft.note || ""} onChange={(e) => set("note", e.target.value || null)} />
            </div>
          </div>

          <div className="admin-cat-settings-foot">
            <div className="danger-side">
              <button type="button" className="admin-btn danger" onClick={onDelete}>🗑️ Delete this category</button>
            </div>
            <button type="button" className="admin-btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="admin-btn gold" onClick={handleApply}>Apply changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  ITEM PANEL
// ============================================================
function ItemPanel({
  section, sections, editingItemIdx, setEditingItemIdx,
  onSaveItem, onDeleteItem, onMoveItem, onUpdateSection, onDeleteCategory,
  uploading,
}) {
  const isAddingNew = editingItemIdx === -1;

  return (
    <div>
      <div className="admin-panel-head">
        <div className="admin-panel-head-left">
          <i className={section.icon} />
          <div>
            <div className="admin-panel-title">{section.title}</div>
            {section.subtitle && <div className="admin-panel-subtitle">{section.subtitle}</div>}
          </div>
        </div>
        <button
          className="admin-btn gold"
          onClick={() => setEditingItemIdx(-1)}
          disabled={isAddingNew}
        >
          + Add new item
        </button>
      </div>

      <CategorySettings section={section} onUpdate={onUpdateSection} onDelete={onDeleteCategory} />

      {isAddingNew && (
        <div className="admin-new-item-wrap">
          <div className="admin-form-header">New Item</div>
          <ItemForm
            initial={blankItem()}
            onSave={(draft, file) => onSaveItem(draft, file, -1)}
            onCancel={() => setEditingItemIdx(null)}
            uploading={uploading}
          />
        </div>
      )}

      <div className="admin-items-list">
        {section.items.length === 0 && !isAddingNew && (
          <div className="admin-empty-items">
            No items yet — click <strong>+ Add new item</strong> above to get started.
          </div>
        )}

        {section.items.map((item, iIdx) => (
          <div key={iIdx} className="admin-item-wrap">
            {editingItemIdx === iIdx ? (
              <div className="admin-edit-wrap">
                <div className="admin-form-header">Editing: {item.name}</div>
                <ItemForm
                  initial={item}
                  onSave={(draft, file) => onSaveItem(draft, file, iIdx)}
                  onCancel={() => setEditingItemIdx(null)}
                  uploading={uploading}
                />
              </div>
            ) : (
              <ItemCard
                item={item}
                sections={sections}
                sectionId={section.id}
                onEdit={() => setEditingItemIdx(iIdx)}
                onDelete={() => onDeleteItem(iIdx)}
                onMove={(targetId) => onMoveItem(iIdx, targetId)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  CATEGORY SIDEBAR
// ============================================================
function CategorySidebar({ sections, activeSectionId, onSelect, onAddCategory }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(blankSection());

  const resetDraft = () => setDraft(blankSection());

  const applyPreset = (key) => {
    const p = PRESETS[key];
    const id = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    setDraft((d) => ({ ...d, ...p, id }));
  };

  const handleAdd = () => {
    if (!draft.title.trim()) { alert("Please enter a category name."); return; }
    const id = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    const newSection = { ...draft, id, tab: draft.tab || draft.title };
    onAddCategory(newSection);
    resetDraft();
    setAdding(false);
  };

  const cancel = () => { resetDraft(); setAdding(false); };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        Categories
        {!adding && (
          <button
            className="admin-sidebar-add-btn"
            onClick={() => setAdding(true)}
            title="Add category"
          >+</button>
        )}
      </div>

      <ul className="admin-cat-list">
        {sections.map((s) => (
          <li
            key={s.id}
            className={`admin-cat-item${s.id === activeSectionId ? " active" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <i className={s.icon} />
            <div className="admin-cat-item-text">
              <span className="admin-cat-item-name">{s.title}</span>
              <span className="admin-cat-item-count">{s.items.length} item{s.items.length !== 1 ? "s" : ""}</span>
            </div>
          </li>
        ))}
      </ul>

      {adding && (
        <div className="admin-add-cat-form">
          <div className="admin-field">
            <label>Category name *</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Popular"
              autoFocus
            />
          </div>
          <div className="admin-field" style={{ marginTop: ".5rem" }}>
            <label>Subtitle</label>
            <input
              value={draft.subtitle}
              onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
              placeholder="Short description"
            />
          </div>

          <div className="admin-add-cat-presets">
            <span>Quick-fill:</span>
            <button type="button" onClick={() => applyPreset("popular")}>⭐ Popular</button>
            <button type="button" onClick={() => applyPreset("chef")}>👑 Chef&apos;s Special</button>
          </div>

          <div className="admin-add-cat-actions">
            <button type="button" className="admin-btn" onClick={cancel}>Cancel</button>
            <button type="button" className="admin-btn gold" onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}
    </aside>
  );
}

// ============================================================
//  DASHBOARD (menu manager)
// ============================================================
export default function DashboardClient({ user }) {
  const [sections, setSections]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [editingItemIdx, setEditingItemIdx]   = useState(null); // null=none | -1=new | n=existing
  const [saving, setSaving]                   = useState(false);
  const [uploading, setUploading]             = useState(false);
  const [isDirty, setIsDirty]                 = useState(false);
  const [msg, setMsg]                         = useState(null);

  const firstLoad = useRef(true);

  const activeSection    = sections.find((s) => s.id === activeSectionId);
  const activeSectionIdx = sections.findIndex((s) => s.id === activeSectionId);

  useEffect(() => {
    if (firstLoad.current) { firstLoad.current = false; return; }
    setIsDirty(true);
  }, [sections]);

  useEffect(() => {
    getMenu()
      .then((d) => {
        firstLoad.current = true;
        setSections(d.sections || []);
        if (d.sections?.[0]) setActiveSectionId(d.sections[0].id);
      })
      .catch((e) => setMsg({ type: "err", text: "Could not load menu: " + e.message }))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => signOut({ callbackUrl: "/login" });

  // ── Item actions ────────────────────────────────────────
  const saveItem = async (draft, pendingFile, itemIdx) => {
    setUploading(true);
    try {
      let img = draft.img;
      if (pendingFile) img = await uploadImage(pendingFile);
      const finalItem = { ...draft, img };
      setSections((prev) =>
        prev.map((s, i) => {
          if (i !== activeSectionIdx) return s;
          if (itemIdx === -1) return { ...s, items: [...s.items, finalItem] };
          return { ...s, items: s.items.map((it, j) => (j === itemIdx ? finalItem : it)) };
        })
      );
      setEditingItemIdx(null);
    } catch (e) {
      setMsg({ type: "err", text: "Image upload failed: " + e.message });
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = (iIdx) => {
    if (!window.confirm("Delete this item?")) return;
    setSections((prev) =>
      prev.map((s, i) => (i !== activeSectionIdx ? s : { ...s, items: s.items.filter((_, j) => j !== iIdx) }))
    );
    if (editingItemIdx === iIdx) setEditingItemIdx(null);
  };

  const moveItem = (iIdx, targetId) => {
    const item = activeSection.items[iIdx];
    const destTitle = sections.find((s) => s.id === targetId)?.title || targetId;
    setSections((prev) => {
      const dst = prev.findIndex((s) => s.id === targetId);
      return prev.map((s, i) => {
        if (i === activeSectionIdx) return { ...s, items: s.items.filter((_, j) => j !== iIdx) };
        if (i === dst) return { ...s, items: [...s.items, item] };
        return s;
      });
    });
    if (editingItemIdx === iIdx) setEditingItemIdx(null);
    setMsg({ type: "ok", text: `"${item.name}" moved to ${destTitle}. Hit Save to publish.` });
  };

  // ── Category actions ────────────────────────────────────
  const addCategory = (newSection) => {
    setSections((prev) => [...prev, newSection]);
    setActiveSectionId(newSection.id);
    setEditingItemIdx(null);
  };

  const updateSection = (patch) => {
    setSections((prev) => prev.map((s, i) => (i !== activeSectionIdx ? s : { ...s, ...patch })));
    if (patch.id && patch.id !== activeSectionId) setActiveSectionId(patch.id);
  };

  const deleteCategory = () => {
    if (!window.confirm(`Delete "${activeSection?.title}" and all its items? This cannot be undone.`)) return;
    const remaining = sections.filter((s) => s.id !== activeSectionId);
    setSections(remaining);
    setActiveSectionId(remaining[0]?.id || null);
    setEditingItemIdx(null);
  };

  // ── Publish ────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const r = await saveMenu({ sections });
      setMsg({ type: "ok", text: `✅ Saved! ${r.sections} categories are now live on the website.` });
      setIsDirty(false);
    } catch (e) {
      if (/unauthorized/i.test(e.message)) {
        setMsg({ type: "err", text: "Session expired — please log in again." });
        setTimeout(logout, 1500);
      } else {
        setMsg({ type: "err", text: e.message });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin">
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-topbar-title">🏔️ Menu <span className="gold">Manager</span></span>
          <span className="admin-topbar-who">Signed in as <strong>{user}</strong></span>
        </div>
        <div className="admin-topbar-right">
          {isDirty && <span className="admin-unsaved">● Unsaved changes</span>}
          <button className="admin-btn gold" onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button className="admin-btn" onClick={logout}>Log out</button>
        </div>
      </div>

      {msg && (
        <div className={`admin-toast ${msg.type}`}>
          {msg.text}
          <button onClick={() => setMsg(null)}>×</button>
        </div>
      )}

      <div className="admin-body-layout">
        {loading ? (
          <div className="admin-loading">Loading menu…</div>
        ) : (
          <>
            <CategorySidebar
              sections={sections}
              activeSectionId={activeSectionId}
              onSelect={(id) => { setActiveSectionId(id); setEditingItemIdx(null); }}
              onAddCategory={addCategory}
            />
            <main className="admin-main">
              {activeSection ? (
                <ItemPanel
                  section={activeSection}
                  sections={sections}
                  editingItemIdx={editingItemIdx}
                  setEditingItemIdx={setEditingItemIdx}
                  onSaveItem={saveItem}
                  onDeleteItem={deleteItem}
                  onMoveItem={moveItem}
                  onUpdateSection={updateSection}
                  onDeleteCategory={deleteCategory}
                  uploading={uploading}
                />
              ) : (
                <div className="admin-empty-state">
                  <p>No categories yet. Click <strong>+ Add Category</strong> in the sidebar to get started.</p>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}
