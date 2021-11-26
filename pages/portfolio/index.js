import Image from 'next/image'

export default function Portfolio() {
  return (
    <section className="text-center">
      <h1>About me</h1>
      <p className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden relative shadow-md"><Image src="/images/lenny.jpg" layout="fill" /></p>
      <p>I am Leonard Martin, an amateur sports photographer based in North London.</p>

      <div className="-mx-6 mb-12">
        <div className="relative aspect-w-9 aspect-h-4"><Image src="/images/southerns.jpg" layout="fill" /></div>
      </div>

      <p>I shoot a variety of sports including rugby, cricket, cycling, and swimming, but the majority of my work is around athletics.</p>

      <p>My work has appeared in print in magazines such as Women's Running and Outdoor Swimmer, as well as many local newspapers in the London area including Ham&High, Hackney Gazette and Islington Tribune.</p>

      <p>I am a strong believer in promoting women's sport, in particular in non-traditional sports such as cricket and rugby.</p>

      <p>When I'm not taking photos I also run with London Heathside Athletics Club, focussing on ultramarathon and mountain races, although I have been known to race on the roads occasionally too.</p>

      <div className="-mx-6 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/rugby.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/cricket.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/mtb.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/strel.jpg" layout="fill" /></div>
      </div>

      <h2>Race Photography</h2>

      <p>I have taken photos for a range of races from league and championship XC races, through track and field athletics, to 100 mile ultramarathons.</p>

      <p>I have worked with a number race organisers including XNRG, Centurion Running, and SVP50/100.</p>

      <div className="-mx-6 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/sdw.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/cts.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/fast-friday.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/xnrg.jpg" layout="fill" /></div>
      </div>

      <h2>Contact</h2>

      <p>You can email me on <a href="mailto:info@leonardmartin.photo">info@leonardmartin.photo</a></p>

      <h2>Follow Me</h2>

      <p>You can find me on instagram at <a href="https://instagram.com/lennygoesoutside">@lennygoesoutside</a> and twitter at <a href="https://twitter.com/lennym">@lennym</a>.</p>

    </section>
  )
}
