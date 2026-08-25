/* seminjin.com — 콘텐츠 데이터
   내용 수정은 전부 이 파일에서만. HTML/CSS는 건드릴 필요 없음. */

const SITE = {
  name: "Semin Jin",
  role: "Post-doctoral researcher in Interior Architecture Design",
  affiliation: "Hanyang University, Seoul, Korea",
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

  contact: [
    { label: "seminijin@gmail.com",   url: "mailto:seminijin@gmail.com" },
    { label: "semini@hanyang.ac.kr",  url: "mailto:semini@hanyang.ac.kr" },
    { label: "Google Scholar",        url: "https://scholar.google.com/citations?user=jY6BdQMAAAAJ&hl" },
    { label: "LinkedIn",              url: "https://www.linkedin.com/in/semin-jin-0b907b2ab" },
    { label: "GitHub",                url: "https://github.com/SeminJin" }
  ],

  cv: "assets/files/Semin_Jin_CV.pdf",

  news: [
    { date: "Apr, 2026", text: "Paper accepted to <b>Archives of Design Research</b>." },
    { date: "Feb, 2026", text: "Paper accepted to <b>Automation in Construction</b>." },
    { date: "Feb, 2026", text: "Paper accepted to <b>CHI 2026</b> in Barcelona." },
    { date: "Jan, 2026", text: "Paper published in <b>Color Research &amp; Application</b>." }
  ],

  publications: [
    {
      tags: ["experiential"],
      title: "Workflow-Net: Toward Understanding Designer Workflows in Generative AI-Driven Systems through Comparing Node- and Prompt-Based Interfaces",
      venue: "Archives of Design Research", year: 2026, detail: "39(2): 7–34",
      authors: "Tae Hee Jo, Jiin Choi, <b>Semin Jin</b>, Seung Won Lee, Yugyeong Jang, Sang Woon Park, Seonghoon Ban, Kyung Hoon Hyun",
      index: "SCOPUS", field: "Computer-Aided Design; Architecture",
      thumb: "assets/img/workflow-net.jpg",
      links: [
        { label: "html", url: "https://doi.org/10.15187/adr.2026.05.39.2.7" },
        { label: "pdf",  url: "https://aodr.org/xml/49535/49535.pdf" }
      ]
    },
    {
      tags: ["spatial"],
      title: "Behavior-Aware Anthropometric Scene Generation for Human-Usable 3D Layouts",
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

  designWork: [
    {
      slug: "parasol-memory",
      title: "Parasol Memory, Manri Market",
      meta: "Graduation Project, Kaywon University of Art & Design, 2021",
      award: "Excellence Award",
      year: 2021,
      desc: "Separated from central Seoul by railway infrastructure and steep terrain, Manri Market has retained a distinctive urban identity while gradually losing its vitality as a traditional marketplace. Parasol Memory reimagines the declining market as a flexible public space where memories of the existing market coexist with temporary programs, reconnecting the fragmented neighborhood through everyday activity and festivity.",
      images: []
    },
    {
      slug: "return-to-flow",
      title: "Return to Flow of Nature",
      meta: "International Invitation Exhibition (Korean Institute of Interior Design), 2022",
      award: "Excellence Award",
      year: 2022,
      desc: "As highways and electric mobility reshape transportation, roadside rest areas and gas stations are gradually losing their original roles. Return to Flow of Nature reimagines an abandoned rest area along National Route 44 as a wellness retreat—transforming obsolete roadside infrastructure into a destination worth visiting again.",
      images: []
    },
    {
      slug: "super-block",
      title: "Super Block",
      meta: "2022",
      award: "",
      year: 2022,
      desc: "Super Block reimagines the area around Busanjin Station as a large-scale urban park connecting essential neighborhood facilities within a 15-minute walking radius. By linking local nodes through a continuous pedestrian landscape and relocating parking underground, the project transforms a dense neighborhood into a more walkable and connected public realm.",
      images: []
    },
    {
      slug: "scenes-of-the-arcade",
      title: "Scenes of the Arcade",
      meta: "2022",
      award: "",
      year: 2022,
      desc: "Inspired by the lively urban scenes of the late-Joseon painting Taepyeongseongsido, Scenes of the Arcade reimagines an aging antique art arcade as a contemporary cultural street. Spaces for viewing, learning, making, shopping, and gathering reconnect traditional art with everyday neighborhood life, while a modular kinetic facade allows the arcade to adapt to changing cultural and public programs.",
      images: []
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
