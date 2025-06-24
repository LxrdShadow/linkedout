from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.services.transcription import transcript_audio

router = APIRouter(prefix="/audio", tags=["audio"])


@router.post("/transcript", status_code=status.HTTP_200_OK)
async def get_transcript(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        return JSONResponse(status_code=400, content={"error": "Invalid file type"})

    audio_bytes = await file.read()
    transcript = await transcript_audio(audio_bytes)

    if transcript.status == "error":
        raise HTTPException(500, "Erreur lors de la transcription.")

    return {"transcript": transcript.text}
