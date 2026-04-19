import { useState, useMemo, useEffect } from 'react'
import TopBar from './components/TopBar'
import CategorySection from './components/CategorySection'
import AddLinkModal from './components/AddLinkModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import useLinks from './hooks/useLinks'
import './styles/index.css'

// Category sort order (anything not listed goes to the end alphabetically)
const CATEGORY_ORDER = ['Anime', 'Movies', 'Books', 'Comics', 'Design', 'Tools', 'Personal']

function sortCategories(entries) {
  return entries.sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

export default function App() {
  const { links, addLink, editLink, deleteLink } = useLinks()

  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('plh_theme') || 'dark')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem('plh_theme', theme)
  }, [theme])

  // Filter links
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links
    const q = searchQuery.toLowerCase()
    return links.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    )
  }, [links, searchQuery])

  // Group by category
  const grouped = useMemo(() => {
    const map = filteredLinks.reduce((acc, link) => {
      const cat = link.category?.trim() || 'Uncategorized'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(link)
      return acc
    }, {})
    return sortCategories(Object.entries(map))
  }, [filteredLinks])

  const openAdd = () => {
    setEditTarget(null)
    setAddModalOpen(true)
  }

  const openEdit = (link) => {
    setEditTarget(link)
    setAddModalOpen(true)
  }

  const handleSave = (data) => {
    if (editTarget) {
      editLink(editTarget.id, data)
      setEditTarget(null)
    } else {
      addLink(data)
    }
    setAddModalOpen(false)
  }

  const handleConfirmDelete = () => {
    deleteLink(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className={`app-root ${theme}`}>
      {/* Pixel corner decorations */}
      <PixelCorner className="pixel-corner pixel-corner-tl" />
      <PixelCorner className="pixel-corner pixel-corner-br" />

      <TopBar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        totalLinks={links.length}
      />

      <main className="main-content">
        {grouped.length === 0 ? (
          <div className="empty-state">
            <div className="empty-pixel">□</div>
            <p className="empty-text">
              {searchQuery ? 'No links match your search.' : 'No links yet. Add your first one!'}
            </p>
          </div>
        ) : (
          grouped.map(([category, catLinks]) => (
            <CategorySection
              key={category}
              category={category}
              links={catLinks}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </main>

      {/* Floating Add Button */}
      <button className="add-fab" onClick={openAdd} title="Add new link" aria-label="Add new link">
        +
      </button>

      {/* Modals */}
      {addModalOpen && (
        <AddLinkModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setAddModalOpen(false); setEditTarget(null) }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          link={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// Small SVG pixel-art corner decoration
function PixelCorner({ className }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0,10,20,30,40,50,60,70,80,90,100,110].map(x =>
        [0,10,20,30,40,50,60,70,80,90,100,110].map(y => {
          const d = Math.sqrt(x * x + y * y)
          if (d > 115) return null
          if ((x + y) % 20 !== 0) return null
          return (
            <rect
              key={`${x}-${y}`}
              x={x + 1}
              y={y + 1}
              width="8"
              height="8"
              fill="var(--cyan)"
              opacity={Math.max(0, 1 - d / 120)}
            />
          )
        })
      )}
    </svg>
  )
}
