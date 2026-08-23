import { trip } from '../trip'
import type { NamedPlace, TripLink } from '../types/trip'
import { StatusChip } from './StatusChip'

function PlaceItems({ places }: { places: NamedPlace[] }) {
  return (
    <ul className="place-list">
      {places.map((place) => (
        <li key={place.name}>
          <a href={place.url} target="_blank" rel="noreferrer">
            {place.name}
          </a>
          {place.note ? <span className="muted">{place.note}</span> : null}
        </li>
      ))}
    </ul>
  )
}

function Links({ links }: { links: TripLink[] }) {
  return (
    <div className="links">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  )
}

export function ReferencePanels() {
  const { lodging, transport, ski, snowMonkeys, concert, ghibli, constraints } = trip

  return (
    <>
      <section>
        <div className="section-title">
          <h2>Constraints</h2>
          <p>Hard edges of the trip. Do not invent extra cities.</p>
        </div>
        <div className="ema-grid">
          {constraints.map((item) => (
            <article key={item.id} className="ref-card">
              <StatusChip status={item.status} />
              <p style={{ marginTop: 10 }}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>Lodging</h2>
          <p>Nothing is held. Schneider is closed.</p>
        </div>
        <div className="ref-grid">
          <article className="ref-card">
            <StatusChip status={lodging.status} />
            <h3>Tokyo</h3>
            <p>{lodging.tokyo.rule}</p>
            <ol className="rank">
              {lodging.tokyo.areaRank.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ol>
            <PlaceItems places={lodging.tokyo.candidates} />
          </article>
          <article className="ref-card">
            <StatusChip status={lodging.status} />
            <h3>Nozawa — self-catered</h3>
            <PlaceItems places={lodging.nozawa.selfCatered} />
          </article>
          <article className="ref-card">
            <StatusChip status={lodging.status} />
            <h3>Nozawa — half-board</h3>
            <PlaceItems places={lodging.nozawa.halfBoard} />
          </article>
          <article className="ref-card closed">
            {lodging.nozawa.closed.map((place) => (
              <div key={place.name}>
                <StatusChip status={place.status ?? 'locked'} />
                <h3>{place.name}</h3>
                <p>{place.note}</p>
                <div className="links">
                  <a href={place.url} target="_blank" rel="noreferrer">
                    Official notice
                  </a>
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>Trains, vans, bags</h2>
        </div>
        <div className="ref-grid">
          <article className="ref-card">
            <StatusChip status={transport.train.status} />
            <h3>Hakutaka</h3>
            <p>{transport.train.text}</p>
            <Links links={transport.train.links} />
          </article>
          <article className="ref-card">
            <StatusChip status={transport.transfer.status} />
            <h3>Iiyama transfer</h3>
            <p>{transport.transfer.text}</p>
            <Links links={transport.transfer.links} />
          </article>
          <article className="ref-card">
            <StatusChip status={transport.yamato.status} />
            <h3>Yamato</h3>
            <p>{transport.yamato.text}</p>
            <Links links={transport.yamato.links} />
          </article>
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>Ski & soto-yu</h2>
        </div>
        <div className="ref-grid">
          <article className="ref-card">
            <h3>{ski.mountain}</h3>
            <p>{ski.properDays}</p>
            <p>
              Adult day {ski.tickets.adultDay} · 3-day {ski.tickets.adult3Day}. {ski.tickets.season}.
            </p>
            <p>
              {ski.rental.shop}: adult day set {ski.rental.adultDaySet}.
            </p>
            <p>{ski.onsen.sotoYu}</p>
            <Links links={ski.links} />
          </article>
          <article className="ref-card">
            <StatusChip status={snowMonkeys.status} />
            <h3>Snow monkeys</h3>
            <p>
              {snowMonkeys.rule} {snowMonkeys.operator}. Reservations from {snowMonkeys.reservationsOpen}.{' '}
              {snowMonkeys.window}. {snowMonkeys.price}.
            </p>
            <div className="links">
              <a href={snowMonkeys.url} target="_blank" rel="noreferrer">
                Kotsu tour
              </a>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>UVERworld & Ghibli</h2>
          <p>Confirmed concert. Unpublished museum calendar.</p>
        </div>
        <div className="ref-grid">
          <article className="ref-card closed">
            <StatusChip status={concert.status} />
            <h3>{concert.artist}</h3>
            <p>{concert.groupRule}</p>
            <p>
              {concert.tour} · {concert.venue}
            </p>
            <ul className="rank">
              {concert.shows.map((show) => (
                <li key={show.date}>
                  {show.date}: doors {show.doors} / start {show.start} · {show.seat} {show.price}
                </li>
              ))}
            </ul>
            <p>{concert.tickets.fcLotteries}</p>
            <p>{concert.tickets.creatorLifeSize}</p>
            <p>{concert.tickets.generalSale}</p>
            <p>{concert.sameNightReturn}</p>
            <Links links={concert.links} />
          </article>
          <article className="ema">
            <StatusChip status={ghibli.status} />
            <h3>Ghibli Museum</h3>
            <p>{ghibli.museum}</p>
            <p>{ghibli.lastYearClosure}</p>
            <p>{ghibli.tuesdayNote}</p>
            <p>{ghibli.primaryDay}</p>
            <p>{ghibli.sale}</p>
            <ul className="rank">
              {ghibli.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <Links links={ghibli.links} />
          </article>
        </div>
      </section>
    </>
  )
}
