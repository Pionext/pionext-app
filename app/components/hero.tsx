import PioneeringSvg from '@/public/images/hero/PIONEERING.svg'
import CommunityDrivenVenturesSvg from '@/public/images/hero/COMMUNITY-DRIVEN_VENTURES.svg'
import { Crimson_Text } from 'next/font/google'

const crimsonText = Crimson_Text({ 
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export function Hero() {
  return (
    <section className="bg-white relative min-h-screen overflow-hidden">
      {/* First row - scrolling left */}
      <div className="h-[40vh] flex items-end">
        <div className="animate-scroll-left whitespace-nowrap pb-4">
          <div className="inline-flex items-center">
            {/* First set */}
            <div className="flex items-center gap-4">
              <PioneeringSvg className="h-[15vh] w-auto" />
              
              <div className="h-[15vh] aspect-square rounded-xl overflow-hidden">
                <img 
                  src="/images/hero/phone.png" 
                  alt="Phone"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="h-[15vh] aspect-square">
                <img 
                  src="/images/hero/price.svg" 
                  alt="Price"
                  className="h-full w-full"
                />
              </div>

              <CommunityDrivenVenturesSvg className="h-[15vh] w-auto mr-16" />
            </div>

            {/* Second set */}
            <div className="flex items-center gap-4">
              <PioneeringSvg className="h-[15vh] w-auto" />
              
              <div className="h-[15vh] aspect-square rounded-xl overflow-hidden">
                <img 
                  src="/images/hero/phone.png" 
                  alt="Phone"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="h-[15vh] aspect-square">
                <img 
                  src="/images/hero/price.svg" 
                  alt="Price"
                  className="h-full w-full"
                />
              </div>

              <CommunityDrivenVenturesSvg className="h-[15vh] w-auto mr-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Second row - scrolling right */}
      <div className="h-[40vh] flex items-start">
        <div className="animate-scroll-right whitespace-nowrap pt-4">
          <div className="inline-flex items-center">
            {/* First set */}
            <div className="flex items-center gap-4">
              <PioneeringSvg className="h-[15vh] w-auto" />

              <div className="h-[15vh] aspect-square">
                <img 
                  src="/images/hero/fund_project.svg" 
                  alt="Fund Project"
                  className="h-full w-full"
                />
              </div>

              <div className="h-[15vh] aspect-square rounded-xl overflow-hidden">
                <img 
                  src="/images/hero/card.png" 
                  alt="Card"
                  className="h-full w-full object-cover"
                />
              </div>

              <CommunityDrivenVenturesSvg className="h-[15vh] w-auto mr-16" />
            </div>

            {/* Second set */}
            <div className="flex items-center gap-4">
              <PioneeringSvg className="h-[15vh] w-auto" />
              
              <div className="h-[15vh] aspect-square rounded-xl overflow-hidden">
                <img 
                  src="/images/hero/fund_project.png" 
                  alt="Fund Project"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="h-[15vh] aspect-square rounded-xl overflow-hidden">
                <img 
                  src="/images/hero/card.png" 
                  alt="Card"
                  className="h-full w-full object-cover"
                />
              </div>

              <CommunityDrivenVenturesSvg className="h-[15vh] w-auto mr-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Updated text section */}
      <div className="absolute bottom-48 left-0 right-0 text-center">
        <p className={`text-[#0000FF] text-2xl md:text-3xl leading-snug max-w-4xl mx-auto font-regular ${crimsonText.className}`}>
          A community-driven platform for proposing, funding,
          <br />
          and developing projects using a credit-based system with AMMs.
        </p>
      </div>
    </section>
  )
}

