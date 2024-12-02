export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Submit Your Vision",
      description: "Builders share their ideas or prototypes and create pre-sale credits for their future product. Early supporters get the best rates through our automated pricing curve."
    },
    {
      number: "2",
      title: "Community Backs Project",
      description: "Supporters invest by purchasing credits they'll use in the finished product. Thanks to our AMM, credits can be traded anytime - the earlier you join, the better the price."
    },
    {
      number: "3",
      title: "Automatic Exchange Listing",
      description: "Once funding goals are met, builders receive capital to start development. When the product launches, supporters can use their credits to use the product."
    }
  ]

  return (
    <section className="min-h-screen bg-[#00008B] text-white flex items-center py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:gap-20">
          <div className="bg-[#0000FF] rounded-full px-8 py-3 h-fit mb-12 md:mb-0 self-start">
            <h2 className="text-3xl whitespace-nowrap">How it works</h2>
          </div>
          
          <div className="space-y-8 md:space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4 md:gap-8">
                <div className="bg-[#0000FF] rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl">{step.number}</span>
                </div>
                <div className="max-w-lg">
                  <h3 className="text-base md:text-lg font-medium mb-2">
                    {step.title}
                  </h3>
                  {step.description.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

