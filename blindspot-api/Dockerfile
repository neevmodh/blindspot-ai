FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the default port (Hugging Face Spaces uses 7860, others use 8000)
# We use an environment variable for PORT, defaulting to 8000
ENV PORT=8000
EXPOSE $PORT

# Run the FastAPI server
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
