/* seminjin.com — 콘텐츠 데이터
   내용 수정은 전부 이 파일에서만. HTML/CSS는 건드릴 필요 없음. */

const SITE = {
  name: "Semin Jin",
  role: "Design computing researcher",
  affiliation: "Hanyang University, Seoul",
  /* 연구 철학 — CV 요약을 한 문장으로 */
  statement: "I build AI-based generation for space, then test it against how bodies move, how surfaces are perceived, and how designers actually decide.",
  updated: "October 2026",
  labs: [
    { label: "Design AILab", url: "https://designinformatics.hanyang.ac.kr/" },
    { label: "Human-Centered AI Design Institute", url: "" }
  ],
  thesis: "Human-AI Collaboration in Design",

  levels: [
    { key: "spatial",      label: "Spatial",      desc: "Behavior-aware generation and evaluation for human-usable 3D layouts" },
    { key: "perceptual",   label: "Perceptual",   desc: "Computational aesthetics in color, material, light, and style" },
    { key: "experiential", label: "Experiential", desc: "Designer experience in human-AI collaboration" }
  ],

  /* 히어로 레일 — 축(key)별 대표 연구. spatial은 두 편. */
  heroLens: [
    {
      key: "spatial",
      project: "Behavior-Aware Anthropometric Scene Generation",
      venue: "ACM CHI 2026",
      note: "Body dimensions become the unit of the plan \u2014 shoulder breadth, forward reach, and the clearance a person needs to actually use a room.",
      media: "assets/img/hero/spatial.webp",
      transparent: true,
      href: "https://kindohyoku.github.io/BehaviorAware/"
    },
    {
      key: "spatial",
      project: "Human-operational 3D Indoor Layout Generation",
      venue: "Automation in Construction 2026",
      note: "An LLM-driven anthropometric simulator checks clearance, accessibility and alignment rules against the actions a room has to support.",
      media: "assets/img/hero/spatial-2.webp",
      transparent: false,
      href: "https://seminjin.github.io/HumanOperationalScene/"
    },
    {
      key: "perceptual",
      project: "Blending Designer Insights with Crowd-Based Colour Compatibility",
      venue: "Color Research & Application 2026",
      note: "The same room re-coloured and scored \u2014 saliency, harmony, and the palettes a crowd actually prefers.",
      media: "assets/img/hero/perceptual.webp",
      transparent: false,
      href: "https://seminjin.github.io/crowdbasedICE/"
    },
    {
      key: "experiential",
      project: "Sketch-guided vs. Prompt-guided 3D Generative AIs",
      venue: "ACM CHI 2024",
      note: "Two ways of asking pull the exploration in different directions; the designer keeps the one that holds.",
      media: "assets/img/hero/experiential.webp",
      transparent: false,
      href: "https://dl.acm.org/doi/fullHtml/10.1145/3613904.3642218"
    }
  ],

  contact: [
    { label: "seminijin@gmail.com",   url: "mailto:seminijin@gmail.com" },
    { label: "semini@hanyang.ac.kr",  url: "mailto:semini@hanyang.ac.kr" },
    { label: "Google Scholar",        url: "https://scholar.google.com/citations?user=jY6BdQMAAAAJ&hl" },
    { label: "LinkedIn",              url: "https://www.linkedin.com/in/semin-jin-0b907b2ab" },
    { label: "GitHub",                url: "https://github.com/SeminJin" }
  ],

  cv: "assets/files/Semin_Jin_CV.pdf",

  news: [
    { date: "Oct, 2026", text: "Paper published in <b>International Journal of Human&ndash;Computer Interaction</b>." },
    { date: "Apr, 2026", text: "Paper accepted to <b>Archives of Design Research</b>." },
    { date: "Feb, 2026", text: "Paper accepted to <b>Automation in Construction</b>." },
    { date: "Feb, 2026", text: "Paper accepted to <b>CHI 2026</b> in Barcelona." },
    { date: "Jan, 2026", text: "Paper published in <b>Color Research &amp; Application</b>." }
  ],

  publications: [
    {
      tags: ["experiential"],
      title: "How Agent-Driven Creative Trace Mining Reshapes Design Behavior in a Deployment Study of Intent-Aligned Multimodal Design",
      thumb: "assets/img/research_thumbs/designjournal.jpg",
      venue: "International Journal of Human–Computer Interaction", year: 2026, detail: "1–37",
      authors: "Seung Won Lee, Jiin Choi, Yejin Yun, <b>Semin Jin</b>, Yugyeong Jang, Geunmin Hwang, Sang Woon Park, Seonghoon Ban, Kyung Hoon Hyun",
      index: "SCIE", field: "Computer Science, Cybernetics; Ergonomics, IF=4.9",
      links: [
        { label: "html", url: "https://doi.org/10.1080/10447318.2026.2739092" }
      ]
    },
    {
      tags: ["experiential"],
      title: "Workflow-Net: Toward Understanding Designer Workflows in Generative AI-Driven Systems through Comparing Node- and Prompt-Based Interfaces",
      thumb: "assets/img/research_thumbs/workflow-net.jpg",
      venue: "Archives of Design Research", year: 2026, detail: "39(2): 7–34",
      authors: "Tae Hee Jo, Jiin Choi, <b>Semin Jin</b>, Seung Won Lee, Yugyeong Jang, Sang Woon Park, Seonghoon Ban, Kyung Hoon Hyun",
      index: "SCOPUS", field: "Computer-Aided Design; Architecture",
      links: [
        { label: "html", url: "https://doi.org/10.15187/adr.2026.05.39.2.7" },
        { label: "pdf",  url: "https://aodr.org/xml/49535/49535.pdf" }
      ]
    },
    {
      tags: ["spatial"],
      title: "Behavior-Aware Anthropometric Scene Generation for Human-Usable 3D Layouts",
      thumb: "assets/img/research_thumbs/chi2026-poster.webp",
      venue: "ACM CHI 2026 Paper", year: 2026, detail: "Barcelona, Spain",
      authors: "<b>Semin Jin</b>, Donghyuk Kim, Jeongmin Ryu, Kyung Hoon Hyun",
      index: "~SCIE TOP-TIER", field: "BKCSA003, h5-index=139",
      links: [
        { label: "html",         url: "https://doi.org/10.1145/3772318.3790341" },
        { label: "pdf",          url: "https://arxiv.org/pdf/2603.02662" },
        { label: "project page", url: "https://kindohyoku.github.io/BehaviorAware/" }
      ]
    },
    {
      tags: ["spatial"],
      title: "Human-operational 3D Indoor Layout Generation with LLM-Driven Anthropometric Simulation",
      thumb: "assets/img/hero/spatial-2.webp",
      venue: "Automation in Construction", year: 2026, detail: "",
      authors: "<b>Semin Jin</b>, Kyung Hoon Hyun",
      index: "SCIE TOP 1%", field: "Construction & Building Technology, IF=11.5",
      links: [
        { label: "html",         url: "https://doi.org/10.1016/j.autcon.2026.106846" },
        { label: "project page", url: "https://seminjin.github.io/HumanOperationalScene/" },
        { label: "dataset",      url: "https://github.com/SeminJin/HumanOperationalScene" },
        { label: "video",        url: "https://youtu.be/4vMlSgMkp_4" }
      ]
    },
    {
      tags: ["perceptual", "experiential"],
      title: "Blending Designer Insights With Predicted Crowd-Based Color Compatibility in Interior Color Design",
      thumb: "assets/img/research_thumbs/color-aesthetic.jpg",
      venue: "Color Research & Application", year: 2026, detail: "",
      authors: "<b>Semin Jin</b>, Kyung Hoon Hyun",
      index: "SCIE", field: "Chemistry, Applied; Optics, IF=1.4",
      links: [
        { label: "html",         url: "https://onlinelibrary.wiley.com/doi/10.1002/col.70055" },
        { label: "project page", url: "https://seminjin.github.io/crowdbasedICE/" },
        { label: "code",         url: "https://github.com/SeminJin/VL-ICAA" }
      ]
    },
    {
      tags: ["perceptual"],
      title: "An Explainable AI-based Approach for Identifying Interior Design Style Principles",
      thumb: "assets/img/research_thumbs/explainable.jpg",
      venue: "Advanced Engineering Informatics", year: 2026, detail: "",
      authors: "Jaehyun Seo, <b>Semin Jin</b>, Kyungah Choi, Kyung Hoon Hyun, Junegak Joung",
      index: "SCIE TOP 2%", field: "Computer Science, Artificial Intelligence; Multidisciplinary, IF=9.9",
      links: [
        { label: "html", url: "https://doi.org/10.1016/j.aei.2025.103879" }
      ]
    },
    {
      tags: ["perceptual"],
      title: "CMLsearch: Semantic Visual Search and Simulation through Segmented Colour, Material, and Lighting in Interior Image",
      thumb: "assets/img/research_thumbs/cmlsearch.webp",
      venue: "Journal of Computational Design and Engineering", year: 2025, detail: "",
      authors: "<b>Semin Jin</b>, Jiin Choi, Kyung Hoon Hyun",
      index: "SCIE", field: "Computer Science, Artificial Intelligence; Engineering, Multidisciplinary, IF=4.9",
      links: [
        { label: "html",  url: "https://doi.org/10.1093/jcde/qwae114" },
        { label: "pdf",   url: "https://academic.oup.com/jcde/article-pdf/12/1/179/61297420/qwae114.pdf" },
        { label: "video", url: "https://vimeo.com/1044275411" }
      ]
    },
    {
      tags: ["experiential"],
      title: "The Impact of Sketch-guided vs. Prompt-guided 3D Generative AIs on the Design Exploration Process",
      thumb: "assets/img/hero/experiential.webp",
      venue: "ACM CHI 2024 Paper", year: 2024, detail: "Honolulu, USA",
      authors: "Seung Won Lee, Tae Hee Joo, <b>Semin Jin</b>, Jiin Choi, Kyungwon Yun, Sergio Bromberg, Seonghoon Ban, Kyung Hoon Hyun",
      index: "~SCIE TOP-TIER", field: "BKCSA003, h5-index=113",
      links: [
        { label: "html", url: "https://dl.acm.org/doi/fullHtml/10.1145/3613904.3642218" },
        { label: "pdf",  url: "https://dl.acm.org/doi/pdf/10.1145/3613904.3642218" }
      ]
    },
    {
      tags: ["perceptual", "experiential"],
      title: "Enhancing the Interior Design Process with Crowdsourced Furnishing Pairing Recommendations",
      thumb: "assets/img/research_thumbs/associationrule.jpg",
      venue: "Archives of Design Research", year: 2024, detail: "",
      authors: "<b>Semin Jin</b>, Kyung Hoon Hyun",
      index: "SCOPUS", field: "", award: "🏆 EXCELLENCE AWARD",
      links: [
        { label: "html", url: "https://doi.org/10.15187/adr.2024.05.37.2.79" },
        { label: "pdf",  url: "https://aodr.org/xml/40686/40686.pdf" }
      ]
    }
  ],

  patents: [
    {
      status: "REGISTERED",
      ko: "사용자의 기존 공간을 고려한 인테리어 요소 색상, 재질, 조명 통합 기반의 제품 검색 및 구매지원 시스템 및 그 방법",
      en: "Method and Apparatus for Providing Interior Product Search Service",
      authors: "Kyung Hoon Hyun, <b>Semin Jin</b>, Jiin Choi",
      number: "Patent No. KR 10-2943193, Registered March 19, 2026"
    },
    {
      status: "FILED",
      ko: "인체측정 데이터 기반 행동 인식형 3차원 실내 공간 자동 생성 및 사용성 검증 시스템",
      en: "Anthropometric Data-driven Behavior-Aware Automatic 3D Indoor Scene Generation and Usability Evaluation System",
      authors: "Kyung Hoon Hyun, <b>Semin Jin</b>, Donghyuk Kim",
      number: "Application No. KR 10-2026-0040371"
    },
    {
      status: "FILED",
      ko: "다중 에이전트 기반 창의적 디자인 대화 구조화 및 시각화 시스템",
      en: "Multi-Agent-based Creative Design Conversation Structuring and Visualization System",
      authors: "Kyung Hoon Hyun, <b>Semin Jin</b>, Seung Won Lee",
      number: "Application No. KR 10-2026-0036677"
    },
    {
      status: "FILED",
      ko: "디자인 아티팩트 기반 이미지 생성 시스템 및 방법",
      en: "Design Artifact-based Image Generation System and Method",
      authors: "Kyung Hoon Hyun, Seung Won Lee, Jiin Choi, <b>Semin Jin</b>",
      number: "Application No. KR 10-2025-0184966"
    },
    {
      status: "FILED",
      ko: "군중 선호도 데이터를 활용한 공간 디자인 이미지의 설명적 평가 및 색채 조합 생성 시스템과 방법",
      en: "Explanatory Feedback through Vision-Language Augmented Image Color Aesthetic Assessment Model for Interior Image Color Combination Generation",
      authors: "Kyung Hoon Hyun, <b>Semin Jin</b>",
      number: "Application No. KR 10-2024-0054887"
    }
  ],

  /* ── Design Work ──────────────────────────────────────────────
     갤러리 카드(그리드) + 프로젝트별 상세 페이지 (#design/slug)
       kind  : 필터 카테고리 키 — workKinds 에서 라벨을 찾는다
       slug  : 상세 페이지 주소 (#design/slug). 영문 소문자·하이픈
       cover : 카드 대표 이미지 (생략하면 slides 의 첫 이미지)
       slides: 상세 페이지에 순서대로 — {src, title, text} 또는 {video: youtubeId, title, text}
               카드에 마우스를 올리면 slides 의 이미지들이 차례로 순환한다
       links : (선택) [{label, url}] — 논문·프로젝트 페이지·영상 등
     연구 프로젝트를 넣을 땐 kind: "research" 로 추가하면 필터가 자동으로 생긴다.
     ──────────────────────────────────────────────────────────── */
  workKinds: { spatial: "Spatial Design", research: "Research" },

  designWork: [
    /* 연구 프로젝트 템플릿 — 주석을 풀고 내용을 채우면 된다
    {
      kind: "research",
      slug: "behavior-aware",
      title: "Behavior-Aware Anthropometric Scene Generation",
      meta: "ACM CHI 2026 · with Donghyuk Kim, Jeongmin Ryu, Kyung Hoon Hyun",
      award: "",
      year: 2026,
      desc: "한두 문단 소개.",
      cover: "assets/img/hero/spatial.webp",
      links: [
        { label: "paper", url: "https://doi.org/10.1145/3772318.3790341" },
        { label: "project page", url: "https://kindohyoku.github.io/BehaviorAware/" }
      ],
      slides: [
        { src: "assets/img/work/behavior-aware/01.jpg", title: "…", text: "…" },
        { video: "youtubeId", title: "…", text: "…" }
      ]
    },
    */
    {
      kind: "spatial",
      slug: "parasol-memory",
      title: "Parasol Memory, Manri Market",
      meta: "Graduation Project, Kaywon University of Art & Design, 2021",
      award: "Excellence Award",
      year: 2021,
      desc: "Separated from central Seoul by railway infrastructure and steep terrain, Manri Market has retained a distinctive urban identity while gradually losing its vitality as a traditional marketplace. Parasol Memory reimagines the declining market as a flexible public space where memories of the existing market coexist with temporary programs, reconnecting the fragmented neighborhood through everyday activity and festivity.",
      slides: [
        { src: "assets/img/work/parasol-memory/01.jpg", title: "Existing Manri Market", text: "Located near Seoul Station, Manri Market developed organically along the sloping streets of Seogye-dong, where vendors and shops appeared wherever people moved, met, and exchanged goods. Today, the market remains physically present but has largely lost the vitality and functions of its former marketplace." },
        { src: "assets/img/work/parasol-memory/02.jpg", title: "Parasol Pop-up Space", text: "The project takes the parasol—a familiar element of traditional street markets—as a symbol of temporality and occupation. A parasol appears when activity begins and disappears when it ends, temporarily transforming an ordinary street into a place of exchange, gathering, and social interaction." },
        { src: "assets/img/work/parasol-memory/03.jpg", title: "Memory & Imagination", text: "The proposal is organized around two complementary ideas: Memory and Imagination. Memory reinforces the everyday activities and spatial character of the existing market, while Imagination introduces flexible spaces for new activities to emerge. The Parasol Plaza and Pop-up Space accommodate temporary markets, events, gatherings, and festivals in response to changing needs." },
        { src: "assets/img/work/parasol-memory/04.jpg", title: "Preserving the Existing Structure", text: "Rather than replacing the market's complex spatial structure, the project embraces the different levels, entrances, traces, and irregularities created over time. New interventions work within this existing fabric, preserving the identity of the market while reconnecting the fragmented slopes of Manri Hill." },
        { src: "assets/img/work/parasol-memory/05.jpg", title: "Physical Model", text: "The physical model reveals how permanent memories and temporary activities coexist within the existing market fabric. Rather than imposing a singular new structure, the proposal works with the accumulated levels, paths, and spaces of Manri Market while allowing new activities to emerge throughout the site." },
        { video: "dwGzhwqycQw", title: "Project Film", text: "By allowing permanent memories and temporary activities to coexist, Parasol Memory transforms Manri Market into an evolving public realm. The project preserves the identity of the existing market while reconnecting the fragmented slopes of Manri Hill through new possibilities for gathering, exchange, and celebration." }
      ]
    },
    {
      kind: "spatial",
      slug: "return-to-flow",
      title: "Return to Flow of Nature",
      meta: "International Invitation Exhibition (Korean Institute of Interior Design), 2022",
      award: "Excellence Award",
      year: 2022,
      desc: "As highways and electric mobility reshape transportation, roadside rest areas and gas stations are gradually losing their original roles. Return to Flow of Nature reimagines an abandoned rest area along National Route 44 as a wellness retreat—transforming obsolete roadside infrastructure into a destination worth visiting again.",
      slides: [
        { src: "assets/img/work/return-to-flow/01.jpg", title: "Reimagining Roadside Infrastructure", text: "Return to Flow of Nature reimagines an abandoned roadside rest area along National Route 44 in Yangpyeong, South Korea. Once built to serve travelers, rest areas and gas stations along national highways have gradually lost their role as traffic has shifted toward expressways. The transition toward electric mobility is expected to further accelerate this change, leaving many roadside facilities without their original purpose." },
        { src: "assets/img/work/return-to-flow/02.jpg", title: "Transforming the Existing Site", text: "The project reorganizes the existing structures and landscape for a new form of occupation. The former gas station, accommodation spaces, circulation routes, and surrounding terrain are adapted to support rest, contemplation, and longer stays, allowing the site to take on a new role beyond mobility." },
        { src: "assets/img/work/return-to-flow/03.jpg", title: "Wellness Retreat", text: "The abandoned rest area is transformed into a wellness retreat where the journey itself becomes a reason to stop. Instead of functioning as a transient roadside facility, the site becomes a destination where visitors intentionally arrive, stay, and reconnect with the surrounding landscape. Through this transformation, the rest area returns to the flow of nature." }
      ]
    },
    {
      kind: "spatial",
      slug: "super-block",
      title: "Super Block",
      meta: "2022",
      award: "",
      year: 2022,
      desc: "Super Block reimagines the area around Busanjin Station as a large-scale urban park connecting essential neighborhood facilities within a 15-minute walking radius. By linking local nodes through a continuous pedestrian landscape and relocating parking underground, the project transforms a dense neighborhood into a more walkable and connected public realm.",
      slides: [
        { src: "assets/img/work/super-block/03.jpg", title: "Park as Urban Infrastructure", text: "The resulting landscape operates as more than a conventional park. It becomes a piece of urban infrastructure that integrates mobility, public programs, neighborhood facilities, and everyday recreation within a single continuous system. By relocating parking underground and prioritizing pedestrian movement above, Super Block creates a greener and more walkable public realm for a dense and long-established neighborhood." },
        { src: "assets/img/work/super-block/01.jpg", title: "A 15-Minute Neighborhood Park", text: "Super Block proposes a large-scale urban park around Busanjin Station, connecting essential neighborhood facilities within a 15-minute walking radius. Schools, community offices, health centers, and cultural facilities become key local nodes, while the area between them is reorganized as a continuous public landscape. By placing everyday destinations within a shared pedestrian network, the project transforms a fragmented neighborhood into a more accessible and connected urban environment." },
        { src: "assets/img/work/super-block/02.jpg", title: "Connecting Urban Nodes", text: "The masterplan organizes the neighborhood around a central public landscape, from which pedestrian routes extend radially toward surrounding community facilities. These connections shorten everyday travel between key destinations while creating a clear spatial network through the park. Below ground, a large shared parking structure absorbs neighborhood parking demand and reduces surface congestion, allowing the ground level to be reclaimed for pedestrians and public space." }
      ]
    },
    {
      kind: "spatial",
      slug: "scenes-of-the-arcade",
      title: "Scenes of the Arcade",
      meta: "2022",
      award: "",
      year: 2022,
      desc: "Inspired by the lively urban scenes of the late-Joseon painting Taepyeongseongsido, Scenes of the Arcade reimagines an aging antique art arcade as a contemporary cultural street. Spaces for viewing, learning, making, shopping, and gathering reconnect traditional art with everyday neighborhood life, while a modular kinetic facade allows the arcade to adapt to changing cultural and public programs.",
      slides: [
        { src: "assets/img/work/scenes-of-the-arcade/05.gif", title: "Kinetic Facade", text: "A modular kinetic facade allows the renovated spaces to respond to changing programs and levels of openness. The system can adapt to classes, lectures, exhibitions, library programs, and other cultural activities while changing the relationship between the interior and the surrounding street. The facade becomes a flexible architectural layer that supports different forms of learning, exchange, and public activity." },
        { src: "assets/img/work/scenes-of-the-arcade/01.jpg", title: "An Aging Antique Art Arcade", text: "The project renovates an aging antique art arcade located beneath a residential apartment complex. The existing shops stretch along the bases of separate apartment blocks, creating a distinctive relationship between everyday residential life, the street, and the commercial arcade. Rather than treating the shops as an isolated retail facility, the proposal reconnects these spaces with the movement of the surrounding neighborhood." },
        { src: "assets/img/work/scenes-of-the-arcade/02.jpg", title: "Inspired by Taepyeongseongsido", text: "The project is inspired by Taepyeongseongsido, a late-Joseon painting depicting an idealized and prosperous city filled with people, shops, buildings, and everyday activities. People move, play, trade goods, make objects, and gather throughout the city. These overlapping scenes of commerce, production, leisure, and social life become the conceptual basis for reimagining the antique arcade." },
        { src: "assets/img/work/scenes-of-the-arcade/03.jpg", title: "From Shops to Shared Experience", text: "The spatial organization translates the activities found in Taepyeongseongsido into a contemporary sequence of programs and movement. Existing antique shops are connected with spaces for exhibitions, learning, making, lectures, and informal gathering. Visitors move between the street, arcade, and apartment blocks while experiencing traditional art through viewing, purchasing, learning, and making." },
        { src: "assets/img/work/scenes-of-the-arcade/04.jpg", title: "A Contemporary Urban Scene", text: "The renewed arcade becomes a contemporary interpretation of the lively urban scenes depicted in Taepyeongseongsido. Commercial activity is combined with exhibitions, workshops, cultural programs, and everyday pedestrian movement, allowing traditional art to become part of daily neighborhood life. The arcade is transformed from a static retail environment into a shared cultural street where different activities continuously overlap." }
      ]
    }
  ],

  teaching: [
    { year: "2026 Fall",   text: "Instructor, Design Computing Research, Hanyang University" },
    { year: "2026 Spring", text: "Teaching Fellow, Furniture Design & Digital Fabrication (4 weeks), Hanyang University" },
    { year: "2025 Spring", text: "Teaching Fellow, Furniture Design & Digital Fabrication (4 weeks), Hanyang University" }
  ],

  service: [
    "Reviewer, ACM UIST (2024–2026)",
    "Reviewer, ACM Creativity & Cognition (2026)",
    "Reviewer, Frontiers of Architectural Research (2026)"
  ]
};
