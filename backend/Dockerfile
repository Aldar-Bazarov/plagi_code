FROM python:3.11-slim

WORKDIR /code

# Установить Poetry
RUN pip install --no-cache-dir poetry

# Копировать только pyproject.toml и poetry.lock для установки зависимостей
COPY pyproject.toml poetry.lock* ./

# Установить зависимости через Poetry (без dev-зависимостей)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Копировать остальной код
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]