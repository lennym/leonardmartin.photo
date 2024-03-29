import Image from 'next/image'

export async function getStaticProps() {
  return { props: {} }
}

export default function Portfolio() {
  return (
    <section className="text-center">
      <h1>About me</h1>
      <p className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden relative shadow-md"><Image src="/images/lenny.jpg" layout="fill" /></p>
      <p className="max-w-screen-lg mx-auto">I am Leonard Martin, an amateur sports photographer based in North London.</p>

      <div className="-mx-6 mb-12">
        <div className="relative aspect-w-9 aspect-h-4"><Image src="/images/southerns.jpg" layout="fill" /></div>
      </div>

      <p className="max-w-screen-lg mx-auto">I shoot a variety of sports including rugby, cricket, cycling, and swimming, but the majority of my work is around athletics.</p>

      <p className="max-w-screen-lg mx-auto">My work has appeared in print in magazines such as Women's Running and Outdoor Swimmer, as well as many local newspapers in the London area including Ham&High, Hackney Gazette and Islington Tribune.</p>

      <p className="max-w-screen-lg mx-auto">I am a strong believer in promoting, supporting, and advocating for women's sport, in particular in non-traditional sports such as cricket and rugby.</p>


      <div className="-mx-6 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/rugby.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/cricket.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/mtb.jpg" layout="fill" /></div>
        <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/strel.jpg" layout="fill" /></div>
      </div>

      <h2>Race Photography</h2>

      <p className="max-w-screen-lg mx-auto">I have taken photos for a range of races from league and championship XC races, through track and field athletics, to 100 mile ultramarathons.</p>

      <p className="max-w-screen-lg mx-auto">I have worked with a number of race organisers including Centurion Running, Canary Trail Events, Endurance Life, XNRG, and SVP50/100.</p>

      <div className="-mx-6 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/sdw.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">Centurion South Downs Way 100</p>
        </div>
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/cts.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">Endurance Life Coastal Trail Series Northumberland</p>
        </div>
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/fast-friday.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">Fast Friday</p>
        </div>
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/xnrg.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">XNRG Tring 50k</p>
        </div>
      </div>

      <p className="max-w-screen-lg mx-auto">When I'm not taking photos I also run with London Heathside Athletics Club, focussing on ultramarathon and mountain races, although I have been known to race on the roads occasionally too.</p>

      <div className="-mx-6 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/ccc.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">CCC, Chamonix, France</p>
        </div>
        <div>
          <div className="relative aspect-w-3 aspect-h-2"><Image src="/images/eiger.jpg" layout="fill" /></div>
          <p className="mb-0 text-gray-400 text-sm text-right">Eiger Ultra Trail, Grindelwald, Switzerland</p>
        </div>
      </div>

      <h2>Contact</h2>

      <p className="max-w-screen-lg mx-auto">You can email me on <a href="mailto:info@leonardmartin.photo">info@leonardmartin.photo</a></p>

      <h2>Follow Me</h2>

      <p className="max-w-screen-lg mx-auto">You can find me on instagram at <a href="https://instagram.com/leonardmartin.photo">@leonardmartin.photo</a>.</p>

    </section>
  )
}
