/**
 * Ensures JobsPipe custom attributes exist on the Companies object
 * Creates them automatically if they don't exist
 */

const JOBSPIPE_ATTRIBUTES = [
  {
    title: "JobsPipe Open Roles",
    api_slug: "jobspipe_open_roles",
    type: "number" as const,
    description: "Number of open job postings from JobsPipe",
  },
  {
    title: "JobsPipe Departments",
    api_slug: "jobspipe_departments",
    type: "text" as const,
    description: "Departments currently hiring (from JobsPipe)",
  },
  {
    title: "JobsPipe Latest Job Posted",
    api_slug: "jobspipe_latest_job_posted",
    type: "date" as const,
    description: "Date of the most recent job posting (from JobsPipe)",
  },
  {
    title: "JobsPipe URL",
    api_slug: "jobspipe_url",
    type: "text" as const,
    description: "Link to full hiring profile on JobsPipe",
  },
]

interface AttributeResponse {
  data?: {
    id?: {
      attribute_id?: string
    }
  }
}

export default async function ensureJobsPipeAttributes(): Promise<void> {
  const ATTIO_API_TOKEN = process.env.ATTIO_API_TOKEN

  if (!ATTIO_API_TOKEN) {
    throw new Error("ATTIO_API_TOKEN not available")
  }

  const existingAttributes = await fetch(
    "https://api.attio.com/v2/objects/companies/attributes",
    {
      headers: {
        Authorization: `Bearer ${ATTIO_API_TOKEN}`,
      },
    }
  )

  if (!existingAttributes.ok) {
    console.error(
      "Failed to fetch existing attributes:",
      await existingAttributes.text()
    )
    return
  }

  const existingData = (await existingAttributes.json()) as {
    data?: Array<{ api_slug?: string }>
  }
  const existingSlugs = new Set(
    (existingData.data || []).map((attr) => attr.api_slug)
  )

  for (const attribute of JOBSPIPE_ATTRIBUTES) {
    if (existingSlugs.has(attribute.api_slug)) {
      console.log(
        `Attribute ${attribute.api_slug} already exists, skipping creation`
      )
      continue
    }

    const response = await fetch(
      "https://api.attio.com/v2/objects/companies/attributes",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ATTIO_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title: attribute.title,
            api_slug: attribute.api_slug,
            type: attribute.type,
            description: attribute.description,
            is_required: false,
          },
        }),
      }
    )

    if (response.ok) {
      const data = (await response.json()) as AttributeResponse
      console.log(
        `Created attribute: ${attribute.api_slug} (${data.data?.id?.attribute_id})`
      )
    } else {
      const errorText = await response.text()
      console.error(
        `Failed to create attribute ${attribute.api_slug}:`,
        response.status,
        errorText
      )
    }
  }
}
