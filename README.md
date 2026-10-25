# Portfolio & Blog

흰 배경과 검은 글자의 간단한 개인 사이트입니다. 프로젝트 제목은 외부 웹사이트로 연결되고, 블로그는 이 사이트 안에서 읽습니다. 이름·직무·주소는 아직 비워 두었습니다.

## 내 정보 수정

GitHub에서 `site.json` 파일을 열고 연필 버튼(Edit)을 누르세요. 따옴표 안의 내용만 수정하고 **Commit changes**를 눌러 저장합니다.

| 항목 | 내용 |
| --- | --- |
| `name` | 표시할 이름 |
| `role` | 지원 직무 또는 짧은 직함. 비어 있으면 숨김 |
| `intro` | 첫 화면 소개 한 줄 |
| `about` | About 소개 문단 |
| `github` | GitHub 주소 |
| `linkedin` | LinkedIn 프로필 주소. 비어 있으면 숨김 |
| `email` | 이메일 주소. 비어 있으면 숨김 |
| `projects`의 `title` | 프로젝트 이름 |
| `projects`의 `url` | `https://`로 시작하는 웹 주소. 비어 있으면 In progress |

이름·소개가 비어 있으면 미리보기용 안내 문구가 표시됩니다. 공개하기 전에 채우세요. JSON에서는 마지막 항목 뒤에 쉼표를 붙이지 않습니다. 문장 안의 큰따옴표는 `\"`로 적습니다.

## 글 작성 — Git 명령어 없이

1. `templates/post.md`의 내용을 복사합니다.
2. GitHub의 `posts` 폴더에서 **Add file → Create new file**을 누릅니다.
3. 파일명을 `2026-10-25-my-first-post.md`처럼 영문·숫자·하이픈으로 적습니다.
4. 템플릿을 붙여 넣고 `title`, `date`, 본문을 바꿉니다. 제목과 본문은 한국어여도 됩니다.
5. 영어 글은 `lang: en`, 한국어 글은 `lang: ko`로 설정합니다.
6. 공개할 글은 `draft: false`로 바꾸고 **Commit changes**로 저장합니다. `draft: true`는 사이트에서 제외되지만 공개 저장소의 파일은 누구나 읽을 수 있습니다.
7. Actions 작업이 성공하면 사이트에 반영됩니다.

제목·날짜 등 맨 위 정보는 한 줄씩 유지하세요. 본문은 일반 Markdown을 지원합니다. 예제 글 `posts/2026-10-25-starting-small.md`는 수정하거나 삭제하세요.

## 최초 GitHub Pages 게시

이 초안은 아직 GitHub에 업로드하거나 공개하지 않았습니다.

1. `kippeum-woo` 계정에서 공개 저장소 `kippeum-woo.github.io`를 만듭니다.
2. 이 프로젝트 소스를 `main` 브랜치에 올립니다. `.github/workflows/pages.yml`도 포함되어야 하며 `node_modules`와 `dist`는 올리지 않습니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. **Actions → Publish website → Run workflow**를 실행합니다. 이후에는 main에 저장하면 자동 실행됩니다.
5. 배포 성공 후 예상 주소는 `https://kippeum-woo.github.io/`입니다. 이미 이 이름의 저장소가 있다면 기존 내용을 먼저 확인하세요.
6. 완성된 웹사이트 주소를 LinkedIn에 추가합니다.

일반 이름의 저장소를 쓰면 주소는 `https://kippeum-woo.github.io/저장소이름/`입니다. 상대경로를 사용하므로 이 경우도 지원합니다.

## 컴퓨터에서 미리보기

Node.js 22 이상에서:

```sh
npm install
npm run build
npm run preview
```

`http://127.0.0.1:4173`을 엽니다. 파일을 수정한 후 build를 다시 실행하고 새로고침하세요. `dist`는 생성 결과이며 직접 수정하지 않습니다. Markdown의 HTML은 작성자가 관리하는 콘텐츠로 그대로 출력됩니다.

배포 설정 참고: [GitHub Pages 공식 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
