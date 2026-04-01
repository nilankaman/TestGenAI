import { api } from './api'

export function getProjects()         { return api.get('/api/v1/projects') }
export function createProject(data)   { return api.post('/api/v1/projects', data) }
export function deleteProject(id)     { return api.delete(`/api/v1/projects/${id}`) }
