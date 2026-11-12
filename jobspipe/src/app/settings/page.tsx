import { Link, Settings } from "attio/client"

import schema from "./schema"

export default Settings.defineWorkspacePage(schema, () => {
  const { Form, Section, TextInput } = Settings.useForm(schema)

  return (
    <Form>
      <Section
        title="JobsPipe API Configuration"
        description="Configure your JobsPipe API key to enable company enrichment and hiring data."
      >
        <TextInput
          label="JobsPipe API Key"
          name="jobspipe_api_key"
          type="password"
          placeholder="jp_live_..."
          minLength={10}
        />

        <Link href="https://jobspipe.dev/dashboard/api-keys">
          Get your API key from JobsPipe Dashboard →
        </Link>
      </Section>

      <Section
        title="About JobsPipe"
        description="JobsPipe provides live job postings from 30+ sources in one normalized API."
      >
        <Link href="https://jobspipe.dev">Visit JobsPipe →</Link>
        <Link href="https://docs.jobspipe.dev">View Documentation →</Link>
      </Section>
    </Form>
  )
})
