export const meta = () => [{title: 'Club Orders | BladeCraft'}];

export default function Club() {
  return (
    <main>
      <section className="relative grid min-h-[560px] items-end overflow-hidden bg-[#101820] px-5 py-16 text-white md:px-20 md:py-24">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/fencer-pair.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/65 to-[#101820]/10" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Club outfitting
          </p>
          <h1 className="mb-5 text-[clamp(2.6rem,7vw,6rem)] font-black leading-none">
            Order for the whole salle with one clean plan.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/85">
            Standardize sizing, starter bundles, weapon parts, and reorder
            lists for clubs, schools, camps, and coaching programs.
          </p>
        </div>
      </section>

      <section className="grid gap-5 px-5 py-16 md:grid-cols-3 md:px-14 md:py-24">
        {[
          ['1. Build the kit list', 'Choose weapon type, athlete count, safety level, and spare part ratios.'],
          ['2. Confirm sizing', 'Map jacket, breeches, glove, mask, and lame sizes by athlete group.'],
          ['3. Ship in batches', 'Receive labeled cartons for teams, coaches, or equipment rooms.'],
        ].map(([title, copy]) => (
          <article
            className="min-h-64 rounded-lg border border-[#d9e0e7] bg-white p-7"
            key={title}
          >
            <div className="mb-10 text-3xl text-[#c92337]">◆</div>
            <h2 className="mb-3 text-3xl font-black leading-none">{title}</h2>
            <p className="leading-7 text-[#61707f]">{copy}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 bg-[linear-gradient(90deg,rgba(16,24,32,.96),rgba(16,24,32,.76)),url('/assets/fencer-weapon.jpg')] bg-cover bg-center px-5 py-16 text-white md:grid-cols-[1fr_.68fr] md:px-14 md:py-24">
        <div>
          <p className="mb-3 text-xs font-black uppercase text-[#d59b24]">
            Recommended pack
          </p>
          <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-none">
            Foil starter room for 12 athletes.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">
            Twelve masks, twelve jackets, twelve gloves, eight electric foils,
            bodycords, two test boxes, and repair parts for a full semester.
          </p>
        </div>
        <div className="rounded-lg border border-white/25 bg-white/10 p-6">
          <h3 className="mb-4 text-2xl font-black">Request a club quote</h3>
          <p className="leading-7 text-white/75">
            Send us your roster size and weapon mix. We will turn it into a
            Shopify draft order or product bundle for approval.
          </p>
        </div>
      </section>
    </main>
  );
}
