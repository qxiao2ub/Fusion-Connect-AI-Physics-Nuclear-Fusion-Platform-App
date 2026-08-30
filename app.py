# fusionconnect_ai_streamlit_app.py
# A Streamlit prototype for an AI-assisted physics and nuclear-fusion learning/community platform.
# Built for Python 3.12+ and designed to run from Google Colab, locally, or Streamlit Community Cloud.

from __future__ import annotations

import base64
import io
import json
import os
import random
import sqlite3
import textwrap
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import plotly.express as px
import qrcode
import streamlit as st
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

APP_NAME = 'Fusion Connect AI'
FOUNDER_NAME = 'Ethan Meline'
ADVISOR_NAME = 'Dr. Qingyang Xiao'
APP_DIR = Path(__file__).resolve().parent
ASSETS_DIR = APP_DIR / 'assets'
DATA_DIR = APP_DIR / 'data'
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = Path(os.getenv('FUSIONCONNECT_DB_PATH', str(DATA_DIR / 'fusionconnect_ai.sqlite3')))

TOPICS = [
    'fusion basics', 'plasma physics', 'tokamak', 'stellarator', 'inertial fusion',
    'magnetic confinement', 'materials', 'tritium breeding', 'diagnostics',
    'AI for fusion', 'nuclear safety', 'energy policy', 'education', 'research collaboration'
]

ROLES = ['Student', 'Teacher', 'Researcher', 'Engineer', 'Industry', 'Policy / Public', 'Curious Public']
KNOWLEDGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
AGE_BANDS = ['Prefer not to say', 'Under 13', '13-17', '18-24', '25-34', '35-44', '45-54', '55+']
EDUCATION_LEVELS = ['Prefer not to say', 'Middle school', 'High school', 'Undergraduate', 'Graduate', 'Professional', 'Self learner']
GOALS = [
    'Learn fundamentals', 'Prepare a class', 'Find research collaborators', 'Explore project ideas',
    'Track fusion progress', 'Share outreach content', 'Build AI/ML skills', 'Ask questions'
]

LEARNING_MODULES = [
    {
        'id': 'fusion_intro',
        'title': 'Fusion in One Page',
        'level': 'Beginner',
        'tags': ['fusion basics', 'energy policy', 'education'],
        'summary': 'What fusion is, why it releases energy, and why it is hard to build on Earth.',
        'content': """
Fusion joins light atomic nuclei into heavier nuclei. The classic fuel pair is deuterium and tritium, two hydrogen isotopes. When they fuse, they produce helium, a neutron, and energy. The energy comes from the difference between the initial and final nuclear binding energy.

The core challenge is not the reaction itself. The challenge is creating and controlling a plasma hot and dense enough, for long enough, that useful fusion reactions happen faster than the plasma loses energy.

Three big engineering questions guide most fusion projects:

1. Can the plasma reach sufficient temperature, density, and confinement time?
2. Can the reactor materials survive heat, neutron damage, and repeated operation?
3. Can the system produce fuel, extract heat, and run economically?
""",
        'activity': 'Draw a three-circle diagram: temperature, density, and confinement time. Put “net useful energy” where they overlap.',
        'quiz_question': 'Which three plasma conditions are commonly combined in fusion performance discussions?',
        'quiz_answer': 'temperature, density, and confinement time'
    },
    {
        'id': 'plasma_basics',
        'title': 'Plasma Physics Basics',
        'level': 'Beginner',
        'tags': ['plasma physics', 'magnetic confinement', 'education'],
        'summary': 'Ionized gas, charged particles, magnetic fields, and collective behavior.',
        'content': """
A plasma is an ionized gas containing free electrons and ions. Because charged particles respond to electric and magnetic fields, plasma can behave collectively rather than like ordinary neutral gas.

A strong magnetic field can make charged particles spiral around field lines. In magnetic confinement devices, this helps keep the hot plasma away from solid walls.

Important vocabulary:

- Ion: an atom or molecule with missing or extra electrons.
- Electron temperature: a measure of average electron kinetic energy.
- Debye shielding: the tendency of plasma to screen electric fields over short distances.
- Instability: a growing disturbance that can degrade confinement.
""",
        'activity': 'Use a pencil to trace a spiral around a line. That line represents a magnetic field line.',
        'quiz_question': 'Why do magnetic fields help in a fusion plasma?',
        'quiz_answer': 'charged particles spiral around magnetic field lines, helping confinement'
    },
    {
        'id': 'tokamak_overview',
        'title': 'Tokamak Overview',
        'level': 'Intermediate',
        'tags': ['tokamak', 'magnetic confinement', 'diagnostics'],
        'summary': 'A doughnut-shaped magnetic bottle for high-temperature plasma.',
        'content': """
A tokamak confines plasma in a torus, similar to a doughnut shape. Magnetic coils produce a strong toroidal field, and a plasma current helps create a poloidal field. Together they form helical magnetic field lines that improve confinement.

Tokamak design topics include:

- Plasma current drive and transformer action.
- Divertors that exhaust heat and particles.
- Edge-localized modes and disruptions.
- Diagnostics for temperature, density, impurities, and magnetic behavior.
""",
        'activity': 'Sketch a doughnut and draw arrows around the long way and short way to represent toroidal and poloidal directions.',
        'quiz_question': 'What is the approximate shape of a tokamak plasma chamber?',
        'quiz_answer': 'a torus or doughnut shape'
    },
    {
        'id': 'stellarator_overview',
        'title': 'Stellarator Overview',
        'level': 'Intermediate',
        'tags': ['stellarator', 'magnetic confinement', 'research collaboration'],
        'summary': 'A twisted magnetic confinement device that can operate without large plasma current.',
        'content': """
A stellarator uses carefully shaped external coils to create twisted magnetic fields. This can reduce reliance on large plasma current, which may support steady-state operation.

Stellarators are mathematically and mechanically complex. Modern optimization and high-performance computing have made better stellarator designs possible.

Key ideas:

- Magnetic surface optimization.
- Complex coil geometry.
- Reduced disruption risk compared with current-driven devices.
- Engineering challenges in coil manufacturing and maintenance.
""",
        'activity': 'Compare a simple circular coil with a twisted 3D coil. Ask: which is easier to build, and which gives more magnetic control?',
        'quiz_question': 'What is one potential advantage of stellarators?',
        'quiz_answer': 'steady-state operation with less need for large plasma current'
    },
    {
        'id': 'inertial_fusion',
        'title': 'Inertial Fusion Basics',
        'level': 'Intermediate',
        'tags': ['inertial fusion', 'fusion basics', 'diagnostics'],
        'summary': 'Compressing tiny fuel targets with lasers or particle beams.',
        'content': """
In inertial confinement fusion, a small fuel target is rapidly compressed and heated. The fuel inertia holds the material together briefly while fusion reactions occur.

The target must be extremely symmetric. Small imperfections can grow into instabilities and reduce performance.

Important ideas:

- Implosion symmetry.
- Target capsule design.
- Laser or beam energy coupling.
- Diagnostics for neutron yield, temperature, and compression.
""",
        'activity': 'Imagine squeezing a balloon evenly from all sides. What happens if one side is pushed harder than another?',
        'quiz_question': 'Why is symmetry important in inertial fusion?',
        'quiz_answer': 'asymmetry can seed instabilities and reduce compression'
    },
    {
        'id': 'lawson_q',
        'title': 'Lawson Criterion and Fusion Gain',
        'level': 'Advanced',
        'tags': ['fusion basics', 'plasma physics', 'AI for fusion'],
        'summary': 'How density, temperature, and confinement time connect to reactor performance.',
        'content': """
The Lawson criterion expresses a condition for fusion power to exceed losses. In practice, researchers often discuss the triple product: density × temperature × confinement time.

Fusion gain Q is the ratio of fusion power produced to external heating power delivered to the plasma. Q is useful, but it is not the same as net electricity from a complete power plant. A power plant must also handle energy conversion, recirculating power, tritium breeding, maintenance, and economics.

AI can help by predicting confinement behavior, detecting instability precursors, optimizing control, and discovering patterns in high-dimensional diagnostic data.
""",
        'activity': 'Make a table with columns for density, temperature, confinement time, and Q. Fill in hypothetical devices and discuss tradeoffs.',
        'quiz_question': 'What is the fusion triple product?',
        'quiz_answer': 'density times temperature times confinement time'
    },
    {
        'id': 'materials_tritium',
        'title': 'Materials and Tritium Breeding',
        'level': 'Advanced',
        'tags': ['materials', 'tritium breeding', 'nuclear safety'],
        'summary': 'Why a fusion power plant is also a materials and fuel-cycle challenge.',
        'content': """
A deuterium-tritium fusion reactor produces energetic neutrons. These neutrons carry energy to the blanket, where heat can be extracted. They also damage materials and can help breed tritium from lithium.

Materials must handle neutron damage, high heat flux, thermal cycling, corrosion, and maintainability. Tritium handling requires careful accounting, containment, and safety practices.

Engineering success depends on the full system, not only the plasma.
""",
        'activity': 'List three reactor subsystems outside the plasma that must work for a commercial plant.',
        'quiz_question': 'Why is lithium important in many fusion blanket concepts?',
        'quiz_answer': 'lithium can breed tritium when interacting with neutrons'
    },
    {
        'id': 'ai_fusion',
        'title': 'AI for Fusion Research',
        'level': 'Intermediate',
        'tags': ['AI for fusion', 'diagnostics', 'research collaboration'],
        'summary': 'How ML, neural networks, and reinforcement learning can support fusion research.',
        'content': """
AI can support fusion in several ways:

- Supervised learning: predict plasma state, classify events, or recommend content based on labeled examples.
- Deep neural networks: learn nonlinear patterns in diagnostic data, images, and time series.
- Reinforcement learning: learn control or recommendation policies from feedback and rewards.

For this app, the AI recommender is intentionally transparent. It combines user profile interests, app behavior, supervised learning, a small neural network, and feedback-based bandit rewards.
""",
        'activity': 'Choose a fusion problem and label it as classification, regression, clustering, or reinforcement learning.',
        'quiz_question': 'What kind of learning uses feedback rewards to improve future actions?',
        'quiz_answer': 'reinforcement learning'
    }
]

ACTIONS = [
    {'action_id': 'learn_fusion_intro', 'label': 'Start with Fusion in One Page', 'type': 'learn', 'item_id': 'fusion_intro', 'tags': ['fusion basics', 'education'], 'why': 'Build a clear foundation before advanced topics.'},
    {'action_id': 'learn_plasma_basics', 'label': 'Study Plasma Physics Basics', 'type': 'learn', 'item_id': 'plasma_basics', 'tags': ['plasma physics', 'magnetic confinement'], 'why': 'Plasma behavior is central to most fusion concepts.'},
    {'action_id': 'learn_tokamak', 'label': 'Explore Tokamak Overview', 'type': 'learn', 'item_id': 'tokamak_overview', 'tags': ['tokamak', 'diagnostics'], 'why': 'Tokamaks are a major path in magnetic confinement fusion.'},
    {'action_id': 'learn_stellarator', 'label': 'Explore Stellarator Overview', 'type': 'learn', 'item_id': 'stellarator_overview', 'tags': ['stellarator', 'magnetic confinement'], 'why': 'Stellarators show how optimized 3D fields can support confinement.'},
    {'action_id': 'learn_inertial', 'label': 'Learn Inertial Fusion Basics', 'type': 'learn', 'item_id': 'inertial_fusion', 'tags': ['inertial fusion', 'diagnostics'], 'why': 'Inertial fusion is a distinct path with different physics and engineering constraints.'},
    {'action_id': 'learn_lawson', 'label': 'Study Lawson Criterion and Fusion Gain', 'type': 'learn', 'item_id': 'lawson_q', 'tags': ['fusion basics', 'plasma physics', 'AI for fusion'], 'why': 'This topic connects plasma performance to reactor goals.'},
    {'action_id': 'learn_materials', 'label': 'Read Materials and Tritium Breeding', 'type': 'learn', 'item_id': 'materials_tritium', 'tags': ['materials', 'tritium breeding', 'nuclear safety'], 'why': 'Commercial fusion depends on robust materials and fuel-cycle design.'},
    {'action_id': 'learn_ai_fusion', 'label': 'Learn AI for Fusion Research', 'type': 'learn', 'item_id': 'ai_fusion', 'tags': ['AI for fusion', 'diagnostics'], 'why': 'AI can help connect education, diagnostics, prediction, control, and collaboration.'},
    {'action_id': 'write_intro_post', 'label': 'Share your first idea or question', 'type': 'community', 'item_id': 'new_post', 'tags': ['education', 'research collaboration'], 'why': 'Posting helps other users find your interests and start discussion.'},
    {'action_id': 'join_collab', 'label': 'Browse collaboration proposals', 'type': 'collaboration', 'item_id': 'collab_board', 'tags': ['research collaboration', 'AI for fusion'], 'why': 'Collaboration is often the fastest way to turn curiosity into a project.'},
    {'action_id': 'create_collab', 'label': 'Create a mini research collaboration proposal', 'type': 'collaboration', 'item_id': 'new_collab', 'tags': ['research collaboration', 'AI for fusion'], 'why': 'A clear project idea can attract students, teachers, or researchers.'},
    {'action_id': 'take_quiz', 'label': 'Take a quick learning quiz', 'type': 'learn', 'item_id': 'quiz', 'tags': ['education', 'fusion basics'], 'why': 'Quizzes convert passive reading into active learning.'}
]

BAD_WORDS = {'spam', 'scam', 'hate', 'violent threat'}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


def safe_json_loads(value: Any, default: Any) -> Any:
    if value is None:
        return default
    if isinstance(value, (list, dict)):
        return value
    try:
        return json.loads(value)
    except Exception:
        return default


def json_dumps(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def run_sql(query: str, params: Tuple[Any, ...] = ()) -> None:
    with get_conn() as conn:
        conn.execute(query, params)
        conn.commit()


def query_df(query: str, params: Tuple[Any, ...] = ()) -> pd.DataFrame:
    with get_conn() as conn:
        return pd.read_sql_query(query, conn, params=params)


def query_one(query: str, params: Tuple[Any, ...] = ()) -> Optional[sqlite3.Row]:
    with get_conn() as conn:
        cur = conn.execute(query, params)
        return cur.fetchone()


def init_db() -> None:
    schema = [
        '''CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            last_seen TEXT,
            display_name TEXT,
            role TEXT,
            age_band TEXT,
            education_level TEXT,
            region TEXT,
            knowledge_level TEXT,
            interests_json TEXT,
            goals_json TEXT,
            consent_ai INTEGER DEFAULT 0,
            consent_public INTEGER DEFAULT 0,
            consent_research INTEGER DEFAULT 0,
            referral_source TEXT
        )''',
        '''CREATE TABLE IF NOT EXISTS events (
            event_id TEXT PRIMARY KEY,
            user_id TEXT,
            event_type TEXT,
            item_id TEXT,
            topic TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL
        )''',
        '''CREATE TABLE IF NOT EXISTS posts (
            post_id TEXT PRIMARY KEY,
            user_id TEXT,
            display_name TEXT,
            category TEXT,
            title TEXT,
            body TEXT,
            tags_json TEXT,
            upvotes INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )''',
        '''CREATE TABLE IF NOT EXISTS comments (
            comment_id TEXT PRIMARY KEY,
            post_id TEXT,
            user_id TEXT,
            display_name TEXT,
            body TEXT,
            created_at TEXT NOT NULL
        )''',
        '''CREATE TABLE IF NOT EXISTS collaborations (
            collab_id TEXT PRIMARY KEY,
            user_id TEXT,
            display_name TEXT,
            title TEXT,
            summary TEXT,
            topics_json TEXT,
            skills_needed TEXT,
            contact_hint TEXT,
            status TEXT,
            created_at TEXT NOT NULL
        )''',
        '''CREATE TABLE IF NOT EXISTS feedback (
            feedback_id TEXT PRIMARY KEY,
            user_id TEXT,
            action_id TEXT,
            suggested_item TEXT,
            rating INTEGER,
            accepted INTEGER,
            reason TEXT,
            created_at TEXT NOT NULL
        )''',
        '''CREATE TABLE IF NOT EXISTS action_rewards (
            segment TEXT,
            action_id TEXT,
            shown_count INTEGER DEFAULT 0,
            reward_sum REAL DEFAULT 0,
            last_updated TEXT,
            PRIMARY KEY (segment, action_id)
        )'''
    ]
    with get_conn() as conn:
        for stmt in schema:
            conn.execute(stmt)
        conn.commit()


def log_event(user_id: Optional[str], event_type: str, item_id: str = '', topic: str = '', metadata: Optional[Dict[str, Any]] = None) -> None:
    run_sql(
        'INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?)',
        (str(uuid.uuid4()), user_id, event_type, item_id, topic, json_dumps(metadata or {}), utc_now())
    )
    if user_id:
        run_sql('UPDATE users SET last_seen = ? WHERE user_id = ?', (utc_now(), user_id))


def content_is_ok(text: str) -> Tuple[bool, str]:
    lowered = (text or '').lower()
    for term in BAD_WORDS:
        if term in lowered:
            return False, f'Please revise before posting. The term “{term}” triggered the basic moderation filter.'
    if len(lowered.strip()) < 3:
        return False, 'Please add more detail before posting.'
    return True, ''


def make_demo_name(user_id: str) -> str:
    return f'FusionUser-{user_id[-5:]}'


def current_referral() -> str:
    try:
        ref = st.query_params.get('ref', 'organic')
        if isinstance(ref, list):
            ref = ref[0] if ref else 'organic'
        return str(ref)[:80]
    except Exception:
        return 'organic'


def create_user_if_needed() -> str:
    if 'user_id' not in st.session_state:
        st.session_state.user_id = str(uuid.uuid4())
    user_id = st.session_state.user_id
    existing = query_one('SELECT user_id FROM users WHERE user_id = ?', (user_id,))
    if not existing:
        run_sql(
            '''INSERT INTO users (
                user_id, created_at, last_seen, display_name, role, age_band, education_level, region,
                knowledge_level, interests_json, goals_json, consent_ai, consent_public, consent_research, referral_source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                user_id, utc_now(), utc_now(), make_demo_name(user_id), 'Curious Public', 'Prefer not to say',
                'Prefer not to say', 'Prefer not to say', 'Beginner', json_dumps(['fusion basics']),
                json_dumps(['Learn fundamentals']), 0, 0, 0, current_referral()
            )
        )
        log_event(user_id, 'signup', topic='onboarding')
    return user_id


def get_user(user_id: str) -> Dict[str, Any]:
    row = query_one('SELECT * FROM users WHERE user_id = ?', (user_id,))
    if not row:
        raise ValueError('User not found')
    data = dict(row)
    data['interests'] = safe_json_loads(data.pop('interests_json', '[]'), [])
    data['goals'] = safe_json_loads(data.pop('goals_json', '[]'), [])
    return data


def update_user_profile(user_id: str, profile: Dict[str, Any]) -> None:
    run_sql(
        '''UPDATE users SET display_name=?, role=?, age_band=?, education_level=?, region=?, knowledge_level=?,
           interests_json=?, goals_json=?, consent_ai=?, consent_public=?, consent_research=?, last_seen=?
           WHERE user_id=?''',
        (
            profile['display_name'], profile['role'], profile['age_band'], profile['education_level'],
            profile['region'], profile['knowledge_level'], json_dumps(profile['interests']), json_dumps(profile['goals']),
            int(profile['consent_ai']), int(profile['consent_public']), int(profile['consent_research']), utc_now(), user_id
        )
    )
    log_event(user_id, 'profile_saved', topic='onboarding', metadata={'interests': profile['interests'], 'goals': profile['goals']})


def ensure_seed_data() -> None:
    marker = query_one("SELECT COUNT(*) AS n FROM events WHERE event_type = 'seed_loaded'")
    if marker and marker['n'] > 0:
        return

    seed_posts = [
        ('Teacher prompt: how would you explain plasma to middle-school students?', 'Education', ['education', 'plasma physics'], 'Try comparing a plasma to a gas where many particles are electrically charged and can respond together to fields.'),
        ('Question: tokamak vs stellarator tradeoffs', 'Question', ['tokamak', 'stellarator'], 'Tokamaks are often simpler geometrically; stellarators move complexity into external coils and optimization.'),
        ('Mini project idea: AI recommender for fusion learning paths', 'AI / ML', ['AI for fusion', 'education'], 'A small supervised model can recommend learning modules based on interests and behavior. Feedback can update a bandit policy.'),
        ('Collaboration idea: fusion glossary for beginners', 'Outreach', ['fusion basics', 'education'], 'A shared glossary with simple definitions would help new users join discussions faster.'),
    ]
    with get_conn() as conn:
        for title, category, tags, body in seed_posts:
            conn.execute(
                'INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                (str(uuid.uuid4()), 'seed', 'Ethan Meline Demo Team', category, title, body, json_dumps(tags), random.randint(3, 18), utc_now())
            )
        conn.commit()

    # Seed anonymous synthetic examples. These are not real users; they only make the demo AI usable before real traffic arrives.
    roles = ROLES
    levels = KNOWLEDGE_LEVELS
    for i in range(45):
        uid = f'seed-user-{i:03d}'
        interests = random.sample(TOPICS, k=random.randint(2, 4))
        goals = random.sample(GOALS, k=random.randint(1, 3))
        role = random.choice(roles)
        level = random.choice(levels)
        run_sql(
            '''INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (uid, utc_now(), utc_now(), f'DemoUser-{i:03d}', role, random.choice(AGE_BANDS), random.choice(EDUCATION_LEVELS), 'Demo region', level, json_dumps(interests), json_dumps(goals), 1, 1, 0, 'seed')
        )
        # Choose actions that approximately match the interests.
        matching = [a for a in ACTIONS if set(a['tags']).intersection(interests)] or ACTIONS
        for _ in range(random.randint(2, 6)):
            action = random.choice(matching)
            rating = random.choice([3, 4, 4, 5, 5])
            accepted = 1 if rating >= 4 else 0
            run_sql(
                'INSERT INTO feedback VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                (str(uuid.uuid4()), uid, action['action_id'], action['item_id'], rating, accepted, 'synthetic seed', utc_now())
            )
            log_event(uid, random.choice(['module_view', 'post_view', 'collab_view']), action['item_id'], random.choice(action['tags']))

    run_sql('INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?)', (str(uuid.uuid4()), 'system', 'seed_loaded', '', '', '{}', utc_now()))


def user_event_counts() -> pd.DataFrame:
    events = query_df('SELECT user_id, event_type, COUNT(*) AS n FROM events GROUP BY user_id, event_type')
    if events.empty:
        return pd.DataFrame(columns=['user_id'])
    pivot = events.pivot_table(index='user_id', columns='event_type', values='n', aggfunc='sum', fill_value=0).reset_index()
    pivot.columns = [str(c) for c in pivot.columns]
    return pivot


def base_feature_frame() -> pd.DataFrame:
    users = query_df('SELECT * FROM users')
    if users.empty:
        return users
    counts = user_event_counts()
    df = users.merge(counts, how='left', on='user_id')
    for col in ['signup', 'profile_saved', 'module_view', 'post_created', 'collab_created', 'recommendation_seen']:
        if col not in df.columns:
            df[col] = 0
    df[['signup', 'profile_saved', 'module_view', 'post_created', 'collab_created', 'recommendation_seen']] = df[['signup', 'profile_saved', 'module_view', 'post_created', 'collab_created', 'recommendation_seen']].fillna(0)
    df['interests'] = df['interests_json'].apply(lambda x: safe_json_loads(x, []))
    df['goals'] = df['goals_json'].apply(lambda x: safe_json_loads(x, []))
    for topic in TOPICS:
        df[f'interest__{topic}'] = df['interests'].apply(lambda xs, t=topic: 1 if t in xs else 0)
    for goal in GOALS:
        df[f'goal__{goal}'] = df['goals'].apply(lambda xs, g=goal: 1 if g in xs else 0)
    return df


def feature_columns() -> Tuple[List[str], List[str]]:
    categorical = ['role', 'age_band', 'education_level', 'region', 'knowledge_level']
    numeric = ['signup', 'profile_saved', 'module_view', 'post_created', 'collab_created', 'recommendation_seen']
    numeric += [f'interest__{topic}' for topic in TOPICS]
    numeric += [f'goal__{goal}' for goal in GOALS]
    return categorical, numeric


def train_models() -> Tuple[Optional[Pipeline], Optional[Pipeline], List[str], str]:
    features = base_feature_frame()
    feedback = query_df('SELECT user_id, action_id, rating, accepted FROM feedback WHERE rating >= 4 OR accepted = 1')
    if features.empty or feedback.empty:
        return None, None, [], 'Not enough data yet. Using transparent rule-based cold-start recommendations.'
    df = feedback.merge(features, how='inner', on='user_id')
    if len(df) < 12 or df['action_id'].nunique() < 2:
        return None, None, [], 'Not enough labeled feedback yet. Using transparent rule-based cold-start recommendations.'

    categorical, numeric = feature_columns()
    for col in categorical:
        df[col] = df[col].fillna('Unknown').astype(str)
    for col in numeric:
        if col not in df.columns:
            df[col] = 0
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    X = df[categorical + numeric]
    y = df['action_id'].astype(str)
    labels = sorted(y.unique().tolist())

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical),
            ('num', StandardScaler(with_mean=False), numeric),
        ]
    )
    rf = Pipeline([
        ('prep', preprocessor),
        ('model', RandomForestClassifier(n_estimators=140, random_state=42, class_weight='balanced'))
    ])
    rf.fit(X, y)

    mlp = None
    if len(df) >= 18 and y.nunique() >= 3:
        mlp = Pipeline([
            ('prep', preprocessor),
            ('model', MLPClassifier(hidden_layer_sizes=(48, 24), activation='relu', random_state=42, max_iter=450, early_stopping=True))
        ])
        try:
            mlp.fit(X, y)
        except Exception:
            mlp = None

    return rf, mlp, labels, f'Trained on {len(df)} positive feedback examples across {len(labels)} actions.'


def features_for_current_user(user: Dict[str, Any]) -> pd.DataFrame:
    categorical, numeric = feature_columns()
    row: Dict[str, Any] = {c: user.get(c, 'Unknown') for c in categorical}
    counts = query_df('SELECT event_type, COUNT(*) AS n FROM events WHERE user_id = ? GROUP BY event_type', (user['user_id'],))
    count_map = dict(zip(counts['event_type'], counts['n'])) if not counts.empty else {}
    for col in ['signup', 'profile_saved', 'module_view', 'post_created', 'collab_created', 'recommendation_seen']:
        row[col] = int(count_map.get(col, 0))
    interests = set(user.get('interests', []))
    goals = set(user.get('goals', []))
    for topic in TOPICS:
        row[f'interest__{topic}'] = 1 if topic in interests else 0
    for goal in GOALS:
        row[f'goal__{goal}'] = 1 if goal in goals else 0
    for col in numeric:
        row.setdefault(col, 0)
    return pd.DataFrame([row])[categorical + numeric]


def segment_for_user(user: Dict[str, Any]) -> str:
    return f"{user.get('role','Unknown')}|{user.get('knowledge_level','Unknown')}"


def bandit_score(action_id: str, user: Dict[str, Any]) -> float:
    segment = segment_for_user(user)
    row = query_one('SELECT shown_count, reward_sum FROM action_rewards WHERE segment = ? AND action_id = ?', (segment, action_id))
    global_row = query_one('SELECT SUM(shown_count) AS shown_count, SUM(reward_sum) AS reward_sum FROM action_rewards WHERE action_id = ?', (action_id,))
    # Laplace-smoothed mean reward, with global fallback.
    if row and row['shown_count']:
        return (float(row['reward_sum']) + 1.0) / (float(row['shown_count']) + 2.0)
    if global_row and global_row['shown_count']:
        return (float(global_row['reward_sum']) + 1.0) / (float(global_row['shown_count']) + 2.0)
    return 0.5


def update_bandit(action_id: str, user: Dict[str, Any], reward: float) -> None:
    segment = segment_for_user(user)
    with get_conn() as conn:
        existing = conn.execute('SELECT shown_count, reward_sum FROM action_rewards WHERE segment = ? AND action_id = ?', (segment, action_id)).fetchone()
        if existing:
            conn.execute(
                'UPDATE action_rewards SET shown_count=?, reward_sum=?, last_updated=? WHERE segment=? AND action_id=?',
                (int(existing['shown_count']) + 1, float(existing['reward_sum']) + reward, utc_now(), segment, action_id)
            )
        else:
            conn.execute(
                'INSERT INTO action_rewards VALUES (?, ?, ?, ?, ?)',
                (segment, action_id, 1, reward, utc_now())
            )
        conn.commit()


def get_recent_social_topics(limit: int = 100) -> Dict[str, int]:
    posts = query_df('SELECT tags_json FROM posts ORDER BY created_at DESC LIMIT ?', (limit,))
    collabs = query_df('SELECT topics_json AS tags_json FROM collaborations ORDER BY created_at DESC LIMIT ?', (limit,))
    topic_counts: Dict[str, int] = {t: 0 for t in TOPICS}
    for df in [posts, collabs]:
        if df.empty:
            continue
        for raw in df['tags_json'].tolist():
            for topic in safe_json_loads(raw, []):
                if topic in topic_counts:
                    topic_counts[topic] += 1
    return topic_counts


def action_probabilities(model: Optional[Pipeline], user_features: pd.DataFrame) -> Dict[str, float]:
    if model is None:
        return {}
    try:
        probs = model.predict_proba(user_features)[0]
        labels = list(model.named_steps['model'].classes_)
        return dict(zip(labels, [float(p) for p in probs]))
    except Exception:
        return {}


def recommend_actions(user: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], str]:
    consent_ai = bool(user.get('consent_ai'))
    rf, mlp, labels, status = train_models() if consent_ai else (None, None, [], 'AI personalization is off until the user opts in.')
    user_features = features_for_current_user(user)
    rf_probs = action_probabilities(rf, user_features) if consent_ai else {}
    mlp_probs = action_probabilities(mlp, user_features) if consent_ai else {}
    social_counts = get_recent_social_topics()
    max_social = max(social_counts.values()) if social_counts else 1
    max_social = max(max_social, 1)

    interests = set(user.get('interests', []))
    goals = set(user.get('goals', []))
    knowledge = user.get('knowledge_level', 'Beginner')
    scored: List[Dict[str, Any]] = []

    for action in ACTIONS:
        tags = set(action['tags'])
        interest_overlap = len(tags.intersection(interests)) / max(len(tags), 1)
        goal_bonus = 0.0
        if action['type'] == 'learn' and 'Learn fundamentals' in goals:
            goal_bonus += 0.12
        if action['type'] == 'community' and ('Share outreach content' in goals or 'Ask questions' in goals):
            goal_bonus += 0.14
        if action['type'] == 'collaboration' and 'Find research collaborators' in goals:
            goal_bonus += 0.18
        if action['action_id'] == 'learn_ai_fusion' and 'Build AI/ML skills' in goals:
            goal_bonus += 0.18
        level_bonus = 0.0
        if knowledge == 'Beginner' and action['item_id'] in {'fusion_intro', 'plasma_basics', 'quiz'}:
            level_bonus += 0.12
        if knowledge == 'Intermediate' and action['item_id'] in {'tokamak_overview', 'stellarator_overview', 'inertial_fusion', 'ai_fusion'}:
            level_bonus += 0.08
        if knowledge == 'Advanced' and action['item_id'] in {'lawson_q', 'materials_tritium', 'new_collab'}:
            level_bonus += 0.10
        rule_score = min(1.0, 0.25 + 0.45 * interest_overlap + goal_bonus + level_bonus)
        supervised_score = rf_probs.get(action['action_id'], 0.0)
        deep_score = mlp_probs.get(action['action_id'], 0.0)
        rl_score = bandit_score(action['action_id'], user) if consent_ai else 0.5
        social_score = sum(social_counts.get(t, 0) for t in tags) / (max_social * max(len(tags), 1))
        social_score = min(1.0, social_score)

        if consent_ai and rf_probs:
            final_score = 0.38 * rule_score + 0.25 * supervised_score + 0.15 * deep_score + 0.15 * rl_score + 0.07 * social_score
        else:
            final_score = 0.70 * rule_score + 0.20 * rl_score + 0.10 * social_score

        explanation_parts = []
        if tags.intersection(interests):
            explanation_parts.append('matches your selected interests')
        if goal_bonus:
            explanation_parts.append('supports your stated goal')
        if supervised_score > 0.05:
            explanation_parts.append('similar users gave positive feedback')
        if rl_score > 0.55:
            explanation_parts.append('feedback rewards are trending positive')
        if social_score > 0.2:
            explanation_parts.append('active community discussion exists')
        if not explanation_parts:
            explanation_parts.append(action['why'])

        scored.append({
            **action,
            'score': final_score,
            'rule_score': rule_score,
            'supervised_score': supervised_score,
            'deep_score': deep_score,
            'rl_score': rl_score,
            'social_score': social_score,
            'explanation': '; '.join(explanation_parts)
        })

    # Simple exploration: sometimes surface a high-potential action outside the top purely exploitative list.
    scored = sorted(scored, key=lambda x: x['score'], reverse=True)
    if consent_ai and len(scored) > 6 and random.random() < 0.15:
        exploratory = random.choice(scored[6:])
        exploratory['explanation'] = 'exploration recommendation: testing a new path so the platform can learn from feedback'
        scored = scored[:4] + [exploratory]
    else:
        scored = scored[:5]

    for action in scored:
        log_event(user['user_id'], 'recommendation_seen', action['item_id'], ','.join(action['tags']), {'action_id': action['action_id'], 'score': action['score']})
    return scored, status


def get_module(module_id: str) -> Optional[Dict[str, Any]]:
    for module in LEARNING_MODULES:
        if module['id'] == module_id:
            return module
    return None


def add_feedback(user: Dict[str, Any], action_id: str, suggested_item: str, rating: int, accepted: bool, reason: str) -> None:
    run_sql(
        'INSERT INTO feedback VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        (str(uuid.uuid4()), user['user_id'], action_id, suggested_item, int(rating), int(accepted), reason, utc_now())
    )
    reward = 1.0 if accepted else 0.0
    reward = max(0.0, min(1.0, (float(rating) - 1.0) / 4.0 if rating else reward))
    update_bandit(action_id, user, reward)
    log_event(user['user_id'], 'feedback_given', suggested_item, '', {'action_id': action_id, 'rating': rating, 'accepted': accepted})


def render_header() -> None:
    st.set_page_config(page_title=APP_NAME, page_icon='⚛️', layout='wide', initial_sidebar_state='expanded')
    st.markdown(
        """
        <style>
        :root {
          --fc-bg: #0d1625;
          --fc-card: #132033;
          --fc-card-2: #17263b;
          --fc-text: #f2f6f9;
          --fc-muted: #9db0c4;
          --fc-border: rgba(128, 166, 199, 0.22);
          --fc-primary: #62dff4;
          --fc-primary-2: #7084ff;
          --fc-signal: #68ebce;
        }
        html, body, [class*="css"] { font-family: "IBM Plex Sans", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .stApp {
          color: var(--fc-text);
          background:
            linear-gradient(rgba(98,223,244,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(98,223,244,.035) 1px, transparent 1px),
            var(--fc-bg);
          background-size: 64px 64px;
        }
        [data-testid="stHeader"] { background: rgba(13,22,37,.78); backdrop-filter: blur(12px); }
        [data-testid="stToolbar"] { right: 1rem; }
        [data-testid="stSidebar"] { background: #101b2b; border-right: 1px solid var(--fc-border); }
        [data-testid="stSidebar"] * { color: var(--fc-text); }
        [data-testid="stSidebar"] .stRadio label { padding: .22rem .35rem; border-radius: .35rem; }
        [data-testid="stSidebar"] .stRadio label:hover { background: rgba(98,223,244,.08); }
        .block-container { max-width: 1220px; padding-top: 2.2rem; padding-bottom: 4rem; }
        h1, h2, h3 { letter-spacing: -0.025em; }
        h1, h2, h3, h4, p, li, label, span { color: var(--fc-text); }
        .stCaption, [data-testid="stCaptionContainer"], small { color: var(--fc-muted) !important; }
        a { color: var(--fc-primary) !important; }
        hr { border-color: var(--fc-border) !important; }
        [data-testid="stVerticalBlockBorderWrapper"] { border-color: var(--fc-border) !important; border-radius: .55rem; background: rgba(19,32,51,.70); }
        [data-testid="stMetric"] { border: 1px solid var(--fc-border); border-radius: .55rem; padding: 1rem; background: rgba(19,32,51,.78); }
        [data-testid="stMetricValue"] { color: var(--fc-text); }
        [data-testid="stMetricLabel"] p { color: var(--fc-muted) !important; text-transform: uppercase; letter-spacing: .12em; font-size: .67rem; }
        .stButton > button, .stDownloadButton > button, .stFormSubmitButton > button {
          border-radius: .4rem; border: 1px solid rgba(98,223,244,.48); background: rgba(98,223,244,.12); color: #eafcff;
        }
        .stButton > button:hover, .stDownloadButton > button:hover, .stFormSubmitButton > button:hover {
          border-color: var(--fc-primary); background: rgba(98,223,244,.22); color: #fff;
        }
        .stTextInput input, .stTextArea textarea, .stSelectbox [data-baseweb="select"] > div, .stMultiSelect [data-baseweb="select"] > div {
          background: #101b2b !important; color: var(--fc-text) !important; border-color: var(--fc-border) !important;
        }
        [data-testid="stImage"] img { border-radius: .55rem; border: 1px solid var(--fc-border); box-shadow: 0 18px 65px -26px rgba(98,223,244,.55); }
        .fc-brand { display:flex; align-items:center; gap:.65rem; padding:.2rem 0 .7rem 0; }
        .fc-atom { width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; border:1px solid rgba(98,223,244,.4); border-radius:50%; color:var(--fc-primary); box-shadow:0 0 28px rgba(98,223,244,.12); }
        .fc-brand-title { font-size:1rem; font-weight:700; line-height:1.05; color:#fff; }
        .fc-brand-sub { font-size:.68rem; letter-spacing:.16em; text-transform:uppercase; color:var(--fc-muted); margin-top:.18rem; }
        .fc-eyebrow { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.69rem; letter-spacing:.18em; text-transform:uppercase; color:var(--fc-muted); margin-bottom:.45rem; }
        .fc-title { font-size: clamp(2.15rem, 5vw, 4.6rem); line-height:1.04; font-weight:750; letter-spacing:-.045em; margin:.25rem 0 1rem 0; color:#f7fbff; }
        .fc-page-title { font-size:2.5rem; line-height:1.08; font-weight:730; letter-spacing:-.035em; margin:.25rem 0 .75rem 0; color:#f7fbff; }
        .fc-lead { max-width: 48rem; font-size:1rem; line-height:1.75; color:var(--fc-muted); }
        .plasma-text { background:linear-gradient(115deg,var(--fc-primary-2),var(--fc-primary)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .fc-card { border:1px solid var(--fc-border); border-radius:.55rem; padding:1.35rem; background:rgba(19,32,51,.78); min-height:150px; }
        .fc-card h3 { margin:.65rem 0 .5rem 0; font-size:1.12rem; }
        .fc-card p { color:var(--fc-muted); font-size:.88rem; line-height:1.55; }
        .fc-card .fc-icon { color:var(--fc-primary); font-size:1.2rem; }
        .fc-stat { border-top:1px solid var(--fc-border); padding-top:.85rem; }
        .fc-stat-value { color:var(--fc-primary); font-family:ui-monospace,monospace; font-size:1.03rem; }
        .fc-stat-label { color:var(--fc-muted); font-size:.64rem; letter-spacing:.14em; text-transform:uppercase; margin-top:.25rem; }
        .fc-note { border:1px solid var(--fc-border); border-left:3px solid var(--fc-primary); border-radius:.45rem; padding:.9rem 1rem; background:rgba(19,32,51,.62); color:var(--fc-muted); }
        .fc-team { border:1px solid var(--fc-border); border-radius:.5rem; padding:.8rem .9rem; background:rgba(19,32,51,.6); font-size:.8rem; }
        .fc-team strong { color:var(--fc-primary); }
        .tag { display:inline-block; padding:.18rem .5rem; border-radius:999px; border:1px solid rgba(98,223,244,.28); margin:.1rem; font-size:.75rem; color:var(--fc-primary); background:rgba(98,223,244,.06); }
        .small-muted { font-size:.86rem; color:var(--fc-muted); }
        div[data-testid="stProgress"] > div > div > div > div { background:linear-gradient(90deg,var(--fc-primary-2),var(--fc-primary)); }
        div[data-baseweb="tab-list"] { gap:.25rem; }
        button[data-baseweb="tab"] { border-radius:.35rem; color:var(--fc-muted); }
        button[data-baseweb="tab"][aria-selected="true"] { color:var(--fc-primary); background:rgba(98,223,244,.09); }
        </style>
        """,
        unsafe_allow_html=True,
    )


def ui_heading(eyebrow: str, title: str, description: str = '') -> None:
    desc = f'<p class="fc-lead">{description}</p>' if description else ''
    st.markdown(
        f'<div class="fc-eyebrow">{eyebrow}</div><div class="fc-page-title">{title}</div>{desc}',
        unsafe_allow_html=True,
    )

def sidebar_user(user_id: str) -> Dict[str, Any]:
    user = get_user(user_id)
    with st.sidebar:
        st.markdown(
            '<div class="fc-brand"><div class="fc-atom">⚛</div><div><div class="fc-brand-title">Fusion Connect AI</div><div class="fc-brand-sub">Physics · Fusion · Community</div></div></div>',
            unsafe_allow_html=True,
        )
        st.markdown(
            f'<div class="fc-team"><strong>Founder & Author</strong><br>{FOUNDER_NAME}<br><br><strong>Advisor</strong><br>{ADVISOR_NAME}</div>',
            unsafe_allow_html=True,
        )
        st.divider()
        st.caption('ANONYMOUS SESSION')
        st.code(user_id[:8] + '...' + user_id[-6:])
        if st.button('New anonymous session', use_container_width=True):
            st.session_state.user_id = str(uuid.uuid4())
            st.rerun()
        st.markdown(f'**{user.get("display_name") or make_demo_name(user_id)}**')
        st.caption(f'{user.get("role") or "Role not set"} · AI personalization {"on" if user.get("consent_ai") else "off"}')
        st.divider()
        st.caption('PUBLIC-EDUCATION PROTOTYPE')
        st.caption('Anonymous-by-default profile design. Production launch should add persistent authentication, moderation, and hosted storage.')
    return user

def page_home(user: Dict[str, Any]) -> None:
    left, right = st.columns([1.02, 0.98], gap='large')
    with left:
        st.markdown(
            '''<div class="fc-eyebrow">Plasma · Confinement · Energy</div>
            <div class="fc-title">Understand Fusion.<br>Explore Physics.<br><span class="plasma-text">Connect Ideas.</span></div>
            <p class="fc-lead">A calm, rigorous place to learn how stars are bottled: guided physics modules, an honest science community, collaborative projects, and transparent AI recommendations for students, teachers, researchers, and the public.</p>''',
            unsafe_allow_html=True,
        )
        b1, b2 = st.columns(2)
        with b1:
            if st.button('Start learning →', use_container_width=True):
                st.session_state.nav_page = 'Profile / Onboarding'
                st.rerun()
        with b2:
            if st.button('Explore fusion', use_container_width=True):
                st.session_state.nav_page = 'Learn'
                st.rerun()
        s1, s2, s3 = st.columns(3)
        for col, value, label in [
            (s1, '≈150M °C', 'plasma core target'),
            (s2, 'nTτ', 'triple product'),
            (s3, '17.6 MeV', 'per D–T event'),
        ]:
            with col:
                st.markdown(f'<div class="fc-stat"><div class="fc-stat-value">{value}</div><div class="fc-stat-label">{label}</div></div>', unsafe_allow_html=True)
    with right:
        hero = ASSETS_DIR / 'tokamak-hero.jpg'
        if hero.exists():
            st.image(str(hero), caption='Tokamak concept artwork from the uploaded Plasma Learn Hub UI', use_container_width=True)
        st.markdown('<div class="fc-note"><div class="fc-eyebrow">Confinement</div><code>q(r) = r Bφ / (R Bθ)</code></div>', unsafe_allow_html=True)

    st.write('')
    st.markdown('<div class="fc-eyebrow">The platform</div><div class="fc-page-title" style="font-size:2rem">Four surfaces, one scientific loop</div><p class="fc-lead">Learn a concept, discuss it, build something with people who care about the same problem, then let transparent AI help choose a useful next step.</p>', unsafe_allow_html=True)
    features = [
        ('◫', 'Learn', 'Structured modules from plasma basics to confinement, materials, diagnostics, and AI for fusion.'),
        ('◉', 'Connect', 'A focused science feed where learners, teachers, and researchers can exchange questions, results, and ideas.'),
        ('◎', 'Collaborate', 'Open research proposals, classroom projects, reading groups, and outreach ideas with skills stated up front.'),
        ('✦', 'Personalise', 'A transparent AI Mentor combines supervised ML, an MLP neural model, and feedback rewards to explain recommendations.'),
    ]
    for row in [features[:2], features[2:]]:
        cols = st.columns(2)
        for col, (icon, title, body) in zip(cols, row):
            with col:
                st.markdown(f'<div class="fc-card"><div class="fc-icon">{icon}</div><h3>{title}</h3><p>{body}</p></div>', unsafe_allow_html=True)

    st.write('')
    c1, c2 = st.columns([0.88, 1.12], gap='large')
    with c1:
        st.markdown('<div class="fc-eyebrow">Where the curriculum points</div><div class="fc-page-title" style="font-size:2rem">From fundamentals to reactor thinking</div><p class="fc-lead">The learning path connects plasma theory to the density–temperature–confinement trade space, then moves into materials, diagnostics, controls, safety, and research collaboration.</p><p style="font-family:ui-monospace,monospace;color:#62dff4">n · T · τ<sub>E</sub> → fusion performance</p>', unsafe_allow_html=True)
    with c2:
        concept = pd.DataFrame({
            'stage': ['Plasma basics', 'Magnetic confinement', 'Performance metrics', 'Materials & fuel cycle', 'Diagnostics & control', 'Integrated systems'],
            'conceptual_depth': [12, 30, 48, 64, 80, 96],
        })
        fig = px.line(concept, x='stage', y='conceptual_depth', markers=True, labels={'conceptual_depth':'Curriculum depth', 'stage':''})
        fig.update_layout(height=310, margin=dict(l=10,r=10,t=20,b=10), paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font_color='#dce8f2', showlegend=False)
        fig.update_xaxes(gridcolor='rgba(128,166,199,.14)', tickangle=-20)
        fig.update_yaxes(gridcolor='rgba(128,166,199,.14)', showticklabels=False)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
        st.caption('Conceptual curriculum map — not experimental performance data.')

    st.markdown('<div class="fc-eyebrow">Start anywhere</div><div class="fc-page-title" style="font-size:2rem">Popular modules</div>', unsafe_allow_html=True)
    cols = st.columns(3)
    for col, module in zip(cols, LEARNING_MODULES[:3]):
        with col:
            tags = ' · '.join(module['tags'][:2])
            st.markdown(f'<div class="fc-card"><div class="fc-eyebrow">{tags}</div><h3>{module["title"]}</h3><p>{module["summary"]}</p><div class="small-muted">{module["level"]}</div></div>', unsafe_allow_html=True)
            if st.button('Open module', key=f'home_module_{module["id"]}', use_container_width=True):
                st.session_state.selected_module = module['id']
                st.session_state.nav_page = 'Learn'
                st.rerun()


def page_user_dashboard(user: Dict[str, Any]) -> None:
    ui_heading('Private to you', 'Dashboard', 'Track learning progress, topic exploration, and community activity for this anonymous session.')
    events = query_df('SELECT * FROM events WHERE user_id = ? ORDER BY created_at DESC', (user['user_id'],))
    posts = query_df('SELECT * FROM posts WHERE user_id = ?', (user['user_id'],))
    feedback = query_df('SELECT * FROM feedback WHERE user_id = ?', (user['user_id'],))
    collabs = query_df('SELECT * FROM collaborations WHERE user_id = ?', (user['user_id'],))

    if events.empty:
        module_views = 0
        community_actions = len(posts) + len(collabs)
        minutes_week = 0
        streak = 0
    else:
        parsed = pd.to_datetime(events['created_at'], errors='coerce', utc=True)
        today = pd.Timestamp.now(tz='UTC').normalize()
        this_week = parsed >= today - pd.Timedelta(days=6)
        weights = {'module_view': 8, 'quiz_attempt': 5, 'post_created': 4, 'comment_created': 3, 'collab_created': 6, 'feedback_given': 2}
        minutes_week = int(sum(weights.get(et, 1) for et in events.loc[this_week, 'event_type'].astype(str)))
        module_views = int(events.loc[events['event_type'].eq('module_view'), 'item_id'].nunique())
        community_actions = int(events['event_type'].isin(['post_created','comment_created','post_upvote','collab_created','collab_interest']).sum())
        active_days = sorted({d.date() for d in parsed.dropna()}, reverse=True)
        streak = 0
        cursor = today.date()
        for d in active_days:
            if d == cursor:
                streak += 1
                cursor = cursor - pd.Timedelta(days=1)
            elif d < cursor:
                break

    m1, m2, m3, m4 = st.columns(4)
    m1.metric('Modules explored', f'{module_views} / {len(LEARNING_MODULES)}')
    m2.metric('Active-day streak', streak)
    m3.metric('Est. minutes · 7d', minutes_week)
    m4.metric('Community actions', community_actions)

    left, right = st.columns([1.45, 1], gap='large')
    with left:
        st.markdown('<div class="fc-eyebrow">Estimated learning activity · last 7 days</div>', unsafe_allow_html=True)
        dates = pd.date_range(pd.Timestamp.now(tz='UTC').normalize() - pd.Timedelta(days=6), periods=7, freq='D')
        activity = pd.DataFrame({'date': dates, 'minutes': 0})
        if not events.empty:
            ev_dates = pd.to_datetime(events['created_at'], errors='coerce', utc=True).dt.normalize()
            weights = events['event_type'].map({'module_view': 8, 'quiz_attempt': 5, 'post_created': 4, 'comment_created': 3, 'collab_created': 6, 'feedback_given': 2}).fillna(1)
            daily = pd.DataFrame({'date': ev_dates, 'minutes': weights}).dropna().groupby('date', as_index=False)['minutes'].sum()
            activity = activity.merge(daily, on='date', how='left', suffixes=('', '_actual'))
            activity['minutes'] = activity['minutes_actual'].fillna(activity['minutes'])
        st.area_chart(activity.set_index('date')['minutes'], height=270)
    with right:
        st.markdown('<div class="fc-eyebrow">Topic exploration</div>', unsafe_allow_html=True)
        topic_counts = {t: 0 for t in TOPICS}
        if not events.empty:
            for raw in events['topic'].fillna(''):
                for t in str(raw).split(','):
                    if t in topic_counts:
                        topic_counts[t] += 1
        top = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:6]
        if any(v for _, v in top):
            radar = pd.DataFrame({'topic':[t for t,_ in top], 'value':[v for _,v in top]})
            fig = px.line_polar(radar, r='value', theta='topic', line_close=True)
            fig.update_traces(fill='toself')
            fig.update_layout(height=270, margin=dict(l=20,r=20,t=20,b=20), paper_bgcolor='rgba(0,0,0,0)', font_color='#dce8f2', polar=dict(bgcolor='rgba(0,0,0,0)', radialaxis=dict(showticklabels=False, gridcolor='rgba(128,166,199,.15)'), angularaxis=dict(gridcolor='rgba(128,166,199,.15)')))
            st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
        else:
            st.info('Explore modules, posts, and projects to build your topic map.')

    c1, c2 = st.columns(2, gap='large')
    with c1:
        st.markdown('<div class="fc-eyebrow">Module progress</div>', unsafe_allow_html=True)
        viewed = set(events.loc[events['event_type'].eq('module_view'), 'item_id'].astype(str)) if not events.empty else set()
        quizzed = set(events.loc[events['event_type'].eq('quiz_attempt'), 'item_id'].astype(str)) if not events.empty else set()
        for module in LEARNING_MODULES:
            progress = 100 if module['id'] in quizzed else 55 if module['id'] in viewed else 0
            st.caption(f'{module["title"]} · {progress}%')
            st.progress(progress)
    with c2:
        st.markdown('<div class="fc-eyebrow">Recent activity</div>', unsafe_allow_html=True)
        if events.empty:
            st.info('No activity yet. Start with a learning module or AI Mentor recommendation.')
        else:
            labels = {
                'module_view':'Explored module', 'quiz_attempt':'Tried knowledge check', 'post_created':'Published post',
                'comment_created':'Commented', 'post_upvote':'Upvoted discussion', 'collab_created':'Created project',
                'collab_interest':'Joined project interest', 'feedback_given':'Trained AI feedback', 'recommendation_accepted':'Accepted AI suggestion'
            }
            for _, row in events.head(8).iterrows():
                label = labels.get(row['event_type'], str(row['event_type']).replace('_',' ').title())
                item = str(row['item_id'] or row['topic'] or '')[:55]
                st.markdown(f'**{label}**  \n<span class="small-muted">{item} · {row["created_at"]}</span>', unsafe_allow_html=True)

    st.caption('Engagement minutes are an MVP estimate from interaction types, not a stopwatch measurement.')


def page_qr(user: Dict[str, Any]) -> None:
    ui_heading('Share offline', 'QR Generator', 'Create real QR codes for the public app, a learning module, a community campaign, or a collaboration outreach link.')
    app_url = st.text_input('Public Streamlit app URL', placeholder='https://your-app-name.streamlit.app')
    kind = st.radio('Share type', ['Platform', 'Learning module', 'Community outreach', 'Collaboration'], horizontal=True)
    target = ''
    if kind == 'Learning module':
        module = st.selectbox('Module', LEARNING_MODULES, format_func=lambda m: m['title'])
        target = module['id']
    elif kind == 'Community outreach':
        target = st.text_input('Campaign/referral label', value='ethan_fusion_community')
    elif kind == 'Collaboration':
        collabs = query_df('SELECT collab_id, title FROM collaborations ORDER BY created_at DESC LIMIT 50')
        if collabs.empty:
            target = st.text_input('Project/referral label', value='fusion_collaboration')
        else:
            options = {row['title']: row['collab_id'] for _, row in collabs.iterrows()}
            selected = st.selectbox('Collaboration proposal', list(options.keys()))
            target = options[selected]
    else:
        target = st.text_input('Referral label', value='ethan_fusion_outreach')

    if app_url.strip():
        base = app_url.strip().rstrip('/')
        if kind == 'Learning module':
            destination = f'{base}?ref=qr_module_{target}'
        elif kind == 'Collaboration':
            destination = f'{base}?ref=qr_collab_{target}'
        else:
            destination = f'{base}?ref={target.strip() or "fusionconnect"}'
        left, right = st.columns([1, .75], gap='large')
        with left:
            st.text_input('Destination', value=destination, disabled=True)
            st.markdown('<div class="fc-note">Referral tags are captured by the MVP signup logic so Ethan can compare outreach sources in Founder Analytics.</div>', unsafe_allow_html=True)
        with right:
            png = qr_png_bytes(destination)
            st.image(png, caption='Scan to open Fusion Connect AI', width=280)
            st.download_button('Download QR code PNG', data=png, file_name='fusion_connect_ai_qr.png', mime='image/png', use_container_width=True)
    else:
        st.info('Enter the deployed Streamlit URL to generate a working QR code.')


def page_start(user: Dict[str, Any]) -> None:
    ui_heading('Your profile', 'Onboarding', 'Create a privacy-aware profile so the AI mentor can recommend learning modules, discussions, and collaboration paths.')
    st.info('Avoid collecting personally identifying information from students or minors unless you have the right consent process. Use broad, optional categories instead of exact birth date, address, or sensitive personal data.')

    with st.form('profile_form'):
        display_name = st.text_input('Public display name', value=user.get('display_name') or make_demo_name(user['user_id']), max_chars=40)
        col1, col2, col3 = st.columns(3)
        with col1:
            role = st.selectbox('Role', ROLES, index=ROLES.index(user.get('role')) if user.get('role') in ROLES else 0)
            age_band = st.selectbox('Age band (optional)', AGE_BANDS, index=AGE_BANDS.index(user.get('age_band')) if user.get('age_band') in AGE_BANDS else 0)
        with col2:
            education_level = st.selectbox('Education level', EDUCATION_LEVELS, index=EDUCATION_LEVELS.index(user.get('education_level')) if user.get('education_level') in EDUCATION_LEVELS else 0)
            knowledge_level = st.selectbox('Physics/fusion knowledge', KNOWLEDGE_LEVELS, index=KNOWLEDGE_LEVELS.index(user.get('knowledge_level')) if user.get('knowledge_level') in KNOWLEDGE_LEVELS else 0)
        with col3:
            region = st.text_input('Region or community (optional)', value=user.get('region') or 'Prefer not to say', max_chars=80)
        interests = st.multiselect('Physics and fusion interests', TOPICS, default=[x for x in user.get('interests', []) if x in TOPICS] or ['fusion basics'])
        goals = st.multiselect('What do you want from this platform?', GOALS, default=[x for x in user.get('goals', []) if x in GOALS] or ['Learn fundamentals'])
        consent_ai = st.checkbox('I agree to use my anonymous profile and app behavior for AI personalization inside this app.', value=bool(user.get('consent_ai')))
        consent_public = st.checkbox('I understand posts/collaboration proposals may be visible to other users of this public app.', value=bool(user.get('consent_public')))
        consent_research = st.checkbox('Optional: allow aggregated, anonymous usage statistics to support outreach/research reports.', value=bool(user.get('consent_research')))
        submitted = st.form_submit_button('Save profile')
    if submitted:
        if not interests:
            st.warning('Please select at least one interest.')
            return
        if not goals:
            st.warning('Please select at least one goal.')
            return
        profile = {
            'display_name': display_name.strip() or make_demo_name(user['user_id']),
            'role': role,
            'age_band': age_band,
            'education_level': education_level,
            'region': region.strip() or 'Prefer not to say',
            'knowledge_level': knowledge_level,
            'interests': interests,
            'goals': goals,
            'consent_ai': consent_ai,
            'consent_public': consent_public,
            'consent_research': consent_research,
        }
        update_user_profile(user['user_id'], profile)
        st.success('Profile saved. Go to AI Mentor to see personalized suggestions.')
        st.rerun()

    st.subheader('Prototype architecture')
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown('**Supervised ML**')
        st.caption('Learns from anonymous profile + behavior + positive feedback to predict helpful next actions.')
    with c2:
        st.markdown('**Deep neural network**')
        st.caption('Uses an MLP classifier as a lightweight neural model for nonlinear recommendation patterns.')
    with c3:
        st.markdown('**Reinforcement learning**')
        st.caption('Uses reward feedback from users to improve future suggestions by segment.')


def page_ai_mentor(user: Dict[str, Any]) -> None:
    ui_heading('Transparent recommendations', 'AI Mentor', 'Personalised next steps that explain the role of rules, supervised ML, neural modelling, and feedback rewards.')
    if not user.get('consent_ai'):
        st.warning('AI personalization is currently off. Recommendations below use only basic rules and community trends. Enable personalization in Profile / Onboarding for the full ML + neural + feedback pipeline.')
    recommendations, status = recommend_actions(user)
    st.caption(status)

    for i, rec in enumerate(recommendations, start=1):
        with st.container(border=True):
            cols = st.columns([0.72, 0.28])
            with cols[0]:
                st.subheader(f'{i}. {rec["label"]}')
                st.write(rec['why'])
                st.markdown(' '.join([f'<span class="tag">{t}</span>' for t in rec['tags']]), unsafe_allow_html=True)
                st.caption(f'Why suggested: {rec["explanation"]}')
            with cols[1]:
                st.metric('AI score', f'{rec["score"]:.2f}')
                st.caption(f'Rule {rec["rule_score"]:.2f} | ML {rec["supervised_score"]:.2f} | NN {rec["deep_score"]:.2f} | RL {rec["rl_score"]:.2f}')
                if st.button('Open / accept', key=f'accept_{rec["action_id"]}_{i}'):
                    add_feedback(user, rec['action_id'], rec['item_id'], rating=5, accepted=True, reason='accepted from recommendation card')
                    log_event(user['user_id'], 'recommendation_accepted', rec['item_id'], ','.join(rec['tags']), {'action_id': rec['action_id']})
                    if rec['type'] == 'learn' and rec['item_id'] not in {'quiz'}:
                        st.session_state.selected_module = rec['item_id']
                        st.session_state.nav_page = 'Learn'
                    elif rec['item_id'] == 'new_post':
                        st.session_state.nav_page = 'Community'
                    elif rec['item_id'] in {'new_collab', 'collab_board'}:
                        st.session_state.nav_page = 'Collaborate'
                    st.rerun()

    st.subheader('Give feedback to train the AI')
    with st.form('feedback_form'):
        action_map = {f"{a['label']} ({a['action_id']})": a for a in ACTIONS}
        chosen_label = st.selectbox('Suggestion you are rating', list(action_map.keys()))
        rating = st.slider('How useful was this suggestion?', 1, 5, 4)
        accepted = st.checkbox('I used or plan to use this suggestion', value=rating >= 4)
        reason = st.text_area('Optional feedback', placeholder='Tell the platform what worked or did not work.', max_chars=400)
        submitted = st.form_submit_button('Submit feedback')
    if submitted:
        action = action_map[chosen_label]
        add_feedback(user, action['action_id'], action['item_id'], rating, accepted, reason)
        st.success('Thanks. Your feedback updated the reinforcement-learning reward table and future recommendations.')


def page_learn(user: Dict[str, Any]) -> None:
    ui_heading('Curriculum', 'Learn', 'Two tracks meet in the middle: physics that governs ionised matter and engineering that can turn it into useful energy.')
    col1, col2 = st.columns([0.35, 0.65])
    with col1:
        levels = ['All'] + KNOWLEDGE_LEVELS
        selected_level = st.selectbox('Level filter', levels)
        selected_topic = st.selectbox('Topic filter', ['All'] + TOPICS)
        module_options = []
        for module in LEARNING_MODULES:
            if selected_level != 'All' and module['level'] != selected_level:
                continue
            if selected_topic != 'All' and selected_topic not in module['tags']:
                continue
            module_options.append(module)
        default_module_id = st.session_state.get('selected_module', module_options[0]['id'] if module_options else LEARNING_MODULES[0]['id'])
        option_titles = {m['title']: m for m in module_options or LEARNING_MODULES}
        default_title = next((m['title'] for m in option_titles.values() if m['id'] == default_module_id), list(option_titles.keys())[0])
        selected_title = st.radio('Choose a module', list(option_titles.keys()), index=list(option_titles.keys()).index(default_title))
        module = option_titles[selected_title]
        if st.button('Mark module as viewed'):
            log_event(user['user_id'], 'module_view', module['id'], ','.join(module['tags']))
            st.success('Progress saved.')
    with col2:
        st.subheader(module['title'])
        st.caption(f"Level: {module['level']} | Tags: {', '.join(module['tags'])}")
        st.write(module['summary'])
        st.markdown(module['content'])
        with st.expander('Active learning activity'):
            st.write(module['activity'])
        with st.expander('Quick quiz'):
            st.write(module['quiz_question'])
            answer = st.text_input('Your answer', key=f'quiz_{module["id"]}')
            if st.button('Check answer', key=f'check_{module["id"]}'):
                log_event(user['user_id'], 'quiz_attempt', module['id'], ','.join(module['tags']))
                normalized = answer.lower().strip()
                expected = module['quiz_answer'].lower()
                if any(word in normalized for word in expected.split()[:4]):
                    st.success('Good direction. Compare with the model answer below.')
                else:
                    st.info('Keep refining. Compare with the model answer below.')
                st.markdown(f'**Model answer:** {module["quiz_answer"]}')


def page_community(user: Dict[str, Any]) -> None:
    ui_heading('Discussion', 'Community', 'A focused science feed for results, questions, outreach, and debate across physics and nuclear fusion.')
    st.markdown('<div class="fc-note"><strong>Community norm:</strong> cite what you can, say when you are unsure, and keep discussion constructive and science-focused.</div>', unsafe_allow_html=True)
    if not user.get('consent_public'):
        st.info('You have not confirmed public posting consent. You can still read posts. To post, enable public posting consent in Profile / Onboarding.')

    with st.expander('Create a post', expanded=False):
        with st.form('new_post_form'):
            category = st.selectbox('Category', ['Question', 'Education', 'AI / ML', 'Research idea', 'Outreach', 'News discussion'])
            tags = st.multiselect('Tags', TOPICS, default=[t for t in user.get('interests', [])[:2] if t in TOPICS])
            title = st.text_input('Title', max_chars=140)
            body = st.text_area('Post body', max_chars=2500)
            submitted = st.form_submit_button('Publish post')
        if submitted:
            if not user.get('consent_public'):
                st.error('Enable public posting consent before publishing.')
            else:
                ok, message = content_is_ok(title + ' ' + body)
                if not ok:
                    st.error(message)
                elif not tags:
                    st.error('Please choose at least one tag.')
                else:
                    run_sql(
                        'INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        (str(uuid.uuid4()), user['user_id'], user.get('display_name') or make_demo_name(user['user_id']), category, title.strip(), body.strip(), json_dumps(tags), 0, utc_now())
                    )
                    log_event(user['user_id'], 'post_created', topic=','.join(tags), metadata={'category': category})
                    st.success('Post published.')
                    st.rerun()

    tag_filter = st.selectbox('Filter by tag', ['All'] + TOPICS)
    if tag_filter == 'All':
        posts = query_df('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100')
    else:
        posts = query_df('SELECT * FROM posts ORDER BY created_at DESC LIMIT 200')
        posts = posts[posts['tags_json'].apply(lambda raw: tag_filter in safe_json_loads(raw, []))]

    if posts.empty:
        st.info('No posts yet. Be the first to start a discussion.')
    for _, post in posts.iterrows():
        tags = safe_json_loads(post['tags_json'], [])
        with st.container(border=True):
            st.subheader(post['title'])
            st.caption(f"{post['category']} · by {post['display_name']} · {post['created_at']} · ▲ {int(post['upvotes'])}")
            st.markdown(' '.join([f'<span class="tag">{t}</span>' for t in tags]), unsafe_allow_html=True)
            st.write(post['body'])
            c1, c2 = st.columns([0.18, 0.82])
            with c1:
                if st.button('▲ Upvote', key=f'up_{post["post_id"]}'):
                    run_sql('UPDATE posts SET upvotes = upvotes + 1 WHERE post_id = ?', (post['post_id'],))
                    log_event(user['user_id'], 'post_upvote', post['post_id'], ','.join(tags))
                    st.rerun()
            with c2:
                with st.form(f'comment_{post["post_id"]}'):
                    comment = st.text_input('Add a comment', key=f'comment_text_{post["post_id"]}', max_chars=800)
                    sent = st.form_submit_button('Comment')
                if sent:
                    if not user.get('consent_public'):
                        st.error('Enable public posting consent before commenting.')
                    else:
                        ok, message = content_is_ok(comment)
                        if ok:
                            run_sql('INSERT INTO comments VALUES (?, ?, ?, ?, ?, ?)', (str(uuid.uuid4()), post['post_id'], user['user_id'], user.get('display_name') or make_demo_name(user['user_id']), comment.strip(), utc_now()))
                            log_event(user['user_id'], 'comment_created', post['post_id'], ','.join(tags))
                            st.rerun()
                        else:
                            st.error(message)
            comments = query_df('SELECT display_name, body, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC LIMIT 20', (post['post_id'],))
            if not comments.empty:
                with st.expander(f'{len(comments)} comment(s)'):
                    for _, row in comments.iterrows():
                        st.markdown(f'**{row["display_name"]}** · {row["created_at"]}')
                        st.write(row['body'])


def page_collaboration(user: Dict[str, Any]) -> None:
    ui_heading('Open projects', 'Collaborate', 'Post mini-project ideas, class activities, reading groups, outreach work, or research collaboration prompts.')
    with st.expander('Create collaboration proposal', expanded=False):
        with st.form('collab_form'):
            title = st.text_input('Proposal title', max_chars=160)
            topics = st.multiselect('Topics', TOPICS, default=[t for t in user.get('interests', [])[:3] if t in TOPICS])
            summary = st.text_area('Summary', max_chars=2500, placeholder='What is the project? What would collaborators do? What is the first milestone?')
            skills_needed = st.text_input('Skills needed', max_chars=250, placeholder='Example: Python, physics teaching, plasma diagnostics, literature review')
            contact_hint = st.text_input('Contact hint (optional)', max_chars=200, placeholder='Example: reply in comments, school club, public email, Discord handle')
            status = st.selectbox('Status', ['Open', 'Planning', 'Needs mentor', 'Classroom activity', 'Research idea'])
            submitted = st.form_submit_button('Publish collaboration proposal')
        if submitted:
            if not user.get('consent_public'):
                st.error('Enable public posting consent before publishing.')
            else:
                ok, message = content_is_ok(title + ' ' + summary)
                if not ok:
                    st.error(message)
                elif not topics:
                    st.error('Please choose at least one topic.')
                else:
                    run_sql(
                        'INSERT INTO collaborations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        (str(uuid.uuid4()), user['user_id'], user.get('display_name') or make_demo_name(user['user_id']), title.strip(), summary.strip(), json_dumps(topics), skills_needed.strip(), contact_hint.strip(), status, utc_now())
                    )
                    log_event(user['user_id'], 'collab_created', topic=','.join(topics), metadata={'status': status})
                    st.success('Collaboration proposal published.')
                    st.rerun()

    proposals = query_df('SELECT * FROM collaborations ORDER BY created_at DESC LIMIT 100')
    if proposals.empty:
        st.info('No collaboration proposals yet.')
    for _, row in proposals.iterrows():
        topics = safe_json_loads(row['topics_json'], [])
        with st.container(border=True):
            st.subheader(row['title'])
            st.caption(f"{row['status']} · by {row['display_name']} · {row['created_at']}")
            st.markdown(' '.join([f'<span class="tag">{t}</span>' for t in topics]), unsafe_allow_html=True)
            st.write(row['summary'])
            if row['skills_needed']:
                st.markdown(f'**Skills needed:** {row["skills_needed"]}')
            if row['contact_hint']:
                st.markdown(f'**Contact hint:** {row["contact_hint"]}')
            if st.button('I am interested', key=f'interested_{row["collab_id"]}'):
                log_event(user['user_id'], 'collab_interest', row['collab_id'], ','.join(topics))
                st.success('Interest recorded. In a production version, this would notify the proposal owner.')


def qr_png_bytes(url: str) -> bytes:
    qr = qrcode.QRCode(version=1, box_size=8, border=3)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return buffer.getvalue()


def page_dashboard(user: Dict[str, Any]) -> None:
    ui_heading('Leadership & outreach', 'Founder Analytics', 'An anonymized launch dashboard for Ethan Meline to track community growth, engagement, referral sources, and project activity.')
    default_pass = 'demo'
    try:
        admin_pass = st.secrets.get('ADMIN_PASSCODE', default_pass)
    except Exception:
        admin_pass = default_pass
    password = st.text_input('Admin passcode', type='password', help='Default for this prototype is “demo”. Change ADMIN_PASSCODE in Streamlit secrets for deployment.')
    if password != admin_pass:
        st.info('Enter the admin passcode to view dashboard metrics.')
        return

    users = query_df('SELECT * FROM users')
    events = query_df('SELECT * FROM events')
    posts = query_df('SELECT * FROM posts')
    feedback = query_df('SELECT * FROM feedback')
    collabs = query_df('SELECT * FROM collaborations')

    c1, c2, c3, c4 = st.columns(4)
    c1.metric('Anonymous signups', len(users[~users['user_id'].astype(str).str.startswith('seed-user')]) if not users.empty else 0)
    c2.metric('Community posts', len(posts))
    c3.metric('Collaboration proposals', len(collabs))
    c4.metric('AI feedback records', len(feedback))

    if not events.empty:
        events['date'] = pd.to_datetime(events['created_at'], errors='coerce').dt.date
        growth = events[events['event_type'].eq('signup')].groupby('date').size().reset_index(name='signups')
        if not growth.empty:
            st.subheader('Signup trend')
            st.line_chart(growth.set_index('date'))

    col1, col2 = st.columns(2)
    with col1:
        st.subheader('User role distribution')
        if not users.empty:
            role_counts = users[~users['user_id'].astype(str).str.startswith('seed-user')]['role'].fillna('Unknown').value_counts().reset_index()
            role_counts.columns = ['role', 'count']
            if not role_counts.empty:
                st.plotly_chart(px.bar(role_counts, x='role', y='count'), use_container_width=True)
            else:
                st.info('No real user roles yet.')
    with col2:
        st.subheader('Interest distribution')
        topic_counts = {topic: 0 for topic in TOPICS}
        if not users.empty:
            for raw in users[~users['user_id'].astype(str).str.startswith('seed-user')]['interests_json'].fillna('[]'):
                for topic in safe_json_loads(raw, []):
                    if topic in topic_counts:
                        topic_counts[topic] += 1
        topics_df = pd.DataFrame({'topic': list(topic_counts.keys()), 'count': list(topic_counts.values())}).sort_values('count', ascending=False)
        st.plotly_chart(px.bar(topics_df.head(10), x='count', y='topic', orientation='h'), use_container_width=True)

    st.subheader('Referral / QR acquisition')
    if not users.empty and 'referral_source' in users.columns:
        referrals = users[~users['user_id'].astype(str).str.startswith('seed-user')]['referral_source'].fillna('organic').replace('', 'organic').value_counts().reset_index()
        referrals.columns = ['source', 'signups']
        if not referrals.empty:
            st.plotly_chart(px.bar(referrals, x='source', y='signups'), use_container_width=True)
        else:
            st.info('No referral data yet.')

    st.subheader('QR code generator')
    app_url = st.text_input('Public app URL', placeholder='https://your-app-name.streamlit.app')
    ref_code = st.text_input('Referral code for QR analytics', value='ethan_fusion_outreach')
    if app_url:
        final_url = app_url.strip()
        separator = '&' if '?' in final_url else '?'
        final_url = f'{final_url}{separator}ref={ref_code.strip() or "ethan"}'
        png = qr_png_bytes(final_url)
        st.image(png, caption=final_url, width=260)
        st.download_button('Download QR code PNG', data=png, file_name='fusionconnect_ai_qr.png', mime='image/png')

    st.subheader('Export anonymized analytics')
    export = {
        'generated_at': utc_now(),
        'anonymous_user_count': int(len(users[~users['user_id'].astype(str).str.startswith('seed-user')])) if not users.empty else 0,
        'post_count': int(len(posts)),
        'collaboration_count': int(len(collabs)),
        'feedback_count': int(len(feedback)),
    }
    st.download_button('Download metrics JSON', json_dumps(export), file_name='fusionconnect_metrics.json', mime='application/json')


def page_privacy(user: Dict[str, Any]) -> None:
    ui_heading('Control your data', 'Privacy / Data', 'This prototype is designed around anonymous IDs, optional broad profile fields, transparent personalization, export, and deletion controls.')
    st.markdown(
        """
**Recommended production upgrades before public launch:**

- Use real authentication if users need persistent identity.
- Use a managed database such as PostgreSQL, Supabase, or Firebase instead of local SQLite.
- Add a real privacy policy, terms of use, consent flow for minors, and content-moderation process.
- Add role-based admin access, audit logs, and data-retention controls.
- Do not collect exact birth dates, home addresses, or sensitive demographics unless legally necessary and properly protected.
"""
    )
    user_rows = query_df('SELECT * FROM users WHERE user_id = ?', (user['user_id'],))
    event_rows = query_df('SELECT * FROM events WHERE user_id = ?', (user['user_id'],))
    feedback_rows = query_df('SELECT * FROM feedback WHERE user_id = ?', (user['user_id'],))
    posts_rows = query_df('SELECT * FROM posts WHERE user_id = ?', (user['user_id'],))
    collab_rows = query_df('SELECT * FROM collaborations WHERE user_id = ?', (user['user_id'],))
    export = {
        'user': user_rows.to_dict(orient='records'),
        'events': event_rows.to_dict(orient='records'),
        'feedback': feedback_rows.to_dict(orient='records'),
        'posts': posts_rows.to_dict(orient='records'),
        'collaborations': collab_rows.to_dict(orient='records'),
    }
    st.download_button('Download my data JSON', data=json_dumps(export), file_name='my_fusionconnect_data.json', mime='application/json')

    st.subheader('Delete anonymous account data')
    st.warning('This deletes your current anonymous profile, events, feedback, posts, comments, and collaboration proposals from this local prototype database.')
    confirm = st.text_input('Type DELETE to confirm')
    if st.button('Delete my current anonymous data'):
        if confirm == 'DELETE':
            uid = user['user_id']
            with get_conn() as conn:
                for table in ['feedback', 'events', 'comments', 'posts', 'collaborations', 'users']:
                    conn.execute(f'DELETE FROM {table} WHERE user_id = ?', (uid,))
                conn.commit()
            st.session_state.user_id = str(uuid.uuid4())
            st.success('Deleted current anonymous data and started a new anonymous session.')
            st.rerun()
        else:
            st.error('Confirmation text did not match DELETE.')


def main() -> None:
    init_db()
    ensure_seed_data()
    render_header()
    user_id = create_user_if_needed()
    user = sidebar_user(user_id)

    pages = ['Home', 'Learn', 'Community', 'Collaborate', 'AI Mentor', 'My Dashboard', 'QR Generator', 'Profile / Onboarding', 'Founder Analytics', 'Privacy / Data']
    if 'nav_page' in st.session_state and st.session_state.nav_page in pages:
        default_index = pages.index(st.session_state.nav_page)
        del st.session_state.nav_page
    else:
        default_index = 0
    page = st.sidebar.radio('Navigate', pages, index=default_index, label_visibility='collapsed')

    if page == 'Home':
        page_home(user)
    elif page == 'Learn':
        page_learn(user)
    elif page == 'Community':
        page_community(user)
    elif page == 'Collaborate':
        page_collaboration(user)
    elif page == 'AI Mentor':
        page_ai_mentor(user)
    elif page == 'My Dashboard':
        page_user_dashboard(user)
    elif page == 'QR Generator':
        page_qr(user)
    elif page == 'Profile / Onboarding':
        page_start(user)
    elif page == 'Founder Analytics':
        page_dashboard(user)
    elif page == 'Privacy / Data':
        page_privacy(user)

    st.divider()
    st.markdown(
        f'<div class="small-muted">Fusion Connect AI · Founder & Author: <strong>{FOUNDER_NAME}</strong> · Advisor: <strong>{ADVISOR_NAME}</strong></div>',
        unsafe_allow_html=True,
    )
    st.caption('Educational prototype: content is simplified and should receive expert review before being presented as authoritative curriculum. AI suggestions are navigation and learning recommendations, not scientific or academic advice.')

if __name__ == '__main__':
    main()
