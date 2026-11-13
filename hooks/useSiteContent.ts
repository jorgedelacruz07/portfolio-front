import { useQuery } from "@tanstack/react-query";

import { api, handleApiError } from "@/lib/api";
import { withSiteCopyDefaults } from "@/lib/site-copy";

export function useSiteContent() {
  const { data } = useQuery({
    queryKey: ["portfolio", "site-content"],
    queryFn: async () => {
      try {
        return await api.getSiteContent();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
  return {
    copy: withSiteCopyDefaults(data?.settings?.siteCopy),
    settings: data?.settings,
    profile: data?.profile,
  };
}
