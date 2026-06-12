# FitMantra — Technical Requirements Document (TRD)

## Version

v1.0

## Product

FitMantra

## Document Type

Technical Requirements Document (TRD)

## Platform

Mobile-first application (iOS + Android)

## Primary Architecture

React Native + Supabase + AI APIs

---

# 1. Technical Overview

FitMantra is a mobile-first wellness platform focused on:

* habit tracking
* wellness routines
* AI wellness support
* progress tracking
* engagement systems

The application must prioritize:

* lightweight performance
* scalability
* low operational cost
* fast iteration speed
* excellent mobile UX

---

# 2. Core Technical Objectives

## Primary Goals

1. Fast mobile experience
2. Offline-friendly architecture
3. Real-time sync capability
4. AI-assisted wellness interactions
5. Scalable backend infrastructure
6. Secure user authentication
7. Analytics-driven product iteration

---

# 3. System Architecture

## High-Level Stack

### Frontend

* React Native
* Expo SDK

### Backend

* Supabase

### Database

* PostgreSQL

### Authentication

* Supabase Auth

### AI Services

* OpenAI API

### Notifications

* OneSignal

### Analytics

* PostHog

### Storage

* Cloudflare R2

### CDN

* Cloudflare CDN

---

# 4. Frontend Requirements

## Framework

React Native with Expo.

## Supported Platforms

* Android (priority)
* iOS

## Minimum Android Version

Android 9+

## Minimum iOS Version

iOS 15+

---

# 5. Frontend Architecture

## Folder Structure

/src
/components
/screens
/hooks
/context
/services
/utils
/navigation
/store
/assets

---

# 6. Navigation Structure

## Navigation Type

Bottom Tab Navigation

## Tabs

1. Home
2. Routines
3. Progress
4. AI Coach
5. Profile

---

# 7. State Management

## Recommended

Zustand

## Responsibilities

* auth state
* onboarding state
* habit state
* user preferences
* cached wellness data

---

# 8. Backend Requirements

## Backend Platform

Supabase

## Responsibilities

* authentication
* database
* realtime sync
* storage
* row-level security
* API endpoints

---

# 9. Database Design

## Tables

### users

Stores user profile information.

Fields:

* id
* name
* email
* age
* gender
* height
* weight
* goals
* created_at

---

### daily_logs

Fields:

* id
* user_id
* sleep_hours
* water_intake
* steps
* mood
* health_score
* created_at

---

### habits

Fields:

* id
* user_id
* habit_type
* streak_count
* completion_status
* created_at

---

### routines

Fields:

* id
* title
* description
* category
* duration
* difficulty
* thumbnail_url

---

### routine_sessions

Fields:

* id
* user_id
* routine_id
* completed
* completion_time
* created_at

---

### ai_conversations

Fields:

* id
* user_id
* message
* response
* created_at

---

### notifications

Fields:

* id
* user_id
* title
* body
* sent_status
* created_at

---

# 10. Authentication Requirements

## Authentication Method

Supabase Auth

## Supported Login Methods

* Email OTP
* Google Login
* Apple Login (iOS)

## Security Requirements

* JWT-based sessions
* secure token refresh
* encrypted storage

---

# 11. AI System Requirements

## AI Provider

OpenAI API

## AI Responsibilities

* wellness suggestions
* motivational responses
* routine recommendations
* conversational engagement

---

# 12. AI Constraints

The AI must NOT:

* diagnose diseases
* prescribe medication
* provide clinical treatment advice
* replace medical professionals

---

# 13. AI Prompt System

## Prompt Layers

### System Prompt

Defines assistant personality and safety.

### Context Prompt

Uses:

* user goals
* recent habits
* health score
* previous conversations

### User Prompt

Actual user input.

---

# 14. AI Rate Limiting

## Requirements

* prevent abuse
* control API cost

## Free Tier Limits

* 10 AI messages/day

## Premium Limits

* unlimited or soft-limited usage

---

# 15. Notification System

## Notification Provider

OneSignal

## Notification Types

* streak reminders
* hydration reminders
* motivation prompts
* inactivity alerts
* sleep reminders

---

# 16. Analytics Requirements

## Analytics Platform

PostHog

## Events to Track

### User Events

* app_open
* onboarding_complete
* routine_started
* routine_completed
* AI_chat_started
* AI_chat_completed
* notification_opened
* streak_completed

---

# 17. Offline Support

## Requirements

App should function partially offline.

## Cached Data

* routines
* progress history
* recent health logs
* user profile

## Sync Strategy

Background sync when internet reconnects.

---

# 18. Performance Requirements

## App Launch Time

Under 3 seconds.

## Screen Transition

Under 300ms.

## API Response Goal

Under 500ms average.

---

# 19. Scalability Requirements

## Initial Capacity

10,000 active users.

## Future Capacity Goal

1 million users.

---

# 20. Security Requirements

## Data Protection

* HTTPS everywhere
* encrypted tokens
* secure API calls
* row-level security in Supabase

## Sensitive Data

* user health information
* chat conversations
* authentication credentials

---

# 21. Compliance Requirements

## Required Compliance

* India DPDP Act
* GDPR-inspired privacy principles

## Data Rules

* explicit user consent
* delete account functionality
* export user data option

---

# 22. Media Requirements

## Supported Media

* images
* short videos
* audio guidance

## Compression Requirements

Optimize for low-bandwidth users.

---

# 23. API Requirements

## API Style

REST + Supabase APIs

## Required APIs

### User APIs

* create user
* update profile
* fetch profile

### Habit APIs

* create habit
* update habit
* fetch streaks

### Routine APIs

* fetch routines
* complete routine

### AI APIs

* send message
* fetch history

---

# 24. Logging Requirements

## Error Monitoring

Use Sentry.

## Track

* crashes
* failed API calls
* AI failures
* sync failures

---

# 25. DevOps Requirements

## Version Control

GitHub

## CI/CD

GitHub Actions

## Deployment

Expo EAS

---

# 26. Environment Structure

## Environments

* Development
* Staging
* Production

---

# 27. Push Notification Rules

## Maximum Notifications

3/day/user

## Quiet Hours

10 PM – 7 AM local time

---

# 28. UI/UX Technical Requirements

## Design Goals

* low cognitive load
* large touch areas
* minimal text input
* dark mode support

## Accessibility

* readable typography
* proper contrast
* scalable font sizes

---

# 29. MVP Non-Goals

The MVP will NOT include:

* smartwatch integrations
* advanced calorie counting
* social networking feed
* live streaming workouts
* marketplace
* doctor consultations

---

# 30. Future Technical Enhancements

## Phase 2

* wearable integration
* multilingual support
* voice assistant
* AI-generated wellness plans

## Phase 3

* machine learning recommendations
* predictive wellness scoring
* community systems
* corporate dashboards

---

# 31. Testing Requirements

## Required Testing

* unit testing
* integration testing
* mobile responsiveness
* API testing

## Beta Testing

Minimum 100 beta users before public launch.

---

# 32. Monitoring Requirements

## Monitor

* API latency
* AI usage cost
* crash reports
* retention analytics
* notification performance

---

# 33. Estimated Infrastructure Cost

## MVP Stage

Approx:
$100–300/month

Includes:

* Supabase
* OpenAI API
* OneSignal
* CDN
* analytics

---

# 34. Development Timeline

## Phase 1 — Foundation

2 weeks

* auth
* onboarding
* DB schema
* navigation

## Phase 2 — Core Features

4 weeks

* habits
* routines
* tracking
* dashboards

## Phase 3 — AI Integration

2 weeks

* AI assistant
* prompt system
* safety layer

## Phase 4 — Testing + Launch

2 weeks

* QA
* analytics
* optimization
* beta launch

---

# 35. Technical Risks

## Major Risks

* AI API cost scaling
* notification fatigue
* low retention
* overengineering MVP

---

# 36. Engineering Principles

## Priorities

1. Speed over perfection
2. Simplicity over complexity
3. Retention over feature count
4. Mobile UX over desktop parity
5. Performance over visual effects

---

# 37. Final Technical Statement

FitMantra should be engineered as a lightweight, scalable, emotionally engaging wellness platform optimized for mobile-first Indian users.

The architecture should prioritize:

* rapid iteration
* retention systems
* low infrastructure costs
* scalable AI interactions
* high-performance mobile UX

The MVP must validate:

* engagement
* consistency
* retention
* emotional connection

before expanding into broader wellness ecosystems.
