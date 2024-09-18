import Turndown from 'turndown'

function webpageToMarkdown(body) {
  if (!body) return undefined

  // Convert HTML string to Markdown string using turndown
  const turndownService = new Turndown({ headingStyle: 'atx' })
  const markdownString = turndownService.turndown(body)

  return markdownString
}

function stripLinksFromMarkdown(markdownContent) {
  const linkPattern = /\[(.*?)\]\((.*?)\)/g

  return markdownContent.replace(linkPattern, (_, linkText) => {
    return linkText
  })
}

export { webpageToMarkdown, stripLinksFromMarkdown }
