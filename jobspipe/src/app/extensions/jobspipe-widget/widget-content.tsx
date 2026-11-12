import { Badge, Link, Stack, Table, Widget, runQuery, useAsyncCache } from "attio/client"

import fetchCompanyHiringData from "../../../lib/fetch-company-hiring-data.server"
import getCompanyDomainQuery from "./get-company-domain.graphql"

interface JobsPipeWidgetContentProps {
  recordId: string
}

export const JobsPipeWidgetContent = ({
  recordId,
}: JobsPipeWidgetContentProps) => {
  const cache = useAsyncCache({
    hiringData: async () => {
      const { company } = (await runQuery(getCompanyDomainQuery, {
        recordId,
      })) as {
        company?: { domains?: string[] }
      }

      if (!company?.domains?.[0]) {
        throw new Error("No domain found for this company")
      }

      const domain = company.domains[0]
      return fetchCompanyHiringData(domain)
    },
  })

  const hiringData = cache.values.hiringData

  if (!hiringData?.openRolesCount) {
    return (
      <Widget.TextWidget>
        <Widget.Title>JobsPipe Hiring Data</Widget.Title>
        <Widget.Text.Primary>
          No domain found for this company
        </Widget.Text.Primary>
      </Widget.TextWidget>
    )
  }

  return (
    <Widget.TextWidget>
      <Widget.Title>JobsPipe Hiring Data</Widget.Title>

      <Stack direction="column" gap="medium">
        <Widget.Text.Primary>
          {hiringData.openRolesCount} open roles
        </Widget.Text.Primary>

        {hiringData.remoteCount > 0 && (
          <Badge color="blue">{hiringData.remoteCount} remote</Badge>
        )}

        {hiringData.departments && hiringData.departments.length > 0 && (
          <Stack direction="column" gap="small">
            <Widget.Text.Secondary>Departments</Widget.Text.Secondary>
            <Stack direction="row" gap="small">
              {hiringData.departments.slice(0, 5).map((dept: string) => (
                <Badge key={dept} color="blue">
                  {dept}
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}

        {hiringData.seniorities && hiringData.seniorities.length > 0 && (
          <Stack direction="column" gap="small">
            <Widget.Text.Secondary>Seniority Levels</Widget.Text.Secondary>
            <Stack direction="row" gap="small">
              {hiringData.seniorities.map((level: string) => (
                <Badge key={level} color="green">
                  {level}
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}

        <Table label="Recent Roles">
          <Table.Header>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Posted</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {hiringData.jobs?.slice(0, 5).map((job) => (
              <Table.Row key={job.id}>
                <Table.Cell>
                  <Link href={job.url}>{job.title}</Link>
                </Table.Cell>
                <Table.Cell>
                  {job.remote ? (
                    <Badge color="blue">Remote</Badge>
                  ) : (
                    job.location || "—"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {job.postedAt
                    ? new Date(job.postedAt).toLocaleDateString()
                    : "—"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Link href={hiringData.jobspipeUrl}>View all on JobsPipe →</Link>
      </Stack>
    </Widget.TextWidget>
  )
}
