import { lazy } from 'react'

const pages = import.meta.glob('../pages/**/*.jsx')

const routes = Object.keys(pages).map((path) => {
  const match = path.match(/\.\/pages\/(.+?)\.jsx$/)
  if (!match) return null
  
  let componentName = match[1]
  let routePath
  
  // Handle folder/index.jsx -> /folder
  // Handle folder/Page.jsx -> /folder/page
  if (componentName.endsWith('/index')) {
    const folder = componentName.replace('/index', '')
    routePath = `/${folder.toLowerCase()}`
  } else {
    routePath = `/${componentName.toLowerCase()}`
  }

  return {
    path: routePath,
    component: lazy(pages[path])
  }
}).filter(Boolean)

export default routes
