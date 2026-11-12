/**
 * JobsPipe API Client
 * Based on JobsPipe OpenAPI spec v1.0.0
 */

export interface JobsPipeJob {
  id: string | number
  job_title: string
  normalized_title: string | null
  company: string
  company_domain: string | null
  employer_type: string
  location: string | null
  country_code: string | null
  city: string | null
  region: string | null
  remote: boolean
  seniority: string | null
  occupation_code: string | null
  isic_division: string | null
  min_annual_salary_usd: number | null
  max_annual_salary_usd: number | null
  date_posted: string | null
  discovered_at: string | null
  source_provider: string | null
  source_url: string | null
  url: string
  skills: string[]
  description: string | null
}

export interface JobSearchRequest {
  job_title_or?: string[]
  company_domain_or?: string[]
  company_or?: string[]
  job_country_code_or?: string[]
  remote?: boolean
  seniority_or?: string[]
  limit?: number
  offset?: number
}

export interface JobSearchResponse {
  results: JobsPipeJob[]
  total: number
  limit: number
  offset: number
  took_ms: number
}

export interface CompanyHiringProfile {
  company_domain: string
  open_roles_count: number
  departments: string[]
  seniorities: string[]
  countries: string[]
  remote_count: number
  latest_job_posted_at: string | null
  jobspipe_url: string
}

export class JobsPipeClient {
  private apiKey: string
  private baseUrl = "https://api.jobspipe.dev"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `JobsPipe API error (${response.status}): ${errorText}`
      )
    }

    return response.json()
  }

  async searchJobs(params: JobSearchRequest): Promise<JobSearchResponse> {
    return this.request<JobSearchResponse>("/v1/jobs/search", {
      method: "POST",
      body: JSON.stringify(params),
    })
  }

  async getCompanyHiringProfile(
    domain: string
  ): Promise<CompanyHiringProfile> {
    const response = await this.searchJobs({
      company_domain_or: [domain],
      limit: 100,
    })

    if (response.total === 0) {
      throw new Error("No open roles found for this company")
    }

    const departments = new Set<string>()
    const seniorities = new Set<string>()
    const countries = new Set<string>()
    let remoteCount = 0
    let latestPostedAt: string | null = null

    for (const job of response.results) {
      if (job.occupation_code) {
        departments.add(job.occupation_code)
      }
      if (job.seniority) {
        seniorities.add(job.seniority)
      }
      if (job.country_code) {
        countries.add(job.country_code)
      }
      if (job.remote) {
        remoteCount++
      }
      if (job.date_posted) {
        if (!latestPostedAt || job.date_posted > latestPostedAt) {
          latestPostedAt = job.date_posted
        }
      }
    }

    return {
      company_domain: domain,
      open_roles_count: response.total,
      departments: Array.from(departments),
      seniorities: Array.from(seniorities),
      countries: Array.from(countries),
      remote_count: remoteCount,
      latest_job_posted_at: latestPostedAt,
      jobspipe_url: `https://jobspipe.dev/companies/${domain}`,
    }
  }
}
