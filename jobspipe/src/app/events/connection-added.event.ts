import type { Connection } from "attio/server"

import ensureJobsPipeAttributes from "../../lib/ensure-attributes.server"

export default async function connectionAdded({
  connection: _connection,
}: {
  connection: Connection
}) {
  await ensureJobsPipeAttributes()
}
