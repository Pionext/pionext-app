import SunIcon from '@/public/images/features/sun.svg'
import BrainIcon from '@/public/images/features/brain.svg'
import PeopleIcon from '@/public/images/features/people.svg'

export function Features() {
  const features = [
    {
      icon: <div className="w-[72px] h-[72px] -ml-2 -mt-2"><SunIcon /></div>,
      title: "Ultra-Early Stage Funding",
      description: "Provide access to funding for projects at the idea stage, enabling innovators to turn concepts into reality.",
      bgColor: "bg-[#E5FF73]",
    },
    {
      icon: <div className="w-[72px] h-[72px] -ml-2 -mt-2"><BrainIcon /></div>,
      title: "Viability Assessment",
      description: "Leverage collective wisdom to evaluate early-stage ideas and prototypes, offering valuable feedback from a market proxy.",
      bgColor: "bg-[#FFD6EC]",
    },
    {
      icon: <div className="w-[72px] h-[72px] -ml-2 -mt-2"><PeopleIcon /></div>,
      title: "Built-In Community",
      description: "Foster a supportive ecosystem where funded projects instantly gain a community of backers, accelerating growth and adoption.",
      bgColor: "bg-[#2B2B2B]",
      textColor: "text-[#E8C4B3]",
    }
  ]

  return (
    <section className="min-h-screen bg-white flex items-center py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.bgColor} rounded-3xl p-8 aspect-square flex flex-col`}
            >
              {feature.icon}
              <div className="h-[45%] mt-auto flex flex-col justify-end">
                <h3 className={`text-lg font-medium mb-2 ${feature.textColor || 'text-[#2B2B2B]'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.textColor || 'text-[#2B2B2B]'}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

