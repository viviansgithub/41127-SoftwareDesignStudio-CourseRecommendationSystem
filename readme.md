# Software Studio

## Running Instructions

Enter `Ctr + C` to safely exit front or back end services.

### Front End

```bash
cd front-end
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Back End

Can be run in 2 ways after navigating to `back-end`:

``` bash
cd back-end
```

#### Standard

``` bash
python3 service/src/app.py
```

#### Docker Compose

``` bash
cd service/dev &&
docker-compose up --build
```

## How to PR

``` bash
git branch example
git checkout example

git checkout -b example
```

``` bash
git add .
git commit -m "..."
git push
```

## How to set up a virtual environment

navigate

``` bash
cd back-end
```

create

``` bash
python3 -m venv env
```

activate

``` bash
source env/bin/activate
```

install dependencies

``` bash
poetry install
```
