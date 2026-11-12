import { Extensions, alert, runQuery, showToast } from "attio/client"

import enrichCompanyWithJobsPipe from "./enrich-company.server"
import getCompanyDomainQuery from "./get-company-domain.graphql"

export default Extensions.defineExtension({
  type: "record-action",
  id: "enrich-with-jobspipe",
  label: "Enrich with JobsPipe",
  objects: "companies",
  onTrigger: async ({ recordId }) => {
    const { hideToast } = await showToast({
      title: "Enriching company with JobsPipe data...",
      variant: "neutral",
    })

    try {
      const { company } = (await runQuery(getCompanyDomainQuery, {
        recordId,
      })) as {
        company?: { domains?: string[] }
      }

      if (!company?.domains?.[0]) {
        await hideToast()
        await alert({
          title: "No domain found",
          text: "This company record doesn't have a domain. Please add one and try again.",
        })
        return
      }

      const domain = company.domains[0]
      const result = await enrichCompanyWithJobsPipe(recordId, domain)

      await hideToast()
      await showToast({
        title: `Enriched with ${result.openRolesCount} open roles`,
        variant: "success",
      })
    } catch (error) {
      await hideToast()
      await alert({
        title: "Enrichment failed",
        text:
          error instanceof Error
            ? error.message
            : "Failed to fetch hiring data from JobsPipe",
      })
    }
  },
})
