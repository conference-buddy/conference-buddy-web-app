const { createFilePath } = require("gatsby-source-filesystem")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.GATSBY_APP_SUPABASE_URL || "empty"
const supabaseAnonKey = process.env.GATSBY_APP_SUPABASE_ANON_KEY || "empty"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  const { data: conferences } = await supabase.from("conferences")

  const { data: publicProfiles } = await supabase
    .from("profiles")
    .select("name,username")

  conferences.forEach(conference => {
    const nodeMeta = {
      id: conference.id,
      parent: null,
      children: [],
      internal: {
        type: `Conference`,
        contentDigest: createContentDigest(conference),
      },
    }
    const node = Object.assign({}, conference, nodeMeta)
    createNode(node)
  })

  publicProfiles.forEach(user => {
    const nodeMeta = {
      id: createNodeId(`user/${user.username}`),
      parent: null,
      children: [],
      internal: {
        type: `User`,
        contentDigest: createContentDigest(user),
      },
    }
    const node = Object.assign({}, user, nodeMeta)
    createNode(node)
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode })

    createNodeField({
      name: "slug",
      node,
      value: slug,
    })
  }
}

exports.onCreatePage = async ({ page, actions: { deletePage } }) => {
  if (page.context?.fields__slug?.includes("/_")) {
    deletePage(page)
  }
}
