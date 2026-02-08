import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eduassist.id';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/dashboard', '/api/private'], // Halaman yang dilarang diintip Google
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}