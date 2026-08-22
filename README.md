# FusionConnect AI

**Founder & Author: Ethan**

FusionConnect AI is a Streamlit prototype for public physics and nuclear-fusion education, community discussion, research-collaboration discovery, and AI-assisted personalization.

The repository is organized for direct upload to GitHub and deployment on **Streamlit Community Cloud** with **Python 3.12**.

## Core features

- Physics and nuclear-fusion learning modules with simplified explanations and knowledge checks.
- Anonymous onboarding with broad demographic, interest, knowledge-level, and goal fields.
- Community feed inspired by discussion/social platforms for sharing ideas and responding to other users.
- Collaboration Hub for research/project proposals and expressions of interest.
- AI Mentor recommendation engine combining:
  - supervised machine learning,
  - a multilayer perceptron/deep-neural-network-style model,
  - feedback/reward updates inspired by reinforcement learning,
  - rule-based fallback recommendations when training data is limited.
- User feedback loop to improve future recommendations.
- Founder Dashboard with anonymous signup counts, engagement metrics, user-interest summaries, referral/QR-source counts, and QR-code generation.
- Privacy/Data page for data export and deletion of the current anonymous account.
- SQLite prototype database seeded automatically on first launch.

## Repository structure

```text
FusionConnect-AI/
├── app.py
├── requirements.txt
├── README.md
├── LICENSE
├── .gitignore
├── .streamlit/
│   ├── config.toml
│   └── secrets.toml.example
├── data/
│   └── .gitkeep
└── notebooks/
    └── FusionConnect_AI_Colab_Development.ipynb
```

## Run locally

Use Python 3.12 in a virtual environment.

```bash
python -m venv .venv
```

Activate the environment, then install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the app:

```bash
streamlit run app.py
```

## Upload to GitHub

1. Create a new GitHub repository, for example `FusionConnect-AI`.
2. Extract this ZIP file on your computer.
3. Upload the **contents** of the `FusionConnect-AI` folder to the root of the GitHub repository. Do not upload only the ZIP file itself.
4. Commit the files to the `main` branch.

The important deployment files are already at the repository root:

- `app.py` — Streamlit entrypoint.
- `requirements.txt` — Python dependencies.
- `.streamlit/config.toml` — Streamlit UI/server configuration.

## Deploy on Streamlit Community Cloud

1. Go to `https://share.streamlit.io/` and choose **Create app**.
2. Select the GitHub repository and `main` branch.
3. Set the entrypoint file to:

```text
app.py
```

4. Open **Advanced settings** and select **Python 3.12**.
5. Add a strong founder-dashboard password in **Secrets**:

```toml
ADMIN_PASSCODE = "replace-this-with-a-strong-private-password"
```

6. Deploy the app.

After deployment, the public URL will look similar to:

```text
https://your-app-name.streamlit.app/
```

Enter that URL in the Founder Dashboard QR generator. The generated QR link adds a referral tag so signups can be grouped by outreach source.

## Important data-persistence note

This prototype uses a local SQLite database at `data/fusionconnect_ai.sqlite3`. That is convenient for a demo, classroom presentation, MVP, and early testing, but Streamlit Community Cloud local storage should **not** be treated as a permanent production database. A restart or redeployment can remove locally stored data.

Before a real public launch with persistent accounts/community content, migrate storage to a hosted database such as PostgreSQL/Supabase/Neon or another production database and add authentication.

## Privacy and responsible-AI notes

The prototype intentionally uses an anonymous UUID instead of requiring a real name, exact birth date, home address, or other unnecessary identifiers. It also gives users separate controls for AI personalization, public posting, and optional aggregated research/outreach statistics.

Before inviting the general public—especially minors—add appropriate terms of use, a privacy policy, content moderation, abuse reporting, parental/guardian consent where legally required, account authentication, persistent storage, and expert review of educational material.

AI recommendations in this prototype are educational/navigation suggestions. They are not scientific, academic, medical, investment, or safety advice.

## Founder dashboard

The prototype dashboard passcode falls back to `demo` only when no Streamlit secret is supplied. **Do not use `demo` for a public deployment.** Configure `ADMIN_PASSCODE` in Streamlit Community Cloud Secrets.

## Colab notebook

The original single-notebook development version is included in `notebooks/FusionConnect_AI_Colab_Development.ipynb`. The deployable Streamlit entrypoint for this repository is `app.py`.

## License

MIT License. See `LICENSE`.
