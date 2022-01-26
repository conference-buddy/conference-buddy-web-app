import { supabase } from "../_database/supabaseClient"
import { SocialLink, SocialLinksDB } from "../profiles/types/types-profiles"

function createSocialLinks({
  profileId,
  socialLinks,
}: {
  profileId: string
  socialLinks: SocialLink[]
}) {
  const socialLinksForDB = {}

  socialLinks.forEach(link => {
    //eslint-disable-next-line
    //@ts-ignore
    socialLinksForDB[Object.entries(link)[0][0]] = Object.entries(link)[0][1]
  })
  return supabase.from<SocialLinksDB>("profiles_social_links").insert([
    {
      id: profileId,
      ...socialLinksForDB,
    },
  ])
}

export { createSocialLinks }