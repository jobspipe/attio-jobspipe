/**
 * ****************************************************
 * THIS FILE IS AUTO-GENERATED AT DEVELOPMENT TIME.
 *
 * DO NOT EDIT DIRECTLY OR COMMIT IT TO SOURCE CONTROL.
 * ****************************************************
 */
import { Query } from "attio/client";

type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

declare module "./get-company-domain.graphql" {
  export type GetCompanyDomainQueryVariables = Exact<{
    recordId: Scalars["String"]["input"];
  }>;

  export type GetCompanyDomainQuery = {
    company:
      | { __typename?: "CustomRecord" }
      | { __typename?: "Person" }
      | { domains: Array<string> }
      | { __typename?: "Deal" }
      | { __typename?: "WorkspaceRecord" }
      | { __typename?: "UserRecord" }
      | null;
  };

  const value: Query<GetCompanyDomainQueryVariables, GetCompanyDomainQuery>;
  export default value;
}
