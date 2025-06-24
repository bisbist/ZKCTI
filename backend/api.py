from fastapi import APIRouter, Body
from utils.zk_circom import (
    sample_row,
    predict_with_model,
    generate_proof_ezkl,
    verify_proof_ezkl,
)

from fastapi import HTTPException

router = APIRouter()


@router.get("/generate-random-sample")
def get_random_sample():
    """Return a random row/sample from the test set, preprocessed."""
    sample = sample_row()
    return sample


@router.post("/predict")
def predict_endpoint(body=Body(...)):
    features = body.get("features")
    if not features:
        raise HTTPException(
            status_code=400, detail="Missing 'features' in request body"
        )
    result = predict_with_model(features)
    return {"prediction": result}


@router.post("/generate-proof")
def generate_proof_endpoint():
    """
    Runs the ZK proof generation pipeline using pre-existing input data.
    """
    zk = generate_proof_ezkl()  # No arguments passed
    return zk


@router.post("/verify-proof")
def verify_proof_endpoint():
    """
    Verify a proof and public signals.
    """
    # proof = body.get("proof")
    # public_signals = body.get("public")
    result = verify_proof_ezkl()
    return result
