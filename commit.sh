#!/bin/bash
git add src/styles.css src/app/app.component.html
git commit -m "style: implement premium scandinavian minimal design system"

git add src/app/models/ src/app/services/
git commit -m "feat(core): add captcha models and state management services"

git add src/app/captcha/components/math-challenge/ src/app/captcha/components/logic-challenge/
git commit -m "feat(challenges): implement math and reasoning puzzles"

git add src/app/captcha/components/pattern-challenge/ src/app/captcha/components/image-challenge/
git commit -m "feat(challenges): implement visual pattern and image selection puzzles"

git add src/app/home/ src/app/captcha/captcha.component.ts src/app/result/ src/app/guards/ src/app/app.routes.ts
git commit -m "feat(routing): integrate challenges into main captcha engine and result guards"
