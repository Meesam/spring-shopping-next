'use client'

import { usePathname } from 'next/navigation'

export default function PathNameClientComponent() {
    const pathname = usePathname()
    return <>{pathname.split('/')[1].split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }</>
}
