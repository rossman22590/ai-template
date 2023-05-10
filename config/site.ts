import { NavItem } from "@/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: "Info Scan",
  description: "Unlock the secrets of any website",
  mainNav: [],
}
