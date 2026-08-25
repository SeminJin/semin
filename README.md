# seminjin.com

Personal site of Semin Jin — post-doctoral researcher in Interior Architecture Design, Hanyang University.

## 구조

```
index.html          랜딩 + 탭
data/site.js        ← 모든 콘텐츠 (논문·특허·프로젝트·강의)
assets/css/style.css
assets/js/app.js    탭 렌더러
assets/img/         이미지
assets/files/       CV PDF
```

**내용을 고칠 땐 `data/site.js` 만 수정하면 됩니다.** HTML/CSS는 건드릴 필요 없습니다.

## 로컬 실행

```bash
python3 -m http.server 4321
```

http://localhost:4321 접속.
