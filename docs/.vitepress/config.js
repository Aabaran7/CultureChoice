import footnote from 'markdown-it-footnote'
import { defineConfig } from 'vitepress'


export default defineConfig({
    title: '🫠 Smile.',
    description: 'a gureckislab joint.',
    markdown: {
        toc: {
            listType: 'ol'
        },
        config: (md) => {
            md.use(footnote)
        }
    },
    themeConfig: {
        lastUpdated: true,
        lastUpdatedText: 'Updated Date',
        nav: [
                { text: 'gureckislab.org', link: 'https://gureckislab.org' }           
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/NYUCCL/smile' },
            { icon: 'twitter', link: 'https://twitter.com/todd_gureckis' }
        ],
        sidebar: [
            {
                text: "Overview",
                items: [
                    { text: "Introduction", link: '/introduction' },
                    { text: "Contributing to the docs", link: '/contributing' },
                    
                ]
            },
            {
                text: "Planning",
                items: [
                    { text: "Manifesto", link: '/manifesto' },
                    { text: "Design Principles", link: '/principles' },
                    { text: "Overview", link: '/research/overview' },
                    { text: "Use-cases", link: '/research/usecases' }
                ]
            },
            {
                text: "Back End",
                items: [
                    { text: "Research Notes", link: "/research/backend" },
                    { text: "Analyzing Data", link: "/analysis" }
                ]
            },
            {
                text: "Front End",
                items: [
                    { text: "Research Notes", link: "/research/frontend"},
                    { text: "Configuration Options", link: "/configuration"}
                ]
            },
            {
                text: "Misc",
                collapsible: true,
                collapsed: true,
                items: [
                    { text: "Setup", link: "/notes" }
                ]
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2020-present Todd Gureckis'
        }
    }
})