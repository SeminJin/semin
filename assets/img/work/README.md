# 디자인 프로젝트 이미지 넣는 곳

프로젝트별 폴더에 넣고, `data/site.js`의 `designWork` 항목 `slides`에 순서대로 적으면 됩니다.
카드 대표 이미지는 `cover` 또는 첫 번째 slide 이미지이고, 카드에 마우스를 올리면 slides 이미지가 차례로 바뀝니다.
상세 페이지(`#design/slug`)에는 slides가 캡션과 함께 세로로 나열됩니다.

- room-strata/           Room Strata (2026) — 인터랙티브 도구는 tools/room-strata/ 에 있고 slides 의 embed 로 들어감
- parasol-memory/        Parasol Memory, Manri Market (2021)
- return-to-flow/        Return to Flow of Nature (2022)
- super-block/           Super Block (2022)
- scenes-of-the-arcade/  Scenes of the Arcade (2022)

연구 프로젝트는 같은 방식으로 폴더를 만들고 `kind: "research"`로 추가하면 필터가 자동으로 생깁니다.
