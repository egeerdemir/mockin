#!/usr/bin/env python3
"""
build_courses.py — Generates courses.js from RWTH CSV datasets.
Run: python3 build_courses.py > courses.js
"""
import csv, json, re, sys

CATALOG = 'rwth_course_catalog_rich.csv'
EXAMS   = 'rwth_courses_with_exams_better.csv'

INCLUDE_TYPES = {'L', 'LE', 'LA', 'LC', 'SE', 'IC'}

DEPT_MAP = {
    '02': 'Architecture', '10': 'Mathematics', '11': 'Physics',
    '12': 'Chemistry', '13': 'Biology', '14': 'Geosciences',
    '15': 'Computer Science', '16': 'Electrical Engineering',
    '19': 'Civil Engineering', '21': 'Architecture & Urban Planning',
    '23': 'Mechanical Engineering', '41': 'Mechanical Engineering',
    '42': 'Aerospace Engineering', '52': 'Materials Science',
    '54': 'Chemical Engineering', '61': 'Electrical Engineering & IT',
    '64': 'Informatics', '70': 'Business & Economics', '81': 'Business & Economics',
    '90': 'Medicine', '92': 'Medicine', '93': 'Dentistry',
    '51': 'Georesources & Mining',
}

def norm(s):
    """Normalize title for fuzzy matching."""
    return re.sub(r'\s+', ' ', s.lower().strip().replace('-', ' ').replace('–', ' '))

# Load exam dates, keyed by normalized title
exam_map = {}  # norm_title -> {exam_date, ects}
try:
    with open(EXAMS, encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = (row.get('course_name') or row.get('title') or '').strip()
            if not title:
                continue
            key = norm(title)
            date = (row.get('exam_date') or '').strip()
            ects_raw = (row.get('ects') or '').strip()
            ects = None
            try:
                v = float(ects_raw)
                if v > 0:
                    ects = int(v) if v == int(v) else v
            except (ValueError, TypeError):
                pass
            if key not in exam_map and date:
                exam_map[key] = {'examDate': date, 'ects': ects}
except FileNotFoundError:
    pass  # exams file optional

# Load catalog
courses = []
seen_titles = set()

with open(CATALOG, encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        ctype = (row.get('course_type_short') or '').strip()
        if ctype not in INCLUDE_TYPES:
            continue

        title = (row.get('title_for_app') or row.get('course_title_en') or '').strip()
        if not title:
            continue

        title_norm = norm(title)
        if title_norm in seen_titles:
            continue
        seen_titles.add(title_norm)

        course_num = (row.get('course_number') or '').strip()
        dept_prefix = course_num.split('.')[0] if '.' in course_num else course_num[:2]
        dept_name = DEPT_MAP.get(dept_prefix, '')

        lecturer = (row.get('first_lecturer') or '').strip()

        # Look up exam data
        exam_info = exam_map.get(title_norm, {})

        courses.append({
            'id': course_num,
            'title': title,
            'lecturer': lecturer,
            'dept': dept_name,
            'deptCode': dept_prefix,
            'examDate': exam_info.get('examDate', None),
            'ects': exam_info.get('ects', None),
        })

# Sort: courses with exam dates first (more useful), then alphabetically
courses.sort(key=lambda c: (0 if c['examDate'] else 1, c['title'].lower()))

out = '/* courses.js — RWTH Course Catalog (auto-generated, do not edit manually) */\n'
out += 'const RWTH_COURSES = ' + json.dumps(courses, ensure_ascii=False, separators=(',', ':')) + ';\n'
print(out, end='')
sys.stderr.write(f'Generated {len(courses)} courses ({len([c for c in courses if c["examDate"]])} with exam dates)\n')
