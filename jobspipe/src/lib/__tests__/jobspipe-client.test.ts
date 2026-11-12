import { describe, expect, it, vi, beforeEach } from "vitest"
import { JobsPipeClient } from "../jobspipe-client"

describe("JobsPipeClient", () => {
  let client: JobsPipeClient

  beforeEach(() => {
    client = new JobsPipeClient("test-api-key")
    global.fetch = vi.fn()
  })

  describe("searchJobs", () => {
    it("should search jobs with correct parameters", async () => {
      const mockResponse = {
        results: [
          {
            id: "job-1",
            job_title: "Software Engineer",
            company: "Test Company",
            company_domain: "test.com",
            location: "Remote",
            remote: true,
            country_code: "US",
            seniority: "senior",
            url: "https://example.com/job",
            skills: ["JavaScript", "TypeScript"],
          },
        ],
        total: 1,
        limit: 10,
        offset: 0,
        took_ms: 123,
      }

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.searchJobs({
        company_domain_or: ["test.com"],
        limit: 10,
      })

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.jobspipe.dev/v1/jobs/search",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            company_domain_or: ["test.com"],
            limit: 10,
          }),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it("should throw error on API failure", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      } as Response)

      await expect(
        client.searchJobs({ company_domain_or: ["test.com"] })
      ).rejects.toThrow("JobsPipe API error (401): Unauthorized")
    })
  })

  describe("getCompanyHiringProfile", () => {
    it("should aggregate hiring data correctly", async () => {
      const mockJobs = [
        {
          id: "1",
          job_title: "Senior Engineer",
          company: "Test Co",
          company_domain: "test.com",
          occupation_code: "Software Development",
          seniority: "senior",
          country_code: "US",
          remote: true,
          date_posted: "2026-11-10T00:00:00Z",
          url: "https://test.com/job1",
          skills: [],
        },
        {
          id: "2",
          job_title: "Junior Designer",
          company: "Test Co",
          company_domain: "test.com",
          occupation_code: "Design",
          seniority: "junior",
          country_code: "UK",
          remote: false,
          date_posted: "2026-11-12T00:00:00Z",
          url: "https://test.com/job2",
          skills: [],
        },
      ]

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: mockJobs,
          total: 2,
          limit: 100,
          offset: 0,
          took_ms: 50,
        }),
      } as Response)

      const profile = await client.getCompanyHiringProfile("test.com")

      expect(profile).toEqual({
        company_domain: "test.com",
        open_roles_count: 2,
        departments: ["Software Development", "Design"],
        seniorities: ["senior", "junior"],
        countries: ["US", "UK"],
        remote_count: 1,
        latest_job_posted_at: "2026-11-12T00:00:00Z",
        jobspipe_url: "https://jobspipe.dev/companies/test.com",
      })
    })

    it("should throw error when no jobs found", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [],
          total: 0,
          limit: 100,
          offset: 0,
          took_ms: 10,
        }),
      } as Response)

      await expect(
        client.getCompanyHiringProfile("nonexistent.com")
      ).rejects.toThrow("No open roles found for this company")
    })
  })
})
