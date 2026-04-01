import { api } from './api'

export async function generateTestCases(params) {
  return api.post('/api/v1/generate', {
    featureDescription: params.description,
    framework:          params.framework   || 'junit5',
    outputFormat:       params.format      || 'CODE',
    coverageType:       params.coverage    || 'ALL',
    uiLanguage:         params.language    || 'en',
    projectId:          params.projectId   || null,
  })
}

export async function getHistory(page = 0, size = 20) {
  return api.get(`/api/v1/generate/history?page=${page}&size=${size}`)
}
