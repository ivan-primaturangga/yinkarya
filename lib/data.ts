export type Lang = "id" | "en" | "zh";
export type L10n = Record<Lang, string>;

export type Slide = { kind: string; title: L10n; body: L10n };
export type Artwork = {
  slug: string;
  name: L10n;
  category: L10n;
  artisan: string;
  origin: string;
  hue: string; // gradient placeholder for photo
  slides: Slide[];
};

const t = (id: string, en: string, zh: string): L10n => ({ id, en, zh });

export const artworks: Artwork[] = [
  {
    slug: "topeng-barong",
    name: t("Topeng Barong", "Barong Mask", "巴龙面具"),
    category: t("Seni Ukir", "Wood Carving", "木雕"),
    artisan: "I Wayan Sudarta",
    origin: "Mas, Ubud, Bali",
    hue: "from-amber-700 via-red-800 to-stone-900",
    slides: [
      { kind: "cover", title: t("Topeng Barong", "Barong Mask", "巴龙面具"), body: t("Ukiran kayu pule dari Mas, Ubud.", "Pule wood carving from Mas, Ubud.", "来自乌布马斯村的普勒木雕刻。") },
      { kind: "intro", title: t("Pengenalan", "Introduction", "简介"), body: t("Barong adalah makhluk mitologi pelindung yang melambangkan kebaikan dalam tradisi Bali.", "The Barong is a mythical guardian creature symbolising good in Balinese tradition.", "巴龙是神话中的守护神兽，在巴厘传统中象征善。") },
      { kind: "artisan", title: t("Sang Pengrajin", "The Artisan", "工匠"), body: t("I Wayan Sudarta mengukir sejak usia 12 tahun, meneruskan keahlian ayahnya.", "I Wayan Sudarta has carved since age 12, continuing his father's craft.", "I Wayan Sudarta 12岁起开始雕刻，传承父亲的手艺。") },
      { kind: "story", title: t("Cerita", "The Story", "故事"), body: t("Topeng ini dibuat untuk upacara desa dan dipercaya menjaga desa dari bencana.", "This mask was made for village ceremonies and is believed to protect the village.", "这件面具为村落仪式而作，被认为能保护村庄。") },
      { kind: "process", title: t("Proses", "The Process", "工艺"), body: t("Kayu pule dipahat kasar, dihaluskan, diwarnai pigmen alami, lalu disepuh emas.", "Pule wood is roughed out, smoothed, painted with natural pigments, then gilded.", "普勒木经粗凿、打磨、天然颜料上色，最后贴金。") },
      { kind: "philosophy", title: t("Filosofi", "Philosophy", "哲学"), body: t("Rwa bhineda: keseimbangan antara baik dan buruk menjaga harmoni semesta.", "Rwa bhineda: the balance of good and evil sustains cosmic harmony.", "Rwa bhineda：善恶平衡维系宇宙和谐。") },
      { kind: "closing", title: t("Terima Kasih", "Thank You", "谢谢"), body: t("Terima kasih telah menghargai karya dan budaya Bali.", "Thank you for appreciating Balinese art and culture.", "感谢您欣赏巴厘的艺术与文化。") },
    ],
  },
  {
    slug: "perak-celuk",
    name: t("Perhiasan Perak Celuk", "Celuk Silver Jewelry", "切鲁克银饰"),
    category: t("Kerajinan Perak", "Silversmithing", "银器工艺"),
    artisan: "Ni Made Ayu Lestari",
    origin: "Celuk, Gianyar, Bali",
    hue: "from-slate-500 via-slate-700 to-stone-900",
    slides: [
      { kind: "cover", title: t("Perhiasan Perak Celuk", "Celuk Silver Jewelry", "切鲁克银饰"), body: t("Filigri perak halus dari Desa Celuk.", "Fine silver filigree from Celuk village.", "来自切鲁克村的精细银丝工艺。") },
      { kind: "intro", title: t("Pengenalan", "Introduction", "简介"), body: t("Celuk dikenal sebagai sentra perak Bali sejak masa kerajaan.", "Celuk has been Bali's silver hub since the royal era.", "切鲁克自王朝时代起就是巴厘的银器中心。") },
      { kind: "artisan", title: t("Sang Pengrajin", "The Artisan", "工匠"), body: t("Ni Made Ayu Lestari menekuni perak selama 20 tahun.", "Ni Made Ayu Lestari has worked silver for 20 years.", "Ni Made Ayu Lestari 从事银器创作已20年。") },
      { kind: "process", title: t("Proses", "The Process", "工艺"), body: t("Perak dilebur, ditarik menjadi kawat, dililit dan disolder satu per satu.", "Silver is melted, drawn into wire, twisted and soldered piece by piece.", "银料熔化、拉丝、盘绕并逐件焊接。") },
      { kind: "closing", title: t("Terima Kasih", "Thank You", "谢谢"), body: t("Setiap perhiasan membawa kesabaran tangan pembuatnya.", "Every piece carries the patience of its maker.", "每件首饰都凝聚着匠人的耐心。") },
    ],
  },
];

export const getArtwork = (slug: string) => artworks.find((a) => a.slug === slug);
