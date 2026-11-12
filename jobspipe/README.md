# JobsPipe for Attio

Enrich your Attio company records with live hiring data from JobsPipe. View open roles, hiring departments, seniority levels, and more - all from 30+ job sources in one normalized API.

## Features

- **Record Widget**: Display company hiring data directly on company record pages
  - Open roles count with department breakdown
  - Remote positions indicator
  - Seniority levels being hired
  - Recent job postings table with links
- **Enrich Action**: One-click enrichment to write hiring signals to company attributes
- **Workspace Settings**: Secure API key configuration

## What is JobsPipe?

[JobsPipe](https://jobspipe.dev) is a jobs-data API that provides:
- Live job postings from 30+ sources (LinkedIn, Indeed, Greenhouse, Lever, company career pages, etc.)
- Normalized schema across all sources
- Company hiring profiles and signals
- Technology stack detection
- Salary benchmarking

## Installation & Setup

### Prerequisites

- An Attio workspace (free trial available at [attio.com](https://attio.com))
- A JobsPipe API key (get one at [jobspipe.dev](https://jobspipe.dev))
- Node.js 18+ and npm

### Development Setup

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd jobspipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This will prompt you to:
   - Choose a workspace to develop in (create a test workspace, not production)
   - Install the app in that workspace

4. **Configure the API key**
   - In Attio, go to Settings → Apps → JobsPipe → Settings
   - Enter your JobsPipe API key (starts with `jp_live_...`)
   - Get your key at: https://jobspipe.dev/dashboard/api-keys

5. **Add the widget to a company record**
   - Open any company record in Attio
   - Ensure the company has a domain set
   - Click "Configure page" → "Add Widget" → "JobsPipe Hiring Data"

### Testing

Run the test suite:
```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run typecheck     # Type checking
npm run lint          # Lint code
```

## Usage

### Record Widget

The widget automatically fetches and displays hiring data for any company with a domain:

- **Open Roles Count**: Total number of open positions
- **Remote Positions**: Count of remote-friendly roles
- **Departments**: Which departments are hiring (based on occupation codes)
- **Seniority Levels**: Junior, mid, senior positions available
- **Recent Roles Table**: Latest 5 job postings with titles, locations, and dates
- **View All Link**: Direct link to full hiring profile on JobsPipe

### Enrich Action

From any company record's overflow menu (three dots):

1. Select "Enrich with JobsPipe"
2. The action automatically creates these custom attributes (if they don't exist):
   - `jobspipe_open_roles` (number) - Number of open job postings
   - `jobspipe_departments` (text) - Departments currently hiring
   - `jobspipe_latest_job_posted` (date) - Date of most recent posting
   - `jobspipe_url` (text) - Link to full hiring profile on JobsPipe
3. Fetches hiring data and writes it to the company record

**Note**: Custom attributes are created automatically on first use. No manual setup required!

### Bulk Enrichment

To enrich multiple companies:

1. Create a list view of companies
2. Select multiple records
3. Use the bulk action menu (coming soon - see Development Roadmap)

## Project Structure

```
jobspipe/
├── src/
│   ├── app/
│   │   ├── extensions/
│   │   │   ├── jobspipe-widget/        # Record widget
│   │   │   │   ├── extension.tsx
│   │   │   │   ├── widget-content.tsx
│   │   │   │   └── get-company-domain.graphql
│   │   │   └── enrich-company/         # Record action
│   │   │       ├── extension.tsx
│   │   │       ├── enrich-company.server.ts
│   │   │       └── get-company-domain.graphql
│   │   └── settings/                   # Workspace settings
│   │       ├── schema.ts
│   │       └── page.tsx
│   └── lib/
│       ├── jobspipe-client.ts          # JobsPipe API client
│       ├── fetch-company-hiring-data.server.ts
│       └── __tests__/
│           └── jobspipe-client.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml                      # CI configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Publishing to Attio Marketplace

### What You Need

To publish this app to the Attio marketplace, you'll need:

1. **Attio Developer Account**
   - Sign in at [developers.attio.com](https://developers.attio.com)
   - Create a developer account (use your company/org name)

2. **App Registration**
   - Create a new app in the developer console
   - Set the app name and slug (e.g., `jobspipe`)
   - Upload an app icon (128x128px PNG recommended)
   - Add app description and screenshots

3. **Build & Deploy**
   ```bash
   npm run build
   npm run attio deploy
   ```

4. **App Review**
   - Submit for review in the developer console
   - Attio will review your app for security and quality
   - Once approved, it will be listed in the marketplace

### Publishing Checklist

- [ ] Create Attio developer account at developers.attio.com
- [ ] Register the app in developer console
- [ ] Set app name, description, and icon
- [ ] Test thoroughly in a development workspace
- [ ] Build the app (`npm run build`)
- [ ] Deploy using `npm run attio deploy`
- [ ] Submit for marketplace review

### What Requires Human Action

The following steps **require a human** and cannot be automated:

1. **Attio Developer Account Creation**: You must sign in with an Attio account and create a developer account manually
2. **App Registration**: Creating the app entry in the developer console
3. **API Key Management**: Users will need to sign up for JobsPipe and get their own API keys
4. **App Icon & Screenshots**: Prepare marketing assets (icon, screenshots, demo video)
5. **Marketplace Review**: Attio team manually reviews apps before listing
6. **Custom Attribute Setup**: Users need to create the enrichment attributes in their workspace

## Development Roadmap

Future enhancements:

- [ ] Bulk record action for enriching multiple companies at once
- [ ] Workflow block for automated enrichment when a company is created
- [ ] Additional widgets for job posting trends over time
- [ ] Filtering by department/seniority in the widget
- [ ] Export to CSV from widget
- [ ] Webhook integration for real-time job posting alerts

## API Reference

This app uses the following JobsPipe endpoints:

- `POST /v1/jobs/search` - Search job postings
  - Filters: company_domain_or, job_title_or, country_code_or, remote, seniority_or
  - Returns: normalized job postings with full metadata
  
For full API documentation, see: https://docs.jobspipe.dev

## Troubleshooting

### "No domain found for this company"
- Ensure the company record has a domain attribute set
- The domain should be in the format: `example.com` (no protocol, no path)

### "JobsPipe API key not configured"
- Go to Settings → Apps → JobsPipe → Settings
- Add your API key from https://jobspipe.dev/dashboard/api-keys

### Widget shows loading forever
- Check browser console for errors
- Verify the API key is valid
- Confirm the company domain is accessible (not a private/invalid domain)

### Enrichment action fails
- Custom attributes are created automatically on first use
- Check that the app has permission to create attributes (workspace admin required)
- Verify the API key is valid and has credits

## Support

- **JobsPipe Issues**: support@jobspipe.dev or https://jobspipe.dev/support
- **Attio SDK Issues**: Check [Attio SDK docs](https://docs.attio.com/sdk/overview)
- **This App**: Open an issue in this repository

## License

MIT License - see LICENSE file for details

## Links

- [JobsPipe Homepage](https://jobspipe.dev)
- [JobsPipe Documentation](https://docs.jobspipe.dev)
- [JobsPipe OpenAPI Spec](https://jobspipe.dev/openapi.json)
- [Attio Developer Platform](https://attio.com/platform/developers)
- [Attio SDK Documentation](https://docs.attio.com/sdk/overview)
