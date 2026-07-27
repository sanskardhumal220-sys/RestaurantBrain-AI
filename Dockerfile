FROM python:3.10-slim

# Set up a new user named "user" with user ID 1000
# Hugging Face Spaces require running as a non-root user
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Copy the requirements file and install dependencies
COPY --chown=user backend/requirements.txt $HOME/app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY --chown=user backend/ $HOME/app/

# Hugging Face exposes port 7860
ENV PORT=7860
EXPOSE 7860

# Run the gunicorn server
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860"]
