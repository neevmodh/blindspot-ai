# ---- FastAPI Backend Dockerfile ----
FROM python:3.11-slim

WORKDIR /app

# PyMuPDF ships pre-built wheels — no system packages needed
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
