import { HeroSection } from '@/components/home/hero-section'

export default function Home() {
  return (
    <main>
      <HeroSection
        name="CAVTEA ARTIOM"
        title="Web Developer"
        location="Chisinau"
        phone="+77 022 444 05 05"
        email="jacob360@gmail.com"
        profileImage="/images/profile.jpg"
        ctaText="Let's talk with me"
        ctaLink="/contact"
      />
    </main>
  )
}
