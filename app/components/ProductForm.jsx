import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        const structuredOption = getStructuredOption(option);

        if (structuredOption) {
          return (
            <StructuredProductOption
              key={option.name}
              navigate={navigate}
              option={option}
              structuredOption={structuredOption}
            />
          );
        }

        return (
          <div className="product-options" key={option.name}>
            <div className="product-option-heading">
              <h5>{getOptionDisplayName(option.name)}</h5>
              <span>
                {getOptionValueDisplayName(
                  option.name,
                  option.optionValues.find((value) => value.selected)?.name,
                )}
              </span>
            </div>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        opacity: available ? 1 : 0.3,
                      }}
                      data-selected={selected || undefined}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={getOptionValueDisplayName(option.name, name)}
                      />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${exists && !selected ? ' link' : ''}`}
                      key={option.name + name}
                      style={{
                        opacity: available ? 1 : 0.3,
                      }}
                      data-selected={selected || undefined}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={getOptionValueDisplayName(option.name, name)}
                      />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <div className="product-purchase-row">
        <div className="product-quantity">
          <span>Quantity</span>
          <div>
            <button
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              type="button"
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              aria-label="Increase quantity"
              onClick={() => setQuantity((current) => current + 1)}
              type="button"
            >
              +
            </button>
          </div>
        </div>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
      </div>
    </div>
  );
}

function StructuredProductOption({navigate, option, structuredOption}) {
  return structuredOption.facets.map((facet) => (
    <div className="product-options product-options-structured" key={facet.key}>
      <div className="product-option-heading">
        <h5>{facet.label}</h5>
        <span>{facet.current || 'Select'}</span>
      </div>
      <div className="product-options-grid">
        {facet.choices.map((choice) => {
          const target = findBestStructuredValue({
            choice,
            facetKey: facet.key,
            option,
            selected: structuredOption.selected,
          });
          const selected = choice.value === facet.current;

          return (
            <button
              className={`product-options-item${target?.exists && !selected ? ' link' : ''}`}
              data-selected={selected || undefined}
              disabled={!target?.exists}
              key={`${facet.key}-${choice.value}`}
              onClick={() => {
                if (selected || !target) return;

                if (target.isDifferentProduct) {
                  void navigate(`/products/${target.handle}?${target.variantUriQuery}`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                  return;
                }

                void navigate(`?${target.variantUriQuery}`, {
                  replace: true,
                  preventScrollReset: true,
                });
              }}
              style={{opacity: target?.available === false ? 0.3 : 1}}
              type="button"
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  ));
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

const STRUCTURED_OPTION_NAMES = new Set([
  'color classification',
  'colour classification',
]);

const FACET_LABELS = {
  weapon: 'Weapon',
  hand: 'Hand',
  color: 'Color',
  garment: 'Item',
  kit: 'Kit option',
  protection: 'Protection level',
  cord: 'Cord type',
  bag: 'Bag style',
  age: 'Fit',
  finish: 'Finish',
};

const FACET_ORDER = [
  'weapon',
  'hand',
  'color',
  'finish',
  'garment',
  'protection',
  'kit',
  'cord',
  'bag',
  'age',
];

function getStructuredOption(option) {
  if (!STRUCTURED_OPTION_NAMES.has(option.name.toLowerCase())) return null;

  const parsedValues = option.optionValues.map((value) => ({
    value,
    facets: parseStructuredOptionValue(value.name),
  }));
  const selectedValue =
    parsedValues.find((item) => item.value.selected) || parsedValues[0];
  const selected = selectedValue?.facets || {};
  const facets = FACET_ORDER.map((key) => {
    if (key === 'bag' && parsedValues.some((item) => item.facets.kit)) {
      return null;
    }

    const choices = [];

    parsedValues.forEach((item) => {
      const value = item.facets[key];
      if (!value || choices.some((choice) => choice.value === value)) return;

      choices.push({value, label: value});
    });

    if (choices.length < 2) return null;

    return {
      key,
      label: FACET_LABELS[key],
      current: selected[key],
      choices,
    };
  }).filter(Boolean);

  if (!facets.length) return null;

  return {facets, parsedValues, selected};
}

function findBestStructuredValue({choice, facetKey, option, selected}) {
  const candidates = option.optionValues
    .map((value) => ({
      value,
      facets: parseStructuredOptionValue(value.name),
    }))
    .filter((item) => item.facets[facetKey] === choice.value);

  return candidates
    .map((item) => ({
      item,
      score: getStructuredOptionScore({
        candidate: item.facets,
        changedFacet: facetKey,
        selected,
      }),
    }))
    .sort((a, b) => b.score - a.score)[0]?.item.value;
}

function getStructuredOptionScore({candidate, changedFacet, selected}) {
  return Object.entries(selected).reduce((score, [key, value]) => {
    if (key === changedFacet) return score;
    return candidate[key] === value ? score + 1 : score;
  }, 0);
}

function parseStructuredOptionValue(name = '') {
  const text = name.toLowerCase();
  const facets = {};

  if (/\bfoil\b/.test(text)) facets.weapon = 'Foil';
  if (/\bepee\b|épée/.test(text)) facets.weapon = facets.weapon ? 'Foil / Epee' : 'Epee';
  if (/\bsabre\b|saber/.test(text)) facets.weapon = 'Sabre';

  if (/left[\s-]?hand(?:ed)?|\(left hand\)/.test(text)) facets.hand = 'Left-Handed';
  if (/right[\s-]?hand(?:ed)?/.test(text)) facets.hand = 'Right-Handed';

  if (/sky blue/.test(text)) facets.color = 'Sky Blue';
  else if (/dark blue|oxford blue/.test(text)) facets.color = /oxford blue/.test(text) ? 'Oxford Blue' : 'Dark Blue';
  else if (/\bblue\b/.test(text)) facets.color = 'Blue';
  else if (/rose red/.test(text)) facets.color = 'Rose Red';
  else if (/fluorescent red/.test(text)) facets.color = 'Fluorescent Red';
  else if (/\bred\b/.test(text)) facets.color = 'Red';
  else if (/\bpink\b/.test(text)) facets.color = 'Pink';
  else if (/\bpurple\b/.test(text)) facets.color = 'Purple';
  else if (/neon green/.test(text)) facets.color = 'Neon Green';
  else if (/grass green/.test(text)) facets.color = 'Grass Green';
  else if (/\bgreen\b/.test(text)) facets.color = 'Green';
  else if (/\byellow\b/.test(text)) facets.color = 'Yellow';
  else if (/\bgray\b|\bgrey\b/.test(text)) facets.color = 'Gray';
  else if (/\bblack\b/.test(text)) facets.color = 'Black';
  else if (/\bwhite\b/.test(text)) facets.color = 'White';

  if (/black and gold/.test(text)) facets.color = 'Black / Gold';
  if (/black and red/.test(text)) facets.color = 'Black / Red';
  if (/white, purple, and fluorescent red|white purple fluorescent red/.test(text)) {
    facets.color = 'White / Purple / Red';
  }

  if (/gold|golden/.test(text)) facets.finish = 'Gold';
  else if (/colorful|iridescent|colou?r/.test(text)) facets.finish = 'Iridescent';
  else if (/silver|stainless|rustproof/.test(text)) facets.finish = 'Silver';
  else if (/\bblue\b/.test(text) && /sword|foil|epee|sabre|blade/.test(text)) facets.finish = 'Blue';
  else if (/regular/.test(text)) facets.finish = 'Standard';

  if (/three-piece|3-piece/.test(text)) facets.garment = 'Three-Piece Set';
  else if (/jacket/.test(text)) facets.garment = 'Jacket';
  else if (/trousers|breeches|pants/.test(text)) facets.garment = 'Breeches';
  else if (/vest|plastron/.test(text)) facets.garment = 'Underarm Protector';

  if (/450n.*900n.*mask|450n jacket.*900n mask/.test(text)) {
    facets.protection = '450N Apparel / 900N Mask';
  } else if (/900n.*900n|900n set|1800n jacket/.test(text)) {
    facets.protection = '900N Set';
  } else if (/450n/.test(text)) {
    facets.protection = '450N Set';
  }

  if (/without sword bag/.test(text)) facets.kit = 'Set Only';
  else if (/roller sword bag|wheeled/.test(text)) facets.kit = 'With Wheeled Bag';
  else if (/backpack/.test(text)) facets.kit = 'With Backpack';

  if (/hand line|body cord/.test(text)) facets.cord = 'Body Cord';
  else if (/head clip/.test(text)) facets.cord = 'Head Clip Lead';
  else if (/mask.*line|mask lead/.test(text)) facets.cord = 'Mask Lead';

  if (/single sword case/.test(text)) facets.bag = 'Single Weapon Case';
  else if (/backpack/.test(text)) facets.bag = 'Backpack';
  else if (/team large roller bag|large roller bag/.test(text)) facets.bag = 'Large Wheeled Bag';
  else if (/set/.test(text) && /bag|warrior|blade|edge/.test(text)) facets.bag = 'Bag Set';

  if (/children|youth|child/.test(text)) facets.age = 'Youth';
  else if (/adult/.test(text)) facets.age = 'Adult';

  return facets;
}

function getOptionDisplayName(name) {
  const normalized = name.toLowerCase();

  if (normalized === 'shoe size') return 'Size';
  if (normalized === 'epee mask sizes') return 'Mask size';
  if (normalized === 'color classification') return 'Option';

  return name;
}

function getOptionValueDisplayName(optionName, value = '') {
  if (!value) return '';
  const normalized = optionName.toLowerCase();

  if (
    normalized === 'shoe size' &&
    /^\d+$/.test(value) &&
    Number(value) >= 20
  ) {
    return `EU ${value}`;
  }
  if (normalized === 'size') return value.replace(/^Size\s+/i, '');

  return value;
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
