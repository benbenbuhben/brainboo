#!/bin/bash

# Start Ollama in the background.
# (Using the full path /bin/ollama if needed)
ollama serve &
# Record the process ID.
pid=$!

# Wait a few seconds for Ollama to start.
sleep 5

echo "Retrieving model (gemma2:2b)..."
ollama pull gemma2:2b
echo "Done."

# Wait for the Ollama server process to finish.
wait $pid
