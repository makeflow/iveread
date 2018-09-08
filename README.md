# IveRead

## Install

```bash
yarn install iveread -D
```

## Configuration

`iveread.json`

```json
{
  "docDir": "docs/guideline"
}
```

## Markdown Format

````markdown
## Who's read this

```iveread: @/src/task
Dizy Zeng
Mr Nobody
Someone
```
````

## Travis CI Configuration

```
language: node_js

node_js:
  - stable

before_install:
  - curl -o- -L https://yarnpkg.com/install.sh | bash -s -- -- version 1.9.4
  - export PATH="$HOME/.yarn/bin:$PATH"
cache:
  directory:
    - $HOME/.yarn/bin

install: yarn install

script: yarn iveread
```
