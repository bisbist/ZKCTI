import subprocess
import os


def run(cmd, desc=None):
    print(f"\n📦 Running: {desc or cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr)
        raise RuntimeError(f"Command failed: {cmd}")


# Paths
model_path = "model_nn.onnx"
compiled_model_circuit_path = "network.ezkl"
input_path = "input/input.json"
settings_path = "settings.json"
witness_path = "witness.json"
proof_path = "proof.json"
pk_path = "pk.key"
vk_path = "vk.key"
srs_path = os.path.expanduser("~/.ezkl/srs/kzg18.srs")

# Full pipeline
try:
    # 1. Generate settings
    run(
        f"ezkl gen-settings --model {model_path} --settings-path {settings_path}",
        "Generate settings",
    )

    # 2. Calibrate settings
    run(
        f"ezkl calibrate-settings --model {model_path} --data {input_path} --settings-path {settings_path}",
        "Calibrate settings",
    )

    # 3. Compile circuit
    run(
        f"ezkl compile-circuit --model {model_path} --compiled-circuit {compiled_model_circuit_path} --settings-path {settings_path}",
        "Compile model",
    )

    # 4. Download SRS if not present
    if not os.path.exists(srs_path):
        run("ezkl get-srs", "Download SRS")

    # 5. Setup keys
    run(
        f"ezkl setup --compiled-circuit {compiled_model_circuit_path} --vk-path {vk_path} --pk-path {pk_path} --srs-path {srs_path}",
        "Setup keys",
    )

    # 6. Generate witness
    run(
        f"ezkl gen-witness --compiled-circuit {compiled_model_circuit_path} --data {input_path} --output {witness_path}",
        "Generate witness",
    )

    # 7. Create proof
    run(
        f"ezkl prove --compiled-circuit {compiled_model_circuit_path} --pk-path {pk_path} --proof-path {proof_path} --witness {witness_path} --srs-path {srs_path}",
        "Generate proof",
    )
    
    run(
        f"ezkl create-evm-verifier --vk-path {vk_path} --srs-path {srs_path}",
        "Generate evm verifier for proof",
    )
        
    #  ezkl create-evm-verifier

    # 8. Verify proof
    run(f"ezkl verify --proof-path {proof_path}", "Verify proof")

    print("\n✅ ZK pipeline completed successfully!")

except Exception as e:
    print(f"\n❌ Pipeline failed: {e}")
