from typing import BinaryIO, Union

import assemblyai as aai

from app.core.config import ASSEMBLYAI_API_KEY

aai.settings.api_key = ASSEMBLYAI_API_KEY

config = aai.TranscriptionConfig(language_code="en", speech_model=aai.SpeechModel.best)


async def transcript_audio(audio_file: Union[str, BinaryIO]) -> aai.Transcript:
    return aai.Transcriber(config=config).transcribe(audio_file)
