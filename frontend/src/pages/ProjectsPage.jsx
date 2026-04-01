import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { getProjects, createProject, deleteProject } from '@/services/projectService'
import styles from './ProjectsPage.module.css'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ name: '', description: '', defaultFramework: 'junit5' })

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(Array.isArray(data) ? data : [])
    } catch { /* no history yet */ }
    finally { setLoading(false) }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      await createProject(form)
      toast.success('Project created.')
      setShowForm(false)
      setForm({ name: '', description: '', defaultFramework: 'junit5' })
      fetchProjects()
    } catch (err) {
      toast.error(err.message || 'Failed to create project.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('projects.confirmDelete'))) return
    try {
      await deleteProject(id)
      setProjects(p => p.filter(x => x.id !== id))
      toast.success('Project deleted.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete project.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t('projects.title')}</h1>
          <p className={styles.pageSub}>{t('projects.subtitle')}</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(v => !v)}>
          + {t('projects.newProject')}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleCreate}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>{t('projects.name')}</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Login Feature Tests"
                required
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>{t('projects.framework')}</label>
              <select
                className={styles.select}
                value={form.defaultFramework}
                onChange={e => setForm(f => ({ ...f, defaultFramework: e.target.value }))}
              >
                {['junit5','pytest','jest','cypress','restassured','appium','rspec'].map(fw => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>{t('projects.description')}</label>
            <input
              className={styles.input}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description..."
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>
              {t('projects.cancel')}
            </button>
            <button type="submit" className={styles.createBtn}>
              {t('projects.create')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}><span className={styles.spinner} /></div>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>📂</span>
          <p>{t('projects.empty')}</p>
          <p className={styles.emptySub}>{t('projects.emptySub')}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map(p => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p.id)}
                  aria-label={`Delete ${p.name}`}
                >✕</button>
              </div>
              {p.description && <p className={styles.cardDesc}>{p.description}</p>}
              <div className={styles.cardMeta}>
                <span className={styles.fwBadge}>{p.defaultFramework}</span>
                <span className={styles.cardDate}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
