import { api, APIError } from "encore.dev/api";
import { infographicDB } from "./db";

export interface DeleteBrandParams {
  id: number;
}

// Deletes a brand.
export const deleteBrand = api<DeleteBrandParams, void>(
  { expose: true, method: "DELETE", path: "/brands/:id" },
  async (params) => {
    // Check if brand is being used by any projects
    const projectCount = await infographicDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM projects WHERE brand_id = ${params.id}
    `;

    if (projectCount && projectCount.count > 0) {
      throw APIError.failedPrecondition("Cannot delete brand that is being used by projects");
    }

    await infographicDB.exec`
      DELETE FROM brands WHERE id = ${params.id}
    `;
  }
);
