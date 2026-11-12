import ensureJobsPipeAttributes from "../../../lib/ensure-attributes.server"
import fetchCompanyHiringData from "../../../lib/fetch-company-hiring-data.server"

interface EnrichmentResult {
  openRolesCount: number
  departments: string[]
  latestJobPostedAt: string | null
  jobspipeUrl: string
}

export default async function enrichCompanyWithJobsPipe(
  recordId: string,
  companyDomain: string
): Promise<EnrichmentResult> {
  await ensureJobsPipeAttributes()

  const hiringData = await fetchCompanyHiringData(companyDomain)

  const ATTIO_API_TOKEN = process.env.ATTIO_API_TOKEN

  if (!ATTIO_API_TOKEN) {
    throw new Error("ATTIO_API_TOKEN not available")
  }

  await fetch(`https://api.attio.com/v2/objects/companies/records/${recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${ATTIO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        values: {
          jobspipe_open_roles: hiringData.openRolesCount,
          jobspipe_departments: hiringData.departments.join(", "),
          jobspipe_latest_job_posted: hiringData.latestJobPostedAt,
          jobspipe_url: hiringData.jobspipeUrl,
        },
      },
    }),
  })

  return {
    openRolesCount: hiringData.openRolesCount,
    departments: hiringData.departments,
    latestJobPostedAt: hiringData.latestJobPostedAt,
    jobspipeUrl: hiringData.jobspipeUrl,
  }
}
