export default {
    title: '🫠 Smile.',
    description: 'a gureckislab joint.',
    
    themeConfig: {
        lastUpdatedText: 'Updated Date',
        nav: [
                { text: 'gureckislab.org', link: 'https://gureckislab.org' }, 
                { text: 'github', link: 'https://github.com/NYUCCL/smile' }              
        ],
        sidebar: [
            {
                text: "Overview",
                items: [
                    { text: "Introduction", link: '/introduction' },
                    { text: "Contributing", link: '/contributing' },
                    { text: "Notes", link: '/notes' },
                    
                ]
            },
            {
                text: "Planning",
                items: [
                    { text: "Design Principles", link: '/principles' },
                    { text: "Manifesto", link: '/manifesto' },
                ]
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2020-present Todd Gureckis'
        }
    }
}