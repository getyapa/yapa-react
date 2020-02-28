import { useState } from "react"

import { Block, Inline, parsePost, Post } from "./parsePost"

const blocks: Block[] = [
  {
    type: "title",
    name: "",
    description: "",
    prefix: "#",
    alt: [".title"],
    attributes: {
      level: 1,
    },
  },
  {
    type: "subtitle",
    prefix: "##",
    name: "",
    description: "",
    alt: [".subtitle"],
    attributes: {
      level: 2,
    },
  },
  {
    type: "list",
    name: "",
    description: "",
    group: "list",
    prefix: "-",
    attributes: {
      type: "unsorted",
    },
  },
  {
    type: "list",
    name: "",
    description: "",
    group: "list",
    prefix: "[ ]",
    attributes: {
      type: "todo",
      checked: false,
    },
  },
  {
    type: "list",
    name: "",
    description: "",
    group: "list",
    prefix: "[x]",
    attributes: {
      type: "todo",
      checked: true,
    },
  },
  {
    type: "list",
    name: "",
    description: "",
    group: "list",
    prefix: "1.",
    alt: ["2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12."],
    attributes: {
      type: "ordered",
    },
  },
]

const inlines: Inline[] = [
  {
    type: "tag",
    name: "",
    description: "",
    prefix: "#",
  },
]

export interface BoardQuery {
  tags?: string[]
  untagged?: boolean
}

export interface BoardHook {
  posts: Post[]
  allPosts: Post[]
  editing: number
  query: BoardQuery
  push(post: string)
  set(index: number, post: string)
  delete(index: number)
  setEditing(index: number)
  up()
  down()
}

interface FilteredPost extends Post {
  unfileredIndex: number
}

export function useBoard(): BoardHook {
  const [posts, setPosts] = useState<FilteredPost[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [query, setQuery] = useState<BoardQuery>({})
  const [editing, setEditing] = useState<number>(-1)

  function updatePosts() {
    const result = []
    for (const post of allPosts) {
      // TODO
    }
  }

  function push(text: string) {
    const now = Date.now()
    const post = parsePost({ blocks, inlines, text, createdAt: now, updatedAt: now })
    setAllPosts(posts => posts.concat(parsePost({ blocks, inlines, text, createdAt: now, updatedAt: now })))
  }

  return {
    posts,
    allPosts,
    editing,
    query,
    push,
    set(index, text) {
      setPosts(posts =>
        posts.map((p, i) => {
          if (index !== i) return p

          return parsePost({ blocks, inlines, text, createdAt: p.createdAt, updatedAt: Date.now() })
        })
      )
    },
    delete(index) {
      setPosts(posts => posts.filter((_, i) => i !== index))
    },
    setEditing(index) {
      setEditing(index)
    },
    up() {
      if (editing < 0) {
        setEditing(posts.length - 1)
      } else if (editing > 0) {
        setEditing(e => e - 1)
      }
    },
    down() {
      if (editing >= posts.length - 1) {
        setEditing(-1)
      } else if (editing >= 0) {
        setEditing(e => e + 1)
      }
    },
  }
}
