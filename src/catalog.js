const imageFiles = import.meta.glob("../assets/*.{jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const categoryDetails = {
  dresses: {
    label: "Girlswear",
    productName: "Little Celebration Dress",
    description: "A colorful little look for the happiest days on the calendar.",
  },
  lehengas: {
    label: "Kids lehengas",
    productName: "Festive Lehenga Set",
    description: "A special-occasion twirl set with joyful color and traditional detail.",
  },
  sets: {
    label: "Festive sets",
    productName: "Little Festive Set",
    description: "A celebration-ready outfit made for movement, photos, and play.",
  },
  family: {
    label: "Mom & me",
    productName: "Matching Celebration Look",
    description: "Coordinated festive style for family photos and days together.",
  },
};

const optimizedImageGroups = {
  "blush-rose-lehenga.webp": "50-27",
  "floral-twirl-set.webp": "50-23",
  "hero-mom-and-me.webp": "50-44",
  "lavender-dream-lehenga.webp": "50-28",
  "lime-garden-lehenga.webp": "50-27",
  "mom-and-me-marigold.webp": "50-41",
  "petal-party-set.webp": "50-36",
  "rani-red-lehenga.webp": "50-22",
  "sibling-celebration-set.webp": "50-42",
  "twirl-set-detail.webp": "50-52",
};

function getCategory(minute, second) {
  if (minute === 50 && second >= 41 && second <= 47) return "family";
  if (minute === 50 && second >= 32 && second <= 40) return "sets";
  if ((minute === 50 && second >= 25 && second <= 31) || minute === 51 || second >= 48) {
    return "lehengas";
  }
  return "dresses";
}

const categoryOrder = { dresses: 0, lehengas: 1, sets: 2, family: 3 };
const categorySequence = { dresses: 0, lehengas: 0, sets: 0, family: 0 };

export const products = Object.entries(imageFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([filePath, src]) => {
    const fileName = filePath.split("/").pop();
    const timestamp = fileName.match(/at \d+\.(\d+)\.(\d+)\s*PM/i);
    const optimizedGroup = optimizedImageGroups[fileName];

    if (!timestamp && !optimizedGroup) {
      throw new Error(`Catalog image does not have a supported WhatsApp timestamp: ${fileName}`);
    }

    const [minute, second] = (optimizedGroup ?? `${timestamp[1]}-${timestamp[2]}`).split("-").map(Number);
    const category = getCategory(minute, second);
    const details = categoryDetails[category];
    const categoryNumber = ++categorySequence[category];
    const image = { src, alt: `${details.label} outfit, product ${categoryNumber}` };
    const key = fileName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const price = 1290 + ((minute * 19 + second * 37) % 8) * 100;

    return {
      key,
      category,
      images: [image],
      image,
      name: `${details.productName} ${String(categoryNumber).padStart(2, "0")}`,
      label: details.label,
      description: details.description,
      price,
      sizes: ["1–2Y", "2–3Y", "3–4Y", "4–5Y", "5–6Y", "6–7Y", "7–8Y"],
    };
  })
  .sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category] || a.name.localeCompare(b.name, undefined, { numeric: true }));

export const catalogCategories = [
  { id: "all", label: "All kidswear" },
  { id: "dresses", label: "Girlswear" },
  { id: "lehengas", label: "Kids lehengas" },
  { id: "sets", label: "Festive sets" },
  { id: "family", label: "Mom & me" },
];
