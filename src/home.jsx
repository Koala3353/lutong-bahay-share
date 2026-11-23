import { useState } from 'react'
import Mascot from './components/Mascot.jsx'
import VideoEmbed from './components/Video.jsx'
import { DEFAULT_ASSUMPTIONS, ImpactCalculator, ModelCalculator } from './components/Calculators.jsx'
import { QrCode } from './components/parts.jsx'

const SITE = () => `${location.origin}${import.meta.env.BASE_URL}`
const newCode = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('')

const SOURCES = (
  <p className="sources muted">
    Sources:{' '}
    <a href="https://www.unep.org/news-and-stories/press-release/world-squanders-over-1-billion-meals-day-un-report" target="_blank" rel="noreferrer">UNEP press release, 27 March 2024</a>
    {' · '}
    <a href="https://bworldonline.com/economy/2024/03/27/584555/phl-household-food-waste-falls-sharply-to-nearly-3-million-tonnes-a-year-unep/" target="_blank" rel="noreferrer">BusinessWorld (Reuters) on the Philippine figure</a>
  </p>
)

export function Home({ go }) {
  const [code, setCode] = useState('')
  const [a, setA] = useState({ ...DEFAULT_ASSUMPTIONS })
  const join = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (c) go(`/r/${c}/poll`)
  }

  return (
    <>
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="rise">
            <h1>Good food should not end up in the bin at closing time</h1>
            <p className="lead">
              Lutong Bahay Share lets restaurants, bakeries and groceries sell unsold but still good food as discounted
              pickup bags. Households save money and less food gets thrown away.
            </p>
            <div className="actions">
              <button className="btn big" onClick={() => go(`/r/${newCode()}/screen`)}>Start a live room</button>
              <button className="btn alt big" onClick={() => go('/r/DEMO/buy')}>Try the app</button>
            </div>
            <form className="join" onSubmit={join}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Room code" aria-label="Room code" maxLength={8} />
              <button className="btn alt" type="submit">Join</button>
            </form>
          </div>
          <div className="stage rise">
            <span className="tag t1">Pickup before closing</span>
            <Mascot mood="cheer" bag size={300} />
            <span className="tag t2">Surplus bag, ₱90</span>
          </div>
        </div>
      </section>

      <section className="section tint" id="tour">
        <div className="wrap">
          <div className="section-head">
            <h2>App tour</h2>
            <p>
              Lutong Bahay Share is an app where restaurants, bakeries and groceries sell unsold, yet still consumable and
              good food at a discount near closing time.
            </p>
          </div>
          <div className="tour">
            <div className="card">
              <h3>Shop section</h3>
              <p className="muted">For the bakery, restaurant or grocery store</p>
              <ul className="bullets">
                <li>Post your surplus bag as the shop</li>
                <li>Enter your details: name, location, what is in the bag and more</li>
                <li>Check the summary, post it, and see reservations come in</li>
              </ul>
              <button className="btn alt" onClick={() => go('/r/DEMO/shop')}>Open the shop view</button>
            </div>
            <div className="card">
              <h3>Buy section</h3>
              <p className="muted">For the consumer or buyer</p>
              <ul className="bullets">
                <li>Look through the bags available from different shops</li>
                <li>Pick the bag that interests you and view it in more detail</li>
                <li>To buy, enter your details and follow the pickup instructions</li>
                <li>See the meals, pesos and food waste you saved after each bag</li>
              </ul>
              <button className="btn alt" onClick={() => go('/r/DEMO/buy')}>Open the buy view</button>
            </div>
            <div className="card qr-card">
              <h3>Open it on your phone</h3>
              <QrCode text={SITE()} size={200} />
              <p className="muted">Scan to open the app</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="model">
        <div className="wrap">
          <div className="section-head">
            <h2>How the business earns</h2>
            <p>The app earns from one thing only: a small commission on every bag sold.</p>
          </div>
          <div className="card">
            <h3>Commission</h3>
            <p style={{ marginBottom: 24 }}>The app receives a {a.pct || 0}% commission on each bag sold through it. Try the numbers below: they are our assumptions, and you can change any of them.</p>
            <ModelCalculator a={a} setA={setA} />
          </div>
        </div>
      </section>

      <section className="section tint" id="video">
        <div className="wrap">
          <div className="section-head">
            <h2>Why food waste matters</h2>
            <p>A short introduction to the effects of food waste.</p>
          </div>
          <VideoEmbed id="ishA6kry8nc" title="Food Waste: The Hidden Cost of the Food We Throw Out" author="ClimateScience" />
        </div>
      </section>

      <section className="section" id="issues">
        <div className="wrap">
          <div className="section-head">
            <h2>Summary of issues</h2>
            <p>Food waste hits households, businesses and the climate at once. Figures are from the UN Environment Programme&apos;s Food Waste Index Report 2024, which covers 2022.</p>
          </div>
          <div className="cards">
            <div className="card"><span className="badge peach">1</span><h3>Good food is thrown out every day</h3><p>Food that is safe and tasty still goes in the bin when a shop closes for the night.</p></div>
            <div className="card"><span className="badge butter">2</span><h3>Households want cheaper food</h3><p>Families and workers, not only students, are looking for meals that cost less.</p></div>
            <div className="card"><span className="badge pink">3</span><h3>Shops have no easy way to sell leftovers</h3><p>Posting, pricing and arranging pickup for leftovers takes time shops do not have.</p></div>
          </div>
          <div className="facts" style={{ marginTop: 24 }}>
            <div className="stat tone-peach"><div className="stat-value">1.05 billion t</div><div className="stat-label">of food wasted worldwide, almost one-fifth of all food available to consumers</div></div>
            <div className="stat tone-butter"><div className="stat-value">60%</div><div className="stat-label">of that waste happens in households, 28% in food services and 12% in retail</div></div>
            <div className="stat tone-mint"><div className="stat-value">2.95 million t</div><div className="stat-label">of food wasted by Philippine households in a year, about 26 kg per person</div></div>
            <div className="stat tone-pink"><div className="stat-value">8 to 10%</div><div className="stat-label">of global greenhouse gas emissions come from food loss and waste</div></div>
          </div>
          {SOURCES}
        </div>
      </section>

      <section className="section tint" id="why">
        <div className="wrap why">
          <div className="section-head">
            <h2>Why we chose to make an app</h2>
          </div>
          <div className="prose">
            <p>
              We chose creating Lutong Bahay Share for our sustainable business plan because it directly connects to our
              group&apos;s goal of living a sustainable lifestyle. Every day, local bakeries, restaurants, and grocery stores
              end up throwing away good, edible food simply because they have no quick way to sell their leftovers before
              closing time. At the same time, regular families, students, and workers are constantly looking for ways to
              save money on their daily meals. By creating a simple mobile app, we bridge this gap by letting food shops
              post discounted surplus bags that buyers can reserve and pick up near closing time.
            </p>
            <p>
              This idea feels realistic and relatable because food waste is something we all see happening around us, yet
              we saw that it is feasible to fix with the use and help of technology. It tackles two significant problems at
              once: it cuts down on environmental food waste and greenhouse gases while giving everyday people a chance to
              enjoy affordable meals. Overall, Lutong Bahay Share turns everyday food rescue into a win-win solution for
              local vendors, consumers, and our planet.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="lessons">
        <div className="wrap">
          <div className="section-head">
            <h2>Connection to our lessons in STS 10</h2>
            <p>The app puts the course&apos;s environment, nutrition and technology lessons to work.</p>
          </div>
          <div className="cards two">
            <div className="card">
              <h3>Digest 9: The Philippine Environment</h3>
              <p>Metro Manila produces over 10,000 tons of waste a day, mostly landfilled, made worse by poor segregation and few processing facilities. Surplus bags keep edible food out of that waste stream. Wasted food also wastes the water and land used to grow it, which matters for food security.</p>
            </div>
            <div className="card">
              <h3>Digest 6: Modern Nutrition</h3>
              <p>The digest treats food waste as an externality of commercialized food, such as excess servings and produce binned for failing looks. It also notes that the poor can afford only cheap, less nutritious food. Discounted bags give households affordable food, and the digest&apos;s idea of food as a force for good combines individual choice with technology, which is what the app offers.</p>
            </div>
            <div className="card">
              <h3>Digest 5.1: Science and technology from the social lens</h3>
              <p>The app is technology push and demand pull together: apps, location and payments make it possible, while demand for cheaper food and sustainability pulls users in. By the utilitarian view, the discount outweighs the hassle of pickup. Under functionalism, technology serves societal needs but can have latent effects, such as shops preparing more surplus on purpose, which we would need to watch.</p>
            </div>
            <div className="card">
              <h3>Digest 11: The Good Life</h3>
              <p>Environmental issues affect social well-being, not only the economy. Cutting waste while saving households money supports a more collective sense of well-being, which is the sustainable lifestyle our project aims for.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint" id="impact">
        <div className="wrap">
          <div className="section-head">
            <h2>Potential impact</h2>
            <p>If Lutong Bahay Share reached the volume in our business model, this is what it could keep out of the bin.</p>
          </div>
          <div className="card">
            <ImpactCalculator a={a} setA={setA} />
          </div>
          <div className="cards" style={{ marginTop: 24 }}>
            <div className="card"><h3>Less food waste</h3><p>Good food gets eaten instead of thrown out, in a country where households waste about 26 kg of food per person a year.</p></div>
            <div className="card"><h3>Lower emissions</h3><p>Food loss and waste generates 8 to 10% of global greenhouse gas emissions, so every rescued meal helps.</p></div>
            <div className="card"><h3>Savings for households</h3><p>Families, students and workers pay less for a good meal, and shops earn from food they would have lost.</p></div>
          </div>
          {SOURCES}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">Lutong Bahay Share is a class project for STS 10. Shops, prices and reservations in the demo are made up.</div>
      </footer>
    </>
  )
}
