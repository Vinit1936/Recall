import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

const siteUrl = 'https://recall-dsa.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Recall – Spaced Repetition for LeetCode & DSA Problems',
    template: '%s | Recall DSA',
  },
  description:
    'Master Data Structures & Algorithms with intelligent spaced repetition. Auto-sync problems from LeetCode, Codeforces, HackerRank, GeeksForGeeks, and CodeChef.',
  keywords: [
    'Recall',
    'Spaced Repetition',
    'LeetCode Tracker',
    'DSA Problem Tracker',
    'Coding Interview Prep',
    'Codeforces',
    'GeeksForGeeks',
    'HackerRank',
    'CodeChef',
    'Algorithm Revision',
    'Ebbinghaus Forgetting Curve',
    'Active Recall DSA',
  ],
  authors: [{ name: 'Vinit Patil', url: 'https://github.com/Vinit1936' }],
  creator: 'Vinit Patil',
  publisher: 'Recall',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Recall – Spaced Repetition for LeetCode & DSA Problems',
    description:
      'Never forget a problem you solved. Automated spaced repetition queue for LeetCode, Codeforces, HackerRank, GFG, and CodeChef.',
    siteName: 'Recall',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recall – Spaced Repetition for LeetCode & DSA Problems',
    description:
      'Never forget a problem you solved. Automated spaced repetition queue for LeetCode, Codeforces, HackerRank, GFG, and CodeChef.',
    creator: '@vinitpatil193',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD Structured Data for Google Rich Snippets (SoftwareApplication & FAQPage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Recall',
        operatingSystem: 'Web',
        applicationCategory: 'EducationalApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Spaced repetition tracker for LeetCode, Codeforces, HackerRank, GFG, and CodeChef DSA problems.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does Recall calculate when a problem is due for revision?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Recall uses an adaptive spaced repetition algorithm inspired by cognitive science, scheduling reviews at 3, 7, 14, and 30 day intervals.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which coding platforms are supported for automatic metadata extraction?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Recall supports LeetCode, Codeforces, GeeksForGeeks, HackerRank, and CodeChef.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ background: '#0f0f0f', color: '#fff', minHeight: '100vh' }} suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
