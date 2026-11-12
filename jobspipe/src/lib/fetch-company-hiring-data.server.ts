import { Settings } from "attio/server"

import { JobsPipeClient } from "./jobspipe-client"
import settingsSchema from "../app/settings/schema"

export interface CompanyHiringData {
  openRolesCount: number
  departments: string[]
  seniorities: string[]
  countries: string[]
  remoteCount: number
  latestJobPostedAt: string | null
  jobspipeUrl: string
  jobs: Array<{
    id: string
    title: string
    location: string | null
    remote: boolean
    seniority: string | null
    postedAt: string | null
    url: string
  }>
}

export default async function fetchCompanyHiringData(
  companyDomain: string
): Promise<CompanyHiringData> {
  const apiKey = await Settings.getSettings(settingsSchema, "jobspipe_api_key")

  if (!apiKey) {
    throw new Error(
      "JobsPipe API key not configured. Please add it in workspace settings."
    )
  }

  const client = new JobsPipeClient(apiKey)

  const profile = await client.getCompanyHiringProfile(companyDomain)

  const jobsResponse = await client.searchJobs({
    company_domain_or: [companyDomain],
    limit: 50,
  })

  return {
    openRolesCount: profile.open_roles_count,
    departments: profile.departments,
    seniorities: profile.seniorities,
    countries: profile.countries,
    remoteCount: profile.remote_count,
    latestJobPostedAt: profile.latest_job_posted_at,
    jobspipeUrl: profile.jobspipe_url,
    jobs: jobsResponse.results.map((job) => ({
      id: String(job.id),
      title: job.job_title,
      location: job.location,
      remote: job.remote,
      seniority: job.seniority,
      postedAt: job.date_posted,
      url: job.url,
    })),
  }
}
