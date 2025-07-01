
# 🛡️ zkcti — Zero-Knowledge Cyber Threat Intelligence

> **A privacy-first, collaborative, and explainable platform for cyber threat intelligence sharing and  verification platform —combining neural networks, explainable AI (XAI), and next-generation zero-knowledge proofs framework (EZKL with Halo2 at it's core).**

<p align="center">
  <img src="frontend/public/zkcti-logo.svg" alt="zkcti logo" height="350" width="350"/>
</p>

<p align="center">
  <a href="https://drive.google.com/file/d/1td3YwCyhqmxzGy0MV_w73hrkquH23yyy/view?usp=sharing" target="_blank">
    <img src="frontend/public/demo.png" alt="ZKCTI Demo" height="90"/>
  </a>
</p>

---

## 🌟 What Are Zero-Knowledge Proofs (ZKPs)?

**Zero-Knowledge Proofs** are a special kind of cryptographic tools that let you **prove** you know something (or that something is true) **without revealing the thing itself**.

### Real-World Analogy #1: The “Where’s Waldo” Puzzle

Suppose you want to prove you found Waldo in a crowded picture, but you don’t want to show exactly where he is.

* You cover the page with cardboard, cutting a small hole exactly at Waldo’s spot.
* You show your friend: they see Waldo through the hole—*proof* you know where he is!
* But they learn nothing else about the rest of the page.

**That’s a zero-knowledge proof:** you proved your claim without giving away any other information.

---

### Real-World Analogy #2: Password Checker

You want to log into a website, but don’t want to ever send your password online.
With zero-knowledge proofs, you can convince the site you *know* the password—without sending it.
**No secrets ever leave your computer.**

---

### How Does zkcti Use This?

* **In cybersecurity,** you might detect a new threat (like malware), but don’t want to share your data, features, or detection methods.
* With zero-knowledge proofs, you can **prove** that your model detected a threat—without sharing the data, features, or the model internals like weights and biases.
* The verifier (another company, auditor, or regulator) can **check the proof** and instantly trust your claim—without seeing any of your internal information.

---

## 🔍 What’s a “Proving System”?

A **proving system** is the toolkit that lets you create and check zero-knowledge proofs.

* **Prover:** The party with the secret, who wants to prove something (like finding Waldo).
* **Verifier:** The party checking the proof, convinced the claim is true—but learns nothing else.

**In zkcti:**

* The **Prover** is the company or analyst who found a cyber threat.
* The **Verifier** is the partner, regulator, or competitor who wants to be sure the threat claim is true—**without seeing the sensitive data**.

---

## ⚡ Why Is This Useful?

* **Privacy:** No sensitive data or proprietary models ever shared.
* **Trust:** Claims are mathematically guaranteed—no blind faith needed.
* **Security:** Even competitors or regulators cannot reverse-engineer your secrets.
* **Compliance:** Prove adherence to policies or regulations, without leaking anything confidential information.

---

## 🤝 The Big Idea

**Zero-knowledge proofs** move us from “trust me”
to **“prove it—without revealing any sensitive information.”**

That’s the core of zkcti:
**“Establishment of Trust without revealing secrets. Security with privacy.”**

---

## 🚀 Project Overview

Modern cyber threats are sophisticated.
Organizations must share threat intelligence (CTI) to defend themselves—but privacy and fear of data leaks, hold them back.

**zkcti bridges this gap using zero-knowledge cryptography**—enabling organizations to prove threat claims (“this file is malicious”) *without exposing the underlying data or proprietary detection models*.

### Key Capabilities

* **Privacy-preserving CTI sharing**
* **Neural network for threat detection (Keras + ONNX + EMBER)**
* **Explainable AI (SHAP)**
* **No manual ZK circuit coding (EZKL/ONNX pipeline)**

---

## 🚦 Key Features

| Feature                     | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| ZK Proofs for Threat Claims | Prove malware classification without revealing model/data                   |
| Neural Network Detection    | Keras-based Neural Network trained on EMBER (2381+ features, real malicious/benign data) |
| Explainable AI (SHAP)       | Feature attribution for every decision, interactive UI                      |
| EZKL + Halo2 ZK Pipeline    | Auto-generates zk-circuits from ONNX format of the original models, no malual zk circuits construction needed   |
| Proof Sharing | Send only the zk-proof & never the raw sample                         |
| Intuitive React UI          | Stepper-based workflow, XAI visualizations                  |
| FastAPI Python Backend      | Secure, modular API for inference, ZK proof generation/verification                      |

---

## 🏛️ Architecture

```
                  +--------------+         +----------------+        +--------------+
                  |  Company A   |         |    zkcti API   |        |  Company B   |
                  |  (Prover)    |<------->|  (FastAPI+EZKL)|<-----> | (Verifier)   |
                  +--------------+         +----------------+        +--------------+
                        |                          |                        |
                        |-- Sample/Detect -------> |                        |

                        |-- Generate Proof ------> |                        |

                        |<--- Proof + SHAP  ------ |                        |

                        |----- Share Proof ------------------------------>  |

                        |------------------- Proof Verified? -------------->|
                        |<-------------------😀 Verified --------------------|
                        |<------------------🤝 Trust Established ---------->|
```

---

## 🧩 Under the Hood: Technologies & Why They Matter

### EZKL

* **What:** An open-source ZKML toolchain that compiles ONNX models into Halo2-based ZK circuits—*no manual cryptography needed*.
* **Why:** Saves time, avoids error-prone manual ZK circuit writing, scales to real neural nets.

## Which models work with EZKL?

* EZKL supports a wide range of models—far beyond basic neural nets:

* Neural networks: MLP, CNN, self-attention, transformers, NanoGPT, RNN, LSTM, GRU

* Decision Trees: Random Forest, Gradient-boosted trees, XGBoost, LightGBM

* Classic ML/Stats: SVM, regression, descriptive statistics

* Vision and language models: Small LLMs, multi-head attention

**NOTE:** You can build ZK proofs for most of the modern ML or data science model—no hand-coding circuits with support for newer models being added in the future according to **EZKL** team!

### ONNX

* **What:** Open Neural Network Exchange—universal ML model format.
* **Why:** Standardizes models from Keras, PyTorch, TensorFlow for ZKML and cloud/edge deployment.

### EMBER Dataset

* **What:** Widely used malware detection dataset (2381 features per Windows PE file).
* **Why:** Enables real-world, reproducible ML research and robust CTI detection.

### Halo2

* **What:** Advanced zero-knowledge proof system (no trusted setup, Plonkish, supports recursion).
* **Why:** Scalable, post-quantum secure, Language Agnostic i.e; While the core Halo2 library is written in Rust, the Move language version of the Halo2 verifier allows blockchains using Move to leverage Halo2 proofs. This addresses the need for on-chain verification of Halo2 proofs within different ecosystems. 
.

---

## 🛠️ Tech Stack

| Layer     | Stack                                                |
| --------- | ---------------------------------------------------- |
| ML/XAI    | Keras (TensorFlow), ONNX, scikit-learn, SHAP|
| Data      | EMBER dataset|
| ZK Proofs | EZKL (ZKML pipeline), Halo2 Proving System|
| Backend   | FastAPI, Uvicorn|
| Frontend  | React, Vite, Basic CSS|


### **Other Technologies in Use**

* **Zero-Knowledge Proofs:** [EZKL](https://github.com/zkonduit/ezkl) (CLI, not a pip/npm package) compiles ONNX models into ZK circuits for Halo2 proofs.
* **Machine Learning Model Format:** [ONNX](https://onnx.ai/) (for Keras/ML models exported for construction of ZK circuits).
* **Dataset:** [EMBER malware dataset](https://github.com/elastic/ember) (provided in Parquet format for training/testing).

#### **Why this stack?**

* **FastAPI** is Pythonic, async, easy to maintain, and pairs well with data science and ZKML workflows.
* **React + Vite** deliver modern, responsive, and highly interactive frontends, with lightning-fast reloads for development.
* **EZKL/Halo2** eliminate manual ZK circuit engineering—making ZKML accessible for rapid innovation.
* **SHAP** brings explainable AI, so every prediction is transparent and auditable.
* **Visualization & UX tools** (recharts, framer-motion) create a compelling, trust-building UI for users, analysts, and auditors.

---

## 📂 Project Directory Structure

```
zkcti/
├── backend/
│   ├── api.py, main.py           # FastAPI API logic
│   ├── model/                    # Trained Keras/ONNX models
│   ├── data/                     # EMBER dataset (.parquet)
│   ├── utils/                    # SHAP, prediction, EZKL helpers
│   └── zk/                       # All EZKL artifacts (witness, proof, etc)
├── frontend/
│   ├── src/                      # React app: UI, components, API hooks
│   └── public/                   # Logo, favicon, assets
├── data/                         # Model training, ONNX export scripts
│   ├── keras_train.py            # Keras model training
│   └── pipeline_test.py          # For testing EZKL pipeline
└── README.md
```

---


## ⚡ Quickstart & Setup

### 1. Clone and Prepare Environment

```sh
git clone https://github.com/bisbist/zkcti.git
cd zkcti
conda create --name zkcti-venv python=3.9.18 -y
conda activate zkcti-venv
```

---

### 2. Download & Prepare EMBER Malware Dataset

**zkcti uses the EMBER dataset for demonstration and testing. You must download and convert it before running the project.**

**1. Download the dataset**
Go to [EMBER for Static Malware Analysis on Kaggle](https://www.kaggle.com/datasets/trinhvanquynh/ember-for-static-malware-analysis)
and download these four files:

* `X_train.dat`
* `y_train.dat`
* `X_test.dat`
* `y_test.dat`

**2. Place the downloaded files in the project’s `data/` directory:**

```
zkcti/
└── data/
    ├── X_train.dat
    ├── y_train.dat
    ├── X_test.dat
    └── y_test.dat
```

**3. Convert the `.dat` files to Parquet format (required by the backend):**

```sh
cd data
python prepare_ember_dataset.py
```

This will generate:

* `ember_train.parquet`
* `ember_test.parquet`

in the `backend/data/` directory:

```
zkcti/
└── backend/
    ├── data/
    │   ├── ember_train.parquet
    │   └── ember_test.parquet
```

---

### 3. Backend Setup

```sh
cd backend
pip install -r requirements.txt
```

#### Install EZKL

* **Rust required:** [Install Rust](https://rustup.rs/)
* **Install EZKL:**

  ```sh
  cargo install --git https://github.com/zkonduit/ezkl
  ```

---

### 4. Model Training & Export

**Train and export the Keras model into ONNX format:**

```sh
python data/keras_train.py
```

*Ensure `ember_train.parquet` and `ember_test.parquet` are present in `backend/data/` before this step.*

---

### 5. Start Backend API

```sh
cd backend/
uvicorn main:app --reload
```

---

### 6. Frontend Setup

```sh
cd frontend/
npm install
npm run dev
```

*Access UI at [http://localhost:5173](http://localhost:5173)*
*Backend API runs at [http://localhost:8000](http://localhost:8000)*

---

## 🧑‍💻 How to Use zkcti

1. **Generate Random Test Sample**
   UI button samples a real EMBER malware test dataset.
2. **Predict & Generate Proof**
   Keras model predicts; SHAP explains predictions; EZKL produces zk-proof.
3. **Send Proof**
   Only the proof is sent to the verifier (no data/model ever leaves the prover's system).
4. **Verify**
   Company B (Verifier) clicks *Verify*, and proof is checked using Halo2.
   If valid, trust is established—no secrets leaked.

---

## 🎨 UI & Workflow

* **Animated Stepper At the buttom of UI**: Walks user through sampling, prediction, proof, and verification.
* **Explainable AI (XAI)**: SHAP feature importance chart for transparency.
* **Company A (Prover)**: Generates, predicts, proves, and sends.
* **Company B (Verifier)**: Receives, verifies, trusts—never sees sensitive data and ML model internal weights and biases.

---

## 🖥️ Example CLI / Script Commands

```sh
# Start backend API
cd backend
uvicorn main:app --reload

# Start frontend
cd frontend
npm run dev

# Advanced: Manual proof workflow
ezkl gen-settings --model model/model_nn.onnx --settings-path zk/ezkl/settings.json
ezkl compile-circuit --model model/model_nn.onnx --compiled-circuit zk/ezkl/network.ezkl --settings-path zk/ezkl/settings.json
ezkl gen-witness --compiled-circuit zk/ezkl/network.ezkl --data zk/build/input.json --output zk/ezkl/witness.json
ezkl prove --compiled-circuit zk/ezkl/network.ezkl --pk-path zk/ezkl/pk.key --proof-path zk/ezkl/proof.json --witness zk/ezkl/witness.json --srs-path zk/ezkl/kzg18.srs
ezkl verify --proof-path zk/ezkl/proof.json --vk-path zk/ezkl/vk.key
```

---

## 🏗️ Future Roadmap (in Simple Language)

* **On-Chain Verification with Smart Contracts**
  *Let anyone verify a proof on public blockchains like Ethereum or Polygon using a smart contract. No need to trust a server — trust the math!*

* **Secure Collaboration Across Organizations (Federated/Encrypted ZKML)**
  *Allow multiple companies to work together on detecting threats—while keeping their sensitive data encrypted and private, even during collaboration.*

* **More Human-Friendly Explanations (LIME, In-Proof XAI)**
  *Add new explainability methods (like LIME), and even include these explanations inside the zero-knowledge proof—so everyone can see why a prediction was made, not just the result.*

* **Decentralized Threat Intelligence Marketplace**
  *Create a “marketplace” where verified threat intelligence can be shared, traded, or sold—so organizations can quickly access the best data, with full privacy and trust.*

* **Regulatory & Compliance Integrations**
  *Easily prove to regulators or auditors that you’re following cybersecurity rules—without exposing private details. Automated compliance!*

* **Run Anywhere—Off-Chain and on Mobile Devices**
  *Bring zero-knowledge machine learning to mobile phones, laptops, or private networks—not just blockchains. Makes the technology available to everyone, everywhere.*

---

## 🤝 Contributing

Open to PRs, collaborations, and academic/industry partnerships!
Please fork, branch, and PR. Issues/feature requests welcome.

---

## 📝 License

MIT License.
See [LICENSE](LICENSE).

---

## 🙏 Credits

* [EZKL](https://github.com/zkonduit/ezkl)
* [EMBER Dataset](https://github.com/elastic/ember)
* [Keras](https://keras.io/), [ONNX](https://onnx.ai/), [SHAP](https://github.com/slundberg/shap)
* [Halo2](https://zcash.github.io/halo2/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [React](https://react.dev/), [Vite](https://vitejs.dev/)

---

## 📬 Contact

**Author:** [Bishal Bist](bistbishal69@gmail.com)
* *For research inquiries, or collaborations, feel free to open an issue.*

