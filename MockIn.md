{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww29700\viewh15480\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # MockIn \'97 Product Blueprint\
\
## Core Philosophy\
\
MockIn is a free, donation-supported exam preparation platform for students.\
\
It organizes students into seasonal course classes, provides checkpoint mock exams throughout the semester, ranks progress through class leaderboards, and supports preparation with self-study tools and community-driven content.\
\
MockIn is built around one simple idea:\
\
**We don't lock people in.  \
People lock in.**\
\
The platform provides structure, rhythm, and motivation \'97 but students decide how much they engage.\
\
No paywalls.  \
No forced subscriptions.  \
Community-supported learning.\
\
---\
\
# Product Vision\
\
MockIn simulates an academic exam season.\
\
Instead of random practice, students experience:\
\
- checkpoint exams\
- seasonal progress\
- ranked classes\
- structured preparation\
\
Students join **season-based classes** tied to real courses.\
\
Example:\
\
METM W26  \
Metallic Materials \'97 Winter 2026\
\
Each class has:\
\
- checkpoint mock exams\
- leaderboard ranking\
- exam timeline\
- course updates\
\
Students can also study independently using self-study tools.\
\
---\
\
# User Entry Flow\
\
Users do not immediately see the dashboard when opening the platform.\
\
Instead they go through a structured onboarding flow.\
\
Landing Page  \
\uc0\u8594  Sign Up / Log In  \
\uc0\u8594  Profile Setup  \
\uc0\u8594  Course Selection  \
\uc0\u8594  Class Assignment Confirmation  \
\uc0\u8594  Personalized Dashboard\
\
This ensures the dashboard is **already personalized when the user enters the platform**.\
\
---\
\
# Landing Page\
\
The landing page introduces the MockIn concept before the user signs up.\
\
Purpose:\
\
- explain the philosophy\
- show how seasons and classes work\
- motivate students to join\
\
Hero Message:\
\
We don't lock people in.  \
People lock in.\
\
Subtext:\
\
Seasonal exam structure and community-driven preparation for RWTH students.\
\
---\
\
# Authentication\
\
Standard authentication flow.\
\
Fields:\
\
- email\
- password\
- confirm password\
\
Users can:\
\
- create an account\
- log in\
\
---\
\
# Profile Setup\
\
After signing up, the user enters a profile setup step.\
\
This step collects minimal information needed for personalization.\
\
Fields:\
\
- full name\
- university (default RWTH Aachen)\
- department / program\
\
The interface should remain **simple and frictionless**.\
\
---\
\
# Course Selection\
\
Users select the courses they are currently taking.\
\
The system provides:\
\
- searchable course catalog\
- suggestions based on department\
\
Data source:\
\
rwth_course_catalog_rich.csv\
\
Fields shown to users:\
\
- course title\
- lecturer (optional)\
\
Technical metadata such as credits or semester week hours should **not be displayed during onboarding** to keep the interface simple.\
\
---\
\
# Class Assignment\
\
After course selection, the system assigns the student to corresponding classes.\
\
Example classes:\
\
METM W26  \
THERMO W26  \
MPHY W26\
\
The user sees a confirmation screen:\
\
"You\'92ve joined your MockIn classes."\
\
This moment creates commitment before entering the dashboard.\
\
---\
\
# Personalized Dashboard\
\
After onboarding the user enters the main dashboard.\
\
The dashboard is **fully personalized**.\
\
Important rule:\
\
The platform should only display exams and progress related to the courses selected by the user.\
\
Global RWTH exam data exists in the system but is **not shown directly to the user**.\
\
---\
\
# Dashboard Layout\
\
Three-column layout.\
\
Left Sidebar:\
\
Navigation and tools.\
\
Sections:\
\
- Dashboard\
- My Classes\
- Self Study\
- Achievements\
- Settings\
\
Center Panel:\
\
Season overview and class information.\
\
Possible components:\
\
- class cards\
- checkpoint timelines\
- course updates\
\
Right Sidebar:\
\
Exam-related information.\
\
Components:\
\
Upcoming Exams  \
Next Exam Countdown  \
Study reminders\
\
Only exams for the user's selected courses are displayed.\
\
---\
\
# Core Platform Concepts\
\
## Seasons\
\
Seasons correspond to real academic terms.\
\
Example:\
\
Winter 2026  \
Summer 2027\
\
Each season contains multiple classes.\
\
---\
\
## Classes\
\
A class represents a course within a season.\
\
Example:\
\
METM W26  \
THERMO W26  \
MPHY W26\
\
Short codes are shown in the UI, while full names appear on hover.\
\
Example:\
\
METM W26 \uc0\u8594  Metallic Materials \'97 Winter 2026\
\
---\
\
# Development Phases\
\
The project should be developed in phases.\
\
---\
\
# Phase 0 \'97 Design System [COMPLETE]\
\
Landing page  \
Theme system  \
Typography  \
UI components\
\
---\
\
# Phase 1 \'97 Core Platform Structure [COMPLETE]\
\
User authentication  \
Profile system  \
Course selection system  \
Class assignment\
\
---\
\
# Phase 2 \'97 Exam Engine [COMPLETE]\
\
Mock exam structure  \
Question system  \
Exam interface\
\
---\
\
# Phase 3 \'97 Season Timeline [COMPLETE]\
\
Checkpoint timeline system\
\
---\
\
# Phase 4 \'97 Leaderboard System [COMPLETE]\
\
Class leaderboards  \
Sticky rank bar\
\
---\
\
# Phase 5 \'97 Scoring System [COMPLETE]\
\
points = exam_score \'d7 ECTS\
\
---\
\
# Phase 6 \'97 Achievement System [COMPLETE]\
\
Badges and profile rewards\
\
---\
\
# Phase 7 \'97 Self Study Tools [COMPLETE]\
\
Quizzes  \
Topic drills  \
Exercises\
\
---\
\
# Phase 8 \'97 Community Content [COMPLETE]\
\
Student-contributed questions and mock exams\
\
---\
\
# Phase 9 \'97 AI Systems [COMPLETE]\
\
AI catch-up exams  \
AI feedback\
\
---\
\
# Phase 10 \'97 Theme System [COMPLETE]\
\
Light and dark mode  \
Pastel light theme  \
Theme persistence\
\
---\
\
# Phase 11 \'97 Profile & Settings [COMPLETE]\
\
Edit profile (name, department)  \
API key management  \
Account settings\
\
---\
\
# Phase 12 \'97 Leaderboard Page [COMPLETE]\
\
Dedicated leaderboard view  \
Per-class rankings  \
Season standings\
\
---\
\
# Phase 13 \'97 Exams Page [COMPLETE]\
\
Upcoming exam schedule  \
Countdown to next exam  \
Class exam timeline\
\
---\
\
# Phase 14 \'97 Season Page [COMPLETE]\
\
Season overview  \
Week progress timeline  \
All-class summary view\
\
---\
\
# Final Goal\
\
MockIn becomes a community-driven academic preparation platform where students support each other during exam seasons.\
\
Students don't get locked into the platform.\
\
They **lock in together.**}