import joblib
import json
from pathlib import Path
from typing import Any, Dict, Tuple

class ModelLoader:
    _instance = None
    _model = None
    _metadata = None

    def __new__(cls):
      if cls._instance is None:
        cls._instance = super().__new__(cls)
      return cls._instance
    
    def load(self, model_path: Path, metadata_path: Path) -> Tuple[Any, Dict]:
      if self._model is not None and self._metadata is not None:
        return self._model, self._metadata
      try:
        self._model = joblib.load(model_path)

        with open(metadata_path, 'r') as f:
          self._metadata = json.load(f)
        return self._model, self._metadata
      except FileNotFoundError as e:
        raise RuntimeError(f"Model or metadata file not found: {e}")
      except Exception as e:
        raise RuntimeError(f"Error loading model or metadata: {e}")
      
    def get_model(self) -> Any:
      if self._model is None:
        raise RuntimeError("Model not loaded. Call load() first.")
      return self._model
    
    def get_metadata(self)-> Dict:
      if self._metadata is None:
        raise RuntimeError("Metadata not loaded. Call load() first.")
      return self._metadata