import React from "react"
import { Extensions, Widget } from "attio/client"

import { JobsPipeWidgetContent } from "./widget-content"

export default Extensions.defineExtension({
  type: "record-widget",
  id: "jobspipe-hiring-data",
  label: "JobsPipe Hiring Data",
  color: "#4F46E5",
  Widget: ({ recordId }) => (
    <React.Suspense fallback={<Widget.Loading />}>
      <JobsPipeWidgetContent recordId={recordId} />
    </React.Suspense>
  ),
  objects: "companies",
})
