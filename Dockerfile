# ---- Backend Dockerfile (repo root) ----
# Render will find this automatically with no extra path config needed.
FROM python:3.11-slim

WORKDIR /app

# Copy API files
COPY blindspot-api/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY blindspot-api/ .

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
