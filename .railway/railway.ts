import { defineRailway, github, project, service } from 'railway/iac'

// This repository owns only the client in the shared Seoulful project.
export const partial = 'seoulful-client'

export default defineRailway(() => {
  const commitSha = process.env.SEOULFUL_RELEASE_SHA
  if (!commitSha || !/^[a-f0-9]{40}$/.test(commitSha)) {
    throw new Error('Set SEOULFUL_RELEASE_SHA to the full commit SHA of a published release tag')
  }

  const client = service('seoulful-client', {
    source: github('hjpark625/seoulful-client', { branch: 'main', commitSha, checkSuites: false }),
    build: { builder: 'DOCKERFILE', dockerfilePath: 'Dockerfile', buildEnvironment: 'V3' },
    start: 'node server.js',
    healthcheck: '/api/health',
    healthcheckTimeout: 120,
    replicas: { 'asia-southeast1-eqsg3a': 1 },
    deploy: { restartPolicyType: 'ON_FAILURE', restartPolicyMaxRetries: 10 },
    domains: [{ domain: 'seoulful.hjpark625.site', port: 8080 }],
  })

  // CLI variable ownership is not yet included in railway@3.16.0's types.
  const definition = { variables: { managed: false }, resources: [client] }
  return project('seoulful', definition)
})
