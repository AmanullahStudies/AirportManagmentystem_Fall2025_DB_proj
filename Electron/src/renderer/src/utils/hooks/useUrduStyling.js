import { useEffect } from 'react'

const isUrduText = (text) => {
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFCFF]/
  return urduRegex.test(text)
}

export function useUrduStyling(ref) {
  useEffect(() => {
    if (!ref.current) return

    const applyUrduStyling = () => {
      const elements = ref.current.querySelectorAll('*')

      elements.forEach((el) => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          const text = el.textContent.trim()
          if (text && isUrduText(text)) {
            el.classList.add('urdu')
          } else {
            el.classList.remove('urdu')
          }
        }
      })
    }

    // Apply immediately
    applyUrduStyling()

    // Observe changes in the table
    const observer = new MutationObserver(() => {
      applyUrduStyling()
    })

    observer.observe(ref.current, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [ref])
}
