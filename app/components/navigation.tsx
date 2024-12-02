import Image from 'next/image'

export function Navigation() {
  return (
    <nav className="top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-8 py-6 flex justify-between items-center">
        <div className="text-[#0000FF]">
          <Image 
            src="/images/pionext_logotype_blue.svg"
            alt="PIONEXT"
            width={145}
            height={26}
            priority
          />
        </div>
        <a 
          href="https://forms.gle/Hm1peh3wetLsKg56A"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-[#0000FF] text-white rounded-full px-6 py-2 hover:bg-blue-700 transition-colors">
            Join waitlist
          </button>
        </a>
      </div>
    </nav>
  )
}