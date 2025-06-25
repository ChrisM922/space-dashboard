// src/app/apod/page.tsx
import Image from 'next/image'

export default async function ApodPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apod`)
  const apod = await res.json()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">{apod.title}</h1>
      <Image src={apod.url} alt={apod.title} width={800} height={600} className="rounded-lg" />
      <p className="mt-4 text-gray-200">{apod.explanation}</p>
    </main>
  )
}
