FROM python:3.12.6-slim-bookworm
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY requirements.txt /app
RUN python -m pip install -r /app/requirements.txt

COPY ImagePromptEnhancer.py /app/ImagePromptEnhancer.py
COPY noton /app/noton

EXPOSE 8501

CMD ["streamlit", "run", "/app/ImagePromptEnhancer.py", "--server.port", "8501", "--server.address", "0.0.0.0"]
